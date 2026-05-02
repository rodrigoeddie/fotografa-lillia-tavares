<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const cfURI = useRuntimeConfig().public.cloudflareURI;

interface Sessao {
  id: number; cliente_id: number; nome_sessao: string; produto_tipo: string;
  pacote_index: number; fotos_incluidas: number; preco_foto_extra: number;
  status: string; criado_em: string; cliente_nome: string; cliente_email: string;
  primeira_foto_id: string | null;
}

const sessoes = ref<Sessao[]>([]);
const loading = ref(false);
const entregasSessaoIds = ref<Set<number>>(new Set());

const columns = [
  {
    key: 'aguardando_fotos',
    label: `
      <span class="material-symbols-outlined"> camera_roll </span>
      <span>Aguardando fotos</span>
    `
  },
  {
    key: 'aguardando_selecao',
    label: `
      <span class="material-symbols-outlined"> hourglass </span>
      <span>Aguardando seleção</span>
    `
  },
  {
    key: 'selecao_concluida',
    label: `
      <span class="material-symbols-outlined"> list_alt_check </span>
      <span>Seleção concluída</span>
    `
  },
];

const columnCards = (status: string) => sessoes.value.filter((s) => s.status === status);

async function load() {
  loading.value = true;
  try {
    const [s, e] = await Promise.all([
      adminFetch<Sessao[]>('/api/admin/sessoes'),
      adminFetch<{ sessao_id: number }[]>('/api/admin/entregas'),
    ]);
    sessoes.value = s;
    entregasSessaoIds.value = new Set(e.map((x) => x.sessao_id));
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function updateStatus(sessao: Sessao, newStatus: string) {
  if (sessao.status === newStatus) return;

  // Captura valores antes do update otimista — o proxy reativo pode ficar stale após a troca no array
  const { id, nome_sessao, produto_tipo, pacote_index, fotos_incluidas, preco_foto_extra } = sessao;
  const prevStatus = sessao.status;

  const idx = sessoes.value.findIndex((s) => s.id === id);
  if (idx !== -1) sessoes.value[idx] = { ...sessoes.value[idx]!, status: newStatus };
  try {
    await adminFetch(`/api/admin/sessoes/${id}`, {
      method: 'PUT',
      body: { nome_sessao, produto_tipo, pacote_index, fotos_incluidas, preco_foto_extra, status: newStatus },
    });
  } catch (e: any) {
    if (idx !== -1) sessoes.value[idx] = { ...sessoes.value[idx]!, status: prevStatus };
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
      <div class="row aic">
        <span class="material-symbols-outlined">photo_library</span>
        <h2>Ensaios</h2>
        <p class="dep-meta"> - {{ sessoes.length }} sessões</p>
      </div>
      <NuxtLink to="/admin/sessoes/save" class="btn-add-item">
        <span class="material-symbols-outlined"> add </span>
        <span>Nova sessão</span>
      </NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="kanban-board">
      <div
        v-for="col in columns"
        :key="col.key"
        class="kanban-col"
        :class="`kanban-col--${col.key}`"
      >
        <div class="kanban-col-header">
          <span class="col-label" v-html="col.label"></span>
          <span class="col-count">{{ columnCards(col.key).length }}</span>
        </div>
        <div class="kanban-cards">
          <div
            v-for="s in columnCards(col.key)"
            :key="s.id"
            class="kanban-card"
          >
            <NuxtLink :to="`/admin/sessoes/save/${s.id}`" class="wrap-info">
              <span class="material-symbols-outlined icon-edit"> edit </span>
              <div class="card-thumb">
                <img v-if="s.primeira_foto_id" :src="`${cfURI}${s.primeira_foto_id}/public`" alt="" />
                <span v-else class="material-symbols-outlined">no_photography</span>
              </div>
              <div class="card-body">
                <p class="card-name">{{ s.cliente_nome }}</p>
                <p class="card-sub">{{ s.nome_sessao }}</p>
                <p class="card-badge">{{ s.produto_tipo }} · Pacote {{ s.pacote_index + 1 }}</p>
              </div>
            </NuxtLink>
            <div class="card-actions">
              <NuxtLink :to="`/admin/sessoes/${s.id}/fotos`" class="card-action" title="Gerenciar fotos">
                <span class="material-symbols-outlined">photo_library</span> <span>Fotos</span>
              </NuxtLink>
              <NuxtLink
                v-if="s.status === 'selecao_concluida' || s.status === 'entregue'"
                :to="`/admin/sessoes/${s.id}/selecao`"
                class="card-action"
                title="Ver seleção"
              >
                <span class="material-symbols-outlined">visibility</span> <span>Ver seleção</span>
              </NuxtLink>
              <NuxtLink v-if="entregasSessaoIds.has(s.id)" :to="`/admin/entregas/${s.id}`" class="card-action" title="Ver entregas">
                <span class="material-symbols-outlined">inventory_2</span> <span>Entregas</span>
              </NuxtLink>
              <button class="card-action card-action--danger" title="Excluir" @click="deleteSessao(s)">
                <span class="material-symbols-outlined">delete</span> <span>Deletar</span>
              </button>
            </div>
          </div>
          <p v-if="columnCards(col.key).length === 0" class="kanban-empty">Vazio</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.wrap-info {
  display: flex;
  width: 100%;
  gap: 10px;

  .icon-edit {
    transition: opacity 0.2s;
    position: absolute;
    opacity: 0;
    right: 5px;
    top: 5px;
  }

  &:hover .icon-edit {
    opacity: 1;
  }
}

.kanban-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  align-items: start;
  overflow-x: auto;
  min-width: 0;
}

.kanban-col {
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s, background 0.15s;
}

.kanban-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px 10px;
  border-bottom: 4px solid #2a2a2a;

  .col-label {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #ccc;
  }

  .col-count {
    background: #2a2a2a;
    color: #888;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
  }
}

.kanban-col--aguardando_fotos,
.kanban-col--aguardando_fotos .kanban-col-header { border-bottom-color: #92200e40; }
.kanban-col--aguardando_selecao,
.kanban-col--aguardando_selecao .kanban-col-header { border-bottom-color: #af921e40; }
.kanban-col--selecao_concluida,
.kanban-col--selecao_concluida .kanban-col-header { border-bottom-color: #16653440; }
.kanban-col--entregue,
.kanban-col--entregue .kanban-col-header { border-bottom-color: #4c1d9540; }

.kanban-cards {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.kanban-card {
  background: #1e1e1e;
  border: 1px solid #2e2e2e;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover { border-color: #444; box-shadow: 0 2px 8px #0004; }
}

.card-thumb {
  width: 100px;
  height: 100px;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .material-symbols-outlined { font-size: 32px; color: #333; }
}

.card-body {
  flex: 1;
  min-width: 0;
  padding: 10px 12px 0 0;

  .card-name { font-size: 13px; font-weight: 600; color: #e5e7eb; margin: 0 0 2px; }
  .card-sub  { font-size: 11px; color: #6b7280; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-badge {
    display: inline-block;
    font-size: 10px;
    background: #2a2a2a;
    color: #9ca3af;
    padding: 2px 6px;
    border-radius: 4px;
    margin: 0;
  }
}
.card-actions {
  border-top: 1px solid #2a2a2a;
  padding: 12px 12px 10px;
  justify-content: center;
  flex-shrink: 0;
  display: flex;
  width: 100%;
  gap: 4px;
}

.card-action {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  gap: 4rem;
  padding: 4px 7px;
  text-decoration: none;
  color: #555;
  border-bottom: 2px solid transparent;
  line-height: 1.4;
  transition: background 0.1s, color 0.1s;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 1px;
    height: 14px;
    background: #2a2a2a;
    margin-left: 5px;
    left: -6px;
    position: absolute;
  }

  &:first-child:before {
    display: none;
    margin-left: 0;
  }

  span {
    font-size: 14px;

    &.material-symbols-outlined {
      font-size: 18px;
    }
  }

  &:hover {
    border-bottom: 2px solid #555;
    color: white;
  }

  &--danger:hover {
    color: #ef4444;
  }
}

.kanban-empty {
  text-align: center;
  color: #3a3a3a;
  font-size: 12px;
  padding: 20px 0;
  margin: 0;
  user-select: none;
}
</style>
