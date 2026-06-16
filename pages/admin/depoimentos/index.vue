<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Depoimento { id: number; nome: string; rating: number; featured: number; data: string; }

const depoimentos = ref<Depoimento[]>([]);
const loading = ref(false);
const saving = ref(false);

async function load() {
  loading.value = true;
  try {
    depoimentos.value = await adminFetch<Depoimento[]>('/api/admin/depoimentos');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteDepoimento(id: number, nome: string) {
  if (!confirm(`Excluir depoimento de "${nome}"?`)) return;
  try {
    await adminFetch(`/api/admin/depoimentos/${id}`, { method: 'DELETE' });
    showMessage('Depoimento removido', 'success');
    depoimentos.value = depoimentos.value.filter((d) => d.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function toggleFeatured(d: Depoimento) {
  const prev = d.featured;
  d.featured = prev ? 0 : 1;
  try {
    await adminFetch(`/api/admin/depoimentos/${d.id}`, { method: 'PATCH', body: { featured: d.featured } });
  } catch (e: any) {
    d.featured = prev;
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

/* ── drag & drop ── */
const dragIndex = ref<number | null>(null);
const overIndex = ref<number | null>(null);

function onDragStart(index: number, e: DragEvent) {
  dragIndex.value = index;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }
}

function onDragOver(index: number, e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  overIndex.value = index;
}

function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) return;
  const list = [...depoimentos.value];
  const [moved] = list.splice(dragIndex.value, 1);
  list.splice(index, 0, moved);
  depoimentos.value = list;
  dragIndex.value = null;
  overIndex.value = null;
  persistOrder();
}

function onDragEnd() {
  dragIndex.value = null;
  overIndex.value = null;
}

async function persistOrder() {
  saving.value = true;
  try {
    const items = depoimentos.value.map((d, i) => ({ id: d.id, ordem: i }));
    await adminFetch('/api/admin/depoimentos/reorder', { method: 'POST', body: { items } });
    showMessage('Ordem salva', 'success');
  } catch (e: any) {
    showMessage('Erro ao salvar ordem: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Depoimentos</h2>
        <p class="dep-meta">{{ depoimentos.length }} depoimentos</p>
      </div>
      <NuxtLink to="/admin/depoimentos/save" class="btn-add-item">+ Novo depoimento</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="depoimentos.length === 0" class="list-empty">Nenhum depoimento cadastrado.</p>
    <div v-else class="item-list">
      <div
        v-for="(d, i) in depoimentos"
        :key="d.id"
        class="item-row"
        :class="{
          'is-dragging': dragIndex === i,
          'is-over': overIndex === i && dragIndex !== i,
        }"
        draggable="true"
        @dragstart="onDragStart(i, $event)"
        @dragover="onDragOver(i, $event)"
        @drop="onDrop(i)"
        @dragend="onDragEnd"
      >
        <span class="drag-handle" title="Arrastar para reordenar">⠿</span>
        <NuxtLink :to="`/admin/depoimentos/save/${d.id}`" class="link-row">
          <span class="item-title">{{ d.nome }}</span>
        </NuxtLink>
        <span class="item-toggle-label">Destaque</span>
        <label class="switch" :title="d.featured ? 'Remover destaque' : 'Destacar'">
          <input type="checkbox" :checked="!!d.featured" @change="toggleFeatured(d)" />
          <span class="slider" />
        </label>
        <span class="item-meta">{{ '⭐'.repeat(d.rating) }}</span>
        <span class="item-meta item-stars">{{ d.data || '—' }}</span>
        <div class="item-actions">
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteDepoimento(d.id, d.nome)">🗑 Deletar</button>
        </div>
      </div>
    </div>
    <p v-if="saving" class="saving-hint">Salvando ordem...</p>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.drag-handle {
  cursor: grab;
  color: #aaa;
  font-size: 1.2rem;
  padding: 0 0.5rem;
  user-select: none;
  flex-shrink: 0;

  &:active {
    cursor: grabbing;
  }
}

.item-row {
  transition: opacity 0.15s, background 0.15s;

  &.is-dragging {
    opacity: 0.4;
  }

  &.is-over {
    background: color-mix(in srgb, var(--color-accent, #b08a6e) 12%, transparent);
    outline: 2px dashed var(--color-accent, #b08a6e);
    outline-offset: -2px;
  }
}

.saving-hint {
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.5rem;
}
</style>
