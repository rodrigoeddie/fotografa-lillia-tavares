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
    key: 'menu',
    label: 'Menu',
    description: 'Navegação do site.',
    icon: '☰',
    urls: [
      `${BASE}/api/public/menu`,
    ],
  },
];

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
    showMessage('Erro: ' + (e.data?.statusMessage || e.message), 'error');
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
.cache-page {
  max-width: 720px;

  h2 { font-size: 28px; margin-bottom: 8px; }
  .subtitle {
    color: #888;
    font-size: 14px;
    margin-bottom: 32px;
    line-height: 1.6;
  }
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
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 18px 20px;

  &--all {
    border-color: #7f1d1d;
    background: #1f1010;
  }

  &__info {
    display: flex;
    align-items: flex-start;
    gap: 14px;
  }

  &__icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }

  h3 { font-size: 15px; margin-bottom: 3px; }
  p  { font-size: 12px; color: #888; }
}

.url-list {
  margin-top: 6px;
  padding: 0;
  list-style: none;
  li {
    font-size: 11px;
    color: #555;
    font-family: monospace;
  }
}

.btn-purge {
  flex-shrink: 0;
  padding: 8px 20px;
  border-radius: 6px;
  border: none;
  background: #1d4ed8;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) { background: #2563eb; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  &--danger {
    background: #b91c1c;
    &:hover:not(:disabled) { background: #dc2626; }
  }
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
