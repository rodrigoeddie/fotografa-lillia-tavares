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
        <NuxtLink :to="`/admin/investimento/save/${p.id}`" class="link-row">
          <span class="item-order">{{ i + 1 }}</span>
          <span class="item-slug text-muted">{{ p.slug }}</span>
          <span class="item-title">{{ p.title }}</span>
        </NuxtLink>
        <label class="switch" :title="p.active ? 'Desativar' : 'Ativar'">
          <input type="checkbox" :checked="!!p.active" @change="toggleActive(p)" />
          <span class="slider" />
        </label>
        <div class="item-actions">
          <button class="btn-icon btn-danger" title="Excluir" @click="deleteProduto(p.id, p.title)">🗑 Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
