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

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Blog <span class="count-badge">{{ posts.length }}</span></h2>
      <NuxtLink to="/admin/blog/save" class="btn-primary">+ Novo post</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="posts.length === 0" class="empty-hint">Nenhum post publicado.</div>
    <table v-else class="data-table">
      <thead><tr><th>Título</th><th>Categoria</th><th>Data</th><th>Ativo</th><th></th></tr></thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id">
          <td>{{ p.titulo }}</td>
          <td class="text-muted">{{ p.categoria }}</td>
          <td class="text-sm text-muted">{{ p.data || '—' }}</td>
          <td>{{ p.ativo ? '✅' : '❌' }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/blog/save/${p.id}`" class="btn-icon">✏️</NuxtLink>
            <button class="btn-icon btn-danger" @click="deletePost(p.id, p.titulo)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
