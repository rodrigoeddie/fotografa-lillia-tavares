<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface LandingPage {
  id: number;
  slug: string;
  rota: string;
  titulo: string;
  ativo: number;
  ordem: number;
}

const lps = ref<LandingPage[]>([]);
const loading = ref(false);
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);

async function load() {
  loading.value = true;
  try {
    const data = await adminFetch<LandingPage[]>('/api/admin/landing-pages');
    lps.value = [...data].sort((a, b) => a.ordem - b.ordem);
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function deleteLp(id: number, titulo: string) {
  if (!confirm(`Excluir landing page "${titulo}"? Os blocos associados também serão removidos.`)) return;
  try {
    await adminFetch(`/api/admin/landing-pages/${id}`, { method: 'DELETE' });
    showMessage('Landing page removida', 'success');
    lps.value = lps.value.filter((l) => l.id !== id);
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function toggleAtivo(lp: LandingPage) {
  const prev = lp.ativo;
  lp.ativo = prev ? 0 : 1;
  try {
    await adminFetch(`/api/admin/landing-pages/${lp.id}`, {
      method: 'PUT',
      body: {
        slug: lp.slug,
        rota: lp.rota,
        titulo: lp.titulo,
        ativo: !!lp.ativo,
        ordem: lp.ordem,
      },
    });
  } catch (e: any) {
    lp.ativo = prev;
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
async function onDrop() {
  if (dragIdx.value === null || dragOverIdx.value === null || dragIdx.value === dragOverIdx.value) {
    dragIdx.value = null; dragOverIdx.value = null; return;
  }
  const list = [...lps.value];
  const [moved] = list.splice(dragIdx.value, 1);
  if (moved) list.splice(dragOverIdx.value, 0, moved);
  lps.value = list;
  dragIdx.value = null; dragOverIdx.value = null;

  await Promise.all(
    lps.value.map((l, idx) =>
      adminFetch(`/api/admin/landing-pages/${l.id}`, { method: 'PATCH', body: { ordem: idx } }).catch(() => null)
    )
  );
  lps.value.forEach((l, idx) => { l.ordem = idx; });
}

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Landing Pages</h2>
        <p class="dep-meta">{{ lps.length }} landing page(s)</p>
      </div>
      <NuxtLink to="/admin/landing-pages/save" class="btn-add-item">+ Nova LP</NuxtLink>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="lps.length === 0" class="list-empty">Nenhuma landing page cadastrada.</p>
    <div v-else class="item-list" @dragover.prevent @drop.prevent="onDrop">
      <div
        v-for="(lp, i) in lps"
        :key="lp.id"
        class="item-row"
        :class="{ 'item-drag-over': dragOverIdx === i }"
        draggable="true"
        @dragstart="onDragStart(i)"
        @dragover.prevent="(e) => onDragOver(e, i)"
      >
        <span class="dep-drag-handle" title="Arrastar para reordenar">⠿</span>
        <NuxtLink :to="`/admin/landing-pages/save/${lp.id}`" class="link-row" title="Editar">
          <span class="item-order">{{ i + 1 }}</span>
          <span class="item-title">{{ lp.titulo }}</span>
          <span class="item-slug">{{ lp.slug }}</span>
          <span class="item-meta">{{ lp.rota }}</span>
        </NuxtLink>
        <span class="row">
          <span class="item-toggle-label">Ativo</span>
          <label class="switch" :title="lp.ativo ? 'Desativar' : 'Ativar'">
            <input type="checkbox" :checked="!!lp.ativo" @change="toggleAtivo(lp)" />
            <span class="slider"></span>
          </label>
        </span>
        <div class="item-actions">
          <a :href="lp.rota" target="_blank" class="btn-icon" title="Ver no site"><span class="material-symbols-outlined">open_in_new</span></a>
          <button class="btn-icon btn-danger" @click="deleteLp(lp.id, lp.titulo)"><span class="material-symbols-outlined">delete</span> Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
