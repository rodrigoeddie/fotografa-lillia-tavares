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

      <!-- Carrinho -->
      <div v-if="state.sessao.status === 'aguardando_selecao'" class="sticky-bar">
        <div class="sticky-bar-inner">

          <!-- Cabeçalho do carrinho -->
          <div class="cart-header">
            <div class="cart-header-left">
              <span class="material-symbols-outlined">shopping_cart</span>
              <span class="cart-title">Seu carrinho</span>
            </div>
            <span v-if="totalSelecionadas > 0" class="cart-badge">{{ totalSelecionadas }}</span>
          </div>

          <!-- Estado vazio -->
          <div v-if="totalSelecionadas === 0" class="cart-empty">
            <span class="material-symbols-outlined">add_photo_alternate</span>
            <p>Toque nas fotos para adicioná-las ao carrinho</p>
          </div>

          <template v-else>
            <!-- Itens do carrinho -->
            <div class="cart-items">
              <!-- Pacote base -->
              <div class="cart-item">
                <div class="cart-item-icon">
                  <span class="material-symbols-outlined">photo_library</span>
                </div>
                <div class="cart-item-details">
                  <span class="cart-item-name">{{ state.sessao.produto_tipo }}</span>
                  <span class="cart-item-sub">{{ state.sessao.pacote_titulo }}</span>
                  <span class="cart-item-qty">{{ Math.min(totalSelecionadas, fotos_incluidas) }} / {{ fotos_incluidas }} fotos incluídas</span>
                </div>
                <span class="cart-item-price cart-item-price--free">Incluso</span>
              </div>

              <!-- Fotos extras -->
              <div v-if="extras > 0" class="cart-item cart-item--extras">
                <div class="cart-item-icon">
                  <span class="material-symbols-outlined">add_circle</span>
                </div>
                <div class="cart-item-details">
                  <span class="cart-item-name">{{ extras }} foto{{ extras > 1 ? 's' : '' }} extra{{ extras > 1 ? 's' : '' }}</span>
                  <span class="cart-item-sub">R$ {{ state.sessao.preco_foto_extra.toFixed(2).replace('.', ',') }} / foto</span>
                </div>
                <div class="cart-item-price-wrap">
                  <span v-if="descontoPercent > 0" class="cart-item-price-old">R$ {{ valorExtrasBruto.toFixed(2).replace('.', ',') }}</span>
                  <span class="cart-item-price">R$ {{ valorExtras.toFixed(2).replace('.', ',') }}</span>
                </div>
              </div>

              <!-- Linha de desconto -->
              <div v-if="descontoPercent > 0 && extras > 0" class="cart-discount-row">
                <span class="cart-discount-tag">
                  <span class="material-symbols-outlined">local_offer</span>
                  {{ descontoPercent }}% OFF aplicado
                </span>
                <span class="cart-discount-saving">–R$ {{ economiaTotalExtras.toFixed(2).replace('.', ',') }}</span>
              </div>
            </div>

            <!-- Teaser: incentivo antes do primeiro extra -->
            <div v-if="state.sessao.preco_foto_extra > 0 && extras === 0" class="desconto-teaser">
              <span class="material-symbols-outlined">local_offer</span>
              <span>A cada <strong>5 fotos extras</strong> você ganha <strong class="desconto-destaque">5% OFF</strong> — quanto mais, maior o desconto!</span>
            </div>

            <!-- Meter: progresso ao próximo desconto -->
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

            <!-- Total do carrinho -->
            <div v-if="extras > 0" class="cart-total">
              <div v-if="descontoPercent > 0" class="cart-total-savings">
                🎉 Você economizou <strong>R$ {{ economiaTotalExtras.toFixed(2).replace('.', ',') }}</strong>
              </div>
              <div class="cart-total-row">
                <span>Total extras</span>
                <strong>R$ {{ valorExtras.toFixed(2).replace('.', ',') }}</strong>
              </div>
            </div>
          </template>

          <!-- Finalizar -->
          <div class="finalizar-wrap">
            <button
              class="finalizar-btn"
              :disabled="finalizing || (fotos_incluidas > 0 && totalSelecionadas < fotos_incluidas)"
              @click="finalizar">
              <span class="material-symbols-outlined">check_circle</span>
              {{ finalizing ? 'Finalizando...' : 'Finalizar seleção' }}
            </button>
            <span v-if="fotos_incluidas > 0 && totalSelecionadas < fotos_incluidas && totalSelecionadas > 0" class="finalizar-hint">
              Selecione mais {{ fotos_incluidas - totalSelecionadas }} foto{{ (fotos_incluidas - totalSelecionadas) > 1 ? 's' : '' }}
            </span>
          </div>

        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.selecao-page {
  padding-bottom: 100px;
  padding-right: 350px;
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
  column-gap: 12px;
  columns: 2;

  @media (min-width: 640px)  { columns: 3; }
  @media (min-width: 1024px) { columns: 4; }
  @media (min-width: 1280px) { columns: 5; }
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
  background: #fff;
  box-shadow: -4px 0 20px rgba(0,0,0,0.12);
  border-left: 1px solid #f0ede8;
  position: fixed;
  width: 350px;
  z-index: 50;
  bottom: 0;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;

  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: hidden;

  .sticky-bar-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0ede8;
  background: #fdf8f5;
  flex-shrink: 0;

  .cart-header-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .material-symbols-outlined {
      font-size: 22px;
      color: #5e2012;
    }
  }

  .cart-title {
    font-size: 17px;
    font-weight: 700;
    color: #1f2937;
  }

  .cart-badge {
    background: #5e2012;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    border-radius: 99px;
    padding: 2px 10px;
    line-height: 1.6;
  }
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 24px;
  color: #9ca3af;
  text-align: center;

  .material-symbols-outlined {
    font-size: 48px;
    opacity: 0.4;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
  }
}

