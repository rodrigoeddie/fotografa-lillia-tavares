<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, pacotes, addPacote, removePacote, init, save } = useProdutoForm(idParam);

// ─── Collapse state ──────────────────────────────────────────────────────────
const collapsed = ref<Set<number>>(new Set());
function toggleCollapse(i: number) {
  const s = new Set(collapsed.value);
  s.has(i) ? s.delete(i) : s.add(i);
  collapsed.value = s;
}

// ─── Drag to reorder pacotes ─────────────────────────────────────────────────
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);
function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
function onDragEnd() {
  if (dragIdx.value !== null && dragOverIdx.value !== null && dragIdx.value !== dragOverIdx.value) {
    const [moved] = pacotes.value.splice(dragIdx.value, 1);
    if (moved) pacotes.value.splice(dragOverIdx.value, 0, moved);
  }
  dragIdx.value = null; dragOverIdx.value = null;
}

// ─── Drag to reorder feature rows ────────────────────────────────────────────
const featureDrag = ref<{ arr: string[]; from: number; over: number } | null>(null);
function fDragStart(arr: string[], i: number) { featureDrag.value = { arr, from: i, over: i }; }
function fDragOver(e: DragEvent, i: number) { e.preventDefault(); if (featureDrag.value) featureDrag.value.over = i; }
function fDragEnd() {
  const s = featureDrag.value;
  if (s && s.from !== s.over) {
    const [moved] = s.arr.splice(s.from, 1);
    if (moved !== undefined) s.arr.splice(s.over, 0, moved);
  }
  featureDrag.value = null;
}
function fIsOver(arr: string[], i: number) { return featureDrag.value?.arr === arr && featureDrag.value?.over === i; }

function addAndExpand() {
  const prevLen = pacotes.value.length;
  addPacote();
  nextTick(() => {
    collapsed.value = new Set(Array.from({ length: prevLen }, (_, i) => i));
  });
}

// ─── Modelos pré-preenchidos de pacote (quase sempre iguais) ──────────────────
const PACOTE_PRESETS: PacoteForm[] = [
  {
    title: 'Pacote 01', subtitle: '', preco: 299, num_parcelas: 3, preco_parcelas: 115,
    fotos_incluidas: 5, preco_foto_extra: 30, is_recommended: false,
    features: [
      '5 fotos editadas', '30 minutos de sessão', 'Entrega em 7 dias úteis',
      '1 Cenário', '1 look', 'Fotos extras por R$30 cada',
    ],
  },
  {
    title: 'Pacote 02', subtitle: '', preco: 579, num_parcelas: 4, preco_parcelas: 168,
    fotos_incluidas: 10, preco_foto_extra: 28, is_recommended: false,
    features: [
      '10 fotos editadas', '40 minutos de sessão', 'Entrega em 5 dias úteis',
      '1 Cenário', '2 trocas de roupa', 'Orientação completa de poses', 'Fotos extras por R$28 cada',
    ],
  },
  {
    title: 'Pacote 03', subtitle: '', preco: 799, num_parcelas: 4, preco_parcelas: 224,
    fotos_incluidas: 25, preco_foto_extra: 20, is_recommended: false,
    features: [
      '25 fotos editadas', '1 hora e 30 minutos de sessão', 'Entrega em 3 dias úteis',
      'Até 3 cenários', '3 trocas de roupa', 'Formato digital em alta resolução',
      'Orientação completa de poses', 'Fotos extras por R$20 cada',
    ],
  },
  {
    title: 'Pacote 04', subtitle: '', preco: 1199, num_parcelas: 5, preco_parcelas: 260,
    fotos_incluidas: 40, preco_foto_extra: 19, is_recommended: false,
    features: [
      '40 fotos editadas', '2 horas de sessão', 'Entrega em 3 dias úteis',
      'Até 4 cenários', '4 trocas de roupa', 'Orientação completa de poses', 'Fotos extras por R$19 cada',
    ],
  },
];

function clonePreset(p: PacoteForm): PacoteForm {
  return { ...p, features: [...p.features] };
}

function addPacotePreset(preset: PacoteForm) {
  const prevLen = pacotes.value.length;
  pacotes.value.push(clonePreset(preset));
  nextTick(() => {
    collapsed.value = new Set(Array.from({ length: prevLen }, (_, i) => i));
  });
}

function addAllPacotePresets() {
  for (const p of PACOTE_PRESETS) pacotes.value.push(clonePreset(p));
  nextTick(() => {
    collapsed.value = new Set(pacotes.value.map((_, i) => i));
  });
}

