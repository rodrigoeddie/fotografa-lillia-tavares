<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const { showConfirm, showAlert } = useDialog();

interface PortfolioCategoria {
  id: number;
  slug: string;
  titulo: string;
  descricao: string | null;
  ordem: number;
  ativo: number;
}

interface CategoriaDetail extends PortfolioCategoria {
  works: { id: number; titulo: string | null; slug: string }[];
}

const categorias = ref<CategoriaDetail[]>([]);
const loading = ref(false);
const editingId = ref<number | null>(null);

const formNew = reactive({ slug: '', titulo: '', descricao: '', ordem: 0 });
const formEdit = reactive({ titulo: '', descricao: '', ordem: 0, ativo: true });
const showNewForm = ref(false);
const saving = ref(false);

async function load() {
  loading.value = true;
  try {
    const list = await adminFetch<PortfolioCategoria[]>('/api/admin/portfolio/categorias');
    categorias.value = await Promise.all(
      list.map((cat) => adminFetch<CategoriaDetail>(`/api/admin/portfolio/categorias/${cat.id}`)),
    );
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function createCategoria() {
  if (!formNew.slug.trim() || !formNew.titulo.trim()) {
    showMessage('Slug e título são obrigatórios', 'error');
    return;
  }
  saving.value = true;
  try {
    await adminFetch('/api/admin/portfolio/categorias', {
      method: 'POST',
      body: { ...formNew },
    });
    showMessage('Categoria criada!', 'success');
    formNew.slug = '';
    formNew.titulo = '';
    formNew.descricao = '';
    formNew.ordem = 0;
    showNewForm.value = false;
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

function startEdit(cat: PortfolioCategoria) {
  editingId.value = cat.id;
  formEdit.titulo = cat.titulo;
  formEdit.descricao = cat.descricao ?? '';
  formEdit.ordem = cat.ordem;
  formEdit.ativo = cat.ativo === 1;
}

function cancelEdit() { editingId.value = null; }

async function saveEdit(cat: PortfolioCategoria) {
  if (!formEdit.titulo.trim()) {
    showMessage('Título é obrigatório', 'error');
    return;
  }
  saving.value = true;
  try {
    await adminFetch(`/api/admin/portfolio/categorias/${cat.id}`, {
      method: 'PUT',
      body: {
        titulo: formEdit.titulo,
        descricao: formEdit.descricao || null,
        ordem: formEdit.ordem,
        ativo: formEdit.ativo,
      },
    });
    showMessage('Salvo!', 'success');
    editingId.value = null;
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

async function toggleAtivo(cat: CategoriaDetail) {
  const prev = cat.ativo;
  cat.ativo = prev ? 0 : 1;
  try {
    await adminFetch(`/api/admin/portfolio/categorias/${cat.id}`, {
      method: 'PUT',
      body: { titulo: cat.titulo, descricao: cat.descricao, ordem: cat.ordem, ativo: !!cat.ativo },
    });
  } catch (e: any) {
    cat.ativo = prev;
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function deleteCategoria(cat: PortfolioCategoria) {
  let works: { id: number; titulo: string | null; slug: string }[] = [];
  try {
    const detail = await adminFetch<CategoriaDetail>(`/api/admin/portfolio/categorias/${cat.id}`);
    works = detail.works ?? [];
  } catch { /* silencioso */ }

  if (works.length > 0) {
    await showAlert(
      `A categoria "${cat.titulo}" está vinculada a ${works.length} trabalho(s):\n${works.slice(0, 5).map((w) => `• ${w.titulo || w.slug}`).join('\n')}${works.length > 5 ? `\n... e mais ${works.length - 5}` : ''}\n\nMova ou altere a categoria dos trabalhos antes de deletar.`,
      'warning',
      'Não é possível deletar',
    );
    return;
  }

  const confirmed = await showConfirm(
    `Deletar a categoria "${cat.titulo}"?`,
    'Confirmar exclusão',
    'Sim, deletar',
  );
  if (!confirmed) return;

  try {
    await adminFetch(`/api/admin/portfolio/categorias/${cat.id}`, { method: 'DELETE' });
    showMessage('Categoria removida', 'success');
    categorias.value = categorias.value.filter((c) => c.id !== cat.id);
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
        <NuxtLink to="/admin/portfolio" class="page-back">← Portfolio</NuxtLink>
        <h2>Categorias do Portfolio</h2>
        <p class="dep-meta">{{ categorias.length }} categorias</p>
      </div>
      <button class="btn-add-item" @click="showNewForm = !showNewForm">
        <span class="material-symbols-outlined">{{ showNewForm ? 'close' : 'add_2' }}</span>
        {{ showNewForm ? 'Cancelar' : 'Nova categoria' }}
      </button>
    </div>

    <!-- Formulário de nova categoria -->
    <div v-if="showNewForm" class="new-form">
      <div class="form-row">
        <div class="form-field">
          <label>Slug *</label>
          <input v-model="formNew.slug" placeholder="ex: corporativo" />
          <small>Usado na URL. Só letras minúsculas, números e hífens.</small>
        </div>
        <div class="form-field">
          <label>Título *</label>
          <input v-model="formNew.titulo" placeholder="ex: Corporativo" />
        </div>
        <div class="form-field form-field--sm">
          <label>Ordem</label>
          <input v-model.number="formNew.ordem" type="number" min="0" />
        </div>
      </div>
      <div class="form-field">
        <label>Descrição</label>
        <textarea v-model="formNew.descricao" rows="2" placeholder="Descrição opcional..." />
      </div>
      <div class="new-form-actions">
        <button class="btn-primary" :disabled="saving" @click="createCategoria">
          {{ saving ? 'Salvando...' : 'Criar categoria' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="categorias.length === 0" class="list-empty">Nenhuma categoria cadastrada.</p>

    <div v-else class="item-list">
      <div v-for="cat in categorias" :key="cat.id">
        <!-- Linha principal -->
        <div class="item-row" :class="{ 'item-row--editing': editingId === cat.id }">
          <template v-if="editingId !== cat.id">
            <span class="item-order">{{ cat.ordem }}</span>
            <div class="item-info">
              <span class="item-title">{{ cat.titulo }}</span>
              <span class="item-sub">{{ cat.slug }}</span>
            </div>
            <label class="switch" :title="cat.ativo ? 'Desativar' : 'Ativar'">
              <input type="checkbox" :checked="!!cat.ativo" @change="toggleAtivo(cat)" />
              <span class="slider" />
            </label>
            <div class="item-actions">
              <button class="btn-icon" @click="startEdit(cat)" title="Editar"><span class="material-symbols-outlined"> edit </span> Editar</button>
              <button class="btn-icon btn-danger" @click="deleteCategoria(cat)" title="Deletar"><span class="material-symbols-outlined"> delete </span> Deletar</button>
            </div>
          </template>

          <!-- Inline edit -->
          <template v-else>
            <div class="edit-row">
              <div class="form-field">
                <label>Título</label>
                <input v-model="formEdit.titulo" />
              </div>
              <div class="form-field form-field--sm">
                <label>Ordem</label>
                <input v-model.number="formEdit.ordem" type="number" min="0" />
              </div>
              <div class="form-field">
                <label>Ativo</label>
                <label class="switch" style="margin-top: 4px">
                  <input type="checkbox" v-model="formEdit.ativo" />
                  <span class="slider" />
                </label>
              </div>
              <div class="form-field form-field--full">
                <label>Descrição</label>
                <textarea v-model="formEdit.descricao" rows="2" />
              </div>
              <div class="edit-actions">
                <button class="btn-sm" :disabled="saving" @click="saveEdit(cat)">
                  {{ saving ? '...' : 'Salvar' }}
                </button>
                <button class="btn-secondary btn-sm" @click="cancelEdit">Cancelar</button>
              </div>
            </div>
          </template>
        </div>

        <!-- Works vinculados -->
        <div class="cat-detail">
          <span v-if="cat.works.length === 0" class="text-muted text-sm">Nenhum trabalho usa esta categoria.</span>
          <ul v-else class="cat-links-list">
            <li v-for="work in cat.works" :key="work.id">
              <NuxtLink :to="`/admin/portfolio/save/${work.id}`" class="cat-link">
                {{ work.titulo || work.slug }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

// ─── Nova categoria form ─────────────────────────────────────────────────────
.new-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  .form-field       { flex: 1; min-width: 160px; }
  .form-field--sm   { flex: 0 0 90px; }
}

.new-form, .edit-row {
  .form-field {
    label              { font-size: 12px; }
    input, textarea    { padding: 7px 10px; font-size: 13px; background: #1a1a1a; }
    small              { font-size: 11px; color: #555; }
    &--check label     { flex-direction: row; align-items: center; gap: 8px; cursor: pointer; }
    &--full            { width: 100%; }
  }
}

.new-form-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 4px;
}

// ─── Inline edit ─────────────────────────────────────────────────────────────
.item-row--editing {
  border-color: #b3881a !important;
  background: #1a1500 !important;
}

.edit-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  align-items: flex-end;
  .form-field     { flex: 1; min-width: 160px; }
  .form-field--sm { flex: 0 0 90px; }
}

.edit-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

// ─── Expanded linked items ───────────────────────────────────────────────────
.cat-detail {
  background: #0d0d0d;
  border: 1px solid #2a2a2a;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 10px 16px;
  margin-bottom: 4px;
}

.cat-links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 6px;
}

.cat-link {
  font-size: 12px;
  color: #60a5fa;
  text-decoration: none;
  background: #1e2d3d;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid #2d4a6a;
  &:hover { background: #253d55; }
}
</style>
