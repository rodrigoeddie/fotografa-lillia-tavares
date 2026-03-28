<script lang="ts" setup>
interface MenuItem {
  label: string;
  path: string;
}

const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const MENU_PATH = 'globals/menu.json';

const menuData = ref<MenuItem[]>([]);
const menuSaving = ref(false);
const menuLoading = ref(false);
const menuDragIdx = ref<number | null>(null);
const menuDragOverIdx = ref<number | null>(null);

async function load() {
  menuLoading.value = true;
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(MENU_PATH)}`, { params: { _t: Date.now() } });
    menuData.value = JSON.parse(res.content);
  } catch (e: any) {
    props.showMessage('Erro ao carregar menu: ' + e.message, 'error');
  } finally {
    menuLoading.value = false;
  }
}

async function saveMenu() {
  menuSaving.value = true;
  try {
    await $fetch('/api/fs/raw', {
      method: 'POST',
      body: { path: MENU_PATH, content: JSON.stringify(menuData.value, null, 4) },
    });
    props.showMessage('Menu salvo!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar menu: ' + e.message, 'error');
  } finally {
    menuSaving.value = false;
  }
}

function addMenuItem() {
  menuData.value.push({ label: '', path: '/' });
}

function removeMenuItem(index: number) {
  menuData.value.splice(index, 1);
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
        <p class="dep-meta">{{ menuData.length }} itens</p>
      </div>
      <div class="dep-header-actions">
        <button class="btn-add-review" @click="addMenuItem">+ Novo item</button>
        <button class="btn-save" @click="saveMenu" :disabled="menuSaving">
          {{ menuSaving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <div class="menu-list" @dragover.prevent @drop.prevent="onMenuDrop">
      <div
        v-for="(item, idx) in menuData"
        :key="idx"
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
        <button class="btn-remove-review" @click="removeMenuItem(idx)" title="Remover">✕</button>
      </div>
    </div>

    <p v-if="menuData.length === 0" class="menu-empty">Nenhum item. Clique em "+ Novo item" para adicionar.</p>
  </div>
</template>

<style lang="scss" scoped>
.menu-editor {
  padding: 0 0 40px;
}

.dep-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 0 16px;
  border-bottom: 1px solid #222;
  margin-bottom: 20px;
  h2 { font-size: 20px; margin: 0 0 4px; }
}

.dep-meta { font-size: 13px; color: #666; margin: 0; }

.dep-header-actions {
  display: flex;
  gap: 8px;
}

.btn-add-review {
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  color: #60a5fa;
  padding: 7px 16px;
  border-radius: 6px;
  flex-shrink: 0;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: #253d55; }
}

.btn-save {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  width: auto;
  padding: 8px 20px;
  font-size: 14px;
  &:hover { background: #1d4ed8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.dep-drag-handle {
  font-size: 16px;
  color: #444;
  cursor: grab;
  padding: 0 2px;
  flex-shrink: 0;
  &:hover { color: #777; }
  &:active { cursor: grabbing; }
}

.btn-remove-review {
  background: none;
  border: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  &:hover { background: #3a1a1a; color: #f87171; }
}

.menu-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.menu-item-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  transition: border-color 0.15s;
  user-select: none;
  &.menu-drag-over { border-color: #60a5fa; }
}

.menu-item-order {
  font-size: 11px;
  color: #444;
  font-family: monospace;
  width: 18px;
  flex-shrink: 0;
  text-align: center;
}

.menu-item-label {
  flex: 0 0 200px;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 5px;
  color: #ccc;
  font-size: 13px;
  padding: 6px 10px;
  &:focus { outline: none; border-color: #444; }
}

.menu-item-path {
  flex: 1;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 5px;
  color: #7eb6d4;
  font-size: 13px;
  font-family: monospace;
  padding: 6px 10px;
  &:focus { outline: none; border-color: #444; }
}

.menu-empty {
  font-size: 13px;
  color: #555;
  padding: 24px 0;
  text-align: center;
}
</style>
