<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface PortfolioWork { id: number; slug: string; titulo: string; categoria: string; ativo: number; home: number; }

const works = ref<PortfolioWork[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    works.value = await adminFetch<PortfolioWork[]>('/api/admin/portfolio');
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

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h2>Portfolio <span class="count-badge">{{ works.length }}</span></h2>
      <NuxtLink to="/admin/portfolio/save" class="btn-primary">+ Novo work</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else-if="works.length === 0" class="empty-hint">Nenhum portfolio cadastrado.</div>
    <table v-else class="data-table">
      <thead><tr><th>Título</th><th>Categoria</th><th>Home</th><th>Ativo</th><th></th></tr></thead>
      <tbody>
        <tr v-for="w in works" :key="w.id">
          <td>{{ w.titulo || w.slug }}</td>
          <td class="text-muted">{{ w.categoria }}</td>
          <td>
            <label class="switch" :title="w.home ? 'Remover da home' : 'Exibir na home'">
              <input type="checkbox" :checked="!!w.home" @change="toggleField(w, 'home')" />
              <span class="slider" />
            </label>
          </td>
          <td>
            <label class="switch" :title="w.ativo ? 'Desativar' : 'Ativar'">
              <input type="checkbox" :checked="!!w.ativo" @change="toggleField(w, 'ativo')" />
              <span class="slider" />
            </label>
          </td>
          <td class="actions-cell">
            <NuxtLink :to="`/admin/portfolio/${w.id}/fotos`" class="btn-icon" title="Fotos">🖼</NuxtLink>
            <NuxtLink :to="`/admin/portfolio/save/${w.id}`" class="btn-icon" title="Editar">✏️</NuxtLink>
            <button class="btn-icon btn-danger" @click="deleteWork(w.id, w.titulo || w.slug)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.switch {
  position: relative; display: inline-block; width: 36px; height: 20px;
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
