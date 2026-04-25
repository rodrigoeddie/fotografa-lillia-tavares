<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface FaqCat { id: number; titulo: string; slug: string; perguntas: any[]; }

const categorias = ref<FaqCat[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    categorias.value = await adminFetch<FaqCat[]>('/api/admin/faq');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteCategoria(id: number, titulo: string) {
  if (!confirm(`Excluir categoria "${titulo}" e todas as perguntas?`)) return;
  try {
    await adminFetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    showMessage('Categoria removida', 'success');
    categorias.value = categorias.value.filter((c) => c.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>FAQ <span class="count-badge">{{ categorias.length }} categorias</span></h2>
      <NuxtLink to="/admin/faq/save" class="btn-primary">+ Nova categoria</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="categorias.length === 0" class="empty-hint">Nenhuma categoria.</div>
    <table v-else class="data-table">
      <thead><tr><th>Título</th><th>Slug</th><th>Perguntas</th><th></th></tr></thead>
      <tbody>
        <tr v-for="c in categorias" :key="c.id">
          <td>{{ c.titulo }}</td>
          <td class="text-muted">{{ c.slug }}</td>
          <td>{{ c.perguntas?.length ?? 0 }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/faq/save/${c.id}`" class="btn-icon">✏️</NuxtLink>
            <button class="btn-icon btn-danger" @click="deleteCategoria(c.id, c.titulo)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
