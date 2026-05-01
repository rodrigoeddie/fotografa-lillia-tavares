<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface FaqCat { id: number; titulo: string; slug: string; perguntas: any[]; }

const categorias = ref<FaqCat[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    categorias.value = await adminFetch<FaqCat[]>('/api/admin/faq');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteCategoria(id: number, titulo: string) {
  if (!confirm(`Excluir categoria "${titulo}" e todas as perguntas?`)) return;
  try {
    await adminFetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    showMessage('Categoria removida', 'success');
    categorias.value = categorias.value.filter((c) => c.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

// ─── Drag to reorder ─────────────────────────────────────────────────────────
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);

function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
function onDragEnd() {
  if (dragIdx.value !== null && dragOverIdx.value !== null && dragIdx.value !== dragOverIdx.value) {
    const [moved] = categorias.value.splice(dragIdx.value, 1);
    if (moved) categorias.value.splice(dragOverIdx.value, 0, moved);
    persistOrder();
  }
  dragIdx.value = null;
  dragOverIdx.value = null;
}

async function persistOrder() {
  try {
    await adminFetch('/api/admin/faq', {
      method: 'PATCH',
      body: categorias.value.map((c, i) => ({ id: c.id, ordem: i + 1 })),
    });
  } catch (e: any) {
    showMessage('Erro ao salvar ordem: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>FAQ</h2>
        <p class="dep-meta">{{ categorias.length }} categorias</p>
      </div>
      <NuxtLink to="/admin/faq/save" class="btn-add-item">+ Nova categoria</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="categorias.length === 0" class="list-empty">Nenhuma categoria cadastrada.</p>
    <div v-else class="item-list">
      <div
        v-for="(c, i) in categorias"
        :key="c.id"
        class="item-row"
        :class="{ 'drag-over': dragOverIdx === i }"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover="(e) => onDragOver(e, i)"
        @dragend="onDragEnd"
      >
        <span class="dep-drag-handle">⠿</span>
        <NuxtLink :to="`/admin/faq/save/${c.id}`" class="link-row">
          <span class="item-title">{{ c.titulo }}</span>
          <span class="item-slug">{{ c.slug }}</span>
          <span class="item-badge">{{ c.perguntas?.length ?? 0 }} perguntas</span>
        </NuxtLink>
        <div class="item-actions">
          <button class="btn-icon btn-danger" @click="deleteCategoria(c.id, c.titulo)">🗑 Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
