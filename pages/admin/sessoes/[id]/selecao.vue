<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const cfURI = useRuntimeConfig().public.cloudflareURI;
const cfImg = useCfImg();
const route = useRoute();

const sessaoId = computed(() => Number(route.params.id));

interface Sessao { id: number; nome_sessao: string; fotos_incluidas: number; cliente_nome: string; }

const sessao = ref<Sessao | null>(null);
const selecao = ref<any>(null);
const loading = ref(true);

async function load() {
  loading.value = true;
  try {
    const [sessoes, sel] = await Promise.all([
      adminFetch<Sessao[]>('/api/admin/sessoes'),
      adminFetch<any>(`/api/admin/sessoes/${sessaoId.value}/selecao`),
    ]);
    sessao.value = sessoes.find((s) => s.id === sessaoId.value) ?? null;
    selecao.value = sel;
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function cfUrl(imageId: string) { return `${cfURI}${imageId}/public`; }

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/sessoes" class="page-back">← Voltar</NuxtLink>
      <h2>Seleção — {{ sessao?.nome_sessao ?? '...' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else-if="selecao">
      <div class="selecao-summary">
        <div class="summary-stat">
          <span class="stat-value">{{ selecao.selecionadas }}</span>
          <span class="stat-label">fotos selecionadas</span>
        </div>
        <div class="summary-stat">
          <span class="stat-value">{{ sessao?.fotos_incluidas }}</span>
          <span class="stat-label">incluídas no pacote</span>
        </div>
        <div class="summary-stat" :class="{ 'stat-extra': selecao.extras > 0 }">
          <span class="stat-value">{{ selecao.extras }}</span>
          <span class="stat-label">fotos extras</span>
        </div>
        <div class="summary-stat" :class="{ 'stat-extra': selecao.valor_extras > 0 }">
          <span class="stat-value">{{ selecao.valor_extras > 0 ? `R$ ${selecao.valor_extras.toFixed(2).replace('.', ',')}` : '—' }}</span>
          <span class="stat-label">valor extras</span>
        </div>
      </div>

      <div class="selecao-grid">
        <div v-for="foto in selecao.fotos" :key="foto.id" class="selecao-card" :class="{ selected: foto.selecionada === 1 }">
          <div class="selecao-img-wrap">
            <nuxt-img
              provider="cloudflare"
              :src="cfImg(foto.cloudflare_image_id)"
              width="200"
              class="image"
              :alt="`Foto ${foto.id}`"
              format="webp"
              placeholder
              loading="lazy"/>
            <span v-if="foto.selecionada === 1" class="selecao-check">✓</span>
          </div>
          <div v-if="foto.comentario" class="selecao-comment">💬 {{ foto.comentario }}</div>
        </div>
      </div>
    </template>
    <div v-else class="empty-hint">Nenhuma seleção disponível.</div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.selecao-summary {
  display: flex; gap: 24px; margin-bottom: 24px;
  padding: 16px 24px; background: t.$surface; border-radius: 8px; flex-wrap: wrap;
}
.summary-stat {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  .stat-value { font-size: 28px; font-weight: 700; color: t.$text; }
  .stat-label { font-size: 12px; color: t.$text-2; text-transform: uppercase; }
  &.stat-extra .stat-value { color: t.$warning; }
}
.selecao-grid {
  column-gap: 12px;
  columns: 6;
  gap: 12px;
}

.selecao-card {
  border: 2px solid transparent;
  margin-bottom: 12px;
  border-radius: 6px;
  overflow: hidden;

  &.selected {
    border-color: t.$success;

    .selecao-img-wrap {
      img {
        filter: none;
        opacity: 1;
      }
    }
  }
}

.selecao-img-wrap {
  position: relative;
  
  img {
    filter: grayscale(100%);
    display: block;
    opacity: 0.4;
    width: 100%;
  }
}

.selecao-check {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: t.$success;
  color: t.$accent-ink;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.selecao-comment { padding: 6px 8px; font-size: 12px; color: t.$text; background: t.$surface; border-top: 1px solid t.$border; }
</style>
