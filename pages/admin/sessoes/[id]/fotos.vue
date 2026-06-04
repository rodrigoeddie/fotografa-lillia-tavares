<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();
const cfURI = useRuntimeConfig().public.cloudflareURI;
const route = useRoute();

const sessaoId = computed(() => Number(route.params.id));

interface Foto { id: number; sessao_id: number; cloudflare_image_id: string; ordem: number; }
interface Sessao {
  id: number; nome_sessao: string; status: string; cliente_nome: string;
  fotos_incluidas: number; pacote_index: number; preco_foto_extra: number; produto_tipo: string;
  capa_foto_id: string | null;
}

const sessao = ref<Sessao | null>(null);
const fotos = ref<Foto[]>([]);
const capaFotoId = ref<string | null>(null);
const settingCapa = ref(false);
const uploadQueue = ref<{ file: File; status: 'pending' | 'processing' | 'done' | 'error'; progress: number; name: string; preview: string; }[]>([]);
const isUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const statusLabels: Record<string, string> = {
  aguardando_fotos: '<span class="material-symbols-outlined"> hourglass </span> Aguardando fotos',
  aguardando_selecao: '<span class="material-symbols-outlined"> photo_camera </span> Aguardando seleção',
  selecao_concluida: '<span class="material-symbols-outlined"> check_circle </span> Seleção concluída',
  entregue: '<span class="material-symbols-outlined"> local_shipping </span> Entregue',
};

async function load() {
  const [sessoes, fotosData] = await Promise.all([
    adminFetch<Sessao[]>('/api/admin/sessoes'),
    adminFetch<Foto[]>(`/api/admin/sessoes/${sessaoId.value}/fotos`),
  ]);
  sessao.value = sessoes.find((s) => s.id === sessaoId.value) ?? null;
  fotos.value = fotosData;
  capaFotoId.value = sessao.value?.capa_foto_id ?? null;
}

async function setCapa(cfImageId: string | null) {
  if (settingCapa.value) return;
  settingCapa.value = true;
  try {
    const newCapa = capaFotoId.value === cfImageId ? null : cfImageId;
    await adminFetch(`/api/admin/sessoes/${sessaoId.value}/fotos`, {
      method: 'PATCH',
      body: { capa_foto_id: newCapa },
    });
    capaFotoId.value = newCapa;
  } catch (e: any) {
    showMessage('Erro ao definir capa: ' + (e.statusMessage || e.message), 'error');
  } finally {
    settingCapa.value = false;
  }
}

async function updateStatus(status: string) {
  if (!sessao.value) return;
  const s = sessao.value;
  const body = { nome_sessao: s.nome_sessao, produto_tipo: s.produto_tipo, pacote_index: s.pacote_index, fotos_incluidas: s.fotos_incluidas, preco_foto_extra: s.preco_foto_extra, status };
  try {
    await adminFetch(`/api/admin/sessoes/${sessaoId.value}`, { method: 'PUT', body });
    sessao.value = { ...sessao.value!, status };
    showMessage('Status atualizado', 'success');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

function removeFromQueue(index: number) {
  uploadQueue.value.splice(index, 1);
}

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const file of Array.from(input.files)) {
    uploadQueue.value.push({ file, status: 'pending', progress: 0, name: file.name, preview: URL.createObjectURL(file) });
  }
  input.value = '';
}

