<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Depoimento { id: number; nome: string; rating: number; featured: number; data: string; }

const depoimentos = ref<Depoimento[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    depoimentos.value = await adminFetch<Depoimento[]>('/api/admin/depoimentos');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteDepoimento(id: number, nome: string) {
  if (!confirm(`Excluir depoimento de "${nome}"?`)) return;
  try {
    await adminFetch(`/api/admin/depoimentos/${id}`, { method: 'DELETE' });
    showMessage('Depoimento removido', 'success');
    depoimentos.value = depoimentos.value.filter((d) => d.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Depoimentos <span class="count-badge">{{ depoimentos.length }}</span></h2>
      <NuxtLink to="/admin/depoimentos/save" class="btn-primary">+ Novo depoimento</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="depoimentos.length === 0" class="empty-hint">Nenhum depoimento cadastrado.</div>
    <table v-else class="data-table">
      <thead><tr><th>Nome</th><th>Rating</th><th>Featured</th><th>Data</th><th></th></tr></thead>
      <tbody>
        <tr v-for="d in depoimentos" :key="d.id">
          <td>{{ d.nome }}</td>
          <td>{{ '⭐'.repeat(d.rating) }}</td>
          <td>{{ d.featured ? '✅' : '' }}</td>
          <td class="text-muted text-sm">{{ d.data || '—' }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/depoimentos/save/${d.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
            <button class="btn-icon btn-danger" title="Excluir" @click="deleteDepoimento(d.id, d.nome)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
