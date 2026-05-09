<script lang="ts" setup>
import type { LpBlock, LpBlockType } from '~/shared/schemas/landing-page';
import { LP_BLOCK_TYPES, BlockSchema } from '~/shared/schemas/landing-page';

const props = defineProps<{ modelValue: LpBlock[] }>();
const emit  = defineEmits<{ (e: 'update:modelValue', v: LpBlock[]): void }>();

const blocks = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const showPicker = ref(false);
const expandedIdx = ref<number | null>(null);
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);

// JSON local por bloco para edição (separado do `dados` para validar antes de gravar)
const editJson = ref<Record<number, string>>({});
const editError = ref<Record<number, string>>({});

function addBlock(tipo: LpBlockType) {
  const newBlock: LpBlock = { tipo, ordem: blocks.value.length, dados: defaultDataFor(tipo) } as LpBlock;
  blocks.value = [...blocks.value, newBlock];
  showPicker.value = false;
  expandedIdx.value = blocks.value.length - 1;
}

function removeBlock(i: number) {
  if (!confirm('Remover este bloco?')) return;
  blocks.value = blocks.value.filter((_, idx) => idx !== i);
  if (expandedIdx.value === i) expandedIdx.value = null;
}

function toggleExpand(i: number) {
  if (expandedIdx.value === i) {
    expandedIdx.value = null;
    return;
  }
  expandedIdx.value = i;
  // Inicializa textarea com o JSON atual
  editJson.value[i] = JSON.stringify(blocks.value[i]!.dados, null, 2);
  editError.value[i] = '';
}

function applyEdit(i: number) {
  try {
    const parsed = JSON.parse(editJson.value[i] ?? '{}');
    const candidate = { tipo: blocks.value[i]!.tipo, ordem: blocks.value[i]!.ordem, dados: parsed };
    const result = BlockSchema.safeParse(candidate);
    if (!result.success) {
      editError.value[i] = result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
      return;
    }
    const next = [...blocks.value];
    next[i] = result.data;
    blocks.value = next;
    editError.value[i] = '';
  } catch (e: any) {
    editError.value[i] = `JSON inválido: ${e.message}`;
  }
}

function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
function onDrop() {
  if (dragIdx.value === null || dragOverIdx.value === null || dragIdx.value === dragOverIdx.value) {
    dragIdx.value = null; dragOverIdx.value = null;
    return;
  }
  const list = [...blocks.value];
  const [moved] = list.splice(dragIdx.value, 1);
  if (moved) list.splice(dragOverIdx.value, 0, moved);
  blocks.value = list.map((b, idx) => ({ ...b, ordem: idx }));
  dragIdx.value = null; dragOverIdx.value = null;
}

function defaultDataFor(tipo: LpBlockType): any {
  switch (tipo) {
    case 'hero':            return { variant: 'corporativo' };
    case 'heroPresentes':   return { title: '', subtitle: '', features: [], whatsappMessage: '', buttonText: '' };
    case 'forWho':          return { title: '', description: '', lists: [{ title: '', list: [] }] };
    case 'howWorks':        return { title: '', list: [{ title: '', description: '', icon: '' }] };
    case 'prices':          return { produtoSlug: '' };
    case 'testimonials':    return {};
    case 'ctaContact':      return { title: '', description: '', buttonText: '', whatsappMessage: '' };
    case 'map':             return { title: '', description: '' };
    case 'portfolioGrid':   return { categoria: '', title: '', description: '' };
    case 'giftGrid':        return {};
    case 'coloracao':       return {};
    case 'deliverables':    return { title: '', description: '', items: [] };
    case 'hubBacklink':     return { text: '', linkLabel: '', linkTo: '' };
    default:                return {};
  }
}
</script>

<template>
  <div class="block-manager">
    <div class="bm-header">
      <strong>Blocos da landing page</strong>
      <button type="button" class="btn-add-item" @click="showPicker = true">+ Adicionar bloco</button>
    </div>

    <p v-if="blocks.length === 0" class="list-empty">Nenhum bloco. Adicione o primeiro.</p>

    <div v-else class="item-list" @dragover.prevent @drop.prevent="onDrop">
      <div
        v-for="(b, i) in blocks"
        :key="i"
        class="item-row block-row"
        :class="{ 'item-drag-over': dragOverIdx === i, expanded: expandedIdx === i }"
        :draggable="expandedIdx !== i"
        @dragstart="onDragStart(i)"
        @dragover.prevent="(e) => onDragOver(e, i)"
      >
        <div class="block-summary" @click="toggleExpand(i)">
          <span class="dep-drag-handle" title="Arrastar para reordenar">⠿</span>
          <span class="item-order">{{ i + 1 }}</span>
          <span class="item-title">{{ b.tipo }}</span>
          <span class="item-meta">{{ JSON.stringify(b.dados).slice(0, 80) }}…</span>
          <button type="button" class="btn-icon btn-danger" @click.stop="removeBlock(i)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
        <div v-if="expandedIdx === i" class="block-editor">
          <label>JSON do bloco (validado por Zod ao aplicar)</label>
          <textarea v-model="editJson[i]" rows="14"></textarea>
          <p v-if="editError[i]" class="block-error">{{ editError[i] }}</p>
          <div class="block-actions">
            <button type="button" class="btn-secondary" @click="toggleExpand(i)">Fechar</button>
            <button type="button" class="btn-primary" @click="applyEdit(i)">Aplicar</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPicker" class="bm-modal" @click.self="showPicker = false">
      <div class="bm-modal-content">
        <h3>Escolha o tipo de bloco</h3>
        <div class="bm-types">
          <button
            v-for="tipo in LP_BLOCK_TYPES"
            :key="tipo"
            type="button"
            class="bm-type"
            @click="addBlock(tipo)"
          >
            {{ tipo }}
          </button>
        </div>
        <button type="button" class="btn-secondary" @click="showPicker = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.block-manager {
  margin: 24rem 0;
}

.bm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rem;
}

.block-row {
  flex-direction: column;
  align-items: stretch;

  &.expanded {
    background: #1a1a1a;
  }
}

.block-summary {
  display: flex;
  align-items: center;
  gap: 12rem;
  width: 100%;
  cursor: pointer;
  padding: 8rem 0;

  .item-meta {
    flex: 1;
    color: #888;
    font-family: monospace;
    font-size: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.block-editor {
  padding: 12rem 0;
  border-top: 1rem solid #333;

  label {
    display: block;
    font-size: 13rem;
    color: #aaa;
    margin-bottom: 6rem;
  }

  textarea {
    width: 100%;
    background: #0a0a0a;
    color: #ddd;
    border: 1rem solid #333;
    border-radius: 4rem;
    padding: 8rem;
    font-family: monospace;
    font-size: 12rem;
    line-height: 1.5;
  }

  .block-error {
    color: #f87171;
    font-size: 13rem;
    margin-top: 8rem;
  }

  .block-actions {
    display: flex;
    gap: 8rem;
    justify-content: flex-end;
    margin-top: 12rem;
  }
}

.bm-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.bm-modal-content {
  background: #1a1a1a;
  padding: 24rem;
  border-radius: 8rem;
  max-width: 600rem;
  width: 90vw;

  h3 {
    margin: 0 0 16rem;
  }
}

.bm-types {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8rem;
  margin-bottom: 16rem;
}

.bm-type {
  background: #222;
  color: #ddd;
  border: 1rem solid #333;
  border-radius: 4rem;
  padding: 10rem;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: #333;
    border-color: #555;
  }
}
</style>
