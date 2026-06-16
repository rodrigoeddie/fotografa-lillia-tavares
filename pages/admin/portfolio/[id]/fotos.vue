<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

const id = computed(() => Number(route.params.id));
const cfImg = useCfImg();

interface PortfolioFoto {
  id?: number;
  cf_image_id: string;
  width: number | null;
  height: number | null;
  formato: string;
  custom_class: string;
  alt: string;
  highlight: boolean;
  can_be_thumb: boolean;
  ordem: number;
}

const work = ref<any>(null);
const fotos = ref<PortfolioFoto[]>([]);
const loading = ref(false);
const saving = ref(false);

// ─── Image presets (mirrors Legacy.vue IMAGE_PRESETS) ─────────────────────
const IMAGE_PRESETS: Record<string, { width: number; height: number; format: string; customClass: string; label: string }> = {
  'retrato-w33':   { width: 567,  height: 850,  format: 'retrato',  customClass: '',     label: 'Retrato 33%' },
  'retrato-w50':   { width: 850,  height: 1275, format: 'retrato',  customClass: 'w50',  label: 'Retrato 50%' },
  'retrato-w25':   { width: 425,  height: 637,  format: 'retrato',  customClass: 'w25',  label: 'Retrato 25%' },
  'paisagem-w50':  { width: 850,  height: 567,  format: 'paisagem', customClass: '',     label: 'Paisagem 50%' },
  'paisagem-full': { width: 1700, height: 1134, format: 'paisagem', customClass: 'w100', label: 'Paisagem 100%' },
};

function applyPreset(idx: number, presetKey: string) {
  const foto = fotos.value[idx];
  const preset = IMAGE_PRESETS[presetKey];
  if (!foto || !preset) return;
  foto.width = preset.width;
  foto.height = preset.height;
  foto.formato = preset.format;
  foto.custom_class = preset.customClass;
}

function getPresetKey(foto: PortfolioFoto): string {
  const cls = foto.custom_class ?? '';
  if (foto.formato === 'paisagem' && cls.includes('w100')) return 'paisagem-full';
  if (foto.formato === 'paisagem') return 'paisagem-w50';
  if (cls.includes('w50')) return 'retrato-w50';
  if (cls.includes('w25')) return 'retrato-w25';
  return 'retrato-w33';
}

const CLASS_SHORTCUTS = ['w25', 'w33', 'w50', 'w66', 'w100'];

// ─── CF Image Browser ──────────────────────────────────────────────────────
interface CfImage { id: string; filename: string }
const cfImages = ref<CfImage[]>([]);
const cfLoading = ref(false);
const cfPage = ref(1);
const cfTotal = ref(0);
const cfOpen = ref(false);
const cfError = ref('');
const cfTargetIdx = ref<number>(-1);

async function openCfBrowser(targetIdx = -1) {
  cfTargetIdx.value = targetIdx;
  cfOpen.value = true;
  if (cfImages.value.length === 0) await loadCfImages(1);
}

async function loadCfImages(page: number) {
  cfLoading.value = true;
  cfError.value = '';
  try {
    const res = await $fetch<{ images: CfImage[]; total_count: number }>('/api/cf-images', {
      params: { page, per_page: 50 },
    });
    cfImages.value = res.images ?? [];
    cfTotal.value = res.total_count;
    cfPage.value = page;
    if ((res.images ?? []).length === 0) cfError.value = 'Nenhuma imagem encontrada.';
  } catch (e: any) {
    cfImages.value = [];
    cfError.value = 'Erro: ' + (e.statusMessage || e.message);
  } finally {
    cfLoading.value = false;
  }
}

