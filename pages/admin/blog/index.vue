<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface BlogPost { id: number; slug: string; titulo: string; categoria: string; data: string; ativo: number; }

const posts = ref<BlogPost[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    posts.value = await adminFetch<BlogPost[]>('/api/admin/blog');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deletePost(id: number, titulo: string) {
  if (!confirm(`Excluir post "${titulo}"?`)) return;
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
        <p class="dep-meta">{{ posts.length }} posts</p>
      </div>
      <NuxtLink to="/admin/blog/save" class="btn-add-item">+ Novo post</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="posts.length === 0" class="list-empty">Nenhum post publicado.</p>
    <div v-else class="item-list">
      <div v-for="p in posts" :key="p.id" class="item-row">
        <NuxtLink :to="`/admin/blog/save/${p.id}`" class="link-row">
          <span class="item-title">{{ p.titulo }}</span>
          <span class="item-slug">{{ p.categoria }}</span>
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
