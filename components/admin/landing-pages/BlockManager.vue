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

/** Erro de validação Zod por bloco, mostrado abaixo do editor. */
const validationError = ref<Record<number, string>>({});

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
  expandedIdx.value = expandedIdx.value === i ? null : i;
}

/**
 * Atualiza os dados de um bloco. Valida com Zod a cada mudança — se inválido,
 * persiste mesmo assim (o usuário pode estar no meio da edição) mas mostra erro
 * inline. Validação final acontece no submit do form e no endpoint (Zod).
 */
function updateBlockDados(i: number, dados: any) {
  const next = [...blocks.value];
  next[i] = { ...next[i]!, dados };
  blocks.value = next;

  // Validação live (não bloqueia)
  const candidate = { tipo: next[i]!.tipo, ordem: next[i]!.ordem, dados };
  const result = BlockSchema.safeParse(candidate);
  validationError.value[i] = result.success
    ? ''
    : result.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
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

/** Sumário curto exibido na linha colapsada (sem expor o JSON inteiro) */
function summary(b: { tipo: string; dados: any }): string {
  const d = b.dados ?? {};
  switch (b.tipo) {
    case 'hero':           return d.variant ?? '';
    case 'heroPresentes':  return d.title?.slice(0, 60) ?? '';
    case 'forWho':         return d.title?.slice(0, 60) ?? '';
    case 'howWorks':       return `${d.title?.slice(0, 40) ?? ''} (${d.list?.length ?? 0} passos)`;
    case 'prices':         return `produto: ${d.produtoSlug ?? '?'}`;
    case 'testimonials':   return d.description?.slice(0, 60) ?? '(padrão)';
    case 'ctaContact':     return d.title?.slice(0, 60) ?? '';
    case 'map':            return d.title?.slice(0, 60) ?? '';
    case 'portfolioGrid':  return `categoria: ${d.categoria ?? '?'}`;
    case 'giftGrid':       return d.title?.slice(0, 60) ?? '(padrão)';
    case 'coloracao':      return d.title?.slice(0, 60) ?? '(padrão)';
    case 'deliverables':   return `${d.title?.slice(0, 40) ?? ''} (${d.items?.length ?? 0} cards)`;
    case 'hubBacklink':    return `${d.linkLabel ?? ''} → ${d.linkTo ?? ''}`;
    default:               return '';
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
          <span class="item-meta">{{ summary(b) }}</span>
          <span v-if="validationError[i]" class="validation-pill" title="Erro de validação">⚠</span>
          <button type="button" class="btn-icon btn-danger" @click.stop="removeBlock(i)">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
        <div v-if="expandedIdx === i" class="block-editor">
          <AdminLandingPagesBlockEditor
            :tipo="b.tipo"
            :model-value="b.dados"
            @update:model-value="(v) => updateBlockDados(i, v)"
          />
          <p v-if="validationError[i]" class="block-error">{{ validationError[i] }}</p>
          <div class="block-actions">
            <button type="button" class="btn-secondary" @click="toggleExpand(i)">Fechar</button>
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
    font-size: 12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.validation-pill {
  color: #fbbf24;
  font-size: 14rem;
  margin-right: 4rem;
}

.block-editor {
  padding: 12rem 0;
  border-top: 1rem solid #333;

  :deep(.block-editor-fields) {
    display: flex;
    flex-direction: column;
    gap: 12rem;
  }

  :deep(.form-field label) {
    display: block;
    font-size: 13rem;
    color: #ccc;
    margin-bottom: 4rem;
  }

  :deep(.form-field small) {
    display: block;
    color: #666;
    font-size: 11rem;
    margin-top: 2rem;
  }

  :deep(.form-field input),
  :deep(.form-field textarea),
  :deep(.form-field select) {
    width: 100%;
    background: #222;
    color: #eee;
    border: 1rem solid #444;
    border-radius: 4rem;
    padding: 6rem 8rem;
    font-size: 13rem;
    font-family: inherit;

    &:focus { outline: none; border-color: #60a5fa; }
  }

  :deep(.form-field textarea) {
    resize: vertical;
  }

  .block-error {
    color: #f87171;
    font-size: 12rem;
    margin-top: 8rem;
    padding: 8rem;
    background: rgba(248, 113, 113, 0.1);
    border-radius: 4rem;
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
