<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

const id = computed(() => Number(route.params.id));
const cfUrl = 'https://imagedelivery.net/O6nFDZdJNNmAV7RmVd-_zw/';

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
const newCfId = ref('');

// ZIP upload state
const zipFile = ref<File | null>(null);
const zipUploading = ref(false);
const zipProgress = ref<{ done: number; total: number; current: string }>({ done: 0, total: 0, current: '' });
const zipErrors = ref<string[]>([]);

async function load() {
  loading.value = true;
  try {
    const data = await adminFetch<any>(`/api/admin/portfolio/${id.value}`);
    work.value = data;
    fotos.value = (data.fotos ?? []).map((f: any) => ({ ...f, highlight: f.highlight === 1, can_be_thumb: f.can_be_thumb === 1 }));
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function addFoto() {
  if (!newCfId.value.trim()) return;
  fotos.value.push({
    cf_image_id: newCfId.value.trim(),
    width: null, height: null, formato: '', custom_class: '',
    alt: '', highlight: false, can_be_thumb: true, ordem: fotos.value.length + 1,
  });
  newCfId.value = '';
}

function removeFoto(idx: number) {
  fotos.value.splice(idx, 1);
}

function moveFoto(idx: number, dir: -1 | 1) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= fotos.value.length) return;
  const tmp = fotos.value[idx];
  fotos.value[idx] = fotos.value[newIdx];
  fotos.value[newIdx] = tmp;
}

