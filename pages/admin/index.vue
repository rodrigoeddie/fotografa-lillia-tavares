<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const sections = [
  { label: 'Portfolio', description: 'Ensaios fotográficos', icon: '📷', path: '/admin/portfolio' },
  { label: 'Depoimentos', description: 'Avaliações de clientes', icon: '⭐', path: '/admin/depoimentos' },
  { label: 'Investimento', description: 'Pacotes e preços', icon: '💰', path: '/admin/investimento' },
  { label: 'Blog', description: 'Posts do blog', icon: '📝', path: '/admin/blog' },
  { label: 'FAQ', description: 'Perguntas frequentes', icon: '❓', path: '/admin/faq' },
  { label: 'Menu', description: 'Menu de navegação', icon: '☰', path: '/admin/menu' },
];
</script>

<template>
  <div class="admin-dashboard">
    <h2>Painel</h2>
    <p class="subtitle">Selecione uma seção para editar ou use a barra lateral de arquivos.</p>

    <div class="dashboard-grid">
      <NuxtLink
        v-for="s in sections"
        :key="s.path"
        :to="s.path"
        class="dashboard-card"
      >
        <span class="card-icon">{{ s.icon }}</span>
        <div>
          <h3>{{ s.label }}</h3>
          <p>{{ s.description }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-dashboard {
  max-width: 800px;

  h2 { font-size: 28px; margin-bottom: 8px; }
  .subtitle { color: #888; margin-bottom: 32px; font-size: 14px; }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.dashboard-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  padding: 20px;
  text-decoration: none;
  color: #eee;
  transition: border-color 0.2s, background 0.2s;

  &:hover {
    border-color: #3b82f6;
    background: #1a2a3a;
  }

  .card-icon { font-size: 28px; flex-shrink: 0; }
  h3 { font-size: 16px; margin-bottom: 4px; }
  p { font-size: 12px; color: #888; }
}
</style>