async function startUpload() {
  if (isUploading.value) return;
  isUploading.value = true;
  const pending = uploadQueue.value.filter((q) => q.status === 'pending');

  for (const item of pending) {
    item.status = 'processing';
    item.progress = 0;
    try {
      const watermarkedBlob = await applyWatermark(item.file);
      item.progress = 40;

      const formData = new FormData();
      formData.append('file', watermarkedBlob, item.name.replace(/\.[^.]+$/, '.jpg'));

      const token = sessionStorage.getItem('cms_token');
      const res = await $fetch<any>('/api/upload', {
        method: 'POST',
        body: formData,
        headers: token ? { 'x-cms-token': token } : {},
      });
      item.progress = 80;

      const imageId: string = res.result?.id;
      if (!imageId) throw new Error('ID não retornado pelo upload');

      await adminFetch(`/api/admin/sessoes/${sessaoId.value}/fotos`, {
        method: 'POST',
        body: { cloudflare_image_id: imageId },
      });
      item.progress = 100;
      item.status = 'done';
    } catch (e: any) {
      item.status = 'error';
      console.error('Upload error:', e);
    }
  }

  isUploading.value = false;
  fotos.value = await adminFetch<Foto[]>(`/api/admin/sessoes/${sessaoId.value}/fotos`);

  // Muda status automaticamente quando atingir o mínimo de fotos incluídas no pacote
  if (
    sessao.value &&
    sessao.value.status === 'aguardando_fotos' &&
    fotos.value.length >= sessao.value.fotos_incluidas &&
    sessao.value.fotos_incluidas > 0
  ) {
    await updateStatus('aguardando_selecao');
    // Cria o primeiro lote de seleção automaticamente
    try {
      await adminFetch(`/api/admin/sessoes/${sessaoId.value}/lotes`, { method: 'POST' });
    } catch {}
    showMessage(`✅ Status alterado para "Aguardando seleção" automaticamente.`, 'success');
  }
}

