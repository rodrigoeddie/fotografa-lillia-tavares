<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface CenarioPagina { id: number; slug: string; titulo: string; cenarios: any[]; }

const paginas = ref<CenarioPagina[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    paginas.value = await adminFetch<CenarioPagina[]>('/api/admin/cenarios');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deletePagina(id: number, titulo: string) {
  if (!confirm(`Excluir página de cenários "${titulo}"?`)) return;
  try {
    await adminFetch(`/api/admin/cenarios/${id}`, { method: 'DELETE' });
    showMessage('Página removida', 'success');
    paginas.value = paginas.value.filter((p) => p.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Cenários</h2>
        <p class="dep-meta">{{ paginas.length }} páginas</p>
      </div>
      <NuxtLink to="/admin/cenarios/save" class="btn-add-item">+ Nova página</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="paginas.length === 0" class="list-empty">Nenhuma página de cenários.</p>
    <div v-else class="item-list">
      <div v-for="p in paginas" :key="p.id" class="item-row">
        <span class="item-title">{{ p.titulo }}</span>
        <span class="item-slug">{{ p.slug }}</span>
        <span class="item-badge">{{ p.cenarios?.length ?? 0 }} cenários</span>
        <div class="item-actions">
          <NuxtLink :to="`/admin/cenarios/save/${p.id}`" class="btn-icon">✏️</NuxtLink>
          <button class="btn-icon btn-danger" @click="deletePagina(p.id, p.titulo)">🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
