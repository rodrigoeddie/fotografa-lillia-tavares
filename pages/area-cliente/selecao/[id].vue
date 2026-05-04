<script lang="ts" setup>
definePageMeta({ layout: 'cliente', middleware: 'cliente-auth' });
useHead({ title: 'Seleção de Fotos — Lillia Tavares' });

const { checkSession } = useClientAuth();
const router = useRouter();
const route = useRoute();
const sessaoId = Number(route.params.id);
const cfURI = useRuntimeConfig().public.cloudflareURI;

interface FotoComSelecao {
  id: number;
  sessao_id: number;
  cloudflare_image_id: string;
  ordem: number;
  selecionada: number | null;  // 0, 1, ou null (LEFT JOIN)
  comentario: string | null;
}

interface SelecaoLocal {
  selecionada: boolean;
  comentario: string;
}

interface ApiResponse {
  sessao: {
    id: number;
    nome_sessao: string;
    produto_tipo: string;
    pacote_titulo: string | null;
    fotos_incluidas: number;
    preco_foto_extra: number;
    status: string;
    prazo_selecao: string | null;
  };
  fotos: FotoComSelecao[];
  selecionadas: number;
  extras: number;
  valor_extras: number;
}

const state = ref<ApiResponse | null>(null);
const selecoes = ref<Record<number, SelecaoLocal>>({});
const loading = ref(true);
const saving = ref(false);
const finalizing = ref(false);
const error = ref('');

const totalSelecionadas = computed(() => Object.values(selecoes.value).filter(s => s.selecionada).length);
const fotos_incluidas = computed(() => state.value?.sessao.fotos_incluidas ?? 0);
const extras = computed(() => Math.max(0, totalSelecionadas.value - fotos_incluidas.value));
const valorExtras = computed(() => extras.value * (state.value?.sessao.preco_foto_extra ?? 0));

const prazoInfo = computed(() => {
  const prazo = state.value?.sessao.prazo_selecao;
  if (!prazo) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prazoDate = new Date(prazo + 'T00:00:00');
  const diffMs = prazoDate.getTime() - today.getTime();
  const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (dias < 0) return { label: `Prazo encerrado em ${prazoDate.toLocaleDateString('pt-BR')}`, urgente: true, encerrado: true };
  if (dias === 0) return { label: 'Prazo: hoje!', urgente: true, encerrado: false };
  if (dias === 1) return { label: 'Prazo: amanhã!', urgente: true, encerrado: false };
  return { label: `Prazo: ${dias} dias (${prazoDate.toLocaleDateString('pt-BR')})`, urgente: dias <= 3, encerrado: false };
});

function cfUrl(id: string) { return `${cfURI}${id}/public`; }

async function load() {
  await checkSession();
  try {
    const data = await $fetch<ApiResponse>(`/api/cliente/sessoes/${sessaoId}/selecao`);
    state.value = data;
    // Inicializa estado local com valores salvos no banco
    for (const foto of data.fotos) {
      selecoes.value[foto.id] = {
        selecionada: foto.selecionada === 1,
        comentario: foto.comentario ?? '',
      };
    }
  } catch (e: any) {
    console.error('[selecao] load error:', e);
    error.value = e.statusMessage || e.message || 'Erro ao carregar fotos';
  } finally {
    loading.value = false;
  }
}

async function autosave(fotoId: number) {
  try {
    const body = {
      selecoes: Object.entries(selecoes.value).map(([id, s]) => ({
        foto_id: Number(id),
        selecionada: s.selecionada,
        comentario: s.comentario,
      })),
    };
    console.log('[autosave] body:', JSON.stringify(body));
    const result = await $fetch(`/api/cliente/sessoes/${sessaoId}/selecao`, {
      method: 'POST',
      body,
    });
    console.log('[autosave] result:', result);
  } catch (e: any) {
    console.error('[autosave] error:', e);
  }
}

const debouncedSave: Record<number, ReturnType<typeof setTimeout>> = {};
function onToggle(fotoId: number) {
  clearTimeout(debouncedSave[fotoId]);
  debouncedSave[fotoId] = setTimeout(() => autosave(fotoId), 800);
}

