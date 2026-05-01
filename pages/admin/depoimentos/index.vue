<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface Depoimento { id: number; nome: string; rating: number; featured: number; data: string; }

const depoimentos = ref<Depoimento[]>([]);
const loading = ref(false);

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
      <div v-for="d in depoimentos" :key="d.id" class="item-row">
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
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
