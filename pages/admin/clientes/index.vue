<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Cliente { id: number; nome: string; email: string; criado_em: string; }

const clientes = ref<Cliente[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    clientes.value = await adminFetch<Cliente[]>('/api/admin/clientes');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteCliente(id: number, nome: string) {
  if (!confirm(`Excluir "${nome}"? Todas as sessões vinculadas serão removidas.`)) return;
  try {
    await adminFetch(`/api/admin/clientes/${id}`, { method: 'DELETE' });
    showMessage('Cliente removido', 'success');
    clientes.value = clientes.value.filter((c) => c.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Clientes</h2>
        <p class="dep-meta">{{ clientes.length }} clientes</p>
      </div>
      <NuxtLink to="/admin/clientes/save" class="btn-add-item">+ Novo cliente</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="clientes.length === 0" class="list-empty">Nenhum cliente cadastrado.</p>
    <div v-else class="item-list">
      <div v-for="c in clientes" :key="c.id" class="item-row">
        <div class="item-info">
          <span class="item-title">{{ c.nome }}</span>
          <span class="item-sub">{{ c.email }}</span>
        </div>
        <span class="item-meta">{{ c.criado_em }}</span>
        <div class="item-actions">
          <NuxtLink :to="`/admin/clientes/save/${c.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteCliente(c.id, c.nome)">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