function selectCfImage(imageId: string) {
  if (cfTargetIdx.value >= 0) {
    const foto = fotos.value[cfTargetIdx.value];
    if (foto) foto.cf_image_id = imageId;
  } else {
    fotos.value.push({
      cf_image_id: imageId,
      width: IMAGE_PRESETS['retrato-w33']!.width,
      height: IMAGE_PRESETS['retrato-w33']!.height,
      formato: IMAGE_PRESETS['retrato-w33']!.format,
      custom_class: IMAGE_PRESETS['retrato-w33']!.customClass,
      alt: '',
      highlight: false, can_be_thumb: false,
      ordem: fotos.value.length + 1,
    });
  }
  cfOpen.value = false;
}

// ─── Add blank slot with preset dims ──────────────────────────────────────
function addFoto(presetKey: string = 'retrato-w33') {
  const preset = IMAGE_PRESETS[presetKey]!;
  fotos.value.push({
    cf_image_id: '',
    width: preset.width,
    height: preset.height,
    formato: preset.format,
    custom_class: preset.customClass,
    alt: '',
    highlight: false,
    can_be_thumb: false,
    ordem: fotos.value.length + 1,
  });
}

// ─── Drag to reorder ───────────────────────────────────────────────────────
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);

function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(i: number) { dragOverIdx.value = i; }
function onDragEnd() {
  if (dragIdx.value !== null && dragOverIdx.value !== null && dragIdx.value !== dragOverIdx.value) {
    const [moved] = fotos.value.splice(dragIdx.value, 1);
    if (moved) fotos.value.splice(dragOverIdx.value, 0, moved);
  }
  dragIdx.value = null;
  dragOverIdx.value = null;
}

// ─── Per-card file upload (dropzone) ──────────────────────────────────────
const dropZoneIdx = ref(-1);
const uploadingIdx = ref(-1);
const fileInput = ref<HTMLInputElement | null>(null);
const fileUploadTargetIdx = ref(-1);

function triggerFileInput(targetIdx: number) {
  fileUploadTargetIdx.value = targetIdx;
  fileInput.value?.click();
}

async function handleFileInputChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || fileUploadTargetIdx.value < 0) return;
  await uploadFileToCard(file, fileUploadTargetIdx.value);
  (e.target as HTMLInputElement).value = '';
}

function handleDropOnCard(e: DragEvent, idx: number) {
  dropZoneIdx.value = -1;
  if (!(e.dataTransfer?.types ?? []).includes('Files')) return;
  const file = e.dataTransfer?.files?.[0];
  if (!file || !file.type.startsWith('image/')) return;
  uploadFileToCard(file, idx);
}

async function uploadFileToCard(file: File, targetIdx: number) {
  uploadingIdx.value = targetIdx;
  try {
    const cmsToken = import.meta.client ? sessionStorage.getItem('cms_token') : '';
    const fd = new FormData();
    fd.append('file', file, file.name);
    const res = await $fetch<{ id: string }>('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-cms-token': cmsToken ?? '' },
      body: fd,
    });
    const foto = fotos.value[targetIdx];
    if (foto) foto.cf_image_id = res.id;
    showMessage('Imagem carregada!', 'success');
  } catch (e: any) {
    showMessage('Erro ao enviar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    uploadingIdx.value = -1;
  }
}

// ─── Grouped views: highlights first ──────────────────────────────────────
const highlightFotos = computed(() =>
  fotos.value.map((foto, idx) => ({ foto, idx })).filter(({ foto }) => foto.highlight)
);
const normalFotos = computed(() =>
  fotos.value.map((foto, idx) => ({ foto, idx })).filter(({ foto }) => !foto.highlight)
);

// ─── Mosaic width (mirrors Gallery.vue CSS) ────────────────────────────────
function getMosaicWidth(foto: PortfolioFoto): string {
  const cls = foto.custom_class ?? '';
  if (cls.includes('w100')) return '100%';
  if (cls.includes('w66')) return 'calc(100% * 2 / 3)';
  if (cls.includes('w50')) return '50%';
  if (cls.includes('w25')) return '25%';
  if (foto.formato === 'paisagem') return '50%';
  return 'calc(100% / 3)';
}