async function finalizar() {
  const { showAlert, showConfirm } = useDialog();

  if (fotos_incluidas.value > 0 && totalSelecionadas.value < fotos_incluidas.value) {
    const faltam = fotos_incluidas.value - totalSelecionadas.value;
    await showAlert(
      `Você precisa selecionar pelo menos ${fotos_incluidas.value} foto(s). Ainda falt${faltam === 1 ? 'a' : 'am'} ${faltam}.`,
      'warning',
      'Seleção incompleta',
    );
    return;
  }

  if (totalSelecionadas.value === 0) {
    await showAlert('Selecione pelo menos uma foto antes de finalizar.', 'warning');
    return;
  }

  const msg = extras.value > 0
    ? `Você selecionou ${extras.value} foto(s) extra(s), totalizando R$ ${valorExtras.value.toFixed(2).replace('.', ',')} a mais. Confirmar seleção?`
    : `Você selecionou ${totalSelecionadas.value} foto(s). Confirmar seleção?`;

  const confirmed = await showConfirm(msg, 'Finalizar seleção', 'Confirmar', 'Cancelar');
  if (!confirmed) return;

  finalizing.value = true;
  try {
    await $fetch(`/api/cliente/sessoes/${sessaoId}/selecao`, {
      method: 'POST',
      body: {
        selecoes: Object.entries(selecoes.value).map(([id, s]) => ({
          foto_id: Number(id),
          selecionada: s.selecionada,
          comentario: s.comentario,
        })),
        finalizar: true,
      },
    });
    await router.push('/area-cliente/meus-ensaios');
  } catch (e: any) {
    await showAlert('Erro ao finalizar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    finalizing.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="selecao-page">
    <div v-if="loading" class="loading-state">Carregando fotos...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>

    <template v-else-if="state">
      <!-- Header -->
      <div class="selecao-header">
        <NuxtLink to="/area-cliente/meus-ensaios" class="back-link">← Meus ensaios</NuxtLink>
        <h1>{{ state.sessao.nome_sessao }}</h1>
        <p class="selecao-sub">Selecione as fotos que você quer receber no seu ensaio final</p>
      </div>

      <!-- Prazo countdown -->
      <div v-if="prazoInfo && state.sessao.status === 'aguardando_selecao'" class="prazo-banner" :class="{ urgente: prazoInfo.urgente, encerrado: prazoInfo.encerrado }">
        <span class="material-symbols-outlined">schedule</span>
        {{ prazoInfo.label }}
      </div>

      <!-- Se já finalizado -->
      <div v-if="state.sessao.status === 'selecao_concluida'" class="status-banner done">
        ✅ Seleção enviada! Aguarde a Lillia preparar seu ensaio.
      </div>
      <div v-else-if="state.sessao.status === 'entregue'" class="status-banner done">
        📦 Seu ensaio já foi entregue!
        <NuxtLink :to="`/area-cliente/entrega/${sessaoId}`">Ver entrega →</NuxtLink>
      </div>

      <!-- Grid de fotos -->
      <div class="fotos-grid">
        <div
          v-for="foto in state.fotos"
          :key="foto.id"
          class="foto-card"
          :class="{ selected: selecoes[foto.id]?.selecionada }"
        >
          <div class="foto-img-wrap" @click="() => { selecoes[foto.id].selecionada = !selecoes[foto.id].selecionada; onToggle(foto.id); }">
            <nuxt-img
              provider="cloudflare"
              :src='"https://images.fotografalilliatavares.com.br/images/" + foto.cloudflare_image_id + "/public"'
              width="400"
              class="image"
              :alt="`Foto ${foto.id}`"
              format="webp"
              placeholder
              loading="lazy"/>
            <div class="foto-overlay">
              <span class="foto-check">
                <span class="material-symbols-outlined" :class="{ 'selected': selecoes[foto.id]?.selecionada }"> check_box </span>
                <span class="material-symbols-outlined unselected" :class="{ 'selected': !selecoes[foto.id]?.selecionada }"> check_box_outline_blank </span>
              </span>
            </div>
          </div>
          <div v-if="selecoes[foto.id]?.selecionada" class="foto-comment">
            <textarea
              v-model="selecoes[foto.id].comentario"
              placeholder="Comentário (opcional)..."
              rows="2"
              @input="onToggle(foto.id)"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Sticky bar -->
      <div v-if="state.sessao.status === 'aguardando_selecao'" class="sticky-bar">
        <div class="sticky-bar-inner">
          <div class="sticky-counts">
            <span class="count-main fotos-selecionadas" v-if="totalSelecionadas > 0">
              <strong>{{ totalSelecionadas }}</strong>
              <span>foto{{ totalSelecionadas > 1 ? 's' : '' }} selecionada{{ totalSelecionadas > 1 ? 's' : '' }}</span>
            </span>
            <div class="infos-pacotes">
              <span class="count-main">
                <span>{{ fotos_incluidas }}</span>
                fotos incluídas no pacote: {{ state.sessao.produto_tipo }}<template v-if="state.sessao.pacote_titulo"> · {{ state.sessao.pacote_titulo }}</template>
              </span>
              <span v-if="extras > 0" class="count-extras">
                +{{ extras }} extra{{ extras > 1 ? 's' : '' }} = R$ {{ valorExtras.toFixed(2).replace('.', ',') }}
              </span>
            </div>
          </div>
          <div class="finalizar-wrap">
            <span v-if="fotos_incluidas > 0 && totalSelecionadas < fotos_incluidas" class="finalizar-hint">
              Faltam {{ fotos_incluidas - totalSelecionadas }} foto(s)
            </span>
            <button
              class="finalizar-btn"
              :disabled="finalizing || (fotos_incluidas > 0 && totalSelecionadas < fotos_incluidas)"
              @click="finalizar">
              {{ finalizing ? 'Finalizando...' : 'Finalizar seleção' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.selecao-page { padding-bottom: 100px; }
.loading-state, .error-state { text-align: center; padding: 48px; color: #9ca3af; }

.selecao-header { margin-bottom: 24px; }
.back-link { font-size: 14px; color: #6b7280; text-decoration: none; &:hover { color: #5e2012; } }
h1 { font-size: 24px; font-weight: 700; color: #1f2937; margin-top: 8px; margin-bottom: 4px; }
.selecao-sub { font-size: 14px; color: #6b7280; }

.status-banner {
  padding: 14px 20px; border-radius: 10px; font-size: 15px; font-weight: 500; margin-bottom: 24px;
  &.done { background: #dcfce7; color: #15803d; }
  a { color: #15803d; font-weight: 700; text-decoration: none; margin-left: 8px; }
}

.prazo-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  background: #fef9c3;
  color: #854d0e;
  .material-symbols-outlined { font-size: 18px; }
  &.urgente { background: #fee2e2; color: #991b1b; }
  &.encerrado { background: #fce7f3; color: #9d174d; }
}

.fotos-grid {
  columns: 2;
  column-gap: 12px;

  @media (min-width: 640px)  { columns: 3; }
  @media (min-width: 1024px) { columns: 5; }
  @media (min-width: 1450px) { columns: 6; }
  @media (min-width: 1700px) { columns: 7; }
}

.foto-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  break-inside: avoid;
  margin-bottom: 12px;

  &.selected {
    border-color: #5e2012;
    box-shadow: 0 0 0 3px rgba(94,32,18,0.12);
  }
}

.foto-img-wrap {
  position: relative;
  cursor: pointer;
  overflow: hidden;

  img { width: 100%; height: auto; display: block; transition: transform 0.2s; }
  &:hover img { transform: scale(1.02); }
}

.foto-overlay {
  position: absolute; inset: 0; display: flex; align-items: flex-start; justify-content: flex-end;
  padding: 8px;
}

.foto-check {
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
  font-size: 20px;
  
  span {
    background: #5e2012;
    border-radius: 7rem;
    line-height: 1em;
    color: white;
    display: none;
    
    &.selected {
      display: inline-block;
    }

    &.unselected {
      background: rgb(94 32 18 / 40%);
    }
  }
}

.foto-comment {
  position: absolute;
  padding: 8px;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.45);

  textarea {
  background: rgba(255,255,255,0.60);
    width: 100%;
    box-sizing: border-box;
    font-size: 13px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 6px 8px;
    resize: none;
    font-family: inherit;
    color: #374151;

    &:focus {
      outline: none;
      border-color: #5e2012;
    }
  }
}

.sticky-bar {
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(8px);
  border-top: 1px solid #f0ede8;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  padding: 14px 24px;
}

.sticky-bar-inner {
  max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; gap: 16px;
}

.sticky-counts { display: flex; flex-direction: column; gap: 2px; }
.count-main {
  font-size: 15px;
  color: #374151;

  &.fotos-selecionadas {
    display: flex;
  }
}
.count-extras { font-size: 14px; color: #b45309; font-weight: 600; }

.finalizar-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.finalizar-hint {
  font-size: 12px;
  color: #b45309;
  font-weight: 600;
}

.finalizar-btn {
  background: #5e2012; color: #fff; border: none; border-radius: 10px;
  padding: 12px 32px; font-size: 16px; font-weight: 700; cursor: pointer; white-space: nowrap;
  transition: background 0.15s;
  &:hover:not(:disabled) { background: #4a1a0f; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>
