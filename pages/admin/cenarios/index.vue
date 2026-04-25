<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface CenarioPagina { id: number; slug: string; titulo: string; cenarios: any[]; }

const paginas = ref<CenarioPagina[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    paginas.value = await adminFetch<CenarioPagina[]>('/api/admin/cenarios');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deletePagina(id: number, titulo: string) {
  if (!confirm(`Excluir página de cenários "${titulo}"?`)) return;
  try {
    await adminFetch(`/api/admin/cenarios/${id}`, { method: 'DELETE' });
    showMessage('Página removida', 'success');
    paginas.value = paginas.value.filter((p) => p.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Cenários <span class="count-badge">{{ paginas.length }} páginas</span></h2>
      <NuxtLink to="/admin/cenarios/save" class="btn-primary">+ Nova página</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="paginas.length === 0" class="empty-hint">Nenhuma página de cenários.</div>
    <table v-else class="data-table">
      <thead><tr><th>Título</th><th>Slug</th><th>Cenários</th><th></th></tr></thead>
      <tbody>
        <tr v-for="p in paginas" :key="p.id">
          <td>{{ p.titulo }}</td>
          <td class="text-muted">{{ p.slug }}</td>
          <td>{{ p.cenarios?.length ?? 0 }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/cenarios/save/${p.id}`" class="btn-icon">✏️</NuxtLink>
            <button class="btn-icon btn-danger" @click="deletePagina(p.id, p.titulo)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