// ─── Data ──────────────────────────────────────────────────────────────────
async function load() {
  loading.value = true;
  try {
    const data = await adminFetch<any>(`/api/admin/portfolio/${id.value}`);
    work.value = data;
    fotos.value = (data.fotos ?? []).map((f: any) => ({
      ...f,
      highlight: f.highlight === 1,
      can_be_thumb: f.can_be_thumb === 1,
    }));
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function removeFoto(idx: number) {
  fotos.value.splice(idx, 1);
}

async function saveAll() {
  saving.value = true;
  try {
    await adminFetch(`/api/admin/portfolio/${id.value}/fotos`, {
      method: 'PUT',
      body: { fotos: fotos.value.filter(f => f.cf_image_id).map((f, i) => ({ ...f, ordem: i + 1 })) },
    });
    showMessage('Fotos salvas!', 'success');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

// ─── ZIP upload ────────────────────────────────────────────────────────────
const zipFile = ref<File | null>(null);
const zipUploading = ref(false);
const zipProgress = ref<{ done: number; total: number; current: string }>({ done: 0, total: 0, current: '' });
const zipErrors = ref<string[]>([]);
const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

function isImageFile(filename: string) {
  return IMAGE_EXTS.has(filename.split('.').pop()?.toLowerCase() ?? '');
}

async function uploadZip() {
  if (!zipFile.value) return;
  zipUploading.value = true;
  zipErrors.value = [];
  zipProgress.value = { done: 0, total: 0, current: '' };
  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(zipFile.value);
    const entries: { name: string; file: any }[] = [];
    zip.forEach((rel, file) => {
      if (file.dir || rel.startsWith('__MACOSX') || rel.split('/').pop()?.startsWith('.')) return;
      if (isImageFile(rel)) entries.push({ name: rel, file });
    });
    entries.sort((a, b) => a.name.localeCompare(b.name));
    zipProgress.value.total = entries.length;
    const newFotos: PortfolioFoto[] = [];
    for (const entry of entries) {
      zipProgress.value.current = entry.name.split('/').pop() ?? entry.name;
      const blob = await entry.file.async('blob');
      const filename = entry.name.split('/').pop() ?? 'image.jpg';
      const mimeType = filename.endsWith('.png') ? 'image/png'
        : filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
      const fd = new FormData();
      fd.append('file', new File([blob], filename, { type: mimeType }), filename);
      try {
        const cmsToken = import.meta.client ? sessionStorage.getItem('cms_token') : '';
        const res = await $fetch<{ id: string }>('/api/admin/upload', {
          method: 'POST',
          headers: { 'x-cms-token': cmsToken ?? '' },
          body: fd,
        });
        const preset = IMAGE_PRESETS['retrato-w33']!;
        newFotos.push({
          cf_image_id: res.id,
          width: preset.width, height: preset.height,
          formato: preset.format, custom_class: preset.customClass,
          alt: '',
          highlight: false, can_be_thumb: false,
          ordem: fotos.value.length + newFotos.length + 1,
        });
      } catch (e: any) {
        zipErrors.value.push(`${filename}: ${e.statusMessage || e.message}`);
      }
      zipProgress.value.done++;
    }
    fotos.value.push(...newFotos);
    showMessage(`${newFotos.length} foto(s) importada(s) do ZIP!`, 'success');
    zipFile.value = null;
  } catch (e: any) {
    showMessage('Erro ao processar ZIP: ' + (e.message || e), 'error');
  } finally {
    zipUploading.value = false;
    zipProgress.value = { done: 0, total: 0, current: '' };
  }
}

onMounted(load);
</script>

<template>
  <div class="fotos-editor">
    <!-- Page header -->
    <div class="editor-header">
      <div>
        <NuxtLink :to="`/admin/portfolio/save/${id}`" class="btn-back">← Voltar</NuxtLink>
        <h2>{{ work?.titulo || work?.slug || '…' }}</h2>
      </div>
      <button class="btn-save" :disabled="saving" @click="saveAll">
        {{ saving ? 'Salvando…' : '💾 Salvar' }}
      </button>
    </div>

    <div v-if="loading" class="loading">Carregando…</div>

    <template v-else>
      <!-- Section header: ZIP upload only (add buttons move to footer) -->
      <div class="tab-header">
        <h3>Fotos ({{ fotos.length }})</h3>
        <div class="tab-header-actions">
          <label class="zip-label">📦 ZIP</label>
          <input
            type="file" accept=".zip,application/zip"
            :disabled="zipUploading"
            @change="(e) => { zipFile = (e.target as HTMLInputElement).files?.[0] ?? null }"
          />
          <button
            class="btn-small"
            :disabled="!zipFile || zipUploading"
            @click="uploadZip">
            {{ zipUploading ? `${zipProgress.done}/${zipProgress.total} — ${zipProgress.current}` : 'Importar ZIP' }}
          </button>
          <div v-if="zipUploading" class="zip-inline-bar">
            <div class="zip-inline-fill" :style="{ width: zipProgress.total ? (zipProgress.done / zipProgress.total * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <ul v-if="zipErrors.length" class="zip-errors">
        <li v-for="(err, i) in zipErrors" :key="i">⚠ {{ err }}</li>
      </ul>

      <div v-if="fotos.length === 0" class="empty-list">
        Nenhuma foto. Use "+ Adicionar" abaixo ou importe um ZIP.
      </div>

      <template v-else>
        <!-- ── DESTAQUES ───────────────────────────────────────────── -->
        <template v-if="highlightFotos.length > 0">
          <div class="section-label section-label--highlight">⭐ Destaques ({{ highlightFotos.length }})</div>
          <div class="mosaic-canvas" @dragover.prevent @drop.prevent="onDragEnd">
            <div
              v-for="{ foto, idx } in highlightFotos"
              :key="idx"
              class="image-card image-card--highlight"
              :class="{ 'drag-over': dragOverIdx === idx }"
              :style="{ width: getMosaicWidth(foto) }"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @dragover.prevent="onDragOver(idx)"
            >
              <div class="image-card-header">
                <span class="drag-handle">⠿</span>
                <span class="image-idx">#{{ idx + 1 }}</span>
                <div v-if="foto.cf_image_id" class="img-thumb">
                  <img :src="cfImg(foto.cf_image_id, 'w=80')" :alt="foto.alt || ''" />
                </div>
                <button class="btn-small" @click="openCfBrowser(idx)">
                  {{ foto.cf_image_id ? 'Trocar' : 'Selecionar' }}
                </button>
                <button class="btn-small danger" @click="removeFoto(idx)">✕</button>
              </div>
              <div class="mc-photo">
                <img v-if="foto.cf_image_id" :src="cfImg(foto.cf_image_id, 'w=600')" :alt="foto.alt || ''" loading="lazy" />
                <div
                  v-else
                  class="mc-photo-empty"
                  :class="{ 'is-drop-active': dropZoneIdx === idx, 'is-uploading': uploadingIdx === idx }"
                  :style="{ aspectRatio: foto.formato === 'paisagem' ? '3/2' : '3/4' }"
                  @dragenter.prevent.stop="(($event as DragEvent).dataTransfer?.types ?? []).includes('Files') && (dropZoneIdx = idx)"
                  @dragleave.stop="dropZoneIdx = -1"
                  @dragover.prevent.stop
                  @drop.prevent.stop="handleDropOnCard($event as DragEvent, idx)"
                  @click="triggerFileInput(idx)"
                >
                  <span v-if="uploadingIdx === idx">Enviando…</span>
                  <span v-else-if="dropZoneIdx === idx">Solte aqui ↓</span>
                  <span v-else>Arraste ou clique para enviar</span>
                </div>
              </div>
              <div class="image-card-fields">
                <label class="field-label field-label--full">
                  Preset
                  <select :value="getPresetKey(foto)" @change="applyPreset(idx, ($event.target as HTMLSelectElement).value)">
                    <option v-for="(preset, key) in IMAGE_PRESETS" :key="key" :value="key">{{ preset.label }}</option>
                  </select>
                </label>
                <label class="field-label field-label--cls">
                  Classe
                  <input v-model="foto.custom_class" type="text" placeholder="w50" />
                  <div class="cls-chips">
                    <button v-for="cls in CLASS_SHORTCUTS" :key="cls" class="cls-chip" :class="{ active: foto.custom_class === cls }" @click="foto.custom_class = foto.custom_class === cls ? '' : cls">{{ cls }}</button>
                  </div>
                </label>
                <label class="field-label">
                  Alt
                  <input v-model="foto.alt" type="text" placeholder="Descrição" />
                </label>
                <label class="field-label field-label--num">
                  W
                  <input v-model.number="foto.width" type="number" placeholder="850" />
                </label>
                <label class="field-label field-label--num">
                  H
                  <input v-model.number="foto.height" type="number" placeholder="1275" />
                </label>
                <div class="size-info">{{ foto.width }}×{{ foto.height }} · {{ foto.formato }}</div>
                <label class="toggle-label">
                  <input v-model="foto.highlight" type="checkbox" class="toggle-input highlight-toggle" />
                  <span class="toggle-track"><span class="toggle-thumb"></span></span>
                  <span>Destaque</span>
                </label>
                <label class="toggle-label">
                  <input v-model="foto.can_be_thumb" type="checkbox" class="toggle-input" />
                  <span class="toggle-track"><span class="toggle-thumb"></span></span>
                  <span>Thumb</span>
                </label>
              </div>
            </div>
            <div class="mosaic-spacer"></div>
            <div class="mosaic-spacer"></div>
          </div>
          <div class="section-divider"></div>
        </template>

        <!-- ── GALERIA ─────────────────────────────────────────────── -->
        <div class="section-label">📷 Galeria ({{ normalFotos.length }})</div>
        <div v-if="normalFotos.length > 0" class="mosaic-canvas" @dragover.prevent @drop.prevent="onDragEnd">
          <div
            v-for="{ foto, idx } in normalFotos"
            :key="idx"
            class="image-card"
            :class="{ 'drag-over': dragOverIdx === idx }"
            :style="{ width: getMosaicWidth(foto) }"
            draggable="true"
            @dragstart="onDragStart(idx)"
            @dragover.prevent="onDragOver(idx)"
          >
            <div class="image-card-header">
              <span class="drag-handle">⠿</span>
              <span class="image-idx">#{{ idx + 1 }}</span>
              <div v-if="foto.cf_image_id" class="img-thumb">
                <img :src="`${CF_IMG}${foto.cf_image_id}/w=80`" :alt="foto.alt || ''" />
              </div>
              <button class="btn-small" @click="openCfBrowser(idx)">
                {{ foto.cf_image_id ? 'Trocar' : 'Selecionar' }}
              </button>
              <button class="btn-small danger" @click="removeFoto(idx)">✕</button>
            </div>
            <div class="mc-photo">
              <img v-if="foto.cf_image_id" :src="`${CF_IMG}${foto.cf_image_id}/w=600`" :alt="foto.alt || ''" loading="lazy" />
              <div
                v-else
                class="mc-photo-empty"
                :class="{ 'is-drop-active': dropZoneIdx === idx, 'is-uploading': uploadingIdx === idx }"
                :style="{ aspectRatio: foto.formato === 'paisagem' ? '3/2' : '3/4' }"
                @dragenter.prevent.stop="(($event as DragEvent).dataTransfer?.types ?? []).includes('Files') && (dropZoneIdx = idx)"
                @dragleave.stop="dropZoneIdx = -1"
                @dragover.prevent.stop
                @drop.prevent.stop="handleDropOnCard($event as DragEvent, idx)"
                @click="triggerFileInput(idx)"
              >
                <span v-if="uploadingIdx === idx">Enviando…</span>
                <span v-else-if="dropZoneIdx === idx">Solte aqui ↓</span>
                <span v-else>Arraste ou clique para enviar</span>
              </div>
            </div>
            <div class="image-card-fields">
              <label class="field-label field-label--full">
                Preset
                <select :value="getPresetKey(foto)" @change="applyPreset(idx, ($event.target as HTMLSelectElement).value)">
                  <option v-for="(preset, key) in IMAGE_PRESETS" :key="key" :value="key">{{ preset.label }}</option>
                </select>
              </label>
              <label class="field-label field-label--cls">
                Classe
                <input v-model="foto.custom_class" type="text" placeholder="w50" />
                <div class="cls-chips">
                  <button v-for="cls in CLASS_SHORTCUTS" :key="cls" class="cls-chip" :class="{ active: foto.custom_class === cls }" @click="foto.custom_class = foto.custom_class === cls ? '' : cls">{{ cls }}</button>
                </div>
              </label>
              <label class="field-label">
                Alt
                <input v-model="foto.alt" type="text" placeholder="Descrição" />
              </label>
              <label class="field-label field-label--num">
                W
                <input v-model.number="foto.width" type="number" placeholder="850" />
              </label>
              <label class="field-label field-label--num">
                H
                <input v-model.number="foto.height" type="number" placeholder="1275" />
              </label>
              <div class="size-info">{{ foto.width }}×{{ foto.height }} · {{ foto.formato }}</div>
              <label class="toggle-label">
                <input v-model="foto.highlight" type="checkbox" class="toggle-input highlight-toggle" />
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
                <span>Destaque</span>
              </label>
              <label class="toggle-label">
                <input v-model="foto.can_be_thumb" type="checkbox" class="toggle-input" />
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
                <span>Thumb</span>
              </label>
            </div>
          </div>
          <div class="mosaic-spacer"></div>
          <div class="mosaic-spacer"></div>
        </div>
        <div v-else class="empty-list empty-list--sm">Sem fotos na galeria.</div>
      </template>

      <!-- Add by preset (mirrors Legacy.vue album-footer) -->
      <div class="add-presets">
        <span class="add-presets-label">+ Adicionar:</span>
        <button
          v-for="(preset, key) in IMAGE_PRESETS"
          :key="key"
          class="btn-small btn-add"
          @click="addFoto(key as string)"
        >{{ preset.label }}</button>
      </div>

      <!-- Bottom save -->
      <div class="bottom-save">
        <button class="btn-save btn-save--lg" :disabled="saving" @click="saveAll">
          {{ saving ? 'Salvando…' : '💾 Salvar fotos' }}
        </button>
      </div>
    </template>

    <!-- Hidden file input for dropzone click -->
    <input ref="fileInput" type="file" accept="image/*" style="display:none" @change="handleFileInputChange" />

    <!-- CF Image Browser Modal -->
    <Teleport to="body">
      <div v-if="cfOpen" class="modal-overlay" @click.self="cfOpen = false">
        <div class="modal-content cf-browser">
          <div class="modal-header">
            <h3>Selecionar imagem do Cloudflare</h3>
            <button class="modal-close" @click="cfOpen = false">✕</button>
          </div>
          <div v-if="cfLoading" class="loading">Carregando imagens…</div>
          <div v-else-if="cfError" class="cf-error">{{ cfError }}</div>
          <div v-else class="cf-grid">
            <div
              v-for="img in cfImages"
              :key="img.id"
              class="cf-thumb"
              @click="selectCfImage(img.id)"
            >
              <img :src="cfImg(img.id, 'w=120')" loading="lazy" />
              <span class="cf-filename">{{ img.filename }}</span>
            </div>
          </div>
          <div v-if="cfTotal > 50" class="cf-pagination">
            <button :disabled="cfPage <= 1" @click="loadCfImages(cfPage - 1)">← Anterior</button>
            <span>Página {{ cfPage }} ({{ cfTotal }} total)</span>
            <button :disabled="cfImages.length < 50" @click="loadCfImages(cfPage + 1)">Próxima →</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.fotos-editor {
  color: #eee;
}

.loading { text-align: center; padding: 40px; color: #888; }

/* Page header */
.editor-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #333;
  div { display: flex; align-items: center; gap: 12px; }
  h2 { font-size: 20px; }
}

.btn-back {
  color: #60a5fa; font-size: 13px; text-decoration: none; white-space: nowrap;
  &:hover { color: #93c5fd; }
}

.btn-save {
  background: #2563eb; border: none; color: #fff; padding: 8px 20px;
  border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;
  &:hover:not(:disabled) { background: #1d4ed8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &--lg { padding: 10px 28px; }
}

/* Section header */
.tab-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 16px; }
}

.tab-header-actions {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
}

.zip-label { font-size: 12px; color: #888; white-space: nowrap; }

.zip-inline-bar {
  width: 80px; height: 4px; background: #333; border-radius: 2px; overflow: hidden;
}
.zip-inline-fill { height: 100%; background: #22c55e; transition: width 0.2s; }

.zip-errors {
  margin-bottom: 12px; padding: 8px 12px;
  background: #2a0a0a; border: 1px solid #7f1d1d; border-radius: 6px;
  font-size: 12px; color: #fca5a5; list-style: none;
}

.empty-list {
  text-align: center; padding: 40px; color: #666; font-size: 13px;
  &--sm { padding: 16px; font-size: 12px; }
}

/* Section label + divider */
.section-label {
  width: 100%; font-size: 11px; color: #555; text-transform: uppercase;
  letter-spacing: 1px; margin-bottom: 8px; padding: 4px 0;
  &--highlight { color: #d97706; }
}

.section-divider {
  width: 100%; height: 1px; background: #2a2a2a; margin: 20px 0 16px;
}

/* Buttons */
.btn-small {
  background: #1e2d3d; border: 1px solid #2d4a6a; color: #60a5fa;
  padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; white-space: nowrap;
  &:hover { background: #253d55; }
  &.danger { color: #f87171; border-color: #7f1d1d; &:hover { background: #450a0a; } }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.btn-add {
  color: #4ade80; border-color: #166534;
  &:hover { background: #052e16; }
}

/* Add presets footer (mirrors Legacy.vue album-footer) */
.add-presets {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin: 16px 0; padding: 12px; background: #111; border-radius: 8px; border: 1px solid #2a2a2a;
}

.add-presets-label {
  font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap;
}

/* Mosaic canvas */
.mosaic-canvas {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
}

.mosaic-spacer {
  min-width: calc(100% / 3);
  height: 1px;
}

/* Image card */
.image-card {
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  box-sizing: border-box;
  padding: 8px;
  transition: border-color 0.15s;
  &.drag-over { border-color: #3b82f6; }
  &--highlight { border-left: 2px solid #d97706; }
}

/* Card header */
.image-card-header {
  display: flex; align-items: center; gap: 6px; margin-bottom: 6px;
}

.drag-handle { cursor: grab; font-size: 16px; color: #555; &:active { cursor: grabbing; } }
.image-idx { font-size: 11px; color: #666; font-weight: 600; min-width: 24px; }

.img-thumb {
  width: 44px; height: 44px; border-radius: 4px; overflow: hidden;
  border: 1px solid #333; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
}

/* Photo preview */
.mc-photo {
  width: 100%; background: #111; margin-bottom: 6px;
  img { display: block; width: 100%; height: auto; }
}

.mc-photo-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px; color: #444; font-size: 11px;
  border: 1px dashed #333; border-radius: 4px;
  cursor: pointer; transition: border-color 0.15s, background 0.15s, color 0.15s;
  &:hover { border-color: #555; background: rgba(255,255,255,0.02); color: #666; }
  &.is-drop-active {
    border-color: #3b82f6; background: rgba(59,130,246,0.07); color: #60a5fa; border-style: solid;
  }
  &.is-uploading {
    border-color: #22c55e; background: rgba(34,197,94,0.07); color: #4ade80;
  }
}

/* Fields */
.image-card-fields {
  display: flex; gap: 6px; flex-wrap: wrap;
  input, select {
    width: 100%; background: #111; border: 1px solid #333; color: #eee;
    padding: 5px 8px; border-radius: 4px; font-size: 11px; margin-top: 3px;
    box-sizing: border-box;
    &:focus { outline: none; border-color: #3b82f6; }
  }
}

.field-label {
  display: flex; flex-direction: column; flex: 1; min-width: 70px;
  font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.4px;
  &--cls { min-width: 120px; flex: 2; }
  &--num { min-width: 50px; max-width: 70px; flex: 0 0 auto; }
  &--full { width: 100%; flex: 0 0 100%; }
}

.size-info {
  width: 100%; font-size: 10px; color: #444; font-family: monospace;
  padding: 2px 0; letter-spacing: 0.3px;
}

/* Toggle switches */
.toggle-label {
  display: inline-flex !important; align-items: center; gap: 6px;
  cursor: pointer; padding-top: 14px; user-select: none;
  text-transform: none !important; letter-spacing: 0 !important;
  font-size: 11px; color: #ccc;
}

.toggle-input { display: none; }

.toggle-track {
  width: 32px; height: 18px; background: #2a2a2a; border-radius: 9px;
  position: relative; flex-shrink: 0; border: 1px solid #444;
  transition: background 0.2s, border-color 0.2s;
}

.toggle-thumb {
  position: absolute; left: 2px; top: 2px;
  width: 12px; height: 12px; background: #555;
  border-radius: 50%; transition: transform 0.2s, background 0.2s;
}

.toggle-input:checked + .toggle-track {
  background: #1e3a5f; border-color: #3b82f6;
  .toggle-thumb { transform: translateX(14px); background: #60a5fa; }
}

.toggle-input.highlight-toggle:checked + .toggle-track {
  background: #451a03; border-color: #d97706;
  .toggle-thumb { transform: translateX(14px); background: #f59e0b; }
}

/* Class chips */
.cls-chips {
  display: flex; gap: 3px; flex-wrap: wrap; margin-top: 3px;
}

.cls-chip {
  background: #222; border: 1px solid #3a3a3a; color: #888;
  padding: 1px 6px; border-radius: 3px; font-size: 10px;
  cursor: pointer; font-family: monospace;
  &:hover { border-color: #555; color: #bbb; }
  &.active { background: #1e3a5f; border-color: #3b82f6; color: #60a5fa; }
}

/* Bottom save */
.bottom-save { margin-top: 20px; display: flex; justify-content: flex-end; }

/* CF Browser modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex;
  align-items: center; justify-content: center; z-index: 9999;
}

.modal-content {
  background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
  width: 90vw; max-width: 1000px; max-height: 80vh; overflow-y: auto; padding: 24px;
}

.cf-browser { max-width: 1100px; }

.modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 18px; color: #eee; }
}

.modal-close {
  background: #333; border: none; color: #eee; width: 32px; height: 32px;
  border-radius: 6px; cursor: pointer; font-size: 16px;
  &:hover { background: #444; }
}

.cf-error { text-align: center; padding: 20px; color: #f87171; }

.cf-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px; margin-bottom: 16px;
}

.cf-thumb {
  cursor: pointer; border: 2px solid transparent; border-radius: 6px;
  overflow: hidden; background: #111; transition: border-color 0.15s;
  &:hover { border-color: #3b82f6; }
  img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
  .cf-filename { display: block; font-size: 9px; color: #888; padding: 3px 4px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}

.cf-pagination {
  display: flex; justify-content: center; align-items: center; gap: 16px;
  button {
    background: #222; border: 1px solid #444; color: #ccc; padding: 6px 14px;
    border-radius: 6px; font-size: 12px; cursor: pointer;
    &:hover:not(:disabled) { background: #333; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  }
  span { font-size: 12px; color: #888; }
}
</style>
