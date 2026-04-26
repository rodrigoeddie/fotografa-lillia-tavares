<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const sections = {
  site: [
    { label: 'Portfolio', description: 'Ensaios fotográficos', icon: '📷', path: '/admin/portfolio' },
    { label: 'Depoimentos', description: 'Avaliações de clientes', icon: '⭐', path: '/admin/depoimentos' },
    { label: 'Investimento', description: 'Pacotes e preços', icon: '💰', path: '/admin/investimento' },
    { label: 'Blog', description: 'Posts do blog', icon: '📝', path: '/admin/blog' },
    { label: 'FAQ', description: 'Perguntas frequentes', icon: '❓', path: '/admin/faq' },
    { label: 'Menu', description: 'Menu de navegação', icon: '☰', path: '/admin/menu' },
  ],
  sistema: [
    { label: 'Clientes', description: 'Clientes da área restrita', icon: '👥', path: '/admin/clientes' },
    { label: 'Seleção de Fotos', description: 'Sessões e envio de fotos', icon: '🖼', path: '/admin/sessoes' },
    { label: 'Entregas', description: 'Entrega de ensaios finalizados', icon: '📦', path: '/admin/entregas' },
  ],
  ferramentas: [
    { label: 'SEO', description: 'Otimização para motores de busca', icon: '🔍', path: '/admin/seo' },
    { label: 'Cache', description: 'Limpar cache do Cloudflare', icon: '🔄', path: '/admin/cache' },
  ],
};
</script>

<template>
  <div class="admin-dashboard">
    <h2>Painel</h2>
    <p class="subtitle">Selecione uma seção para editar ou use a barra lateral de arquivos.</p>

    <h3>Sistema</h3>
    <br>

    <div class="dashboard-grid">
      <NuxtLink
        v-for="s in sections.sistema"
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

    <br><br>
    <h3>Site</h3>
    <br>

    <div class="dashboard-grid">
      <NuxtLink
        v-for="s in sections.site"
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

    <br><br>
    <h3>Ferramentas</h3>
    <br>

    <div class="dashboard-grid">
      <NuxtLink
        v-for="s in sections.ferramentas"
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
