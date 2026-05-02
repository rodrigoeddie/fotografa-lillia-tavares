<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const route = useRoute();
const sessaoId = Number(route.params.sessaoId);

interface Entrega {
  id: number; sessao_id: number; lote_id: number | null;
  r2_key: string | null; nome_arquivo: string | null;
  bg_image_id: string | null; mensagem: string | null;
  ativo: number; criado_em: string;
}

interface Lote {
  id: number; sessao_id: number; criado_em: string;
  status: 'aguardando_selecao' | 'selecao_concluida' | 'entregue';
}

const entregas = ref<Entrega[]>([]);
const lotes = ref<Lote[]>([]);
const loading = ref(false);
const creatingLote = ref(false);

async function load() {
  loading.value = true;
  try {
    const [e, l] = await Promise.all([
      adminFetch<Entrega[]>(`/api/admin/entregas/${sessaoId}`),
      adminFetch<Lote[]>(`/api/admin/sessoes/${sessaoId}/lotes`),
    ]);
    entregas.value = e;
    lotes.value = l;
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function loteLabel(lote: Lote, idx: number) {
  return `Leva ${idx + 1} — ${new Date(lote.criado_em).toLocaleDateString('pt-BR')}`;
}

function loteName(loteId: number | null) {
  if (!loteId) return '—';
  const idx = lotes.value.findIndex((l) => l.id === loteId);
  return idx >= 0 ? loteLabel(lotes.value[idx]!, idx) : `Lote #${loteId}`;
}

/** Lotes sem entrega ainda */
const lotesDisponiveis = computed(() =>
  lotes.value.filter((l) => l.status === 'selecao_concluida' && !entregas.value.some((e) => e.lote_id === l.id))
);

async function novaLeva() {
  if (!confirm('Criar nova leva de seleção para esta sessão? O cliente poderá escolher mais fotos.')) return;
  creatingLote.value = true;
  try {
    await adminFetch(`/api/admin/sessoes/${sessaoId}/lotes`, { method: 'POST' });
    showMessage('Nova leva criada! Status da sessão voltou para "aguardando seleção".', 'success');
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    creatingLote.value = false;
  }
}

async function deleteEntrega(e: Entrega) {
  if (!confirm(`Excluir esta entrega?`)) return;
  try {
    await adminFetch(`/api/admin/entregas/item/${e.id}`, { method: 'DELETE' });
    entregas.value = entregas.value.filter((x) => x.id !== e.id);
    showMessage('Entrega removida', 'success');
  } catch (err: any) {
    showMessage('Erro: ' + (err.statusMessage || err.message), 'error');
  }
}

function copyLink(entregaId: number) {
  // O cliente acessa o download pelo sessaoId — mantemos compatibilidade
  const url = `${window.location.origin}/area-cliente/entrega/${sessaoId}`;
  navigator.clipboard.writeText(url).then(() => showMessage('Link copiado!', 'success'));
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <NuxtLink to="/admin/sessoes" class="page-back">← Sessões</NuxtLink>
        <h2>Entregas da Sessão</h2>
        <p class="dep-meta">{{ entregas.length }} entrega(s) · {{ lotes.length }} leva(s)</p>
      </div>
      <div class="header-actions">
        <button class="btn-add-item btn-secondary" :disabled="creatingLote" @click="novaLeva">
          <span class="material-symbols-outlined">add_circle</span>
          {{ creatingLote ? 'Criando...' : 'Nova leva de seleção' }}
        </button>
        <NuxtLink :to="`/admin/entregas/save?sessao_id=${sessaoId}`" class="btn-add-item">
          <span class="material-symbols-outlined">add</span> Nova entrega
        </NuxtLink>
      </div>
    </div>

    <!-- Levas de seleção -->
    <section v-if="lotes.length" class="lotes-section">
      <h3 class="section-title">Levas de seleção</h3>
      <div class="lotes-list">
        <div v-for="(l, i) in lotes" :key="l.id" class="lote-row">
          <span class="lote-label">{{ loteLabel(l, i) }}</span>
          <span class="status-pill" :class="`status-${l.status}`">{{ l.status.replace(/_/g, ' ') }}</span>
          <NuxtLink :to="`/admin/sessoes/${sessaoId}/selecao?lote_id=${l.id}`" class="btn-icon">
            <span class="material-symbols-outlined">visibility</span> Ver seleção
          </NuxtLink>
          <NuxtLink
            v-if="l.status === 'selecao_concluida' && !entregas.some((e) => e.lote_id === l.id)"
            :to="`/admin/entregas/save?sessao_id=${sessaoId}&lote_id=${l.id}`"
            class="btn-icon btn-primary"
          >
            <span class="material-symbols-outlined">upload_file</span> Criar entrega
          </NuxtLink>
        </div>
      </div>
    </section>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="entregas.length === 0" class="list-empty">Nenhuma entrega para esta sessão.</p>
    <div v-else class="item-list">
      <div v-for="e in entregas" :key="e.id" class="item-row">
        <NuxtLink :to="`/admin/entregas/save/${e.id}`" class="link-row" title="Editar">
          <div class="item-info">
            <span class="item-title">{{ e.nome_arquivo ?? 'Entrega #' + e.id }}</span>
            <span class="item-sub">{{ loteName(e.lote_id) }}</span>
            <span class="item-sub">{{ new Date(e.criado_em).toLocaleDateString('pt-BR') }}</span>
          </div>
        </NuxtLink>
        <span class="status-pill" :class="e.ativo ? 'active' : 'inactive'">
          {{ e.ativo ? 'Ativa' : 'Inativa' }}
        </span>
        <div class="item-actions">
          <button class="btn-icon" title="Copiar link" @click="copyLink(e.id)">
            <span class="material-symbols-outlined">link</span>
          </button>
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteEntrega(e)">
            <span class="material-symbols-outlined">delete</span> Deletar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.page-back {
  display: inline-block;
  color: #888;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 6px;
  &:hover { color: #fff; }
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-secondary {
  background: #1e3a2a;
  border-color: #2d6a4f;
  color: #4ade80;
  display: flex;
  align-items: center;
  gap: 6px;
  .material-symbols-outlined { font-size: 16px; }
}

.lotes-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
  font-weight: 700;
  margin-bottom: 10px;
}

.lotes-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lote-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: #161616;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
}

.lote-label {
  font-size: 13px;
  color: #ccc;
  flex: 1;
}

.status-pill {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
  &.active, &.status-entregue    { background: #1a3a1a; color: #4ade80; border: 1px solid #166534; }
  &.inactive                      { background: #3a1a1a; color: #f87171; border: 1px solid #7f1d1d; }
  &.status-aguardando_selecao     { background: #1e2d3d; color: #60a5fa; border: 1px solid #1e40af; }
  &.status-selecao_concluida      { background: #2d2a1a; color: #facc15; border: 1px solid #854d0e; }
}

.btn-primary {
  background: #1e3a5f;
  border-color: #2563eb;
  color: #93c5fd;
}
</style>
