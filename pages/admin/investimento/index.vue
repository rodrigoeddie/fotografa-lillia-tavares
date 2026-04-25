<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Produto { id: number; slug: string; title: string; active: number; ordem: number; }

const produtos = ref<Produto[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    produtos.value = await adminFetch<Produto[]>('/api/admin/produtos');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteProduto(id: number, title: string) {
  if (!confirm(`Excluir "${title}"?`)) return;
  try {
    await adminFetch(`/api/admin/produtos/${id}`, { method: 'DELETE' });
    showMessage('Produto removido', 'success');
    produtos.value = produtos.value.filter((p) => p.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Investimentos / Produtos <span class="count-badge">{{ produtos.length }}</span></h2>
      <NuxtLink to="/admin/investimento/save" class="btn-primary">+ Novo produto</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="produtos.length === 0" class="empty-hint">Nenhum produto cadastrado.</div>
    <table v-else class="data-table">
      <thead><tr><th>Slug</th><th>Título</th><th>Ativo</th><th>Ordem</th><th></th></tr></thead>
      <tbody>
        <tr v-for="p in produtos" :key="p.id">
          <td class="text-muted">{{ p.slug }}</td>
          <td>{{ p.title }}</td>
          <td>{{ p.active ? '✅' : '❌' }}</td>
          <td>{{ p.ordem }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/investimento/save/${p.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
            <button class="btn-icon btn-danger" title="Excluir" @click="deleteProduto(p.id, p.title)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
