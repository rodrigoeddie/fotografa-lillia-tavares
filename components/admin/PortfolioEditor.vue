<script lang="ts" setup>
interface AlbumItem {
  imageId: string;
  width: number;
  height: number;
  format: 'retrato' | 'paisagem';
  customClass?: string;
  alt?: string;
  nome?: string;
  ratio?: string;
  instagram?: string;
  canBeThumb?: boolean;
  highlight?: boolean;
  order?: number;
  showAtEnd?: boolean;
  _uploading?: boolean;
}

interface WorkData {
  artigo?: string;
  home?: boolean;
  homeOrder?: number;
  colorHighlight?: string;
  title: string;
  description?: string;
  category?: { slug: string; title: string };
  local?: string;
  date?: string;
  video?: string;
  testimonialId?: number;
  testimonial?: {
    text: string;
    avatar: string;
    link: string;
    rating: number;
    date: string;
    source: string;
  };
  album: AlbumItem[];
}

interface CfImage {
  id: string;
  filename: string;
  uploaded: string;
}

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
}>();

const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';
const ESTUDIO_LINK = `<a href='https://www.fotografalilliatavares.com.br/estudio'>Estúdio Lillia Tavares</a>`;
const DEP_PATH = 'depoimentos/index.json';

const IMAGE_PRESETS: Record<string, { width: number; height: number; format: string; customClass?: string; label: string }> = {
  'paisagem-full': { width: 1700, height: 1134, format: 'paisagem', label: 'Paisagem Full (100%)' },
  'paisagem-w50': { width: 850, height: 567, format: 'paisagem', customClass: 'w50', label: 'Paisagem 50%' },
  'retrato-w33': { width: 567, height: 850, format: 'retrato', customClass: 'w33', label: 'Retrato 33%' },
  'retrato-w50': { width: 850, height: 1275, format: 'retrato', customClass: 'w50', label: 'Retrato 50%' },
  'retrato-w25': { width: 425, height: 637, format: 'retrato', customClass: 'w25', label: 'Retrato 25%' },
};

// State
const categories = ref<{ name: string; path: string; slug: string; title: string }[]>([]);
const works = ref<{ name: string; path: string }[]>([]);
const selectedCategory = ref('');
const selectedWork = ref('');
const workData = ref<WorkData | null>(null);
const saving = ref(false);
const loading = ref(false);
const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Rich editor refs
const descEditorRef = ref<HTMLDivElement | null>(null);
const localEditorRef = ref<HTMLDivElement | null>(null);

// Cloudflare image browser
const cfImages = ref<CfImage[]>([]);
const cfImagesLoading = ref(false);
const cfImagesPage = ref(1);
const cfImagesTotalCount = ref(0);
const cfBrowserOpen = ref(false);
const cfBrowserTarget = ref(-1);
const cfImagesError = ref('');

// Depoimentos (local copy for testimonial selector)
const depData = ref<DepoimentosData | null>(null);

const categoryOptions = computed(() =>
  categories.value.map(c => ({ slug: c.slug, title: c.title }))
);

const pageUrl = computed(() => {
  if (!selectedWork.value) return null;
  const parts = selectedWork.value.split('/');
  if (parts.length < 3) return null;
  const category = parts[1]?.replace(/^\d+\./, '');
  const slug = parts[2]?.replace(/\.json$/, '').replace(/^\d+\./, '');
  return `/ensaio-fotografico/${category}/${slug}`;
});

const highlightItems = computed(() => {
  if (!workData.value) return [];
  return workData.value.album.map((item, index) => ({ ...item, _origIndex: index })).filter(i => i.highlight);
});

const normalItems = computed(() => {
  if (!workData.value) return [];
  return workData.value.album.map((item, index) => ({ ...item, _origIndex: index })).filter(i => !i.highlight);
});

