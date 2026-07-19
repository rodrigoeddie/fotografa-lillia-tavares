<script lang="ts" setup>
interface MenuItem {
  label: string;
  path: string;
  blank: boolean;
  children?: MenuItem[];
}

const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const { adminFetch } = useAdminFetch();

const menuData = ref<MenuItem[]>([]);
const menuSaving = ref(false);
const menuLoading = ref(false);
const menuDragIdx = ref<number | null>(null);
const menuDragOverIdx = ref<number | null>(null);

const totalItems = computed(() =>
  menuData.value.reduce((acc, item) => acc + 1 + (item.children?.length ?? 0), 0)
);

async function load() {
  menuLoading.value = true;
  try {
    const results = await adminFetch<MenuItem[]>('/api/admin/menu');
    menuData.value = results.map(({ label, path, blank, children }) => ({
      label,
      path,
      blank: blank ?? false,
      children: (children ?? []).map((c) => ({ label: c.label, path: c.path, blank: c.blank ?? false })),
    }));
  } catch (e: any) {
    props.showMessage('Erro ao carregar menu: ' + (e.statusMessage || e.message), 'error');
  } finally {
    menuLoading.value = false;
  }
}

async function saveMenu() {
  menuSaving.value = true;
  try {
    await adminFetch('/api/admin/menu', {
      method: 'PUT',
      body: menuData.value.map((item) => ({
        ...item,
        children: item.children?.length ? item.children : undefined,
      })),
    });
    props.showMessage('Menu salvo!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar menu: ' + (e.statusMessage || e.message), 'error');
  } finally {
    menuSaving.value = false;
  }
}

function addMenuItem() {
  menuData.value.push({ label: '', path: '/', blank: false, children: [] });
}

function removeMenuItem(index: number) {
  menuData.value.splice(index, 1);
}

function addSubItem(parentIdx: number) {
  const parent = menuData.value[parentIdx];
  if (!parent) return;
  if (!parent.children) parent.children = [];
  parent.children.push({ label: '', path: '/', blank: false });
}

function removeSubItem(parentIdx: number, childIdx: number) {
  menuData.value[parentIdx]?.children?.splice(childIdx, 1);
}

function moveSubItem(parentIdx: number, childIdx: number, dir: -1 | 1) {
  const children = menuData.value[parentIdx]?.children;
  if (!children) return;
  const target = childIdx + dir;
  if (target < 0 || target >= children.length) return;
  const [moved] = children.splice(childIdx, 1);
  if (moved) children.splice(target, 0, moved);
}

function onMenuDragStart(idx: number) { menuDragIdx.value = idx; }
function onMenuDragOver(e: DragEvent, idx: number) { e.preventDefault(); menuDragOverIdx.value = idx; }
function onMenuDrop() {
  if (menuDragIdx.value !== null && menuDragOverIdx.value !== null) {
    const [moved] = menuData.value.splice(menuDragIdx.value, 1);
    if (moved) menuData.value.splice(menuDragOverIdx.value, 0, moved);
  }
  menuDragIdx.value = null;
  menuDragOverIdx.value = null;
}

defineExpose({ load });
</script>

