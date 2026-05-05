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

// Desconto progressivo: a cada 5 fotos extras, 5% de desconto
const descontoPercent = computed(() => Math.floor(extras.value / 5) * 5);
const valorExtrasBruto = computed(() => extras.value * (state.value?.sessao.preco_foto_extra ?? 0));
const valorExtras = computed(() => valorExtrasBruto.value * (1 - descontoPercent.value / 100));
const economiaTotalExtras = computed(() => valorExtrasBruto.value - valorExtras.value);
const faltamParaProximoDesconto = computed(() => {
  const progressoNaTier = extras.value % 5;
  return progressoNaTier === 0 ? 5 : 5 - progressoNaTier;
});
const proximoDescontoPercent = computed(() => descontoPercent.value + 5);

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
    ? descontoPercent.value > 0
      ? `Você selecionou ${extras.value} foto(s) extra(s) com ${descontoPercent.value}% de desconto! Total extras: R$ ${valorExtras.value.toFixed(2).replace('.', ',')} (economia de R$ ${economiaTotalExtras.value.toFixed(2).replace('.', ',')}). Confirmar seleção?`
      : `Você selecionou ${extras.value} foto(s) extra(s), totalizando R$ ${valorExtras.value.toFixed(2).replace('.', ',')} a mais. Confirmar seleção?`
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
        <NuxtLink to="/area-cliente/meus-ensaios" class="back-link">
          <span class="material-symbols-outlined"> arrow_back_ios </span> Meus ensaios
        </NuxtLink>
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
          <div class="package-info">
            <span class="package-title">{{ state.sessao.produto_tipo }}</span>
            
            <span class="package-name">
              <span>Pacote - </span>
              <template v-if="state.sessao.pacote_titulo">{{ state.sessao.pacote_titulo }}</template>
            </span>
            
            <span class="included-photos">
              <span><b>{{ fotos_incluidas }}</b>&nbsp;</span>
              <span>fotos inclusas no pacote</span>
            </span>

            <span v-if="state.sessao.preco_foto_extra > 0" class="extra-photos-hint">
              <span class="material-symbols-outlined">add_circle</span>
              <b>{{ state.sessao.preco_foto_extra.toFixed(2).replace('.', ',') }}</b>/ foto extra
            </span>
          </div>

          <div class="sticky-counts">
            <template v-if="totalSelecionadas > 0">
              <div class="count-main">
                <span class="fotos-count-label">
                  <strong>{{ totalSelecionadas }}</strong> foto{{ totalSelecionadas > 1 ? 's' : '' }} selecionada{{ totalSelecionadas > 1 ? 's' : '' }}
                </span>

                <span v-if="extras > 0" class="count-extras">
                  <span class="material-symbols-outlined">add_circle</span>
                  <span>+{{ extras }} extra{{ extras > 1 ? 's' : '' }}</span>
                  <template v-if="descontoPercent > 0">
                    <span class="preco-riscado">R$ {{ valorExtrasBruto.toFixed(2).replace('.', ',') }}</span>
                    <span class="preco-final">R$ {{ valorExtras.toFixed(2).replace('.', ',') }}</span>
                  </template>
                  <span v-else>— R$ {{ valorExtras.toFixed(2).replace('.', ',') }}</span>
                </span>

                <span v-if="descontoPercent > 0" class="desconto-ativo">
                  🎉 {{ descontoPercent }}% OFF aplicado! Você economizou <strong>R$ {{ economiaTotalExtras.toFixed(2).replace('.', ',') }}</strong>
                </span>
              </div>

              <!-- Teaser: dentro do pacote, antecipa o benefício sem barra -->
              <div v-if="state.sessao.preco_foto_extra > 0 && extras === 0" class="desconto-teaser">
                <span class="material-symbols-outlined">local_offer</span>
                <span>A cada <strong>5 fotos extras</strong> você ganha <strong class="desconto-destaque">5% OFF</strong> — quanto mais, maior o desconto!</span>
              </div>

              <!-- Meter: só aparece quando há fotos extras de fato -->
              <div v-if="state.sessao.preco_foto_extra > 0 && extras > 0" class="desconto-meter">
                <div class="desconto-meter-texto">
                  <template v-if="descontoPercent === 0">
                    <span>Mais <strong>{{ faltamParaProximoDesconto }}</strong> foto extra{{ faltamParaProximoDesconto > 1 ? 's' : '' }} e você ganha <strong class="desconto-destaque">5% OFF</strong>!</span>
                  </template>
                  <template v-else>
                    <span>Mais <strong>{{ faltamParaProximoDesconto }}</strong> foto extra{{ faltamParaProximoDesconto > 1 ? 's' : '' }} para <strong class="desconto-destaque">{{ proximoDescontoPercent }}% OFF</strong>!</span>
                  </template>
                </div>
                <div class="desconto-barra-wrap">
                  <div class="desconto-segmentos">
                    <div
                      v-for="i in 5"
                      :key="i"
                      class="segmento"
                      :class="{ filled: (extras % 5) >= i }"
                    ></div>
                  </div>
                  <span class="desconto-barra-label">{{ extras % 5 }}/5</span>
                </div>
                <div class="desconto-tiers">
                  <span
                    v-for="tier in [5, 10, 15, 20, 25, 30, 35]"
                    :key="tier"
                    class="tier-badge"
                    :class="{ ativo: descontoPercent >= tier }"
                  >
                    <span class="material-symbols-outlined">{{ descontoPercent >= tier ? 'check_circle' : 'radio_button_unchecked' }}</span>
                    {{ tier }}%
                  </span>
                </div>
              </div>
            </template>

            <span v-else class="count-main selecao-empty-hint">
              <span>Toque nas fotos para selecionar as que você quer receber</span>
            </span>
          </div>

          <div class="finalizar-wrap">
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
.selecao-page {
  padding-bottom: 100px;
}

