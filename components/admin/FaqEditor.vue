<script lang="ts" setup>
interface FaqQuestion {
  question: string;
  answer: string;
}

interface FaqCategory {
  name: string;
  slug: string;
  questions: FaqQuestion[];
}

interface FaqData {
  title: string;
  description: string;
  categories: FaqCategory[];
}

const FAQ_PATH = 'pages/perguntas-frequentes.json';

const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const data = ref<FaqData | null>(null);
const loading = ref(false);
const saving = ref(false);

// Drag state
const catDragIdx = ref<number | null>(null);
const catDragOverIdx = ref<number | null>(null);
const qDragIdx = ref<{ cat: number; q: number } | null>(null);
const qDragOverIdx = ref<{ cat: number; q: number } | null>(null);

// Expanded categories
const expandedCats = ref(new Set<number>());

function toggleCat(idx: number) {
  const s = new Set(expandedCats.value);
  s.has(idx) ? s.delete(idx) : s.add(idx);
  expandedCats.value = s;
}

async function load() {
  loading.value = true;
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(FAQ_PATH)}`);
    data.value = JSON.parse(res.content);
    // Expand all by default
    if (data.value) {
      expandedCats.value = new Set(data.value.categories.map((_, i) => i));
    }
  } catch (e: any) {
    props.showMessage('Erro ao carregar FAQ: ' + e.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!data.value) return;
  saving.value = true;
  try {
    await $fetch('/api/fs/raw', {
      method: 'POST',
      body: { path: FAQ_PATH, content: JSON.stringify(data.value, null, 2) },
    });
    props.showMessage('FAQ salvo!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar FAQ: ' + e.message, 'error');
  } finally {
    saving.value = false;
  }
}

function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Category CRUD
function addCategory() {
  if (!data.value) return;
  const name = prompt('Nome da categoria:');
  if (!name?.trim()) return;
  data.value.categories.push({ name: name.trim(), slug: slugify(name), questions: [] });
  expandedCats.value.add(data.value.categories.length - 1);
}

function removeCategory(idx: number) {
  if (!data.value) return;
  const cat = data.value.categories[idx];
  if (!cat || !confirm(`Remover categoria "${cat.name}" e todas suas perguntas?`)) return;
  data.value.categories.splice(idx, 1);
  // Rebuild expanded set
  expandedCats.value = new Set(data.value.categories.map((_, i) => i));
}

function editCategoryName(idx: number) {
  if (!data.value) return;
  const cat = data.value.categories[idx];
  if (!cat) return;
  const newName = prompt('Novo nome:', cat.name);
  if (!newName?.trim()) return;
  cat.name = newName.trim();
  cat.slug = slugify(newName);
}

// Category drag
function catDragStart(idx: number) { catDragIdx.value = idx; }
function catDragOver(idx: number) { catDragOverIdx.value = idx; }
function catDragEnd() {
  if (!data.value || catDragIdx.value === null || catDragOverIdx.value === null || catDragIdx.value === catDragOverIdx.value) {
    catDragIdx.value = null; catDragOverIdx.value = null; return;
  }
  const arr = data.value.categories;
  const [item] = arr.splice(catDragIdx.value, 1);
  if (item) arr.splice(catDragOverIdx.value, 0, item);
  expandedCats.value = new Set(arr.map((_, i) => i));
  catDragIdx.value = null; catDragOverIdx.value = null;
}

// Question CRUD
function addQuestion(catIdx: number) {
  if (!data.value) return;
  data.value.categories[catIdx]?.questions.push({ question: '', answer: '' });
}

function removeQuestion(catIdx: number, qIdx: number) {
  if (!data.value) return;
  data.value.categories[catIdx]?.questions.splice(qIdx, 1);
}

// Question drag (within same category)
function questionDragStart(catIdx: number, qIdx: number) { qDragIdx.value = { cat: catIdx, q: qIdx }; }
function questionDragOver(catIdx: number, qIdx: number) { qDragOverIdx.value = { cat: catIdx, q: qIdx }; }
function questionDragEnd() {
  if (!data.value || !qDragIdx.value || !qDragOverIdx.value) {
    qDragIdx.value = null; qDragOverIdx.value = null; return;
  }
  if (qDragIdx.value.cat !== qDragOverIdx.value.cat || qDragIdx.value.q === qDragOverIdx.value.q) {
    qDragIdx.value = null; qDragOverIdx.value = null; return;
  }
  const cat = data.value.categories[qDragIdx.value.cat];
  if (!cat) { qDragIdx.value = null; qDragOverIdx.value = null; return; }
  const arr = cat.questions;
  const [item] = arr.splice(qDragIdx.value.q, 1);
  if (item) arr.splice(qDragOverIdx.value.q, 0, item);
  qDragIdx.value = null; qDragOverIdx.value = null;
}

defineExpose({ load });
</script>

<template>
  <div class="faq-editor">
    <div v-if="loading" class="loading">Carregando FAQ...</div>

    <template v-else-if="data">
      <div class="editor-header">
        <h2>❓ Editor de FAQ</h2>
        <button class="btn-save" @click="save" :disabled="saving">
          {{ saving ? 'Salvando...' : '💾 Salvar' }}
        </button>
      </div>

      <!-- Meta fields -->
      <div class="field-row">
        <label>Título da página</label>
        <input v-model="data.title" type="text" placeholder="Perguntas Frequentes" />
      </div>
      <div class="field-row">
        <label>Descrição (SEO)</label>
        <textarea v-model="data.description" rows="2" placeholder="Descrição para SEO"></textarea>
      </div>

      <!-- Categories -->
      <div class="categories-header">
        <h3>Categorias ({{ data.categories.length }})</h3>
        <button class="btn-small" @click="addCategory">+ Categoria</button>
      </div>

      <div
        v-for="(cat, catIdx) in data.categories"
        :key="catIdx"
        class="category-block"
        :class="{ 'drag-over': catDragOverIdx === catIdx }"
        draggable="true"
        @dragstart.stop="catDragStart(catIdx)"
        @dragover.prevent.stop="catDragOver(catIdx)"
        @dragend.stop="catDragEnd()"
      >
        <div class="category-header" @click="toggleCat(catIdx)">
          <span class="drag-handle" @click.stop>⠿</span>
          <span class="cat-expand">{{ expandedCats.has(catIdx) ? '▾' : '▸' }}</span>
          <span class="cat-name">{{ cat.name }}</span>
          <span class="cat-slug">({{ cat.slug }})</span>
          <span class="cat-count">{{ cat.questions.length }} perguntas</span>
          <div class="cat-actions" @click.stop>
            <button class="btn-icon" @click="editCategoryName(catIdx)" title="Renomear">✏️</button>
            <button class="btn-icon danger" @click="removeCategory(catIdx)" title="Remover">🗑️</button>
          </div>
        </div>

        <div v-if="expandedCats.has(catIdx)" class="category-body">
          <div
            v-for="(q, qIdx) in cat.questions"
            :key="qIdx"
            class="question-item"
            :class="{ 'drag-over': qDragOverIdx?.cat === catIdx && qDragOverIdx?.q === qIdx }"
            draggable="true"
            @dragstart.stop="questionDragStart(catIdx, qIdx)"
            @dragover.prevent.stop="questionDragOver(catIdx, qIdx)"
            @dragend.stop="questionDragEnd()"
          >
            <div class="question-header">
              <span class="drag-handle">⠿</span>
              <span class="q-idx">#{{ qIdx + 1 }}</span>
              <button class="btn-icon danger" @click="removeQuestion(catIdx, qIdx)">✕</button>
            </div>
            <div class="question-fields">
              <input v-model="q.question" type="text" placeholder="Pergunta" class="q-input" />
              <textarea v-model="q.answer" rows="3" placeholder="Resposta" class="q-answer"></textarea>
            </div>
          </div>

          <button class="btn-add-question" @click="addQuestion(catIdx)">+ Pergunta</button>
        </div>
      </div>

      <div v-if="data.categories.length === 0" class="empty-state">
        Nenhuma categoria. Clique em "+ Categoria" para começar.
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.faq-editor { color: #eee; }

.loading { text-align: center; padding: 40px; color: #888; }
.empty-state { text-align: center; padding: 40px; color: #666; font-size: 14px; }

.editor-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #333;
  h2 { font-size: 20px; }
}

.btn-save {
  background: #2563eb; border: none; color: #fff; padding: 8px 20px;
  border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;
  &:hover:not(:disabled) { background: #1d4ed8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

// Fields
.field-row {
  margin-bottom: 16px;
  label { display: block; font-size: 12px; color: #999; margin-bottom: 6px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  input[type="text"], textarea {
    width: 100%; background: #1a1a1a; border: 1px solid #333; color: #eee;
    padding: 8px 12px; border-radius: 6px; font-size: 14px;
    &:focus { outline: none; border-color: #3b82f6; }
  }
  textarea { resize: vertical; font-family: inherit; }
}

.btn-small {
  background: #1e2d3d; border: 1px solid #2d4a6a; color: #60a5fa; padding: 6px 12px;
  border-radius: 6px; font-size: 12px; cursor: pointer; white-space: nowrap;
  &:hover { background: #253d55; }
}

// Categories
.categories-header {
  display: flex; justify-content: space-between; align-items: center; margin: 24px 0 16px;
  h3 { font-size: 16px; }
}

.category-block {
  background: #141414; border: 1px solid #2a2a2a; border-radius: 8px;
  margin-bottom: 12px; transition: border-color 0.15s;
  &.drag-over { border-color: #3b82f6; }
}

.category-header {
  display: flex; align-items: center; gap: 8px; padding: 12px 16px;
  cursor: pointer; user-select: none;
  &:hover { background: #1a1a1a; border-radius: 8px; }
}

.drag-handle { cursor: grab; font-size: 16px; color: #555; &:active { cursor: grabbing; } }
.cat-expand { font-size: 12px; color: #888; width: 16px; }
.cat-name { font-weight: 600; font-size: 14px; }
.cat-slug { font-size: 11px; color: #666; font-family: monospace; }
.cat-count { font-size: 11px; color: #888; margin-left: auto; }

.cat-actions {
  display: flex; gap: 4px; margin-left: 8px;
}

.btn-icon {
  background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px;
  opacity: 0.6; transition: opacity 0.15s;
  &:hover { opacity: 1; }
  &.danger:hover { filter: brightness(1.3); }
}

.category-body { padding: 0 16px 16px; }

.question-item {
  background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px;
  padding: 10px 12px; margin-bottom: 8px; transition: border-color 0.15s;
  &.drag-over { border-color: #3b82f6; }
}

.question-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}

.q-idx { font-size: 11px; color: #666; font-weight: 600; flex: 1; }

.question-fields {
  display: flex; flex-direction: column; gap: 8px;
}

.q-input, .q-answer {
  width: 100%; background: #111; border: 1px solid #333; color: #eee;
  padding: 8px 10px; border-radius: 4px; font-size: 13px; font-family: inherit;
  &:focus { outline: none; border-color: #3b82f6; }
}

.q-answer { resize: vertical; min-height: 60px; }

.btn-add-question {
  background: none; border: 1px dashed #444; color: #888; width: 100%;
  padding: 10px; border-radius: 6px; font-size: 13px; cursor: pointer;
  margin-top: 4px;
  &:hover { border-color: #60a5fa; color: #60a5fa; }
}
</style>
