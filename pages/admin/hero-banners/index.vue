<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const cfImg = useCfImg();

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string | null;
  bg_image: string | null;
  cta_nome: string | null;
  cta_url: string | null;
  cta_target: string;
  ativo: number;
  ordem: number;
  routes: string[];
}

const banners = ref<Banner[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    banners.value = await adminFetch<Banner[]>('/api/admin/hero-banners');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteBanner(id: number, titulo: string) {
  if (!confirm(`Excluir banner "${titulo}"?`)) return;
  try {
    await adminFetch(`/api/admin/hero-banners/${id}`, { method: 'DELETE' });
    showMessage('Banner removido', 'success');
    banners.value = banners.value.filter((b) => b.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <span class="material-symbols-outlined">image</span>
      <h2>Hero Banners</h2>
      <NuxtLink to="/admin/hero-banners/save" class="btn-add-item">
        <span class="material-symbols-outlined">add_photo_alternate</span>
        <span>Novo banner</span>
      </NuxtLink>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <div v-else-if="banners.length === 0" class="empty-state">
      <p>Nenhum hero banner cadastrado ainda.</p>
      <NuxtLink to="/admin/hero-banners/save" class="btn-primary">
        <span class="material-symbols-outlined">add_photo_alternate</span>
        <span>Criar primeiro banner</span>
      </NuxtLink>
    </div>

    <div v-else class="banners-list">
      <div v-for="b in banners" :key="b.id" class="banner-card">
        <!-- Preview da imagem -->
        <div class="banner-thumb">
          <nuxt-img
            v-if="b.bg_image"
            provider="cloudflare"
            :src="cfImg(b.bg_image)"
            width="220"
            height="46"
            fit="cover"
            format="webp"
            placeholder
            loading="lazy"
            class="thumb-img"
          />
          <div v-else class="thumb-placeholder">
            <span class="material-symbols-outlined">image</span>
          </div>
        </div>

        <!-- Info -->
        <div class="banner-info">
          <div class="banner-row">
            <h3 class="banner-titulo">{{ b.titulo }}</h3>
            <span class="status-badge" :class="b.ativo ? 'active' : 'inactive'">
              {{ b.ativo ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          <p v-if="b.subtitulo" class="banner-sub">{{ b.subtitulo }}</p>
          <div class="banner-meta">
            <span v-if="b.cta_nome" class="meta-pill">
              <span class="material-symbols-outlined">link</span>
              {{ b.cta_nome }}
              <span v-if="b.cta_target === 'blank'" class="meta-target">↗</span>
            </span>
            <span class="meta-pill pages-pill">
              <span class="material-symbols-outlined">pages</span>
              {{ b.routes.length }} {{ b.routes.length === 1 ? 'página' : 'páginas' }}
            </span>
          </div>
          <div v-if="b.routes.length > 0" class="banner-routes">
            <code v-for="r in b.routes" :key="r" class="route-chip">{{ r }}</code>
          </div>
        </div>

        <!-- Ações -->
        <div class="banner-actions">
          <NuxtLink :to="`/admin/hero-banners/save/${b.id}`" class="btn-icon" title="Editar">
            <span class="material-symbols-outlined">edit</span>
          </NuxtLink>
          <button class="btn-icon danger" title="Excluir" @click="deleteBanner(b.id, b.titulo)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.page-header {
  display: flex;
  align-items: center;
  gap: 10px;

  .material-symbols-outlined { font-size: 22px; color: #60a5fa; }
}

.btn-add-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #1e3a5f;
  border: 1px solid #2d5a9e;
  color: #93c5fd;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  text-decoration: none;
  margin-left: auto;
  &:hover { background: #253d55; }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #555;

  p { margin-bottom: 20px; }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
}

.banners-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.banner-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #0d1117;
  border: 1px solid #21262d;
  border-radius: 10px;
  padding: 14px;
  transition: border-color .15s;

  &:hover { border-color: #30363d; }
}

.banner-thumb {
  flex-shrink: 0;
  width: 220px;
  height: 46px;
  border-radius: 6px;
  overflow: hidden;
  background: #161b22;
  border: 1px solid #21262d;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #30363d;
  .material-symbols-outlined { font-size: 20px; }
}

.banner-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.banner-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.banner-titulo {
  font-size: 15px;
  font-weight: 600;
  color: #e6edf3;
  margin: 0;
}

.banner-sub {
  font-size: 13px;
  color: #8b949e;
  margin: 0;
}

.status-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;

  &.active   { background: #0d3321; color: #3fb950; border: 1px solid #1a5c36; }
  &.inactive { background: #2d1b1b; color: #f87171; border: 1px solid #5c2d2d; }
}

.banner-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8b949e;
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 20px;
  padding: 2px 10px;

  .material-symbols-outlined { font-size: 14px; }
}

.meta-target { font-size: 10px; }

.pages-pill .material-symbols-outlined { color: #60a5fa; }

.banner-routes {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}

.route-chip {
  font-size: 11px;
  font-family: monospace;
  background: #161b22;
  border: 1px solid #30363d;
  color: #8b949e;
  border-radius: 4px;
  padding: 1px 7px;
}

.banner-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  background: #161b22;
  border: 1px solid #21262d;
  border-radius: 6px;
  color: #8b949e;
  text-decoration: none;
  cursor: pointer;
  transition: all .15s;

  .material-symbols-outlined { font-size: 18px; }
  &:hover { background: #1f2937; color: #e6edf3; border-color: #30363d; }

  &.danger:hover { background: #2d1b1b; color: #f87171; border-color: #5c2d2d; }
}

.loading-hint {
  color: #555;
  padding: 20px 0;
  font-size: 14px;
}
</style>
