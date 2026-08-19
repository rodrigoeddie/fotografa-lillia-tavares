<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

const loading = ref<string | null>(null);
const { adminFetch } = useAdminFetch();

const BASE = 'https://fotografalilliatavares.com.br';

const sections = [
  {
    key: 'tudo',
    label: 'Tudo (purge_everything)',
    description: 'Limpa todo o cache do Cloudflare de uma vez.',
    icon: '🔥',
    urls: [],
  },
  {
    key: 'blog',
    label: 'Blog',
    description: 'Listagens e posts do blog.',
    icon: '📝',
    urls: [
      `${BASE}/blog`,
      `${BASE}/api/public/blog`,
    ],
  },
  {
    key: 'portfolio',
    label: 'Portfolio',
    description: 'Ensaios fotográficos.',
    icon: '📷',
    urls: [
      `${BASE}/ensaio-fotografico`,
      `${BASE}/api/public/portfolio`,
    ],
  },
  {
    key: 'depoimentos',
    label: 'Depoimentos',
    description: 'Avaliações de clientes.',
    icon: '⭐',
    urls: [
      `${BASE}/depoimentos`,
      `${BASE}/api/public/depoimentos`,
    ],
  },
  {
    key: 'investimento',
    label: 'Investimento',
    description: 'Pacotes e preços.',
    icon: '💰',
    urls: [
      `${BASE}/precos-ensaios-fotograficos`,
      `${BASE}/api/public/investimento`,
    ],
  },
  {
    key: 'faq',
    label: 'FAQ',
    description: 'Perguntas frequentes.',
    icon: '❓',
    urls: [
      `${BASE}/perguntas-frequentes`,
      `${BASE}/api/public/faq`,
    ],
  },
  {
    key: 'sobre',
    label: 'Sobre',
    description: 'Bio, cards de serviço e a linha do tempo "Nossa história".',
    icon: '👤',
    urls: [
      `${BASE}/sobre-fotografa-lillia-tavares`,
      `${BASE}/api/public/sobre`,
    ],
  },
  {
    key: 'menu',
    label: 'Menu',
    description: 'Navegação do site.',
    icon: '☰',
    urls: [
      `${BASE}/api/public/menu`,
    ],
  },
];

const status = ref<{ ok: boolean; zona?: string; motivo?: string } | null>(null);
const checando = ref(false);

/** Confere se o purge está utilizável (secrets + token com acesso à zona). */
async function checarConfig() {
  checando.value = true;
  try {
    status.value = await adminFetch('/api/admin/cache/purge');
  } catch (e: any) {
    status.value = { ok: false, motivo: e.statusMessage || e.data?.statusMessage || e.message };
  } finally {
    checando.value = false;
  }
}

onMounted(checarConfig);

async function purge(key: string) {
  const section = sections.find(s => s.key === key);
  if (!section) return;
  loading.value = key;
  try {
    await adminFetch('/api/admin/cache/purge', {
      method: 'POST',
      body: section.urls.length > 0 ? { urls: section.urls } : {},
    });
    showMessage(`Cache "${section.label}" limpo com sucesso!`, 'success');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.data?.statusMessage || e.message), 'error');
  } finally {
    loading.value = null;
  }
}
</script>

<template>
  <div class="cache-page">
    <h2>Limpar Cache</h2>
    <p class="subtitle">
      O Cloudflare armazena páginas e APIs em cache por até 24h. Use esta página para
      forçar a atualização imediata após salvar conteúdo no banco.
    </p>

    <p v-if="checando" class="cache-status">Verificando a configuração do purge...</p>
    <p v-else-if="status" class="cache-status" :class="status.ok ? 'cache-status--ok' : 'cache-status--erro'">
      <template v-if="status.ok">
        ✅ Purge ativo{{ status.zona ? ` na zona ${status.zona}` : '' }} — os botões abaixo funcionam.
      </template>
      <template v-else>
        ⚠️ O purge não vai funcionar: {{ status.motivo }}
      </template>
    </p>

    <div class="cache-grid">
      <div
        v-for="section in sections"
        :key="section.key"
        class="cache-card"
        :class="{ 'cache-card--all': section.key === 'tudo' }"
      >
        <div class="cache-card__info">
          <span class="cache-card__icon">{{ section.icon }}</span>
          <div>
            <h3>{{ section.label }}</h3>
            <p>{{ section.description }}</p>
            <ul v-if="section.urls.length > 0" class="url-list">
              <li v-for="url in section.urls" :key="url">{{ url }}</li>
            </ul>
          </div>
        </div>
        <button
          class="btn-purge"
          :class="{ 'btn-purge--danger': section.key === 'tudo' }"
          :disabled="loading !== null"
          @click="purge(section.key)"
        >
          <span v-if="loading === section.key" class="spinner" />
          <span v-else>Limpar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;

.cache-page {
  max-width: 720px;

  h2 { font-size: 28px; margin-bottom: 8px; }

  @include m.max(sm) {
    h2 { font-size: 21px; }
    .subtitle { margin-bottom: 20px; }
  }

  .subtitle {
    color: t.$text-3;
    font-size: 14px;
    margin-bottom: 32px;
    line-height: 1.6;
  }
}

.cache-status {
  font-size: 13px;
  line-height: 1.5;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 18px;
  border: 1px solid t.$border;
  color: t.$text-2;

  &--ok    { border-color: t.$accent-line; }
  &--erro  { border-color: t.$danger; background: t.$danger-bg; }
}

.cache-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cache-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 10px;
  padding: 18px 20px;

  /* A lista de URLs em monospace não quebra: empilha e deixa o botão largo. */
  @include m.max(sm) {
    align-items: stretch;
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }

  &--all {
    border-color: t.$danger;
    background: t.$danger-bg;
  }

  &__info {
    display: flex;
    align-items: flex-start;
    min-width: 0;
    gap: 14px;
  }

  &__icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }

  h3 { font-size: 15px; margin-bottom: 3px; }
  p  { font-size: 12px; color: t.$text-3; }
}

.url-list {
  margin-top: 6px;
  padding: 0;
  list-style: none;
  li {
    font-size: 11px;
    color: t.$text-3;
    font-family: monospace;
    overflow-wrap: anywhere;
  }
}

.btn-purge {
  flex-shrink: 0;
  padding: 8px 20px;

  @include m.max(sm) { width: 100%; }

  border-radius: 6px;
  border: none;
  background: t.$accent;
  color: t.$accent-ink;
  font-size: 14px;
  cursor: pointer;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) { background: t.$accent-hi; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--danger {
    background: t.$danger;
    color: t.$accent-ink;
    &:hover:not(:disabled) { background: t.$danger; }
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(26, 18, 12, 0.25);
  border-top-color: t.$accent-ink;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