.cart-items {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f0ede8;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px dashed #f0ede8;

  &:last-child { border-bottom: none; }

  &.cart-item--extras .cart-item-icon .material-symbols-outlined { color: #9b3a22; }

  .cart-item-icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #f5ede8;
    display: flex;
    align-items: center;
    justify-content: center;

    .material-symbols-outlined {
      font-size: 17px;
      color: #5e2012;
    }
  }

  .cart-item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;

    .cart-item-name {
      font-size: 13px;
      font-weight: 600;
      color: #1f2937;
    }

    .cart-item-sub {
      font-size: 12px;
      color: #6b7280;
    }

    .cart-item-qty {
      font-size: 11px;
      color: #9b3a22;
      font-weight: 500;
    }
  }

  .cart-item-price {
    font-size: 13px;
    font-weight: 700;
    color: #1f2937;
    white-space: nowrap;

    &.cart-item-price--free {
      color: #15803d;
      font-size: 11px;
      background: #dcfce7;
      border-radius: 6px;
      padding: 2px 8px;
      align-self: flex-start;
      font-weight: 600;
    }
  }

  .cart-item-price-wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 1px;

    .cart-item-price-old {
      font-size: 11px;
      color: #9ca3af;
      text-decoration: line-through;
    }

    .cart-item-price {
      font-size: 13px;
      font-weight: 700;
      color: #9b3a22;
    }
  }
}

.cart-discount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #fef3c7;
  border-radius: 8px;
  border: 1px solid #fde68a;
  margin: 4px 0 8px;

  .cart-discount-tag {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
    color: #92400e;

    .material-symbols-outlined { font-size: 14px; }
  }

  .cart-discount-saving {
    font-size: 13px;
    font-weight: 700;
    color: #15803d;
  }
}

.cart-total {
  padding: 14px 16px;
  border-top: 2px solid #f0ede8;
  background: #fdf8f5;
  flex-shrink: 0;

  .cart-total-savings {
    font-size: 12px;
    color: #92400e;
    font-weight: 600;
    margin-bottom: 8px;
    padding: 5px 10px;
    background: #fef3c7;
    border-radius: 6px;
    border: 1px solid #fde68a;
    animation: desconto-pop 0.4s ease;
  }

  .cart-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #4b5563;

    strong {
      font-size: 18px;
      font-weight: 800;
      color: #5e2012;
    }
  }
}

.desconto-teaser {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #5e2012;
  background: linear-gradient(135deg, #fdf8f5, #f5ede8);
  border: 1px solid #d4b0a6;
  border-radius: 8px;
  padding: 10px 14px;
  margin: 8px 16px;

  .material-symbols-outlined {
    font-size: 15px;
    flex-shrink: 0;
  }

  .desconto-destaque { color: #7a2d1a; }
}

.desconto-meter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 4px 16px 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #fdf8f5, #f5ede8);
  border-radius: 10px;
  border: 1px solid #d4b0a6;

  .desconto-meter-texto {
    font-size: 12px;
    color: #5e2012;
    line-height: 1.4;
  }

  .desconto-destaque {
    color: #7a2d1a;
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
        background: #e8c4b8;
        transition: background 0.35s, transform 0.2s;

        &.filled {
          background: linear-gradient(90deg, #5e2012, #9b3a22);
          transform: scaleY(1.25);
        }
      }
    }

    .desconto-barra-label {
      font-size: 11px;
      color: #7a2d1a;
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
      color: #d4b0a6;
      transition: all 0.3s;

      .material-symbols-outlined {
        font-size: 13px;
      }

      &.ativo {
        color: #5e2012;
        animation: desconto-pop 0.4s ease;
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
  padding: 16px;
  border-top: 1px solid #f0ede8;
  background: #fff;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  flex-shrink: 0;
}

.finalizar-hint {
  font-size: 12px;
  color: #9b3a22;
  font-weight: 600;
  text-align: center;
}

.finalizar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: #5e2012; color: #fff; border: none; border-radius: 10px;
  padding: 14px 32px; font-size: 16px; font-weight: 700; cursor: pointer; white-space: nowrap;
  transition: background 0.15s;

  .material-symbols-outlined { font-size: 20px; }

  &:hover:not(:disabled) { background: #4a1a0f; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
}
</style>
