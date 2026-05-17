<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, perguntas, selectedPages, addPergunta, removePergunta, init, save } = useFaqForm(idParam);

// ─── Slug auto-generate ──────────────────────────────────────────────────────
function generateSlug() {
  if (!form.titulo) return;
  form.slug = form.titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── Collapse state ──────────────────────────────────────────────────────────
const collapsed = ref<Set<number>>(new Set());
function toggleCollapse(i: number) {
  const s = new Set(collapsed.value);
  s.has(i) ? s.delete(i) : s.add(i);
  collapsed.value = s;
}
function collapseAll() { collapsed.value = new Set(perguntas.value.map((_, i) => i)); }
function expandAll() { collapsed.value = new Set(); }

// ─── Drag to reorder ─────────────────────────────────────────────────────────
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);
function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
function onDragEnd() {
  if (dragIdx.value !== null && dragOverIdx.value !== null && dragIdx.value !== dragOverIdx.value) {
    const [moved] = perguntas.value.splice(dragIdx.value, 1);
    if (moved) perguntas.value.splice(dragOverIdx.value, 0, moved);
    collapsed.value = new Set();
  }
  dragIdx.value = null; dragOverIdx.value = null;
}

function addAndExpand() {
  addPergunta();
  nextTick(() => {
    collapsed.value = new Set(
      perguntas.value.slice(0, perguntas.value.length - 1).map((_, i) => i)
    );
  });
}

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/faq" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar categoria FAQ' : 'Nova categoria FAQ' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>

      <div class="form-card">
        <h3 class="form-section-title">Categoria</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.titulo" type="text" @input="generateSlug" />
          </div>
          <div class="form-field">
            <label>Slug</label>
            <div class="input-with-btn">
              <input v-model="form.slug" type="text" placeholder="sobre-ensaios" />
              <button class="btn-ghost-sm" type="button" title="Gerar slug" @click="generateSlug">↻</button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="perguntas-header">
          <h3 class="form-section-title">
            Perguntas
            <span class="count-badge">{{ perguntas.length }}</span>
          </h3>
          <div class="perguntas-actions">
            <button v-if="perguntas.length > 1" class="btn-ctrl" @click="collapseAll">⊟ Colapsar</button>
            <button v-if="perguntas.length > 1" class="btn-ctrl" @click="expandAll">⊞ Expandir</button>
            <button class="btn-secondary btn-sm" @click="addAndExpand">+ Pergunta</button>
          </div>
        </div>

        <div class="perguntas-list">
          <div
            v-for="(p, i) in perguntas" :key="i"
            class="pergunta-card"
            :class="{ 'drag-over': dragOverIdx === i }"
            draggable="true"
            @dragstart="onDragStart(i)"
            @dragover="(e) => onDragOver(e, i)"
            @dragend="onDragEnd"
          >
            <div class="pergunta-card-header" @click="toggleCollapse(i)">
              <span class="drag-handle">⠿</span>
              <span class="q-num">#{{ i + 1 }}</span>
              <span class="q-preview">{{ p.pergunta || '(sem texto)' }}</span>
              <span class="q-toggle">{{ collapsed.has(i) ? '▸' : '▾' }}</span>
              <button class="btn-remove" type="button" @click.stop="removePergunta(i)" title="Remover">✕</button>
            </div>

            <div v-show="!collapsed.has(i)" class="pergunta-card-body">
              <div class="form-field">
                <label>Pergunta</label>
                <input v-model="p.pergunta" type="text" placeholder="Qual é a sua pergunta?" />
              </div>
              <div class="form-field">
                <label>Resposta</label>
                <textarea v-model="p.resposta" rows="4" placeholder="Resposta detalhada..." />
              </div>
            </div>
          </div>

          <button
            v-if="perguntas.length > 0"
            class="btn-add-dashed"
            type="button"
            @click="addAndExpand"
          >+ Adicionar pergunta</button>

          <p v-if="perguntas.length === 0" class="empty-hint">
            Nenhuma pergunta. Clique em "+ Pergunta" para começar.
          </p>
        </div>
      </div>

      <div class="form-card pages-card">
        <h3 class="form-section-title">Páginas do site</h3>
        <p class="pages-hint">Selecione em quais páginas este grupo de FAQ deve aparecer automaticamente.</p>
        <AdminRouteMultiSelect v-model="selectedPages" />
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/faq" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/faq'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Criar') }}
        </button>
      </div>

    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-section-title {
  font-size: 13px; font-weight: 600; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.05em; margin: 0;
  display: flex; align-items: center; gap: 8px;
}

// Slug row
.input-with-btn { display: flex; gap: 6px; align-items: stretch; input { flex: 1; } }
.btn-ghost-sm {
  background: #2a2a2a; border: 1px solid #555; color: #aaa;
  border-radius: 6px; padding: 0 10px; cursor: pointer; font-size: 18px; line-height: 1;
  &:hover { background: #3a3a3a; color: #eee; }
}

// Perguntas section header
.perguntas-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 35px; flex-wrap: wrap; gap: 8px;
}
.perguntas-actions { display: flex; gap: 6px; align-items: center; }
.btn-ctrl {
  background: #1a1a1a; border: 1px solid #333; color: #999;
  font-size: 12px; padding: 5px 10px; border-radius: 6px; cursor: pointer;
  &:hover { background: #222; color: #ccc; }
}

// Pergunta cards
.perguntas-list { display: flex; flex-direction: column; gap: 8px; }
.pergunta-card {
  background: #141414; border: 1px solid #2a2a2a; border-radius: 8px;
  overflow: hidden; transition: border-color 0.15s;
  &.drag-over { border-color: #60a5fa; }
}
.pergunta-card-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  cursor: pointer; user-select: none;
  &:hover { background: #1a1a1a; }
}
.drag-handle { font-size: 16px; color: #444; cursor: grab; flex-shrink: 0; &:active { cursor: grabbing; } }
.q-num { font-size: 11px; color: #666; font-weight: 600; flex-shrink: 0; }
.q-preview { flex: 1; font-size: 13px; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.q-toggle { font-size: 12px; color: #666; flex-shrink: 0; }
.btn-remove {
  background: none; border: none; color: #555; font-size: 13px;
  cursor: pointer; padding: 2px 5px; border-radius: 4px; flex-shrink: 0;
  &:hover { background: #3a1a1a; color: #f87171; }
}
.pergunta-card-body {
  padding: 12px 14px; border-top: 1px solid #222;
  display: flex; flex-direction: column; gap: 12px;
}

// Pages card
.pages-card { margin-top: 24px; }
.pages-hint { font-size: 12px; color: #666; margin: 4px 0 12px; }

// Dashed add button
.btn-add-dashed {
  background: none; border: 1px dashed #444; color: #888; width: 100%;
  padding: 10px; border-radius: 6px; font-size: 13px; cursor: pointer; margin-top: 4px;
  &:hover { border-color: #60a5fa; color: #60a5fa; }
}
</style>
