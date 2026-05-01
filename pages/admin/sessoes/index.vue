<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Sessao {
  id: number; cliente_id: number; nome_sessao: string; produto_tipo: string;
  pacote_index: number; fotos_incluidas: number; preco_foto_extra: number;
  status: string; criado_em: string; cliente_nome: string; cliente_email: string;
}

const sessoes = ref<Sessao[]>([]);
const loading = ref(false);

const statusLabels: Record<string, string> = {
  aguardando_fotos: '⏳ Aguardando fotos',
  aguardando_selecao: '📸 Aguardando seleção',
  selecao_concluida: '✅ Seleção concluída',
  entregue: '📦 Entregue',
};

async function load() {
  loading.value = true;
  try {
    sessoes.value = await adminFetch<Sessao[]>('/api/admin/sessoes');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function updateStatus(sessao: Sessao, status: string) {
  const body = {
    nome_sessao: sessao.nome_sessao, produto_tipo: sessao.produto_tipo,
    pacote_index: sessao.pacote_index, fotos_incluidas: sessao.fotos_incluidas,
    preco_foto_extra: sessao.preco_foto_extra, status,
  };
  try {
    await adminFetch(`/api/admin/sessoes/${sessao.id}`, { method: 'PUT', body });
    const idx = sessoes.value.findIndex((s) => s.id === sessao.id);
    if (idx !== -1) sessoes.value[idx] = { ...sessoes.value[idx], status };
    showMessage('Status atualizado', 'success');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function deleteSessao(s: Sessao) {
  if (!confirm(`Excluir sessão "${s.nome_sessao}"? As fotos cadastradas serão removidas.`)) return;
  try {
    await adminFetch(`/api/admin/sessoes/${s.id}`, { method: 'DELETE' });
    showMessage('Sessão removida', 'success');
    sessoes.value = sessoes.value.filter((x) => x.id !== s.id);
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
        <h2>Fotos para Seleção</h2>
        <p class="dep-meta">{{ sessoes.length }} sessões</p>
      </div>
      <NuxtLink to="/admin/sessoes/save" class="btn-add-item">+ Nova sessão</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="sessoes.length === 0" class="list-empty">Nenhuma sessão cadastrada.</p>
    <div v-else class="item-list">
      <div v-for="s in sessoes" :key="s.id" class="item-row">
        <div class="item-info">
          <span class="item-title">{{ s.cliente_nome }}</span>
          <span class="item-sub">{{ s.cliente_email }}</span>
        </div>
        <span class="item-meta">{{ s.nome_sessao }}</span>
        <span class="item-badge">{{ s.produto_tipo }} · Pacote {{ s.pacote_index + 1 }}</span>
        <select
          class="status-select"
          :value="s.status"
          @change="updateStatus(s, ($event.target as HTMLSelectElement).value)"
        >
          <option value="aguardando_fotos">⏳ Aguardando fotos</option>
          <option value="aguardando_selecao">📸 Aguardando seleção</option>
          <option value="selecao_concluida">✅ Seleção concluída</option>
          <option value="entregue">📦 Entregue</option>
        </select>
        <div class="item-actions">
          <NuxtLink :to="`/admin/sessoes/save/${s.id}`" class="btn-icon" title="Editar sessão">✏️</NuxtLink>
          <NuxtLink :to="`/admin/sessoes/${s.id}/fotos`" class="btn-icon" title="Gerenciar fotos">🖼</NuxtLink>
          <NuxtLink :to="`/admin/sessoes/${s.id}/selecao`" class="btn-icon" title="Ver seleção do cliente">👁</NuxtLink>
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteSessao(s)">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
