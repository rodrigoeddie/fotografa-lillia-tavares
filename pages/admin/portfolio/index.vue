<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface PortfolioWork { id: number; slug: string; titulo: string; categoria: string; ativo: number; home: number; }

const works = ref<PortfolioWork[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    works.value = await adminFetch<PortfolioWork[]>('/api/admin/portfolio');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteWork(id: number, titulo: string) {
  if (!confirm(`Excluir "${titulo}"?`)) return;
  try {
    await adminFetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    showMessage('Portfolio removido', 'success');
    works.value = works.value.filter((w) => w.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Portfolio <span class="count-badge">{{ works.length }}</span></h2>
      <NuxtLink to="/admin/portfolio/save" class="btn-primary">+ Novo work</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="works.length === 0" class="empty-hint">Nenhum portfolio cadastrado.</div>
    <table v-else class="data-table">
      <thead><tr><th>Título</th><th>Categoria</th><th>Home</th><th>Ativo</th><th></th></tr></thead>
      <tbody>
        <tr v-for="w in works" :key="w.id">
          <td>{{ w.titulo || w.slug }}</td>
          <td class="text-muted">{{ w.categoria }}</td>
          <td>{{ w.home ? '🏠' : '' }}</td>
          <td>{{ w.ativo ? '✅' : '❌' }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/portfolio/${w.id}/fotos`" class="btn-icon" title="Fotos">🖼</NuxtLink>
            <NuxtLink :to="`/admin/portfolio/save/${w.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
            <button class="btn-icon btn-danger" @click="deleteWork(w.id, w.titulo || w.slug)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