async function saveAll() {
  saving.value = true;
  try {
    await adminFetch(`/api/admin/portfolio/${id.value}/fotos`, {
      method: 'PUT',
      body: {
        fotos: fotos.value.map((f, i) => ({ ...f, ordem: i + 1 })),
      },
    });
    showMessage('Fotos salvas!', 'success');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']);

function isImageFile(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTS.has(ext);
}

async function uploadZip() {
  if (!zipFile.value) return;
  zipUploading.value = true;
  zipErrors.value = [];
  zipProgress.value = { done: 0, total: 0, current: '' };

  try {
    const JSZip = (await import('jszip')).default;
    const zip = await JSZip.loadAsync(zipFile.value);

    // Collect image entries (skip __MACOSX and hidden files)
    const imageEntries: { name: string; file: JSZip.JSZipObject }[] = [];
    zip.forEach((relativePath, file) => {
      if (file.dir) return;
      if (relativePath.startsWith('__MACOSX')) return;
      if (relativePath.split('/').pop()?.startsWith('.')) return;
      if (isImageFile(relativePath)) {
        imageEntries.push({ name: relativePath, file });
      }
    });

    // Sort by name for deterministic order
    imageEntries.sort((a, b) => a.name.localeCompare(b.name));
    zipProgress.value.total = imageEntries.length;

    const { token } = useAdminFetch();
    const newFotos: PortfolioFoto[] = [];

    for (const entry of imageEntries) {
      zipProgress.value.current = entry.name.split('/').pop() ?? entry.name;

      const blob = await entry.file.async('blob');
      const filename = entry.name.split('/').pop() ?? 'image.jpg';
      const mimeType = filename.endsWith('.png') ? 'image/png'
        : filename.endsWith('.webp') ? 'image/webp'
        : 'image/jpeg';

      const fd = new FormData();
      fd.append('file', new File([blob], filename, { type: mimeType }), filename);

      try {
        const res = await $fetch<{ id: string }>('/api/admin/upload', {
          method: 'POST',
          headers: { 'x-cms-token': token.value },
          body: fd,
        });

        newFotos.push({
          cf_image_id: res.id,
          width: null, height: null,
          formato: '', custom_class: '', alt: '',
          highlight: false, can_be_thumb: true,
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
  <div class="page">
    <div class="page-header">
      <NuxtLink :to="`/admin/portfolio/save/${id}`" class="page-back">← Voltar</NuxtLink>
      <h2>Fotos: {{ work?.titulo || work?.slug }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>
      <div class="form-card">
        <h3 class="form-section-title">Adicionar foto</h3>
        <div class="add-foto-row">
          <input v-model="newCfId" type="text" placeholder="CF Image ID" @keydown.enter="addFoto" />
          <button class="btn-primary btn-sm" @click="addFoto">+ Adicionar</button>
        </div>
      </div>

      <div class="form-card">
        <h3 class="form-section-title">Importar do ZIP</h3>
        <p class="form-hint">Selecione um arquivo ZIP com imagens JPG/PNG. As imagens serão enviadas ao Cloudflare Images automaticamente.</p>
        <div class="add-foto-row">
          <input
            type="file"
            accept=".zip,application/zip"
            :disabled="zipUploading"
            @change="(e) => { zipFile = (e.target as HTMLInputElement).files?.[0] ?? null }" />
          <button
            class="btn-primary btn-sm"
            :disabled="!zipFile || zipUploading"
            @click="uploadZip">
            {{ zipUploading ? 'Enviando...' : '📦 Importar ZIP' }}
          </button>
        </div>
        <div v-if="zipUploading" class="zip-progress">
          <div class="zip-progress-bar">
            <div
              class="zip-progress-fill"
              :style="{ width: zipProgress.total ? (zipProgress.done / zipProgress.total * 100) + '%' : '0%' }"/>
          </div>
          <span>{{ zipProgress.done }}/{{ zipProgress.total }} — {{ zipProgress.current }}</span>
        </div>
        <ul v-if="zipErrors.length" class="zip-errors">
          <li v-for="(err, i) in zipErrors" :key="i">⚠ {{ err }}</li>
        </ul>
      </div>

      <div class="form-card">
        <h3 class="form-section-title">Fotos ({{ fotos.length }})</h3>
        <div class="fotos-grid">
          <div v-for="(foto, i) in fotos" :key="i" class="foto-card">
            <img :src="`${cfUrl}${foto.cf_image_id}/public`" :alt="foto.alt || ''" />
            <div class="foto-controls">
              <button class="btn-icon" title="Mover para cima" @click="moveFoto(i, -1)">↑</button>
              <button class="btn-icon" title="Mover para baixo" @click="moveFoto(i, 1)">↓</button>
              <button class="btn-icon btn-danger" title="Remover" @click="removeFoto(i)">🗑</button>
            </div>
            <div class="foto-meta">
              <div class="form-field">
                <label>Formato</label>
                <select v-model="foto.formato">
                  <option value="">—</option>
                  <option value="paisagem">Paisagem</option>
                  <option value="retrato">Retrato</option>
                </select>
              </div>
              <div class="form-field">
                <label>Class CSS</label>
                <input v-model="foto.custom_class" type="text" placeholder="w50" />
              </div>
              <div class="form-field">
                <label>Alt text</label>
                <input v-model="foto.alt" type="text" />
              </div>
              <div class="form-field checkboxes">
                <label><input v-model="foto.highlight" type="checkbox" /> Destaque</label>
                <label><input v-model="foto.can_be_thumb" type="checkbox" /> Thumbnail</label>
              </div>
            </div>
          </div>
        </div>
        <p v-if="fotos.length === 0" class="empty-hint">Nenhuma foto adicionada.</p>
      </div>

      <div class="form-actions">
        <NuxtLink :to="`/admin/portfolio/save/${id}`" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="saveAll">
          {{ saving ? 'Salvando...' : '💾 Salvar fotos' }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.add-foto-row {
  display: flex;
  gap: 0.75rem;
  input { flex: 1; }
}

.fotos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
}

.foto-card {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }
}

.foto-controls {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  justify-content: flex-end;
}

.foto-meta {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .form-field {
    margin: 0;
    label { font-size: 0.7rem; }
    input, select { font-size: 0.8rem; padding: 0.2rem 0.4rem; }
  }
}

.checkboxes {
  display: flex;
  gap: 1rem;
  flex-direction: row !important;
  label { display: flex; align-items: center; gap: 0.3rem; font-weight: normal !important; font-size: 0.8rem; }
}

.form-hint {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.zip-progress {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #475569;
}

.zip-progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.zip-progress-fill {
  height: 100%;
  background: #22c55e;
  transition: width 0.2s;
}

.zip-errors {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #be123c;
  list-style: none;
}
</style>
