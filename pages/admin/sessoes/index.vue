<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const { showConfirm } = useDialog();
const cfURI = useRuntimeConfig().public.cloudflareURI;

interface Sessao {
  id: number;
  cliente_id: number;
  nome_sessao: string;
  produto_tipo: string;
  pacote_index: number;
  fotos_incluidas: number;
  preco_foto_extra: number;
  status: string;
  criado_em: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_celular: string | null;
  cliente_senha: string | null;
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
  const ok = await showConfirm(`As fotos cadastradas serão removidas.`, `Excluir sessão "${s.nome_sessao}"?`, 'Excluir', 'Cancelar');
  if (!ok) return;
  try {
    await adminFetch(`/api/admin/sessoes/${s.id}`, { method: 'DELETE' });
    showMessage('Sessão removida', 'success');
    sessoes.value = sessoes.value.filter((x) => x.id !== s.id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

const shareModal = ref<Sessao | null>(null);
const LINK_AREA_CLIENTE = 'https://fotografalilliatavares.com.br/area-cliente';

function openShare(s: Sessao) { shareModal.value = s; }
function closeShare() { shareModal.value = null; }

function shareText(s: Sessao) {
  return `Olá ${s.cliente_nome}! Suas fotos estão prontas para seleção 🎉\n\nAcesse a sua área do cliente:\n🔗 ${LINK_AREA_CLIENTE}\n📧 E-mail: ${s.cliente_email}\n🔑 Senha: ${s.cliente_senha ?? '(não cadastrada)'}`;
}

async function copyShare(s: Sessao) {
  await navigator.clipboard.writeText(shareText(s));
  showMessage('Copiado!', 'success');
}

function whatsappShare(s: Sessao) {
  const celular = s.cliente_celular?.replace(/\D/g, '');
  if (!celular) { showMessage('Cliente sem celular cadastrado', 'error'); return; }
  const url = `https://wa.me/55${celular}?text=${encodeURIComponent(shareText(s))}`;
  window.open(url, '_blank');
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
              <NuxtLink
                v-if="s.status === 'selecao_concluida' && !entregasSessaoIds.has(s.id)"
                :to="`/admin/entregas/save?sessao_id=${s.id}`"
                class="card-action card-action--primary"
                title="Cadastrar entrega"
              >
                <span class="material-symbols-outlined">upload_file</span> <span>Cadastrar entrega</span>
              </NuxtLink>
              <button
                v-if="s.status === 'aguardando_selecao'"
                class="card-action card-action--share"
                title="Compartilhar acesso"
                @click="openShare(s)"
              >
                <span class="material-symbols-outlined">share</span> <span>Compartilhar</span>
              </button>
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

  <!-- Modal Compartilhar -->
  <Teleport to="body">
    <div v-if="shareModal" class="share-overlay" @click.self="closeShare">
      <div class="share-modal">
        <div class="share-modal-header">
          <span class="material-symbols-outlined">share</span>
          <h3>Compartilhar acesso</h3>
          <button class="share-close" @click="closeShare">✕</button>
        </div>
        <div class="share-modal-body">
          <div class="share-field">
            <label>Link</label>
            <span>{{ LINK_AREA_CLIENTE }}</span>
          </div>
          <div class="share-field">
            <label>E-mail</label>
            <span>{{ shareModal.cliente_email }}</span>
          </div>
          <div class="share-field">
            <label>Senha</label>
            <span>{{ shareModal.cliente_senha ?? '(não cadastrada)' }}</span>
          </div>
        </div>
        <div class="share-modal-actions">
          <button class="btn-share-copy" @click="copyShare(shareModal)">
            <span class="material-symbols-outlined">content_copy</span> Copiar
          </button>
          <button class="btn-share-whats" @click="whatsappShare(shareModal)">
            <span class="material-symbols-outlined">chat</span> WhatsApp
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
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
  background: t.$surface;
  border: 1px solid t.$border;
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
  border-bottom: 4px solid t.$border;

  .col-label {
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    color: t.$text;
  }

  .col-count {
    background: t.$border;
    color: t.$text-3;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
  }
}

.kanban-col--aguardando_fotos,
.kanban-col--aguardando_fotos .kanban-col-header { border-bottom-color: t.$danger-bg; }
.kanban-col--aguardando_selecao,
.kanban-col--aguardando_selecao .kanban-col-header { border-bottom-color: t.$warning-bg; }
.kanban-col--selecao_concluida,
.kanban-col--selecao_concluida .kanban-col-header { border-bottom-color: t.$success-bg; }
.kanban-col--entregue,
.kanban-col--entregue .kanban-col-header { border-bottom-color: t.$accent-dim; }

.kanban-cards {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.kanban-card {
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  align-items: flex-start;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:hover { border-color: t.$border-strong; box-shadow: 0 2px 8px #0004; }
}

.card-thumb {
  width: 100px;
  height: 100px;
  background: t.$bg;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .material-symbols-outlined { font-size: 32px; color: t.$border-strong; }
}

.card-body {
  flex: 1;
  min-width: 0;
  padding: 10px 12px 0 0;

  .card-name { font-size: 13px; font-weight: 600; color: t.$text; margin: 0 0 2px; }
  .card-sub  { font-size: 11px; color: t.$text-3; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-badge {
    display: inline-block;
    font-size: 10px;
    background: t.$surface-2;
    color: t.$text-2;
    padding: 2px 6px;
    border-radius: 4px;
    margin: 0;
  }
}
.card-actions {
  border-top: 1px solid t.$border;
  padding: 12px 12px 10px;
  justify-content: center;
  flex-shrink: 0;
  display: flex;
  width: 100%;
  gap: 4px;
}

.card-action {
  transition: background 0.1s, color 0.1s;
  border-bottom: 2px solid transparent;
  text-decoration: none;
  align-items: center;
  background: none;
  padding: 4px 7px;
  line-height: 1.4;
  cursor: pointer;
  font-size: 14px;
  border: none;
  flex-direction: column;
  display: flex;
  color: t.$text-3;
  gap: 4rem;

  &:before {
    content: '';

    display: inline-block;
    background: t.$border-strong;
    position: absolute;
    margin-left: 5px;
    height: 40px;
    width: 1px;
    left: -6px;
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
    border-bottom: 2px solid t.$border-strong;
    color: t.$text;
  }

  &--danger:hover {
    color: t.$danger;
  }

  &--primary {
    color: t.$success;
    &:hover {
      border-bottom-color: t.$success;
      color: t.$success;
    }
  }
}

.kanban-empty {
  text-align: center;
  color: t.$text-3;
  font-size: 12px;
  padding: 20px 0;
  margin: 0;
  user-select: none;
}

.card-action--share {
  color: t.$accent;
  &:hover {
    border-bottom-color: t.$accent;
    color: t.$accent-hi;
  }
}

.share-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.share-modal {
  background: t.$surface;
  border: 1px solid t.$border-strong;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.share-modal-header {
  display: flex;
  align-items: center;
  gap: 10px;

  h3 { flex: 1; font-size: 16px; font-weight: 600; margin: 0; color: t.$text; }

  .material-symbols-outlined { color: t.$accent; font-size: 20px; }

  .share-close {
    background: none;
    border: none;
    color: t.$text-3;
    cursor: pointer;
    font-size: 14px;
    padding: 4px;
    &:hover { color: t.$text; }
  }
}

.share-modal-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: t.$text-3;
  }

  span {
    font-size: 14px;
    color: t.$text;
    background: t.$bg;
    border: 1px solid t.$border;
    border-radius: 6px;
    padding: 8px 12px;
    word-break: break-all;
  }
}

.share-modal-actions {
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: opacity 0.15s;

    &:hover { opacity: 0.85; }

    .material-symbols-outlined { font-size: 18px; }
  }
}

.btn-share-copy {
  background: t.$surface-2;
  color: t.$text;
}

.btn-share-whats {
  background: #25d366;
  color: #fff;
}
</style>