<template>
  <div v-if="!menuLoading" class="menu-editor">
    <div class="dep-header">
      <div>
        <h2>Menu de Navegação</h2>
        <p class="dep-meta">{{ totalItems }} itens · arraste para reordenar o topo; subitens usam ▲▼</p>
      </div>
      <div class="dep-header-actions">
        <button class="btn-add-review" @click="addMenuItem">+ Novo item</button>
        <button class="btn-save" @click="saveMenu" :disabled="menuSaving">
          {{ menuSaving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <div class="menu-list" @dragover.prevent @drop.prevent="onMenuDrop">
      <div v-for="(item, idx) in menuData" :key="idx" class="menu-item-group">
        <div
          class="menu-item-row"
          :class="{ 'menu-drag-over': menuDragOverIdx === idx }"
          draggable="true"
          @dragstart="onMenuDragStart(idx)"
          @dragover.prevent="(e) => onMenuDragOver(e, idx)"
        >
          <span class="dep-drag-handle" title="Arrastar para reordenar">⠿</span>
          <span class="menu-item-order">{{ idx + 1 }}</span>
          <input
            v-model="item.label"
            type="text"
            class="menu-item-label"
            placeholder="Label (ex: Home)"
          />
          <input
            v-model="item.path"
            type="text"
            class="menu-item-path"
            placeholder="Path (ex: /sobre)"
          />

          <span class="menu-item-blank">
            <label class="switch">
              <input type="checkbox" v-model="item.blank" />
              <span class="slider" />
            </label>
            <span class="menu-item-blank-label">Link externo</span>
          </span>

          <div class="item-actions">
            <button class="btn-icon" title="Adicionar subitem" @click="addSubItem(idx)">＋ Sub</button>
            <button class="btn-icon btn-danger" @click="removeMenuItem(idx)">🗑 Deletar</button>
          </div>
        </div>

        <div
          v-for="(child, cidx) in item.children"
          :key="cidx"
          class="menu-item-row menu-subitem-row"
        >
          <span class="menu-subitem-indent">└</span>
          <span class="menu-item-order">{{ idx + 1 }}.{{ cidx + 1 }}</span>
          <input
            v-model="child.label"
            type="text"
            class="menu-item-label"
            placeholder="Label (ex: Aluguel do estúdio)"
          />
          <input
            v-model="child.path"
            type="text"
            class="menu-item-path"
            placeholder="Path (ex: /estudio-.../aluguel)"
          />

          <span class="menu-item-blank">
            <label class="switch">
              <input type="checkbox" v-model="child.blank" />
              <span class="slider" />
            </label>
            <span class="menu-item-blank-label">Link externo</span>
          </span>

          <div class="item-actions">
            <button class="btn-icon" title="Mover para cima" :disabled="cidx === 0" @click="moveSubItem(idx, cidx, -1)">▲</button>
            <button class="btn-icon" title="Mover para baixo" :disabled="cidx === (item.children?.length ?? 0) - 1" @click="moveSubItem(idx, cidx, 1)">▼</button>
            <button class="btn-icon btn-danger" @click="removeSubItem(idx, cidx)">🗑</button>
          </div>
        </div>
      </div>
    </div>

    <p v-if="menuData.length === 0" class="menu-empty">Nenhum item. Clique em "+ Novo item" para adicionar.</p>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.menu-editor {
  padding: 0 0 40px;
}

.dep-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 0 16px;
  border-bottom: 1px solid t.$border;
  margin-bottom: 20px;
  h2 { font-size: 20px; margin: 0 0 4px; }
}

.dep-meta { font-size: 13px; color: t.$text-3; margin: 0; }

.dep-header-actions {
  display: flex;
  gap: 8px;
}

.btn-add-review {
  background: t.$surface-2;
  border: 1px solid t.$border;
  color: t.$text;
  padding: 7px 16px;
  border-radius: 6px;
  flex-shrink: 0;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: t.$surface-3; }
}

.btn-save {
  width: 100%;
  padding: 12px;
  background: t.$accent;
  color: t.$accent-ink;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: auto;
  padding: 8px 20px;
  font-size: 14px;
  &:hover { background: t.$accent-hi; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.dep-drag-handle {
  font-size: 16px;
  color: t.$text-3;
  cursor: grab;
  padding: 0 2px;
  flex-shrink: 0;
  &:hover { color: t.$text-2; }
  &:active { cursor: grabbing; }
}

.btn-remove-review {
  background: none;
  border: none;
  color: t.$text-3;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  &:hover { background: t.$danger-bg; color: t.$danger; }
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.menu-item-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 8px;
  transition: border-color 0.15s;
  user-select: none;
  &.menu-drag-over { border-color: t.$accent; }
}

.menu-subitem-row {
  margin-left: 32px;
  background: t.$bg;
  border-style: dashed;
}

.menu-subitem-indent {
  color: t.$text-3;
  font-size: 14px;
  flex-shrink: 0;
}

.btn-icon {
  background: t.$surface-2;
  border: 1px solid t.$border-strong;
  color: t.$text-2;
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  &:hover:not(:disabled) { background: t.$surface-3; color: t.$text; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
  &.btn-danger:hover { background: t.$danger-bg; color: t.$danger; border-color: t.$danger; }
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.menu-item-order {
  font-size: 11px;
  color: t.$text-3;
  font-family: monospace;
  width: 18px;
  flex-shrink: 0;
  text-align: center;
}

.menu-item-label {
  flex: 0 0 200px;
  background: t.$bg;
  border: 1px solid t.$border;
  border-radius: 5px;
  color: t.$text;
  font-size: 13px;
  padding: 6px 10px;
  &:focus { outline: none; border-color: t.$accent-line; }
}

.menu-item-path {
  flex: 1;
  background: t.$bg;
  border: 1px solid t.$border;
  border-radius: 5px;
  color: t.$info;
  font-size: 13px;
  font-family: monospace;
  padding: 6px 10px;
  &:focus { outline: none; border-color: t.$accent-line; }
}

.menu-item-blank {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.menu-item-blank-label {
  font-size: 12px;
  color: t.$text-3;
  white-space: nowrap;
}

.menu-empty {
  font-size: 13px;
  color: t.$text-3;
  padding: 24px 0;
  text-align: center;
}
</style>
