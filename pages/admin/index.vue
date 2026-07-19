<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const { canAccess, isSuperAdmin } = useAdminAuth();

const ALL_SECTIONS = {
  site: [
    { label: 'Portfolio',     description: 'Ensaios fotográficos',            icon: '<span class="material-symbols-outlined"> photo_camera </span>',  slug: 'portfolio' },
    { label: 'Depoimentos',   description: 'Avaliações de clientes',           icon: '<span class="material-symbols-outlined"> star </span>',           slug: 'depoimentos' },
    { label: 'Investimento',  description: 'Pacotes e preços',                 icon: '<span class="material-symbols-outlined"> finance_chip </span>',   slug: 'investimento' },
    { label: 'Blog',          description: 'Posts do blog',                    icon: '<span class="material-symbols-outlined"> article </span>',        slug: 'blog' },
    { label: 'FAQ',           description: 'Perguntas frequentes',             icon: '<span class="material-symbols-outlined"> quiz </span>',           slug: 'faq' },
    { label: 'Hero Banners',  description: 'Banners de destaque por página',   icon: '<span class="material-symbols-outlined"> image </span>',          slug: 'hero-banners' },
    { label: 'Menu',          description: 'Menu de navegação',                icon: '<span class="material-symbols-outlined"> menu </span>',           slug: 'menu' },
  ],
  sistema: [
    { label: 'Clientes',  description: 'Clientes da área restrita',         icon: '<span class="material-symbols-outlined"> person_3 </span>',      slug: 'clientes' },
    { label: 'Ensaios',   description: 'Sessões e envio de fotos',          icon: '<span class="material-symbols-outlined"> photo_library </span>', slug: 'sessoes' },
    { label: 'Entregas',  description: 'Entrega de ensaios finalizados',    icon: '<span class="material-symbols-outlined"> folder_zip </span>',    slug: 'entregas' },
  ],
  ferramentas: [
    { label: 'SEO',       description: 'Otimização para motores de busca',  icon: '<span class="material-symbols-outlined"> search </span>',         slug: 'seo' },
    { label: 'Cache',     description: 'Limpar cache do Cloudflare',        icon: '<span class="material-symbols-outlined"> refresh </span>',        slug: 'cache' },
    { label: 'Usuários',  description: 'Gerenciar admins e permissões',     icon: '<span class="material-symbols-outlined"> manage_accounts </span>', slug: 'usuarios' },
  ],
};

const sections = computed(() => ({
  site:        ALL_SECTIONS.site.filter(s => canAccess(s.slug)),
  sistema:     ALL_SECTIONS.sistema.filter(s => canAccess(s.slug)),
  ferramentas: ALL_SECTIONS.ferramentas.filter(s => s.slug !== 'usuarios' ? canAccess(s.slug) : isSuperAdmin.value),
}));
</script>

<template>
  <div class="admin-dashboard">
    <h2>Painel</h2>
    <p class="subtitle">Selecione uma seção para editar ou use a barra lateral de arquivos.</p>

    <template v-if="sections.sistema.length">
      <h3>Sistema</h3>
      <br>
      <div class="dashboard-grid">
        <NuxtLink v-for="s in sections.sistema" :key="s.slug" :to="`/admin/${s.slug}`" class="dashboard-card">
          <span class="card-icon" v-html="s.icon"></span>
          <div>
            <h3>{{ s.label }}</h3>
            <p>{{ s.description }}</p>
          </div>
        </NuxtLink>
      </div>
      <br><br>
    </template>

    <template v-if="sections.site.length">
      <h3>Site</h3>
      <br>
      <div class="dashboard-grid">
        <NuxtLink v-for="s in sections.site" :key="s.slug" :to="`/admin/${s.slug}`" class="dashboard-card">
          <span class="card-icon" v-html="s.icon"></span>
          <div>
            <h3>{{ s.label }}</h3>
            <p>{{ s.description }}</p>
          </div>
        </NuxtLink>
      </div>
      <br><br>
    </template>

    <template v-if="sections.ferramentas.length">
      <h3>Ferramentas</h3>
      <br>
      <div class="dashboard-grid">
        <NuxtLink v-for="s in sections.ferramentas" :key="s.slug" :to="`/admin/${s.slug}`" class="dashboard-card">
          <span class="card-icon" v-html="s.icon"></span>
          <div>
            <h3>{{ s.label }}</h3>
            <p>{{ s.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;

.admin-dashboard {
  max-width: 960px;

  h2 { font-size: 26px; font-weight: 680; letter-spacing: -0.3px; margin-bottom: 8px; color: t.$text; }
  .subtitle { color: t.$text-2; margin-bottom: 32px; font-size: 13.5px; }

  > h3 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: t.$text-3;
    margin: 0;
  }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 14px;
}

.dashboard-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: t.$radius;
  padding: 18px;
  text-decoration: none;
  color: t.$text;
  transition: border-color 0.18s, background 0.18s, transform 0.18s;

  &:hover {
    border-color: t.$accent-line;
    background: t.$surface-2;
    transform: translateY(-2px);
  }

  .card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: t.$surface-3;
    color: t.$accent;
    display: grid;
    place-items: center;
    flex-shrink: 0;

    :deep(.material-symbols-outlined) { font-size: 22px; }
  }

  h3 { font-size: 14.5px; font-weight: 620; margin-bottom: 3px; }
  p { font-size: 12.5px; color: t.$text-3; line-height: 1.45; }
}
</style>
