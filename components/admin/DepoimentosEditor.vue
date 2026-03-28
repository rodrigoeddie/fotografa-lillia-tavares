<script lang="ts" setup>
interface Review {
  id: number;
  name: string;
  photo: string;
  rating: number;
  date: string;
  link?: string;
  text: string;
  featured?: boolean;
  portfolioLink?: string;
}

interface DepoimentosData {
  title: string;
  description: string;
  reviews: Review[];
}

const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
  portfolioWorks: { label: string; value: string }[];
}>();

const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';
const DEP_PATH = 'depoimentos/index.json';

const depData = ref<DepoimentosData | null>(null);
const depSaving = ref(false);
const depLoading = ref(false);

const depSearch = ref('');
const collapsedDeps = ref<Set<number>>(new Set());
const depDragIdx = ref<number | null>(null);
const depDragOverIdx = ref<number | null>(null);
const avatarUploading = ref<number | null>(null);

function reviewAvatarUrl(review: { id: number; photo?: string }): string {
  if (review.photo && !review.photo.startsWith('http')) {
    return CF_IMG_BASE + review.photo + '/public';
  }
  return `/assets/images/depoimentos/reviewer-${review.id}.jpg`;
}

async function load() {
  depLoading.value = true;
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(DEP_PATH)}`, { params: { _t: Date.now() } });
    depData.value = JSON.parse(res.content);
  } catch (e: any) {
    props.showMessage('Erro ao carregar depoimentos: ' + e.message, 'error');
  } finally {
    depLoading.value = false;
  }
}

async function saveDepoimentos() {
  if (!depData.value) return;
  depSaving.value = true;
  try {
    await $fetch('/api/fs/raw', {
      method: 'POST',
      body: { path: DEP_PATH, content: JSON.stringify(depData.value, null, 2) },
    });
    props.showMessage('Depoimentos salvos!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar: ' + e.message, 'error');
  } finally {
    depSaving.value = false;
  }
}

function addReview() {
  if (!depData.value) return;
  const maxId = depData.value.reviews.reduce((m, r) => Math.max(m, r.id), -1);
  depData.value.reviews.unshift({
    id: maxId + 1,
    name: '',
    photo: '',
    rating: 5,
    date: '',
    link: '',
    text: '',
  });
}

function removeReview(index: number) {
  if (!depData.value) return;
  if (!confirm('Remover este depoimento?')) return;
  depData.value.reviews.splice(index, 1);
}

async function uploadAvatar(file: File, reviewIndex: number) {
  if (!depData.value) return;
  avatarUploading.value = reviewIndex;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await $fetch<any>('/api/upload', { method: 'POST', body: formData });
    if (result.success && result.result) {
      const targetReview = depData.value.reviews[reviewIndex];
      if (targetReview) targetReview.photo = result.result.id;
      props.showMessage('Avatar enviado!', 'success');
    }
  } catch (e: any) {
    const cfErrors = e.data?.data as Array<{ code: number; message: string }> | undefined;
    const detail = Array.isArray(cfErrors) && cfErrors[0]?.message ? cfErrors[0].message : null;
    const fallback = e.data?.statusMessage || e.statusMessage || e.message;
    props.showMessage(detail ? `Upload falhou: ${detail}` : `Erro no upload: ${fallback}`, 'error');
  } finally {
    avatarUploading.value = null;
  }
}

const filteredReviews = computed(() => {
  if (!depData.value) return [];
  const q = depSearch.value.trim().toLowerCase();
  return depData.value.reviews
    .map((review, realIdx) => ({ review, realIdx }))
    .filter(({ review }) =>
      !q || review.name.toLowerCase().includes(q) || review.text.toLowerCase().includes(q)
    );
});

function toggleDepCollapse(id: number) {
  const next = new Set(collapsedDeps.value);
  if (next.has(id)) next.delete(id); else next.add(id);
  collapsedDeps.value = next;
}

function collapseAllDeps() {
  if (!depData.value) return;
  collapsedDeps.value = new Set(depData.value.reviews.map(r => r.id));
}

function expandAllDeps() {
  collapsedDeps.value = new Set();
}

function onDepDragStart(realIdx: number) { depDragIdx.value = realIdx; }
function onDepDragOver(e: DragEvent, realIdx: number) { e.preventDefault(); depDragOverIdx.value = realIdx; }
function onDepDrop() {
  if (depDragIdx.value !== null && depDragOverIdx.value !== null && depData.value) {
    const [moved] = depData.value.reviews.splice(depDragIdx.value, 1);
    if (moved) depData.value.reviews.splice(depDragOverIdx.value, 0, moved);
  }
  depDragIdx.value = null;
  depDragOverIdx.value = null;
}

defineExpose({ load, depData });
</script>

<template>
  <div v-if="depData && !depLoading" class="dep-editor">
    <div class="dep-header">
      <div>
        <h2>Depoimentos</h2>
        <p class="dep-meta">{{ depData.reviews.length }} avaliações</p>
      </div>
      <div class="dep-header-actions">
        <button class="btn-add-review" @click="addReview">+ Novo depoimento</button>
        <button class="btn-save" @click="saveDepoimentos" :disabled="depSaving">
          {{ depSaving ? 'Salvando...' : 'Salvar' }}
        </button>
      </div>
    </div>

    <div class="dep-meta-fields">
      <div class="field">
        <label>Título da seção</label>
        <input v-model="depData.title" type="text" />
      </div>
      <div class="field">
        <label>Descrição da seção</label>
        <textarea v-model="depData.description" rows="2"></textarea>
      </div>
    </div>

    <div class="dep-toolbar">
      <input v-model="depSearch" type="text" class="dep-search" placeholder="🔍 Buscar por nome ou texto..." />
      <button class="btn-dep-ctrl" @click="collapseAllDeps" title="Colapsar todos">⊟ Colapsar</button>
      <button class="btn-dep-ctrl" @click="expandAllDeps" title="Expandir todos">⊞ Expandir</button>
    </div>

    <div class="dep-list" @dragover.prevent @drop.prevent="onDepDrop">
      <div
        v-for="{ review, realIdx } in filteredReviews"
        :key="review.id"
        class="dep-card"
        :class="{ 'dep-drag-over': depDragOverIdx === realIdx }"
        draggable="true"
        @dragstart.self="onDepDragStart(realIdx)"
        @dragover.prevent="(e) => onDepDragOver(e, realIdx)"
      >
        <div class="dep-card-header">
          <span class="dep-drag-handle" title="Arrastar para reordenar">⠿</span>
          <div class="dep-avatar-mini">
            <img :src="reviewAvatarUrl(review)" :alt="review.name" />
          </div>
          <span class="dep-card-name">{{ review.name || '(sem nome)' }}</span>
          <div class="dep-stars">
            <button
              v-for="s in 5" :key="s"
              class="star-btn"
              :class="{ active: s <= review.rating }"
              @click="review.rating = s"
            >★</button>
          </div>
          <button
            class="btn-favorite-dep"
            :class="{ active: review.featured }"
            @click="review.featured = !review.featured"
            :title="review.featured ? 'Remover dos favoritos' : 'Marcar como favorito'"
          >★</button>
          <button
            class="btn-collapse-dep"
            @click="toggleDepCollapse(review.id)"
            :title="collapsedDeps.has(review.id) ? 'Expandir' : 'Colapsar'"
          >{{ collapsedDeps.has(review.id) ? '▸' : '▾' }}</button>
          <button class="btn-remove-review" @click="removeReview(realIdx)" title="Remover">✕</button>
        </div>

        <div v-show="!collapsedDeps.has(review.id)" class="dep-card-body">
          <div class="dep-field-row">
            <div class="field">
              <label>Nome</label>
              <input v-model="review.name" type="text" placeholder="Nome da cliente" />
            </div>
            <div class="field">
              <label>Data</label>
              <input v-model="review.date" type="text" placeholder="Ex: Há 2 semanas" />
            </div>
          </div>
          <div class="dep-field-row">
            <div class="field">
              <label>Foto (avatar)</label>
              <div class="avatar-upload-row">
                <div class="avatar-thumb">
                  <img v-if="avatarUploading !== realIdx" :src="reviewAvatarUrl(review)" :alt="review.name" />
                  <div v-else-if="avatarUploading === realIdx" class="avatar-uploading">⏳</div>
                  <div v-else class="avatar-empty">?</div>
                </div>
                <div class="avatar-actions">
                  <label class="btn-avatar-upload">
                    {{ avatarUploading === realIdx ? 'Enviando...' : '↑ Upload' }}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      :disabled="avatarUploading === realIdx"
                      @change="(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadAvatar(f, realIdx); }"
                    />
                  </label>
                  <input v-model="review.photo" type="text" class="avatar-url-input" placeholder="ou cole o ID CF..." />
                </div>
              </div>
            </div>
            <div class="field">
              <label>Link Google Maps</label>
              <input v-model="review.link" type="text" placeholder="https://maps.app.goo.gl/..." />
            </div>
          </div>
          <div class="field">
            <label>Texto do depoimento</label>
            <textarea v-model="review.text" rows="3" placeholder="Texto..."></textarea>
          </div>
          <div class="field">
            <label>Portfolio vinculado</label>
            <select v-model="review.portfolioLink">
              <option value="">Nenhum</option>
              <option v-for="w in portfolioWorks" :key="w.value" :value="w.value">{{ w.label }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  label { font-size: 13px; color: #aaa; font-weight: 500; }
  input[type="text"], select, textarea {
    background: #222;
    border: 1px solid #444;
    color: #eee;
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 14px;
    &:focus { outline: none; border-color: #666; }
  }
  textarea { resize: vertical; font-family: inherit; }
}

.dep-editor {
  padding: 0 0 40px;
}

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

.dep-header-actions {
  display: flex;
  gap: 8px;
}

.btn-add-review {
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  color: #60a5fa;
  padding: 7px 16px;
  border-radius: 6px;
  flex-shrink: 0;
  font-size: 13px;
  cursor: pointer;
  &:hover { background: #253d55; }
}

.btn-save {
  width: auto;
  padding: 8px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #1d4ed8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.dep-meta-fields {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  .field { flex: 1; }
  textarea { width: 100%; }
}

.dep-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.dep-search {
  flex: 1;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  color: #ccc;
  font-size: 13px;
  padding: 7px 12px;
  &:focus { outline: none; border-color: #444; }
}

.btn-dep-ctrl {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #999;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #252525; color: #ccc; }
}

.dep-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dep-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;
  cursor: default;
  &.dep-drag-over { border-color: #60a5fa; }
}

.dep-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  background: #141414;
  border-bottom: 1px solid #222;
  user-select: none;
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

.dep-avatar-mini {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: #1e2d3d;
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.dep-card-name {
  font-size: 13px;
  font-weight: 500;
  color: #ccc;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-favorite-dep {
  background: none;
  border: none;
  color: #444;
  font-size: 16px;
  cursor: pointer;
  padding: 2px 5px;
  border-radius: 4px;
  line-height: 1;
  transition: color 0.15s;
  &.active { color: #facc15; }
  &:hover { color: #fbbf24; }
}

.btn-collapse-dep {
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1;
  &:hover { background: #222; color: #aaa; }
}

.dep-stars {
  display: flex;
  gap: 2px;
  flex: 1;
}

.star-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #444;
  padding: 0 1px;
  &.active { color: #facc15; }
  &:hover { color: #fbbf24; }
}

.btn-remove-review {
  background: none;
  border: none;
  color: #555;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  &:hover { background: #3a1a1a; color: #f87171; }
}

.dep-card-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.dep-field-row {
  display: flex;
  gap: 12px;
  .field { flex: 1; }
}

.avatar-upload-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;

  .avatar-thumb {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    background: #1e2d3d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #555;
    img { width: 100%; height: 100%; object-fit: cover; }
    .avatar-uploading { font-size: 18px; animation: spin 1s linear infinite; }
    .avatar-empty { color: #444; }
  }

  .avatar-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .btn-avatar-upload {
    display: inline-block;
    cursor: pointer;
    font-size: 11px;
    padding: 4px 10px;
    background: #1e2d3d;
    border: 1px solid #334;
    border-radius: 4px;
    color: #7eb6d4;
    transition: background 0.15s;
    width: fit-content;
    &:hover { background: #243a4e; }
  }

  .avatar-url-input {
    font-size: 10px;
    padding: 4px 6px;
    background: #111;
    border: 1px solid #2a2a2a;
    border-radius: 4px;
    color: #888;
    width: 100%;
    box-sizing: border-box;
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