.loading-state,
.error-state {
  text-align: center;
  color: #9ca3af;
  padding: 48px;
}

.selecao-header {
  margin-bottom: 24px;
  text-align: center;
  padding-top: 10px;
  
  .back-link {
    text-decoration: none;
    align-items: center;
    position: absolute;
    color: #6b7280;
    font-size: 14px;
    display: flex;
    z-index: 2;
    top: 25px;
    left: 0;

    span {
      font-size: 17px;
    }

    &:hover {
      color: #5e2012;
    }
  }
  
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    margin-top: 8px;
    margin-bottom: 4px;
  }
  
  .selecao-sub {
    font-size: 14px;
    color: #6b7280;
  }
}

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

  .material-symbols-outlined {
    font-size: 18px;
  }
  
  &.urgente {
    background: #fee2e2;
    color: #991b1b;
  }
  
  &.encerrado {
    background: #fce7f3;
    color: #9d174d;
  }
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
  justify-content: flex-end;
  align-items: flex-start;
  position: absolute;
  display: flex;
  padding: 8px;
  inset: 0;
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
  background: rgba(255,255,255,0.95);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  border-top: 1px solid #f0ede8;
  backdrop-filter: blur(8px);
  padding: 14px 24px;
  position: fixed;
  z-index: 50;
  bottom: 0;
  right: 0;
  left: 0;
  
  .sticky-bar-inner {
    padding-left: 220px;
    width: 1750rem;
    margin: 0 auto;
    max-width: 98%;
    display: flex;
    justify-content: space-between;

    .package-info {
      padding: 10px 20px;
      background: #f0f0f0;
      border-radius: 8px;
      font-size: 13px;
      color: #4b5563;
      display: flex;
      flex-direction: column;
      border: #15803d 1px solid;
      width: 200px;
      position: absolute;
      left: 0;
      bottom: 0;

      .package-title {
        font-size: 16px;
        font-weight: bold;
      }

      .package-name {
        font-size: 15px;
      }

      .included-photos {
        padding-top: 10px;
        display: block;
      }

      .extra-photos-hint {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 6px;
        padding-top: 6px;
        border-top: 1px dashed #d1d5db;
        font-size: 12px;
        color: #7c3aed;
        font-weight: 600;

        .material-symbols-outlined {
          font-size: 14px;
        }
      }
    }
  }
}

.sticky-counts { 
  height: 100%;
  display: flex;
  align-items: center;
  gap: 20px;

  .count-main {
    flex-direction: column;
    color: #374151;
    font-size: 15px;
    display: flex;
    gap: 4px;

    &.selecao-empty-hint {
      color: #9ca3af;
      font-size: 14px;
      font-style: italic;
    }
  }

  .count-extras {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;

    .material-symbols-outlined {
      font-size: 16px;
      color: #15803d;
    }

    .preco-riscado {
      text-decoration: line-through;
      color: #9ca3af;
      font-weight: 400;
      font-size: 13px;
    }

    .preco-final {
      color: #15803d;
      font-weight: 700;
    }
  }

  .desconto-ativo {
    font-size: 13px;
    color: #15803d;
    font-weight: 600;
    background: #dcfce7;
    border: 1px solid #bbf7d0;
    border-radius: 6px;
    padding: 3px 8px;
    animation: desconto-pop 0.4s ease;
  }

  .upsell-hint {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #7c3aed;
    font-weight: 600;
    animation: pulse-hint 2s ease-in-out infinite;

    .material-symbols-outlined {
      font-size: 15px;
    }
  }

  .desconto-teaser {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #5b21b6;
    background: linear-gradient(135deg, #faf5ff, #ede9fe);
    border: 1px solid #c4b5fd;
    border-radius: 8px;
    padding: 7px 10px;

    .material-symbols-outlined {
      font-size: 15px;
      flex-shrink: 0;
    }
  }

  .desconto-meter {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 210px;
    padding: 10px 14px;
    background: linear-gradient(135deg, #faf5ff, #ede9fe);
    border-radius: 10px;
    border: 1px solid #c4b5fd;

    .desconto-meter-texto {
      font-size: 12px;
      color: #5b21b6;
      line-height: 1.4;
    }

    .desconto-destaque {
      color: #7c3aed;
      font-size: 13px;
    }

    .desconto-barra-wrap {
      display: flex;
      align-items: center;
      gap: 8px;

      .desconto-segmentos {
        display: flex;
        flex: 1;
        gap: 4px;

        .segmento {
          flex: 1;
          height: 8px;
          border-radius: 4px;
          background: #ddd6fe;
          transition: background 0.35s, transform 0.2s;

          &.filled {
            background: linear-gradient(90deg, #7c3aed, #a855f7);
            transform: scaleY(1.25);
          }
        }
      }

      .desconto-barra-label {
        font-size: 11px;
        color: #7c3aed;
        font-weight: 700;
        white-space: nowrap;
      }
    }

    .desconto-tiers {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .tier-badge {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 11px;
        font-weight: 600;
        color: #c4b5fd;
        transition: all 0.3s;

        .material-symbols-outlined {
          font-size: 13px;
        }

        &.ativo {
          color: #5b21b6;
          animation: desconto-pop 0.4s ease;
        }
      }
    }
  }
}

@keyframes pulse-hint {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes desconto-pop {
  0%   { transform: scale(0.85); opacity: 0; }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); }
}

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
