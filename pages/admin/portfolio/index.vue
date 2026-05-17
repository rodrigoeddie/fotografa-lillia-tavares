<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const { showConfirm } = useDialog();

const CF_IMG = 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/';

interface ThumbPhoto { id: number; cf_image_id: string; width?: number | null; height?: number | null; }
interface PortfolioWork { id: number; slug: string; titulo: string; categoria: string; ativo: number; home: number; ordem: number; thumb_photos: ThumbPhoto[]; }
interface Categoria { id: number; slug: string; titulo: string; }

const works = ref<PortfolioWork[]>([]);
const categorias = ref<Categoria[]>([]);
const loading = ref(false);
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);
const filterCategoria = ref('');

const filteredWorks = computed(() =>
  filterCategoria.value
    ? works.value.filter((w) => w.categoria === filterCategoria.value)
    : works.value
);

async function load() {
  loading.value = true;
  try {
    const [data, cats] = await Promise.all([
      adminFetch<PortfolioWork[]>('/api/admin/portfolio'),
      adminFetch<Categoria[]>('/api/admin/portfolio/categorias'),
    ]);
    works.value = [...data].sort((a, b) => a.ordem - b.ordem);
    categorias.value = cats;
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function categoriaLabel(slug: string) {
  return categorias.value.find((c) => c.slug === slug)?.titulo ?? slug;
}

async function deleteWork(id: number, titulo: string) {
  const confirmed = await showConfirm(`Excluir "${titulo}"?`, 'Confirmar exclusão', 'Sim, excluir');
  if (!confirmed) return;
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

async function toggleThumb(w: PortfolioWork, foto: ThumbPhoto) {
  try {
    await adminFetch(`/api/admin/portfolio/${w.id}/fotos`, {
      method: 'PATCH',
      body: { foto_id: foto.id, can_be_thumb: false },
    });
    w.thumb_photos = w.thumb_photos.filter((f) => f.id !== foto.id);
  } catch (e: any) {
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
        <p class="dep-meta">{{ filteredWorks.length }} trabalhos<span v-if="filterCategoria"> na categoria selecionada</span></p>
      </div>
      <div class="header-actions">
        <NuxtLink to="/admin/portfolio/categorias" class="btn-add-item btn-category"><span class="material-symbols-outlined"> category </span> Categorias</NuxtLink>
        <NuxtLink to="/admin/portfolio/save" class="btn-add-item"><span class="material-symbols-outlined"> add_2 </span> Novo work</NuxtLink>
      </div>
    </div>

    <!-- Filtro por categoria -->
    <div v-if="categorias.length" class="filter-bar">
      <span class="filter-label">Categoria:</span>
      <button
        :class="['filter-btn', filterCategoria === '' ? 'active' : '']"
        @click="filterCategoria = ''"
      >Todas</button>
      <button
        v-for="cat in categorias"
        :key="cat.id"
        :class="['filter-btn', filterCategoria === cat.slug ? 'active' : '']"
        @click="filterCategoria = cat.slug"
      >{{ cat.titulo }}</button>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="filteredWorks.length === 0" class="list-empty">Nenhum portfolio encontrado.</p>
    <div v-else class="item-list" @dragover.prevent @drop.prevent="onDrop">
      <div
        v-for="(w, i) in filteredWorks"
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
          <span class="item-title">
            {{ w.titulo || w.slug }}
            <br>
            <span class="item-categoria">{{ categoriaLabel(w.categoria) }}</span>
          </span>

          <span v-if="w.thumb_photos?.length" class="item-thumbs">
            <span v-for="foto in w.thumb_photos" :key="foto.id" class="item-thumb-wrap">
              <img
                :src="`${CF_IMG}${foto.cf_image_id}/w=200`"
                class="item-thumb"
                :class="foto.width && foto.height ? (foto.height > foto.width ? 'portrait' : 'landscape') : ''"
                :style="foto.width && foto.height ? { aspectRatio: `${foto.width}/${foto.height}` } : {}"
                alt=""
              />
              <button class="btn-thumb-remove" title="Remover thumb" @click.prevent="toggleThumb(w, foto)">✕</button>
            </span>
          </span>
          <span v-else class="item-thumb item-thumb--empty"></span>
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
          <NuxtLink :to="`/admin/portfolio/${w.id}/fotos`" class="btn-icon btn-fotos" title="Fotos"><span class="material-symbols-outlined">camera_alt</span> Fotos</NuxtLink>
          <button class="btn-icon btn-danger" @click="deleteWork(w.id, w.titulo || w.slug)"><span class="material-symbols-outlined">delete</span> Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;


.item-title {
  width: 150px;
  flex: none;
}

.item-thumbs {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.item-thumb-wrap {
  position: relative;
  flex-shrink: 0;
}

.item-thumb {
  width: 80px;
  height: auto;
  display: block;
  object-fit: cover;
  border-radius: 4px;
  &.landscape { width: 181px; }

  &--empty {
    width: 80px;
    height: 80px;
    display: inline-block;
    background: #2a2a2a;
    border-radius: 4px;
  }
}

.btn-thumb-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  line-height: 1;
  padding: 2px 4px;
  cursor: pointer;

  &:hover { background: #c0392b; }
}
</style>