// ─── Sugestões pré-preenchidas de "o que está incluso" ────────────────────────
const INCLUDE_SUGGESTIONS = [
  'Orientação e consultoria durante todo o ensaio',
  'Fotos digitais em alta resolução enviadas por email',
  'Para garantia da vaga é necessário um sinal de R$100.',
  'Os pacotes contemplam ensaios individuais',
  'Oferecemos o serviço de make por R$120, sendo necessário confirmar junto ao agendamento.',
  '* Para necessidades diferentes dos pacotes, por favor, entre em contato.',
  'Orçamento válido por 30 dias a partir da data de recebimento.',
];
const availableSuggestions = computed(() =>
  INCLUDE_SUGGESTIONS.filter((s) => !form.includes.includes(s)),
);
function addSuggestion(text: string) {
  form.includes.push(text);
}
function addAllSuggestions() {
  for (const s of availableSuggestions.value) form.includes.push(s);
}

// ─── Focus on new feature input ───────────────────────────────────────────────
const includesList = ref<HTMLElement | null>(null);
const featuresLists = ref<Record<number, HTMLElement>>({});

function addInclude() {
  form.includes.push('');
  nextTick(() => {
    const inputs = includesList.value?.querySelectorAll<HTMLInputElement>('input');
    inputs?.[inputs.length - 1]?.focus();
  });
}

