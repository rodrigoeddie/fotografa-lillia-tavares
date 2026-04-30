<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Produto { id: number; slug: string; title: string; active: number; ordem: number; }

const produtos = ref<Produto[]>([]);
const loading = ref(false);
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);

async function load() {
  loading.value = true;
  try {
    const data = await adminFetch<Produto[]>('/api/admin/produtos');
    produtos.value = [...data].sort((a, b) => a.ordem - b.ordem);
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteProduto(id: number, title: string) {
  if (!confirm(`Excluir "${title}"?`)) return;
  try {
    await adminFetch(`/api/admin/produtos/${id}`, { method: 'DELETE' });
    showMessage('Produto removido', 'success');
    produtos.value = produtos.value.filter((p) => p.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function toggleActive(p: Produto) {
  const prev = p.active;
  p.active = prev ? 0 : 1;
  try {
    await adminFetch(`/api/admin/produtos/${p.id}`, { method: 'PATCH', body: { active: p.active } });
  } catch (e: any) {
    p.active = prev;
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
async function onDrop() {
  if (dragIdx.value === null || dragOverIdx.value === null || dragIdx.value === dragOverIdx.value) {
    dragIdx.value = null; dragOverIdx.value = null; return;
  }
  const list = [...produtos.value];
  const [moved] = list.splice(dragIdx.value, 1);
  if (moved) list.splice(dragOverIdx.value, 0, moved);
  produtos.value = list;
  dragIdx.value = null; dragOverIdx.value = null;

  // Persist new ordem
  await Promise.all(
    produtos.value.map((p, idx) =>
      adminFetch(`/api/admin/produtos/${p.id}`, { method: 'PATCH', body: { ordem: idx + 1 } }).catch(() => null)
    )
  );
  produtos.value.forEach((p, idx) => { p.ordem = idx + 1; });
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Investimentos / Produtos</h2>
        <p class="dep-meta">{{ produtos.length }} produtos</p>
      </div>
      <NuxtLink to="/admin/investimento/save" class="btn-add-item">+ Novo produto</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="produtos.length === 0" class="list-empty">Nenhum produto cadastrado.</p>
    <div v-else class="item-list" @dragover.prevent @drop.prevent="onDrop">
      <div
        v-for="(p, i) in produtos"
        :key="p.id"
        class="item-row"
        :class="{ 'item-drag-over': dragOverIdx === i }"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover.prevent="(e) => onDragOver(e, i)"
      >
        <span class="dep-drag-handle" title="Arrastar para reordenar">⠿</span>
        <span class="item-order">{{ i + 1 }}</span>
        <span class="item-slug text-muted">{{ p.slug }}</span>
        <span class="item-title">{{ p.title }}</span>
        <label class="switch" :title="p.active ? 'Desativar' : 'Ativar'">
          <input type="checkbox" :checked="!!p.active" @change="toggleActive(p)" />
          <span class="slider" />
        </label>
        <div class="item-actions">
          <NuxtLink :to="`/admin/investimento/save/${p.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteProduto(p.id, p.title)">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

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

.btn-add-item {
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  color: #60a5fa;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  text-decoration: none;
  white-space: nowrap;
  &:hover { background: #253d55; }
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  transition: border-color 0.15s;
  user-select: none;
  &.item-drag-over { border-color: #60a5fa; }
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

.item-order {
  font-size: 11px;
  color: #444;
  font-family: monospace;
  width: 18px;
  flex-shrink: 0;
  text-align: center;
}

.item-slug {
  font-family: monospace;
  font-size: 12px;
  color: #555;
  flex: 0 0 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-title {
  flex: 1;
  font-size: 14px;
  color: #ccc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.list-empty {
  font-size: 13px;
  color: #555;
  padding: 24px 0;
  text-align: center;
}

.switch {
  position: relative; display: inline-block; width: 36px; height: 20px; flex-shrink: 0;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; inset: 0; background: #444; border-radius: 20px;
    cursor: pointer; transition: 0.25s;
    &::before {
      content: ''; position: absolute; height: 14px; width: 14px;
      left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.25s;
    }
  }
  input:checked + .slider { background: #4ade80; }
  input:checked + .slider::before { transform: translateX(16px); }
}
</style>
