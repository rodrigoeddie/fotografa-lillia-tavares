<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const { showConfirm } = useDialog();

interface PageFaq { id: number; route: string; faq_slug: string; }

const items    = ref<PageFaq[]>([]);
const loading  = ref(false);
const saving   = ref(false);
const editingId = ref<number | null>(null);

// Categorias disponíveis do FAQ
const faqCats = ref<{ slug: string; titulo: string }[]>([]);

// Formulário novo
const showNewForm = ref(false);
const formNew = reactive({ route: '', faq_slug: '' });

// Formulário edição
const formEdit = reactive({ route: '', faq_slug: '' });

async function load() {
  loading.value = true;
  try {
    const [list, rawFaq] = await Promise.all([
      adminFetch<PageFaq[]>('/api/admin/page-faq'),
      adminFetch<any[]>('/api/public/faq'),
    ]);
    items.value = list ?? [];
    faqCats.value = (rawFaq ?? []).map((c: any) => ({ slug: c.slug, titulo: c.titulo ?? c.name ?? c.slug }));
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function create() {
  if (!formNew.route.trim() || !formNew.faq_slug.trim()) {
    showMessage('Rota e categoria são obrigatórios', 'error');
    return;
  }
  saving.value = true;
  try {
    await adminFetch('/api/admin/page-faq', { method: 'POST', body: { ...formNew } });
    showMessage('Associação criada!', 'success');
    formNew.route = '';
    formNew.faq_slug = '';
    showNewForm.value = false;
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

function startEdit(item: PageFaq) {
  editingId.value = item.id;
  formEdit.route    = item.route;
  formEdit.faq_slug = item.faq_slug;
}

async function saveEdit(item: PageFaq) {
  if (!formEdit.route.trim() || !formEdit.faq_slug.trim()) {
    showMessage('Rota e categoria são obrigatórios', 'error');
    return;
  }
  saving.value = true;
  try {
    await adminFetch(`/api/admin/page-faq/${item.id}`, { method: 'PUT', body: { ...formEdit } });
    showMessage('Salvo!', 'success');
    editingId.value = null;
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

async function remove(item: PageFaq) {
  const ok = await showConfirm(
    `Remover FAQ da página <strong>${item.route}</strong>?`,
    { confirmText: 'Remover', cancelText: 'Cancelar' },
  );
  if (!ok) return;
  try {
    await adminFetch(`/api/admin/page-faq/${item.id}`, { method: 'DELETE' });
    showMessage('Removido!', 'success');
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>FAQ por página</h2>
      <p class="page-subtitle">Associe um grupo de perguntas a qualquer página pública do site.</p>
      <button class="btn-add-item" @click="showNewForm = !showNewForm">+ Nova associação</button>
    </div>

    <!-- Formulário novo -->
    <div v-if="showNewForm" class="form-card">
      <h3 class="form-card__title">Nova associação</h3>
      <div class="form-row">
        <div class="form-field">
          <label>Rota da página *</label>
          <input
            v-model="formNew.route"
            placeholder="/sobre-fotografa-lillia-tavares"
            list="routes-hint"
          />
          <datalist id="routes-hint">
            <option value="/sobre-fotografa-lillia-tavares" />
            <option value="/ensaio-fotografico" />
            <option value="/estudio" />
            <option value="/depoimentos" />
            <option value="/perguntas-frequentes" />
            <option value="/precos-ensaios-fotograficos" />
            <option value="/presente-ensaio-fotografico-mogi" />
            <option value="/analise-coloracao-pessoal-em-mogi" />
            <option value="/agende-seu-ensaio" />
          </datalist>
          <small>Deve começar com /</small>
        </div>
        <div class="form-field">
          <label>Categoria do FAQ *</label>
          <select v-model="formNew.faq_slug">
            <option value="" disabled>Selecione...</option>
            <option v-for="cat in faqCats" :key="cat.slug" :value="cat.slug">
              {{ cat.titulo }} ({{ cat.slug }})
            </option>
          </select>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-secondary" @click="showNewForm = false">Cancelar</button>
        <button class="btn-primary" :disabled="saving" @click="create">Criar</button>
      </div>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <div v-else-if="items.length === 0 && !showNewForm" class="list-empty">
      Nenhuma associação configurada.
    </div>

    <div v-else class="item-list">
      <div v-for="item in items" :key="item.id" class="item-row">

        <!-- Modo visualização -->
        <template v-if="editingId !== item.id">
          <div class="item-info">
            <span class="item-title">{{ item.route }}</span>
            <span class="item-sub">{{ faqCats.find(c => c.slug === item.faq_slug)?.titulo ?? item.faq_slug }}</span>
          </div>
          <div class="item-actions">
            <button class="btn-icon" title="Editar" @click="startEdit(item)">
              <span class="material-symbols-outlined">edit</span>
            </button>
            <button class="btn-icon btn-danger" title="Remover" @click="remove(item)">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </template>

        <!-- Modo edição inline -->
        <template v-else>
          <div class="form-row inline-edit">
            <div class="form-field">
              <label>Rota</label>
              <input v-model="formEdit.route" list="routes-hint" />
            </div>
            <div class="form-field">
              <label>Categoria</label>
              <select v-model="formEdit.faq_slug">
                <option v-for="cat in faqCats" :key="cat.slug" :value="cat.slug">
                  {{ cat.titulo }} ({{ cat.slug }})
                </option>
              </select>
            </div>
          </div>
          <div class="item-actions">
            <button class="btn-icon" title="Salvar" :disabled="saving" @click="saveEdit(item)">
              <span class="material-symbols-outlined">check</span>
            </button>
            <button class="btn-icon" title="Cancelar" @click="editingId = null">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.page-subtitle {
  color: #888;
  font-size: 13rem;
  margin: 4rem 0 12rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rem;

  &.inline-edit {
    flex: 1;
  }
}

.item-row {
  display: flex;
  align-items: center;
  gap: 12rem;
}

.item-actions {
  display: flex;
  gap: 4rem;
  flex-shrink: 0;
}
</style>