async function applyWatermark(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1200;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(16, Math.round(w / 20))}px Arial, sans-serif`;
      ctx.rotate((-35 * Math.PI) / 180);
      const stepX = w * 0.4;
      const stepY = h * 0.25;
      for (let x = -w; x < w * 2; x += stepX) {
        for (let y = -h; y < h * 2; y += stepY) {
          ctx.fillText('© Lillia Tavares', x, y);
        }
      }
      ctx.restore();
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Canvas toBlob falhou'))),
        'image/jpeg', 0.78,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function removePhoto(foto: Foto) {
  if (!confirm('Remover esta foto da sessão?')) return;
  try {
    await adminFetch(`/api/admin/sessoes/${sessaoId.value}/fotos`, { method: 'DELETE', body: { foto_id: foto.id } });
    fotos.value = fotos.value.filter((f) => f.id !== foto.id);
    showMessage('Foto removida', 'success');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

function cfUrl(imageId: string) { return `${cfURI}${imageId}/public`; }

onMounted(load);
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin/sessoes" class="page-back">← Voltar</NuxtLink>
    <div class="page-header">
      <div style="flex:1">
        <h2>{{ sessao?.nome_sessao ?? '...' }}</h2>
        <p class="text-muted text-sm"><b>Cliente: </b> {{ sessao?.cliente_nome }} · Status: <span v-if="sessao" v-html="statusLabels[sessao.status]"></span></p>
      </div>
    </div>

    <!-- Upload -->
    <div class="upload-section">
      <div class="upload-drop" @click="fileInputRef?.click()"
        @dragover.prevent
        @drop.prevent="(e) => { const dt = (e as DragEvent).dataTransfer; if (dt) { const fake = { target: { files: dt.files } } as any; onFilesSelected(fake); } }">
        <span class="flex aic gap-5">
          <span class="material-symbols-outlined icon-photo"> photo </span>
          <span>Arraste fotos aqui ou clique para selecionar</span>
        </span>
        <small>A marca d'água será aplicada automaticamente antes do upload</small>
      </div>
      <input ref="fileInputRef" type="file" accept="image/*" multiple style="display:none" @change="onFilesSelected" />

      <div v-if="uploadQueue.length > 0" class="upload-queue">
        <div class="upload-queue-header">
          <span>{{ uploadQueue.filter(q=>q.status==='done').length }}/{{ uploadQueue.length }} fotos processadas</span>
          <button class="btn-primary" :disabled="isUploading || uploadQueue.every(q=>q.status==='done')" @click="startUpload">
            {{ isUploading ? '⏳ Processando...' : '▶ Iniciar upload' }}
          </button>
        </div>
        <div v-for="(item, i) in uploadQueue" :key="i" class="queue-item">
          <img class="queue-thumb" :src="item.preview" :alt="item.name" />
          <span class="queue-status" :class="item.status">
            {{ item.status === 'done' ? '✅' : item.status === 'error' ? '❌' : item.status === 'processing' ? '⏳' : '⬜' }}
          </span>
          <span class="queue-name">{{ item.name }}</span>
          <div v-if="item.status === 'processing'" class="queue-progress">
            <div class="queue-fill" :style="{ width: item.progress + '%' }"></div>
          </div>
          <button v-if="item.status === 'pending'" class="queue-remove" title="Remover" @click="removeFromQueue(i)">✕</button>
        </div>
      </div>
    </div>

    <!-- Fotos existentes -->
    <div class="fotos-section">
      <h3>Fotos da sessão <span class="count-badge">{{ fotos.length }}</span></h3>
      <div v-if="fotos.length === 0" class="empty-hint">Nenhuma foto adicionada ainda.</div>
      <div v-else class="fotos-grid">
        <div v-for="foto in fotos" :key="foto.id" class="foto-card" :class="{ 'is-capa': capaFotoId === foto.cloudflare_image_id }">
          <nuxt-img
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/" + foto.cloudflare_image_id + "/public"'
            width="200"
            class="image"
            :alt="`Foto ${foto.id}`"
            format="webp"
            placeholder
            loading="lazy"/>
          <div v-if="capaFotoId === foto.cloudflare_image_id" class="capa-badge">
            <span class="material-symbols-outlined">art_track</span> Capa
          </div>
          <button
            class="btn-capa"
            :title="capaFotoId === foto.cloudflare_image_id ? 'Remover como capa' : 'Definir como capa'"
            :class="{ active: capaFotoId === foto.cloudflare_image_id }"
            :disabled="settingCapa"
            @click="setCapa(foto.cloudflare_image_id)">
            <span class="material-symbols-outlined">{{ capaFotoId === foto.cloudflare_image_id ? 'star' : 'star_outline' }}</span>
          </button>
          <button class="foto-remove" title="Remover foto" @click="removePhoto(foto)">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.text-muted {
  padding-top: 15px;
}
.text-muted span,
.text-muted {
  align-items: center;
  display: flex;
}
.icon-photo {
  margin-right: 2px;
  top: 6px;
}
.upload-section { margin-bottom: 32px; }
.upload-queue { margin-top: 16px; }
.upload-queue-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; }
.queue-item { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
.queue-thumb { width: 100px; height: auto; border-radius: 4px; object-fit: contain; flex-shrink: 0; display: block; }
.queue-status { font-size: 16px; width: 24px; text-align: center; }
.queue-name { flex: 1; color: #374151; }
.queue-progress { width: 80px; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
.queue-fill { height: 100%; background: #1f2937; transition: width 0.2s; }
.queue-remove {
  margin-left: auto; background: none; border: none; color: #9ca3af; cursor: pointer;
  font-size: 12px; padding: 2px 4px; border-radius: 3px;
  &:hover { color: #dc2626; background: #fee2e2; }
}
.fotos-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.fotos-grid {
  column-gap: 12px;
  columns: 6;
  gap: 12px;
}

.foto-card {
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
  
  img { width: 100%; display: block; }
}
.foto-remove {
  position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: #fff;
  border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer;
  font-size: 10px; display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(220,38,38,0.85); }
}

.btn-capa {
  position: absolute; top: 4px; left: 4px;
  background: rgba(0,0,0,0.55); color: #d1d5db;
  border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, color 0.15s;
  .material-symbols-outlined { font-size: 16px; }
  &:hover { background: rgba(0,0,0,0.8); color: #fbbf24; }
  &.active { color: #fbbf24; background: rgba(0,0,0,0.75); }
  &:disabled { opacity: 0.5; cursor: default; }
}

.capa-badge {
  position: absolute; bottom: 6px; left: 6px;
  background: rgba(251,191,36,0.9); color: #1c1917;
  border-radius: 4px; padding: 2px 6px;
  font-size: 11px; font-weight: 700;
  display: flex; align-items: center; gap: 2px;
  .material-symbols-outlined { font-size: 12px; }
}

.foto-card.is-capa {
  outline: 2px solid #fbbf24;
  outline-offset: 2px;
}
</style>
