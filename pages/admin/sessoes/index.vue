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
    sessoes.value = await adminFetch<Sessao[]>('/api/admin/sessoes');
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

// ─── Drag & drop ─────────────────────────────────────────────────────────────
const draggingId = ref<number | null>(null);
const dragOverCol = ref<string | null>(null);

function onDragStart(e: DragEvent, sessao: Sessao) {
  draggingId.value = sessao.id;
  e.dataTransfer!.effectAllowed = 'move';
}
function onDragOver(e: DragEvent, colKey: string) {
  e.preventDefault();
  e.dataTransfer!.dropEffect = 'move';
  dragOverCol.value = colKey;
}
function onDragLeave(e: DragEvent) {
  // só limpa se saiu da coluna de fato (não para filho)
  if (!(e.currentTarget as Element).contains(e.relatedTarget as Node)) {
    dragOverCol.value = null;
  }
}
function onDrop(e: DragEvent, colKey: string) {
  e.preventDefault();
  dragOverCol.value = null;
  if (draggingId.value === null) return;
  const sessao = sessoes.value.find((s) => s.id === draggingId.value);
  if (sessao) updateStatus(sessao, colKey);
  draggingId.value = null;
}
function onDragEnd() {
  draggingId.value = null;
  dragOverCol.value = null;
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
    <div v-else class="kanban-board">
      <div
        v-for="col in columns"
        :key="col.key"
        class="kanban-col"
        :class="[`kanban-col--${col.key}`, { 'kanban-col--drag-over': dragOverCol === col.key }]"
        @dragover="(e) => onDragOver(e, col.key)"
        @dragleave="(e) => onDragLeave(e)"
        @drop="(e) => onDrop(e, col.key)"
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
            :class="{ 'kanban-card--dragging': draggingId === s.id }"
            draggable="true"
            @dragstart="(e) => onDragStart(e, s)"
            @dragend="onDragEnd"
          >
            <div class="card-body">
              <p class="card-name">{{ s.cliente_nome }}</p>
              <p class="card-sub">{{ s.nome_sessao }}</p>
              <p class="card-badge">{{ s.produto_tipo }} · Pacote {{ s.pacote_index + 1 }}</p>
            </div>
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
              <NuxtLink :to="`/admin/sessoes/save/${s.id}`" class="card-action" title="Editar">
                <span class="material-symbols-outlined"> edit </span> <span>Editar</span>
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

  &--drag-over {
    border-color: #3b82f6;
    background: #0f1a2e;
  }
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

.kanban-col--aguardando_fotos   .kanban-col-header { border-bottom-color: #92200e40; }
.kanban-col--aguardando_selecao .kanban-col-header { border-bottom-color: #af921e40; }
.kanban-col--selecao_concluida  .kanban-col-header { border-bottom-color: #16653440; }
.kanban-col--entregue           .kanban-col-header { border-bottom-color: #4c1d9540; }

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
  padding: 10px 12px;
  cursor: grab;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  transition: border-color 0.15s, opacity 0.15s, box-shadow 0.15s;

  &:hover { border-color: #444; box-shadow: 0 2px 8px #0004; }
  &--dragging { opacity: 0.4; cursor: grabbing; }

  .card-drag-handle {
    color: #444;
    font-size: 16px;
    cursor: grab;
    line-height: 1;
    padding-top: 2px;
    flex-shrink: 0;
  }
}

.card-body {
  flex: 1;
  min-width: 0;
}

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

.card-actions {
  border-top: 1px solid #2a2a2a;
  margin-top: 10px;
  padding-top: 15px;
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
  color: #555;
  gap: 4rem;
  padding: 2px 4px;
  border-radius: 4px;
  text-decoration: none;
  line-height: 1.4;
  transition: background 0.1s, color 0.1s;
  display: flex;
  align-items: center;

  span {
    font-size: 14px;
    color: white;

    &.material-symbols-outlined {
      font-size: 18px;
    }
  }

  &:hover { background: #2a2a2a; color: #ccc; }
  &--danger:hover { background: #2a1010; color: #ef4444; }
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
