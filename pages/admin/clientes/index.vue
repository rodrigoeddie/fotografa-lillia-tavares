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
    <div class="page-header">
      <h2>Clientes <span class="count-badge">{{ clientes.length }}</span></h2>
      <NuxtLink to="/admin/clientes/save" class="btn-primary">+ Novo cliente</NuxtLink>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="clientes.length === 0" class="empty-hint">Nenhum cliente cadastrado.</div>

    <table v-else class="data-table">
      <thead>
        <tr><th>Nome</th><th>E-mail</th><th>Cadastrado em</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="c in clientes" :key="c.id">
          <td>{{ c.nome }}</td>
          <td class="text-muted">{{ c.email }}</td>
          <td class="text-sm text-muted">{{ c.criado_em }}</td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/clientes/save/${c.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
            <button class="btn-icon btn-danger" title="Excluir" @click="deleteCliente(c.id, c.nome)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