function addFeature(arr: string[], pi: number) {
  arr.push('');
  nextTick(() => {
    const inputs = featuresLists.value[pi]?.querySelectorAll<HTMLInputElement>('input');
    inputs?.[inputs.length - 1]?.focus();
  });
}

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/investimento" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar produto' : 'Novo produto' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>

      <!-- ── Dados gerais ─────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Dados gerais</h3>
        <div class="form-grid">

          <div class="form-field">
            <label>Slug (URL)</label>
            <input v-model="form.slug" type="text" placeholder="corporativo" />
          </div>
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.title" type="text" placeholder="Ensaio Corporativo" />
          </div>
          <div class="form-field">
            <label>Slug LP (landing page)</label>
            <input v-model="form.lp_slug" type="text" placeholder="corporativo" />
          </div>
          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>
          <div class="form-field form-field--full">
            <label>Descrição</label>
            <textarea v-model="form.description" rows="3" />
          </div>
          <div class="form-field form-field--full">
            <label>Ícone <small>(SVG ou emoji)</small></label>
            <AdminIconPicker v-model="form.icon" />
          </div>
          <div class="form-field">
            <label>Ativo</label>
            <div class="switch-row">
              <span>Produto ativo</span>
              <label class="switch">
                <input type="checkbox" v-model="form.active" />
                <span class="slider" />
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- ── CTA ─────────────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">CTA (chamada para ação)</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Título CTA</label>
            <input v-model="form.cta_title" type="text" />
          </div>
          <div class="form-field">
            <label>Descrição CTA</label>
            <input v-model="form.cta_description" type="text" />
          </div>
          <div class="form-field form-field--full">
            <label>Mensagem WhatsApp</label>
            <input v-model="form.cta_whatsapp_msg" type="text" />
          </div>
        </div>
      </div>

      <!-- ── O que está incluso ──────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">O que está incluso</h3>
        <div class="features-list" ref="includesList">
          <div
            v-for="(_, i) in form.includes" :key="i" class="feature-row"
            draggable="true"
            :class="{ 'drag-over': fIsOver(form.includes, i) }"
            @dragstart="fDragStart(form.includes, i)"
            @dragover="(e) => fDragOver(e, i)"
            @dragend="fDragEnd"
          >
            <span class="drag-handle-sm">⠿</span>
            <input v-model="form.includes[i]" type="text" placeholder="Ex: 5 fotos editadas" />
            <button class="btn-remove-sm" @click="form.includes.splice(i, 1)" title="Remover">
              <span class="material-symbols-outlined">delete_forever</span>
            </button>
          </div>
          <p v-if="form.includes.length === 0" class="empty-hint">Nenhum item.</p>
        </div>
        <button class="btn-add-dashed" @click="addInclude">+ Adicionar item</button>

        <div v-if="availableSuggestions.length" class="suggestions">
          <div class="suggestions-header">
            <span>Sugestões</span>
            <button class="btn-add-small" @click="addAllSuggestions">+ Adicionar todas</button>
          </div>
          <div class="suggestions-chips">
            <button
              v-for="s in availableSuggestions" :key="s"
              class="suggestion-chip" type="button"
              @click="addSuggestion(s)"
            >
              <span class="material-symbols-outlined">add</span>{{ s }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── Pacotes ─────────────────────────────────────────────────────── -->
      <div class="form-card">
        <div class="section-header">
          <h3 class="form-section-title">
            Pacotes
            <span class="count-badge">{{ pacotes.length }}</span>
          </h3>
          <button class="btn-secondary btn-sm" @click="addAndExpand">+ Adicionar pacote</button>
        </div>

        <div class="suggestions suggestions--models">
          <div class="suggestions-header">
            <span>Modelos prontos</span>
            <button class="btn-add-small" @click="addAllPacotePresets">+ Adicionar os 4 modelos</button>
          </div>
          <div class="model-chips">
            <button
              v-for="p in PACOTE_PRESETS" :key="p.title"
              class="model-chip" type="button"
              @click="addPacotePreset(p)"
            >
              <span class="material-symbols-outlined">add</span>
              <span class="model-chip-name">{{ p.title }}</span>
              <span class="model-chip-meta">R$ {{ p.preco }} · {{ p.fotos_incluidas }} fotos</span>
            </button>
          </div>
        </div>

        <div class="pacotes-list" @dragover.prevent @drop.prevent="onDragEnd">
          <div
            v-for="(pacote, pi) in pacotes" :key="pi"
            class="pacote-card"
            :class="{ 'drag-over': dragOverIdx === pi, 'is-recommended': pacote.is_recommended }"
            draggable="true"
            @dragstart="onDragStart(pi)"
            @dragover="(e) => onDragOver(e, pi)"
          >
            <!-- Header -->
            <div class="pacote-card-header" @click="toggleCollapse(pi)">
              <span class="drag-handle">⠿</span>
              <span class="pkg-collapse">{{ collapsed.has(pi) ? '▸' : '▾' }}</span>
              <span class="pkg-title">{{ pacote.title || 'Sem título' }}</span>
              <span class="pkg-price">R$ {{ pacote.preco }}</span>
              <span v-if="pacote.is_recommended" class="pkg-badge">★ Recomendado</span>
              <button class="btn-remove-sm" type="button" @click.stop="removePacote(pi)" title="Remover">
                <span class="material-symbols-outlined">
                delete
                </span>
              </button>
            </div>

            <!-- Body -->
            <div v-show="!collapsed.has(pi)" class="pacote-card-body">
              <div class="form-grid">
                <div class="form-field">
                  <label>Título</label>
                  <input v-model="pacote.title" type="text" />
                </div>
                <div class="form-field">
                  <label>Subtítulo</label>
                  <input v-model="pacote.subtitle" type="text" />
                </div>
                <div class="form-field">
                  <label>Preço (R$)</label>
                  <input v-model.number="pacote.preco" type="number" step="0.01" />
                </div>
                <div class="form-field">
                  <label>Nº parcelas</label>
                  <input v-model.number="pacote.num_parcelas" type="number" />
                </div>
                <div class="form-field">
                  <label>Preço por parcela</label>
                  <input v-model.number="pacote.preco_parcelas" type="number" step="0.01" />
                </div>
                <div class="form-field">
                  <label>Fotos incluídas</label>
                  <input v-model.number="pacote.fotos_incluidas" type="number" />
                </div>
                <div class="form-field">
                  <label>Preço foto extra (R$)</label>
                  <input v-model.number="pacote.preco_foto_extra" type="number" step="0.01" />
                </div>
                <div class="form-field">
                  <label>Recomendado?</label>
                  <div class="switch-row">
                    <span>Destacar como recomendado</span>
                    <label class="switch">
                      <input type="checkbox" v-model="pacote.is_recommended" />
                      <span class="slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div class="pkg-features">
                <div class="pkg-features-header">
                  <label>Itens incluídos</label>
                  <button class="btn-add-small" @click="addFeature(pacote.features, pi)">+ item</button>
                </div>
                <div class="features-list" :ref="(el) => { if (el) featuresLists[pi] = el as HTMLElement }">
                  <div
                    v-for="(_, fi) in pacote.features" :key="fi" class="feature-row"
                    draggable="true"
                    :class="{ 'drag-over': fIsOver(pacote.features, fi) }"
                    @dragstart="fDragStart(pacote.features, fi)"
                    @dragover="(e) => fDragOver(e, fi)"
                    @dragend="fDragEnd"
                  >
                    <span class="drag-handle-sm">⠿</span>
                    <input v-model="pacote.features[fi]" type="text" placeholder="Ex: 5 fotos editadas" />
                    <button class="btn-remove-sm" @click="pacote.features.splice(fi, 1)" title="Remover">
                      <span class="material-symbols-outlined">delete_forever</span>
                    </button>
                  </div>
                  <p v-if="pacote.features.length === 0" class="empty-hint">Nenhum item.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-if="pacotes.length === 0" class="empty-hint">Nenhum pacote adicionado.</p>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/investimento" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => {})">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '💾 Criar produto') }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.form-section-title {
  font-size: 13px; font-weight: 600; color: t.$text-2;
  text-transform: uppercase; letter-spacing: 0.05em; margin: 0;
  display: flex; align-items: center; gap: 8px;
}

