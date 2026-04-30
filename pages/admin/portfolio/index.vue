<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface PortfolioWork { id: number; slug: string; titulo: string; categoria: string; ativo: number; home: number; ordem: number; }

const works = ref<PortfolioWork[]>([]);
const loading = ref(false);
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);

async function load() {
  loading.value = true;
  try {
    const data = await adminFetch<PortfolioWork[]>('/api/admin/portfolio');
    works.value = [...data].sort((a, b) => a.ordem - b.ordem);
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteWork(id: number, titulo: string) {
  if (!confirm(`Excluir "${titulo}"?`)) return;
  try {
    await adminFetch(`/api/admin/portfolio/${id}`, { method: 'DELETE' });
    showMessage('Portfolio removido', 'success');
    works.value = works.value.filter((w) => w.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function toggleField(w: PortfolioWork, field: 'ativo' | 'home') {
  const prev = w[field];
  w[field] = prev ? 0 : 1;
  try {
    await adminFetch(`/api/admin/portfolio/${w.id}`, { method: 'PATCH', body: { [field]: w[field] } });
  } catch (e: any) {
    w[field] = prev;
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
async function onDrop() {
  if (dragIdx.value === null || dragOverIdx.value === null || dragIdx.value === dragOverIdx.value) {
    dragIdx.value = null; dragOverIdx.value = null; return;
  }
  const list = [...works.value];
  const [moved] = list.splice(dragIdx.value, 1);
  if (moved) list.splice(dragOverIdx.value, 0, moved);
  works.value = list;
  dragIdx.value = null; dragOverIdx.value = null;

  // Persist new ordem
  await Promise.all(
    works.value.map((w, idx) =>
      adminFetch(`/api/admin/portfolio/${w.id}`, { method: 'PATCH', body: { ordem: idx + 1 } }).catch(() => null)
    )
  );
  works.value.forEach((w, idx) => { w.ordem = idx + 1; });
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Portfolio</h2>
        <p class="dep-meta">{{ works.length }} trabalhos</p>
      </div>
      <NuxtLink to="/admin/portfolio/save" class="btn-add-item">+ Novo work</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="works.length === 0" class="list-empty">Nenhum portfolio cadastrado.</p>
    <div v-else class="item-list" @dragover.prevent @drop.prevent="onDrop">
      <div
        v-for="(w, i) in works"
        :key="w.id"
        class="item-row"
        :class="{ 'item-drag-over': dragOverIdx === i }"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover.prevent="(e) => onDragOver(e, i)"
      >
        <span class="dep-drag-handle" title="Arrastar para reordenar">⠿</span>
        <span class="item-order">{{ i + 1 }}</span>
        <span class="item-title">{{ w.titulo || w.slug }}</span>
        <span class="item-categoria">{{ w.categoria }}</span>
        <span class="item-toggle-label">Home</span>
        <label class="switch" :title="w.home ? 'Remover da home' : 'Exibir na home'">
          <input type="checkbox" :checked="!!w.home" @change="toggleField(w, 'home')" />
          <span class="slider" />
        </label>
        <span class="item-toggle-label">Ativo</span>
        <label class="switch" :title="w.ativo ? 'Desativar' : 'Ativar'">
          <input type="checkbox" :checked="!!w.ativo" @change="toggleField(w, 'ativo')" />
          <span class="slider" />
        </label>
        <div class="item-actions">
          <NuxtLink :to="`/admin/portfolio/${w.id}/fotos`" class="btn-icon" title="Fotos">🖼</NuxtLink>
          <NuxtLink :to="`/admin/portfolio/save/${w.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
          <button class="btn-icon btn-danger" @click="deleteWork(w.id, w.titulo || w.slug)">🗑</button>
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

.item-title {
  flex: 1;
  font-size: 14px;
  color: #ccc;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-categoria {
  flex: 0 0 140px;
  font-size: 12px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-toggle-label {
  font-size: 11px;
  color: #555;
  flex-shrink: 0;
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