async function loadCategories() {
  try {
    const data = await $fetch<{ name: string; isDirectory: boolean }[]>('/api/files', {
      params: { path: 'ensaio-fotografico' },
    });
    const dirs = data.filter(f => f.isDirectory);
    const cats = await Promise.all(dirs.map(async (f) => {
      const path = `ensaio-fotografico/${f.name}`;
      let title = f.name.replace(/^\d+\./, '');
      try {
        const indexData = await $fetch<{ title?: string }>(`/api/files/${encodeURIComponent(path + '/index.json')}`);
        if (indexData?.title) title = indexData.title;
      } catch { /* fallback */ }
      const slug = f.name.replace(/^\d+\./, '');
      return { name: f.name, path, slug, title };
    }));
    categories.value = cats;
  } catch (e: any) {
    props.showMessage('Erro ao carregar categorias: ' + e.message, 'error');
  }
}

async function loadWorks(categoryPath: string) {
  selectedWork.value = '';
  workData.value = null;
  try {
    const data = await $fetch<{ name: string; isDirectory: boolean }[]>('/api/files', {
      params: { path: categoryPath },
    });
    works.value = data
      .filter(f => !f.isDirectory && f.name.endsWith('.json') && f.name !== 'index.json')
      .map(f => ({ name: f.name, path: `${categoryPath}/${f.name}` }));
  } catch (e: any) {
    props.showMessage('Erro ao carregar trabalhos: ' + e.message, 'error');
  }
}