// Suggestions
.suggestions { margin-top: 14px; padding-top: 12px; border-top: 1px solid t.$border; }
.suggestions-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  span { font-size: 12px; color: t.$text-3; text-transform: uppercase; letter-spacing: 0.05em; }
}
.suggestions-chips { display: flex; flex-direction: column; gap: 6px; }
.suggestion-chip {
  display: flex; align-items: center; gap: 6px; width: 100%; text-align: left;
  background: t.$surface; border: 1px dashed t.$border-strong; color: t.$text-2;
  font-size: 13px; font-family: inherit; padding: 7px 10px; border-radius: 6px; cursor: pointer;
  transition: border-color .12s, color .12s;
  .material-symbols-outlined { font-size: 16px; color: t.$text-3; flex-shrink: 0; }
  &:hover { border-color: t.$accent; color: t.$accent; .material-symbols-outlined { color: t.$accent; } }
}

// Package model presets
.suggestions--models { margin-top: 0; margin-bottom: 16px; padding-top: 0; border-top: none; }
.model-chips {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px;
}
.model-chip {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap; text-align: left;
  background: t.$surface; border: 1px dashed t.$border-strong; color: t.$text-2;
  font-size: 13px; font-family: inherit; padding: 8px 10px; border-radius: 6px; cursor: pointer;
  transition: border-color .12s, color .12s;
  .material-symbols-outlined { font-size: 16px; color: t.$text-3; flex-shrink: 0; }
  &:hover { border-color: t.$accent; color: t.$accent; .material-symbols-outlined { color: t.$accent; } }
}
.model-chip-name { font-weight: 500; }
.model-chip-meta { font-size: 11px; color: t.$text-3; width: 100%; }

// Switch
.switch-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; color: t.$text; font-size: 14px; }
.switch {
  position: relative; display: inline-block; width: 40px; height: 22px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; inset: 0; background: t.$border-strong; border-radius: 22px; transition: 0.3s; cursor: pointer;
    &::before { content: ''; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
  }
  input:checked + .slider { background: t.$accent; }
  input:checked + .slider::before { transform: translateX(18px); }
}

// Section header
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }

// Features list
.features-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.feature-row {
  display: flex;
  align-items: center;
  gap: 6px;

  input {
    border: 1px solid t.$border-strong;
    border-radius: 4px;
    padding: 5px;
    flex: 1;
  }
}
.bullet { color: t.$text-2; font-size: 16px; flex-shrink: 0; }
.drag-handle-sm { font-size: 14px; color: t.$border-strong; cursor: grab; flex-shrink: 0; &:active { cursor: grabbing; } }
.feature-row.drag-over { outline: 1px dashed t.$accent; border-radius: 4px; }
.btn-remove-sm {
  background: none; border: none; color: t.$text-3; font-size: 13px; cursor: pointer;
  padding: 2px 6px; border-radius: 4px; flex-shrink: 0;
  &:hover { background: t.$danger-bg; color: t.$danger; }
}

// Pacote cards
.pacotes-list { display: flex; flex-direction: column; gap: 8px; }
.pacote-card {
  background: t.$surface; border: 1px solid t.$border; border-radius: 8px;
  overflow: hidden; transition: border-color 0.15s;
  &.drag-over { border-color: t.$accent; }
  &.is-recommended { border-color: t.$warning; }
}
.pacote-card-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  cursor: pointer; user-select: none;
  &:hover { background: t.$surface-2; }
}
.drag-handle { font-size: 16px; color: t.$border-strong; cursor: grab; flex-shrink: 0; &:active { cursor: grabbing; } }
.pkg-collapse { font-size: 12px; color: t.$text-3; flex-shrink: 0; }
.pkg-title { flex: 1; font-size: 14px; font-weight: 500; color: t.$text; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pkg-price { font-size: 13px; color: t.$text-2; flex-shrink: 0; }
.pkg-badge { background: t.$warning-bg; color: t.$warning; font-size: 11px; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.pacote-card-body { padding: 14px; border-top: 1px solid t.$surface-2; }

// Features sub-section
.pkg-features { margin-top: 12px; }
.pkg-features-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; label { font-size: 13px; color: t.$text-2; font-weight: 500; } }
.btn-add-small {
  background: t.$surface; border: 1px solid t.$border; color: t.$text-3; font-size: 12px;
  padding: 4px 10px; border-radius: 4px; cursor: pointer;
  &:hover { color: t.$accent; border-color: t.$accent; }
}

// Dashed add
.btn-add-dashed {
  background: none; border: 1px dashed t.$border-strong; color: t.$text-3; width: 100%;
  padding: 10px; border-radius: 6px; font-size: 13px; cursor: pointer; margin-top: 8px;
  &:hover { border-color: t.$accent; color: t.$accent; }
}
</style>
