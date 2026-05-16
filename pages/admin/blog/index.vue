<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const { showConfirm } = useDialog();

interface BlogPost { id: number; slug: string; titulo: string; categoria: string; data: string; ativo: number; }
interface Categoria { id: number; slug: string; titulo: string; }

const posts = ref<BlogPost[]>([]);
const categorias = ref<Categoria[]>([]);
const loading = ref(false);
const filterCategoria = ref('');

const filteredPosts = computed(() =>
  filterCategoria.value
    ? posts.value.filter((p) => p.categoria === filterCategoria.value)
    : posts.value
);

async function load() {
  loading.value = true;
  try {
    [posts.value, categorias.value] = await Promise.all([
      adminFetch<BlogPost[]>('/api/admin/blog'),
      adminFetch<Categoria[]>('/api/admin/blog/categorias'),
    ]);
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function categoriaLabel(slug: string) {
  return categorias.value.find((c) => c.slug === slug)?.titulo ?? slug;
}

async function deletePost(id: number, titulo: string) {
  const confirmed = await showConfirm(`Excluir post "${titulo}"?`, 'Confirmar exclusão', 'Sim, excluir');
  if (!confirmed) return;
  try {
    await adminFetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    showMessage('Post removido', 'success');
    posts.value = posts.value.filter((p) => p.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function toggleAtivo(p: BlogPost) {
  const prev = p.ativo;
  p.ativo = prev ? 0 : 1;
  try {
    await adminFetch(`/api/admin/blog/${p.id}`, { method: 'PATCH', body: { ativo: p.ativo } });
  } catch (e: any) {
    p.ativo = prev;
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Blog</h2>
        <p class="dep-meta">{{ filteredPosts.length }} posts<span v-if="filterCategoria"> na categoria selecionada</span></p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/admin/blog/categorias" class="btn-add-item btn-category"><span class="material-symbols-outlined"> category </span> Categorias</NuxtLink>
        <NuxtLink to="/admin/blog/save" class="btn-add-item"><span class="material-symbols-outlined"> add_2 </span> Novo Post</NuxtLink>
      </div>
    </div>

    <!-- Filtro por categoria -->
    <div v-if="categorias.length" class="filter-bar">
      <span class="filter-label">Categoria:</span>
      <button
        :class="['filter-btn', filterCategoria === '' ? 'active' : '']"
        @click="filterCategoria = ''"
      >Todas</button>
      <button
        v-for="cat in categorias"
        :key="cat.id"
        :class="['filter-btn', filterCategoria === cat.slug ? 'active' : '']"
        @click="filterCategoria = cat.slug"
      >{{ cat.titulo }}</button>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="filteredPosts.length === 0" class="list-empty">Nenhum post encontrado.</p>
    <div v-else class="item-list">
      <div v-for="p in filteredPosts" :key="p.id" class="item-row">
        <NuxtLink :to="`/admin/blog/save/${p.id}`" class="link-row">
          <span class="item-title">{{ p.titulo }}</span>
          <span class="item-slug">{{ categoriaLabel(p.categoria) }}</span>
          <span class="item-meta">{{ p.data || '—' }}</span>
        </NuxtLink>
        <label class="switch" :title="p.ativo ? 'Desativar' : 'Ativar'">
          <input type="checkbox" :checked="!!p.ativo" @change="toggleAtivo(p)" />
          <span class="slider" />
        </label>
        <div class="item-actions">
          <button class="btn-icon btn-danger" @click="deletePost(p.id, p.titulo)">🗑 Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
