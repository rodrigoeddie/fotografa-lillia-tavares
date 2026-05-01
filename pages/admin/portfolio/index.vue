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
        <NuxtLink :to="`/admin/portfolio/save/${w.id}`" class="link-row" title="Editar">
          <span class="item-order">{{ i + 1 }}</span>
          <span class="item-title">{{ w.titulo || w.slug }}</span>
          <span class="item-categoria">{{ w.categoria }}</span>
        </NuxtLink>
        <span class="row">
        <span class="item-toggle-label">Home</span>
        <label class="switch" :title="w.home ? 'Remover da home' : 'Exibir na home'">
          <input type="checkbox" :checked="!!w.home" @change="toggleField(w, 'home')" />
          <span class="slider"></span>
        </label>
        </span>
        <span class="row">
        <span class="item-toggle-label">Ativo</span>
        <label class="switch" :title="w.ativo ? 'Desativar' : 'Ativar'">
          <input type="checkbox" :checked="!!w.ativo" @change="toggleField(w, 'ativo')" />
          <span class="slider"></span>
        </label>
        </span>
        <div class="item-actions">
          <NuxtLink :to="`/admin/portfolio/${w.id}/fotos`" class="btn-icon" title="Fotos">🖼 Fotos</NuxtLink>
          <button class="btn-icon btn-danger" @click="deleteWork(w.id, w.titulo || w.slug)">🗑 Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