async function loadWork(workPath: string) {
  loading.value = true;
  try {
    const data = await $fetch<WorkData>(`/api/files/${encodeURIComponent(workPath)}`);
    workData.value = data;
    nextTick(() => {
      if (descEditorRef.value) descEditorRef.value.innerHTML = data.description || '';
      if (localEditorRef.value) localEditorRef.value.innerHTML = data.local || '';
    });
  } catch (e: any) {
    props.showMessage('Erro ao carregar trabalho: ' + e.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function loadDepoimentos() {
  if (depData.value) return;
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(DEP_PATH)}`, { params: { _t: Date.now() } });
    depData.value = JSON.parse(res.content);
  } catch { /* silent — testimonial selector stays empty */ }
}

function syncDescription() {
  if (workData.value && descEditorRef.value)
    workData.value.description = descEditorRef.value.innerHTML;
}

function syncLocal() {
  if (workData.value && localEditorRef.value)
    workData.value.local = localEditorRef.value.innerHTML;
}

function insertEstudioLink() {
  if (localEditorRef.value) {
    localEditorRef.value.innerHTML = ESTUDIO_LINK;
    syncLocal();
  }
}

function execCmd(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

function insertLink(editorRef: HTMLDivElement | null) {
  const url = prompt('URL do link:');
  if (url && editorRef) {
    editorRef.focus();
    document.execCommand('createLink', false, url);
  }
}

async function saveWork() {
  if (!selectedWork.value || !workData.value) return;
  syncDescription();
  syncLocal();
  saving.value = true;
  try {
    const cleanData = JSON.parse(JSON.stringify(workData.value));
    if (cleanData.album) {
      cleanData.album.forEach((item: any) => delete item._uploading);
    }
    await $fetch(`/api/files/${encodeURIComponent(selectedWork.value)}`, {
      method: 'POST',
      body: cleanData,
    });
    props.showMessage('Salvo com sucesso!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar: ' + e.message, 'error');
  } finally {
    saving.value = false;
  }
}

async function uploadImage(file: File, index: number) {
  if (!workData.value) return;
  const albumItem = workData.value.album[index];
  if (!albumItem) return;
  albumItem._uploading = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await $fetch<any>('/api/upload', { method: 'POST', body: formData });
    if (result.success && result.result) {
      albumItem.imageId = result.result.id;
      props.showMessage('Imagem enviada!', 'success');
    }
  } catch (e: any) {
    const cfErrors = e.data?.data as Array<{ code: number; message: string }> | undefined;
    const detail = Array.isArray(cfErrors) && cfErrors[0]?.message ? cfErrors[0].message : null;
    const fallback = e.data?.statusMessage || e.statusMessage || e.message;
    props.showMessage(detail ? `Upload falhou: ${detail}` : `Erro no upload: ${fallback}`, 'error');
  } finally {
    if (workData.value?.album[index]) workData.value.album[index]._uploading = false;
  }
}

async function openCfBrowser(targetIndex: number) {
  cfBrowserTarget.value = targetIndex;
  cfBrowserOpen.value = true;
  if (cfImages.value.length === 0) await loadCfImages(1);
}

async function loadCfImages(page: number) {
  cfImagesLoading.value = true;
  cfImagesError.value = '';
  try {
    const res = await $fetch<{ images: CfImage[]; total_count: number }>('/api/cf-images', {
      params: { page, per_page: 50 },
    });
    cfImages.value = res.images ?? [];
    cfImagesTotalCount.value = res.total_count;
    cfImagesPage.value = page;
    if ((res.images ?? []).length === 0) {
      cfImagesError.value = 'Nenhuma imagem encontrada no Cloudflare.';
    }
  } catch (e: any) {
    cfImages.value = [];
    cfImagesError.value = 'Erro ao carregar imagens: ' + (e.statusMessage || e.message);
  } finally {
    cfImagesLoading.value = false;
  }
}

function selectCfImage(imageId: string) {
  if (!workData.value || cfBrowserTarget.value < 0) return;
  const target = workData.value.album[cfBrowserTarget.value];
  if (!target) return;
  target.imageId = imageId;
  cfBrowserOpen.value = false;
  props.showMessage('Imagem selecionada!', 'success');
}

function addImage(presetKey?: string) {
  if (!workData.value) return;
  const preset = presetKey ? IMAGE_PRESETS[presetKey] : IMAGE_PRESETS['paisagem-full'];
  workData.value.album.push({
    imageId: '',
    width: preset!.width,
    height: preset!.height,
    format: preset!.format as 'retrato' | 'paisagem',
    customClass: preset!.customClass,
    alt: '',
  });
}

function removeImage(index: number) {
  workData.value?.album.splice(index, 1);
}

function applyPreset(index: number, presetKey: string) {
  if (!workData.value) return;
  const preset = IMAGE_PRESETS[presetKey];
  if (!preset) return;
  const item = workData.value.album[index];
  if (!item) return;
  item.width = preset.width;
  item.height = preset.height;
  item.format = preset.format as 'retrato' | 'paisagem';
  item.customClass = preset.customClass;
}

function onCategorySelect(slug: string) {
  if (!workData.value?.category) return;
  if (slug === '__new__') {
    const newTitle = prompt('Nome da nova categoria:');
    if (!newTitle) return;
    const newSlug = newTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    workData.value.category.slug = newSlug;
    workData.value.category.title = newTitle;
    return;
  }
  const cat = categoryOptions.value.find(c => c.slug === slug);
  if (cat) {
    workData.value.category.slug = cat.slug;
    workData.value.category.title = cat.title;
  }
}

function onDragStart(index: number) { dragIndex.value = index; }
function onDragOver(e: DragEvent, index: number) { e.preventDefault(); dragOverIndex.value = index; }
function onDragEnd() {
  if (dragIndex.value !== null && dragOverIndex.value !== null && workData.value) {
    const [moved] = workData.value.album.splice(dragIndex.value, 1);
    if (moved) workData.value.album.splice(dragOverIndex.value, 0, moved);
  }
  dragIndex.value = null;
  dragOverIndex.value = null;
}

function onFileDrop(e: DragEvent, index: number) {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  const file = files && files.length > 0 ? files[0] : null;
  if (file && file.type.startsWith('image/')) uploadImage(file, index);
}

function onFileSelect(e: Event, index: number) {
  const input = e.target as HTMLInputElement;
  const file = input.files && input.files.length > 0 ? input.files[0] : null;
  if (file) uploadImage(file, index);
}

function getGridClass(item: AlbumItem): string {
  if (item.format === 'retrato') {
    if (item.customClass === 'w50') return 'grid-w50 retrato';
    if (item.customClass === 'w25') return 'grid-w25 retrato';
    return 'grid-w33 retrato';
  }
  if (item.customClass === 'w50') return 'grid-w50 paisagem';
  return 'grid-full paisagem';
}

function getPresetKey(item: AlbumItem): string {
  if (item.format === 'paisagem' && !item.customClass) return 'paisagem-full';
  if (item.format === 'paisagem' && item.customClass === 'w50') return 'paisagem-w50';
  if (item.format === 'retrato' && item.customClass === 'w50') return 'retrato-w50';
  if (item.format === 'retrato' && item.customClass === 'w25') return 'retrato-w25';
  return 'retrato-w33';
}

function selectTestimonial(reviewId: string) {
  if (!workData.value) return;
  if (!reviewId) {
    workData.value.testimonialId = undefined;
    workData.value.testimonial = undefined;
    return;
  }
  const id = parseInt(reviewId);
  const review = depData.value?.reviews.find(r => r.id === id);
  if (!review) return;
  workData.value.testimonialId = id;
  workData.value.testimonial = {
    text: review.text,
    avatar: review.photo || '',
    link: review.link || '',
    rating: review.rating,
    date: review.date,
    source: 'Google Maps',
  };
}

async function openWork(filePath: string) {
  const parts = filePath.split('/');
  const categoryPath = `${parts[0]}/${parts[1]}`;

  if (!depData.value) loadDepoimentos();

  if (selectedCategory.value !== categoryPath) {
    selectedCategory.value = categoryPath;
    await loadWorks(categoryPath);
  }

  selectedWork.value = filePath;
  await nextTick();
  document.querySelector('.portfolio-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

watch(selectedCategory, (val) => { if (val) loadWorks(val); });
watch(selectedWork, (val) => { if (val) loadWork(val); });

onMounted(() => {
  loadCategories();
});

defineExpose({ openWork, selectedWork });
</script>

<template>
  <div v-if="workData && !loading" class="portfolio-editor editor">
    <!-- Sidebar -->
    <div class="editor-sidebar">
      <h2>Dados gerais</h2>

      <div class="field">
        <label>Título</label>
        <input v-model="workData.title" type="text" />
      </div>

      <div class="field">
        <label>Artigo (o/a)</label>
        <select v-model="workData.artigo">
          <option value="o">o</option>
          <option value="a">a</option>
        </select>
      </div>

      <div class="field">
        <label>Cor destaque</label>
        <div class="color-field">
          <input v-model="workData.colorHighlight" type="color" />
          <input v-model="workData.colorHighlight" type="text" class="color-text" />
        </div>
      </div>

      <!-- Rich Description Editor -->
      <div class="field">
        <label>Descrição</label>
        <div class="rich-toolbar">
          <button type="button" @click="execCmd('bold')" title="Negrito"><b>B</b></button>
          <button type="button" @click="execCmd('italic')" title="Itálico"><i>I</i></button>
          <button type="button" @click="insertLink(descEditorRef)" title="Link">🔗</button>
        </div>
        <div ref="descEditorRef" class="rich-editor" contenteditable="true" @input="syncDescription"></div>
      </div>

      <!-- Rich Local Editor -->
      <div class="field">
        <label>Local</label>
        <div class="rich-toolbar">
          <button type="button" @click="execCmd('bold')" title="Negrito"><b>B</b></button>
          <button type="button" @click="insertLink(localEditorRef)" title="Link">🔗</button>
          <button type="button" class="btn-estudio" @click="insertEstudioLink" title="Inserir link do Estúdio">📍 Estúdio</button>
        </div>
        <div ref="localEditorRef" class="rich-editor rich-editor-single" contenteditable="true" @input="syncLocal"></div>
      </div>

      <!-- Category select -->
      <div class="field">
        <label>Categoria</label>
        <select :value="workData.category?.slug" @change="onCategorySelect(($event.target as HTMLSelectElement).value)">
          <option v-for="cat in categoryOptions" :key="cat.slug" :value="cat.slug">{{ cat.title }}</option>
          <option value="__new__">+ Nova categoria...</option>
        </select>
        <input v-model="workData.category!.title" type="text" placeholder="Label da categoria" class="mt-4" />
      </div>

      <!-- Home switch -->
      <div class="field">
        <div class="switch-row">
          <span>Mostrar na Home</span>
          <label class="switch">
            <input type="checkbox" v-model="workData.home" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <div class="field" v-if="workData.home">
        <label>Ordem na Home</label>
        <input v-model.number="workData.homeOrder" type="number" min="1" />
      </div>

      <!-- Testimonial selector -->
      <div class="field testimonial-field">
        <label>Depoimento associado</label>
        <select
          :value="workData.testimonialId ?? ''"
          @change="selectTestimonial(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Nenhum</option>
          <option
            v-for="r in (depData?.reviews ?? [])"
            :key="r.id"
            :value="r.id"
          >{{ r.name }}</option>
        </select>
        <div v-if="workData.testimonial" class="testimonial-preview">
          <img v-if="workData.testimonial.avatar" :src="CF_IMG_BASE + workData.testimonial.avatar + '/public'" :alt="depData?.reviews.find(r => r.id === workData!.testimonialId)?.name" />
          <div class="testimonial-preview-body">
            <span class="testimonial-stars">{{ '★'.repeat(workData.testimonial.rating) }}</span>
            <p class="testimonial-text">{{ workData.testimonial.text.slice(0, 100) }}{{ workData.testimonial.text.length > 100 ? '…' : '' }}</p>
          </div>
        </div>
      </div>

      <button class="btn-save" @click="saveWork" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar' }}
      </button>

      <NuxtLink v-if="pageUrl" :to="pageUrl" target="_blank" class="btn-view-page">
        🔗 Ver página
      </NuxtLink>
    </div>

    <!-- Main content -->
    <div class="editor-main">
      <!-- Highlight / Hero section -->
      <div v-if="highlightItems.length > 0" class="section-label">
        <span class="badge badge-highlight">★ DESTAQUE / HERO</span>
      </div>
      <div v-if="highlightItems.length > 0" class="album-grid-preview highlight-zone">
        <div v-for="hi in highlightItems" :key="hi._origIndex" :class="['album-item is-highlight', getGridClass(hi)]">
          <div class="image-zone">
            <img v-if="hi.imageId" :src="CF_IMG_BASE + hi.imageId + '/public'" :alt="hi.alt" loading="lazy" />
            <div v-else class="empty-slot"><span>Sem imagem</span></div>
          </div>
        </div>
      </div>

      <!-- Album header -->
      <div class="album-header">
        <h2>Álbum ({{ workData.album?.length || 0 }} fotos)</h2>
      </div>

      <!-- Album grid -->
      <div class="album-grid-preview">
        <div
          v-for="(item, index) in workData.album"
          :key="index"
          :class="['album-item', getGridClass(item), { 'drag-over': dragOverIndex === index, 'is-highlight': item.highlight }]"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover="(e) => onDragOver(e, index)"
          @dragend="onDragEnd">
          <div class="image-zone" @drop.prevent.stop="(e) => onFileDrop(e, index)" @dragover.prevent>
            <div v-if="item._uploading" class="uploading">Enviando...</div>
            <img v-else-if="item.imageId" :src="CF_IMG_BASE + item.imageId + '/public'" :alt="item.alt" loading="lazy" />
            <div v-else class="empty-slot">
              <span>Arraste uma imagem aqui</span>
              <span class="or">ou</span>
              <label class="file-label">
                Selecionar arquivo
                <input type="file" accept="image/*" @change="(e) => onFileSelect(e, index)" hidden />
              </label>
              <button class="btn-browse" @click="openCfBrowser(index)">Buscar no Cloudflare</button>
            </div>
            <div v-if="item.imageId && !item._uploading" class="image-actions">
              <label class="action-btn">
                ↑ Upload
                <input type="file" accept="image/*" @change="(e) => onFileSelect(e, index)" hidden />
              </label>
              <button class="action-btn" @click="openCfBrowser(index)">☁ Cloudflare</button>
            </div>
          </div>
          <div class="item-controls">
            <select :value="getPresetKey(item)" @change="applyPreset(index, ($event.target as HTMLSelectElement).value)">
              <option v-for="(preset, key) in IMAGE_PRESETS" :key="key" :value="key">{{ preset.label }}</option>
            </select>
            <input v-model="item.alt" type="text" placeholder="Alt text" class="alt-input" />
            <div class="flags">
              <label class="switch-mini" :class="{ active: item.canBeThumb }">
                <input type="checkbox" v-model="item.canBeThumb" />
                <span class="slider-mini"></span>
                <span class="switch-label">Thumb</span>
              </label>
              <label class="switch-mini" :class="{ active: item.highlight }">
                <input type="checkbox" v-model="item.highlight" />
                <span class="slider-mini"></span>
                <span class="switch-label">Destaque</span>
              </label>
            </div>
            <div class="size-info">{{ item.width }}×{{ item.height }} · {{ item.format }}{{ item.customClass ? ' · ' + item.customClass : '' }}</div>
            <button class="btn-remove" @click="removeImage(index)" title="Remover">✕</button>
          </div>
        </div>
      </div>

      <div class="album-footer">
        <div class="add-buttons">
          <button v-for="(preset, key) in IMAGE_PRESETS" :key="key" class="btn-add" @click="addImage(key as string)">+ {{ preset.label }}</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Cloudflare Image Browser Modal -->
  <Teleport to="body">
    <div v-if="cfBrowserOpen" class="modal-overlay" @click.self="cfBrowserOpen = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Selecionar imagem do Cloudflare</h3>
          <button class="modal-close" @click="cfBrowserOpen = false">✕</button>
        </div>
        <div v-if="cfImagesLoading" class="loading">Carregando imagens...</div>
        <div v-else-if="cfImagesError" class="cf-error">
          <p>{{ cfImagesError }}</p>
          <button class="cf-retry-btn" @click="loadCfImages(cfImagesPage)">Tentar novamente</button>
        </div>
        <div v-else class="cf-grid">
          <div v-for="img in cfImages" :key="img.id" class="cf-item" @click="selectCfImage(img.id)">
            <img :src="CF_IMG_BASE + img.id + '/public'" loading="lazy" />
            <span class="cf-filename">{{ img.filename || img.id.slice(0, 8) }}</span>
          </div>
        </div>
        <div v-if="cfImagesTotalCount > 50" class="modal-pagination">
          <button :disabled="cfImagesPage <= 1" @click="loadCfImages(cfImagesPage - 1)">← Anterior</button>
          <span>Página {{ cfImagesPage }} ({{ cfImagesTotalCount }} imagens)</span>
          <button :disabled="cfImages.length < 50" @click="loadCfImages(cfImagesPage + 1)">Próxima →</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
* { box-sizing: border-box; }

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  label { font-size: 13px; color: #aaa; font-weight: 500; }
  input[type="text"], input[type="number"], select, textarea {
    background: #222;
    border: 1px solid #444;
    color: #eee;
    padding: 8px 10px;
    border-radius: 4px;
    font-size: 14px;
    &:focus { outline: none; border-color: #666; }
  }
  textarea { resize: vertical; font-family: inherit; }
  .mt-4 { margin-top: 4px; }
}

.color-field {
  display: flex; gap: 8px; align-items: center;
  input[type="color"] { width: 40px; height: 34px; padding: 2px; border: 1px solid #444; background: #222; border-radius: 4px; cursor: pointer; }
  .color-text { flex: 1; }
}

/* Rich Editor */
.rich-toolbar {
  display: flex; gap: 4px; margin-bottom: 4px;
  button {
    background: #333; border: 1px solid #555; color: #ddd; padding: 4px 10px; border-radius: 3px; cursor: pointer; font-size: 13px;
    &:hover { background: #444; }
  }
  .btn-estudio { font-size: 11px; padding: 4px 8px; }
}

.rich-editor {
  background: #222;
  border: 1px solid #444;
  color: #eee;
  padding: 8px 10px;
  border-radius: 4px;
  min-height: 60px;
  font-size: 14px;
  line-height: 1.5;
  &:focus { outline: none; border-color: #666; }
  a { color: #60a5fa; text-decoration: underline; }
  b, strong { font-weight: 700; }
  &.rich-editor-single { min-height: 36px; }
}

/* Switch Toggles */
.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  color: #aaa;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; cursor: pointer; inset: 0; background: #444; border-radius: 24px; transition: 0.2s;
    &::before { content: ''; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
  }
  input:checked + .slider { background: #2563eb; }
  input:checked + .slider::before { transform: translateX(20px); }
}

.switch-mini {
  display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 11px; color: #666;
  input { opacity: 0; width: 0; height: 0; position: absolute; }
  .slider-mini {
    position: relative; display: inline-block; width: 28px; height: 16px; background: #444; border-radius: 16px; transition: 0.2s; flex-shrink: 0;
    &::before { content: ''; position: absolute; height: 12px; width: 12px; left: 2px; bottom: 2px; background: #888; border-radius: 50%; transition: 0.2s; }
  }
  &.active {
    color: #4ade80;
    .slider-mini { background: #166534; &::before { transform: translateX(12px); background: #4ade80; } }
  }
  .switch-label { white-space: nowrap; }
}

.loading { text-align: center; padding: 40px; color: #888; }

/* Testimonial selector */
.testimonial-field {
  select { width: 100%; }
}
.testimonial-preview {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 8px;
  background: #141414;
  border: 1px solid #222;
  border-radius: 6px;
  padding: 10px;
  img {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
  .testimonial-info { flex: 1; min-width: 0; }
  .testimonial-name { font-size: 12px; font-weight: 600; color: #ccc; }
  .testimonial-stars { font-size: 12px; color: #facc15; margin: 2px 0; }
  .testimonial-text {
    font-size: 11px;
    color: #666;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

/* Portfolio editor layout */
.portfolio-editor.editor { display: flex; gap: 24px; }

.editor-sidebar {
  width: 320px;
  flex-shrink: 0;
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #333;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  h2 { font-size: 16px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 1px solid #333; }
}

.editor-main { flex: 1; min-width: 0; }

.section-label { margin-bottom: 8px; }

.badge {
  display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
}

.badge-highlight { background: #422006; color: #fbbf24; border: 1px solid #92400e; }

.highlight-zone {
  margin-bottom: 24px;
  border: 2px solid #92400e;
  border-radius: 8px;
  padding: 4px;
  background: #1a1206;
}

.is-highlight { border-color: #92400e !important; box-shadow: 0 0 0 1px #92400e; }

.album-header {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  h2 { font-size: 18px; }
}
.album-footer {
  display: flex; justify-content: space-between; align-items: flex-start; margin-top: 20px; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
  h2 { font-size: 18px; }
}

.add-buttons { display: flex; flex-wrap: wrap; gap: 6px; }

.btn-add {
  background: #1a2a1a; color: #4ade80; border: 1px solid #166534; padding: 6px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; white-space: nowrap;
  &:hover { background: #1f3a1f; }
}

.btn-save {
  width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 15px; font-weight: 600; cursor: pointer;
  &:hover { background: #1d4ed8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

.btn-view-page {
  display: block;
  width: 100%;
  padding: 10px 12px;
  background: #1a2a1a;
  color: #4ade80;
  border: 1px solid #166534;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  margin-top: 8px;
  &:hover { background: #1f3a1f; }
}

.album-grid-preview { display: flex; flex-wrap: wrap; gap: 4px; }

.album-item {
  background: #1a1a1a; border: 2px solid #333; border-radius: 6px; overflow: hidden; transition: border-color 0.2s; position: relative;
  &.drag-over { border-color: #2563eb; }
  &:hover { border-color: #555; }
  &.grid-full { width: 100%; }
  &.grid-w50 { width: calc(50% - 2px); }
  &.grid-w33 { width: calc(33.333% - 3px); }
  &.grid-w25 { width: calc(25% - 3px); }
  &.retrato .image-zone { aspect-ratio: 2/3; }
  &.paisagem .image-zone { aspect-ratio: 3/2; }
}

.image-zone {
  width: 100%; position: relative; overflow: hidden; background: #0a0a0a; display: flex; align-items: center; justify-content: center;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}

.image-actions {
  position: absolute; bottom: 0; left: 0; right: 0; display: flex; gap: 2px; opacity: 0; transition: opacity 0.2s; background: linear-gradient(transparent, rgba(0,0,0,0.8)); padding: 20px 6px 6px;
  .image-zone:hover & { opacity: 1; }
}

.action-btn {
  flex: 1; background: rgba(255,255,255,0.15); backdrop-filter: blur(4px); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 5px 8px; border-radius: 4px; font-size: 11px; cursor: pointer; text-align: center;
  &:hover { background: rgba(255,255,255,0.25); }
}

.empty-slot {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 20px; color: #666; font-size: 13px; text-align: center; width: 100%; height: 100%; border: 2px dashed #333;
  .or { font-size: 11px; color: #444; }
}

.file-label {
  background: #333; color: #ccc; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 12px;
  &:hover { background: #444; }
}

.btn-browse {
  background: #1a2a3a; color: #60a5fa; border: 1px solid #1e40af; padding: 6px 14px; border-radius: 4px; font-size: 12px; cursor: pointer;
  &:hover { background: #1e3a5a; }
}

.uploading { color: #facc15; font-size: 14px; font-weight: 500; }

.item-controls {
  padding: 8px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; background: #151515;
  select { background: #222; border: 1px solid #444; color: #eee; padding: 4px 6px; border-radius: 3px; font-size: 11px; }
  .alt-input { flex: 1; min-width: 80px; background: #222; border: 1px solid #444; color: #eee; padding: 4px 6px; border-radius: 3px; font-size: 11px; }
  .flags { display: flex; gap: 10px; }
  .size-info { font-size: 10px; color: #555; font-family: monospace; }
}

.btn-remove {
  background: #3a1a1a; color: #f87171; border: 1px solid #7f1d1d; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; margin-left: auto;
  &:hover { background: #5a1a1a; }
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;
}

.modal-content {
  background: #1a1a1a; border: 1px solid #333; border-radius: 12px; width: 90vw; max-width: 1000px; max-height: 80vh; overflow-y: auto; padding: 24px;
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 18px; color: #eee; }
}

.modal-close {
  background: #333; border: none; color: #eee; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px;
  &:hover { background: #444; }
}

.cf-error {
  padding: 24px; text-align: center; color: #f87171; font-size: 14px; background: #3a1a1a; border: 1px solid #7f1d1d; border-radius: 6px;
  p { margin-bottom: 12px; }
}

.cf-retry-btn {
  background: #333; border: 1px solid #555; color: #eee; padding: 6px 16px; border-radius: 4px; cursor: pointer; font-size: 13px;
  &:hover { background: #444; }
}

.cf-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;
}

.cf-item {
  cursor: pointer; border: 2px solid #333; border-radius: 6px; overflow: hidden; transition: border-color 0.2s;
  &:hover { border-color: #2563eb; }
  img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
  .cf-filename { display: block; padding: 4px 6px; font-size: 10px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: #151515; }
}

.modal-pagination {
  display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 16px; font-size: 13px; color: #888;
  button {
    background: #333; border: 1px solid #555; color: #eee; padding: 6px 14px; border-radius: 4px; cursor: pointer;
    &:hover { background: #444; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  }
}

@media (max-width: 900px) {
  .portfolio-editor.editor { flex-direction: column; }
  .editor-sidebar { width: 100%; position: static; max-height: none; }
  .album-item {
    &.grid-w33, &.grid-w25 { width: calc(50% - 2px); }
  }
}
</style>
