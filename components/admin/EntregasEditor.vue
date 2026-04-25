<script lang="ts" setup>
const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const { adminFetch } = useAdminFetch();
const cfURI = useRuntimeConfig().public.cloudflareURI;

interface Sessao { id: number; nome_sessao: string; cliente_nome: string; status: string; }
interface Entrega {
  id?: number; sessao_id: number; r2_key: string | null; nome_arquivo: string | null;
  bg_image_id: string | null; mensagem: string | null; ativo: number;
  nome_sessao?: string; cliente_nome?: string;
}

const entregas = ref<Entrega[]>([]);
const sessoes = ref<Sessao[]>([]);
const loading = ref(false);

type View = 'list' | 'create' | 'edit';
const view = ref<View>('list');
const activeEntrega = ref<Partial<Entrega> & { sessao_id: number }>({ sessao_id: 0 });

// Form fields
const form = reactive({
  sessao_id: 0,
  r2_key: '',
  nome_arquivo: '',
  bg_image_id: '',
  mensagem: '',
  ativo: true,
});

// Upload ZIP state
const uploadProgress = ref(0);
const isUploading = ref(false);
const uploadDone = ref(false);
const zipFileRef = ref<HTMLInputElement | null>(null);
const selectedZipFile = ref<File | null>(null);

// CF Images browser for bg
const showImageBrowser = ref(false);
const cfImages = ref<any[]>([]);
const cfImagesPage = ref(1);
const cfImagesLoading = ref(false);
const cfImagesHasMore = ref(true);

async function load() {
  loading.value = true;
  try {
    const [e, s] = await Promise.all([
      adminFetch<Entrega[]>('/api/admin/entregas'),
      adminFetch<Sessao[]>('/api/admin/sessoes'),
    ]);
    entregas.value = e;
    sessoes.value = s;
  } catch (e: any) {
    props.showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  Object.assign(form, { sessao_id: 0, r2_key: '', nome_arquivo: '', bg_image_id: '', mensagem: '', ativo: true });
  selectedZipFile.value = null;
  uploadProgress.value = 0;
  uploadDone.value = false;
  view.value = 'create';
}

function openEdit(e: Entrega) {
  form.sessao_id = e.sessao_id;
  form.r2_key = e.r2_key ?? '';
  form.nome_arquivo = e.nome_arquivo ?? '';
  form.bg_image_id = e.bg_image_id ?? '';
  form.mensagem = e.mensagem ?? '';
  form.ativo = e.ativo === 1;
  activeEntrega.value = { ...e };
  uploadProgress.value = 0;
  uploadDone.value = false;
  view.value = 'edit';
}

function onZipSelected(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  selectedZipFile.value = f;
  if (!form.nome_arquivo) form.nome_arquivo = f.name;
}

async function uploadZip() {
  if (!selectedZipFile.value) return;
  isUploading.value = true;
  uploadProgress.value = 0;
  try {
    // 1. Pega presigned URL do servidor
    const { url, key } = await adminFetch<{ url: string; key: string }>('/api/admin/r2/presign', {
      method: 'POST',
      body: { filename: selectedZipFile.value.name, content_type: selectedZipFile.value.type || 'application/zip' },
    });

    // 2. Upload direto para R2 via XHR (suporta progresso)
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (ev) => {
        if (ev.lengthComputable) uploadProgress.value = Math.round((ev.loaded / ev.total) * 100);
      });
      xhr.addEventListener('load', () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`))));
      xhr.addEventListener('error', () => reject(new Error('Erro de rede')));
      xhr.open('PUT', url);
      xhr.setRequestHeader('Content-Type', selectedZipFile.value!.type || 'application/zip');
      xhr.send(selectedZipFile.value);
    });

    form.r2_key = key;
    if (!form.nome_arquivo) form.nome_arquivo = selectedZipFile.value.name;
    uploadDone.value = true;
    props.showMessage('ZIP enviado com sucesso!', 'success');
  } catch (e: any) {
    props.showMessage('Erro no upload: ' + e.message, 'error');
  } finally {
    isUploading.value = false;
  }
}

async function saveEntrega() {
  if (!form.sessao_id) {
    props.showMessage('Selecione uma sessão', 'error');
    return;
  }
  try {
    await adminFetch('/api/admin/entregas', {
      method: 'POST',
      body: { ...form, sessao_id: Number(form.sessao_id) },
    });
    props.showMessage('Entrega salva!', 'success');
    await load();
    view.value = 'list';
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function updateEntrega() {
  if (!activeEntrega.value?.sessao_id) return;
  try {
    await adminFetch(`/api/admin/entregas/${activeEntrega.value.sessao_id}`, {
      method: 'PUT',
      body: { ...form, sessao_id: Number(form.sessao_id), ativo: form.ativo },
    });
    props.showMessage('Entrega atualizada!', 'success');
    await load();
    view.value = 'list';
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function deleteEntrega(e: Entrega) {
  if (!confirm(`Excluir entrega de "${e.nome_sessao}"?`)) return;
  try {
    await adminFetch(`/api/admin/entregas/${e.sessao_id}`, { method: 'DELETE' });
    entregas.value = entregas.value.filter((x) => x.sessao_id !== e.sessao_id);
    props.showMessage('Entrega removida', 'success');
  } catch (err: any) {
    props.showMessage('Erro: ' + (err.statusMessage || err.message), 'error');
  }
}

function copyLink(sessaoId: number) {
  const url = `${window.location.origin}/area-cliente/entrega/${sessaoId}`;
  navigator.clipboard.writeText(url).then(() => props.showMessage('Link copiado!', 'success'));
}

// CF Images browser
async function openImageBrowser() {
  showImageBrowser.value = true;
  cfImages.value = [];
  cfImagesPage.value = 1;
  cfImagesHasMore.value = true;
  await loadCfImages();
}

async function loadCfImages() {
  if (cfImagesLoading.value) return;
  cfImagesLoading.value = true;
  try {
    const res = await adminFetch<any>(`/api/cf-images?page=${cfImagesPage.value}`);
    const imgs = res.result?.images ?? [];
    cfImages.value.push(...imgs);
    cfImagesHasMore.value = imgs.length >= 20;
    cfImagesPage.value++;
  } finally {
    cfImagesLoading.value = false;
  }
}

function selectBgImage(imageId: string) {
  form.bg_image_id = imageId;
  showImageBrowser.value = false;
}

function cfUrl(id: string) { return `${cfURI}${id}/public`; }

onMounted(load);
</script>

<template>
  <div class="entregas-editor">
    <!-- ─── Lista ──────────────────────────────────────────────────── -->
    <template v-if="view === 'list'">
      <div class="editor-header">
        <h2>Entregas de Ensaio <span class="count-badge">{{ entregas.length }}</span></h2>
        <button class="btn-primary" @click="openCreate">+ Nova entrega</button>
      </div>
      <div v-if="loading" class="loading-hint">Carregando...</div>
      <div v-else-if="entregas.length === 0" class="empty-hint">Nenhuma entrega cadastrada.</div>
      <table v-else class="data-table">
        <thead>
          <tr><th>Sessão</th><th>Cliente</th><th>Arquivo</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="e in entregas" :key="e.sessao_id">
            <td>{{ e.nome_sessao }}</td>
            <td>{{ e.cliente_nome }}</td>
            <td class="text-sm text-muted">{{ e.nome_arquivo ?? '—' }}</td>
            <td>
              <span class="status-pill" :class="e.ativo ? 'active' : 'inactive'">
                {{ e.ativo ? '🟢 Ativa' : '🔴 Inativa' }}
              </span>
            </td>
            <td class="actions-cell">
              <button class="btn-icon" title="Copiar link do cliente" @click="copyLink(e.sessao_id)">🔗</button>
              <button class="btn-icon" title="Editar" @click="openEdit(e)">✏️</button>
              <button class="btn-icon btn-danger" title="Excluir" @click="deleteEntrega(e)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- ─── Criar / Editar ───────────────────────────────────────── -->
    <template v-else>
      <div class="editor-header">
        <button class="btn-back" @click="view = 'list'">← Voltar</button>
        <h2>{{ view === 'create' ? 'Nova entrega' : 'Editar entrega' }}</h2>
      </div>

      <div class="editor-form-card">
        <!-- Sessão (read-only no edit) -->
        <div class="form-field" v-if="view === 'create'">
          <label>Sessão do ensaio</label>
          <select v-model.number="form.sessao_id">
            <option :value="0">Selecione a sessão</option>
            <option v-for="s in sessoes" :key="s.id" :value="s.id">
              {{ s.nome_sessao }} — {{ s.cliente_nome }}
            </option>
          </select>
        </div>

        <!-- Upload ZIP -->
        <div class="upload-zip-section">
          <h3>📦 Arquivo ZIP do ensaio</h3>
          <div v-if="form.r2_key && !selectedZipFile" class="current-file">
            ✅ Arquivo atual: <strong>{{ form.nome_arquivo || form.r2_key }}</strong>
            <button class="btn-sm" @click="selectedZipFile = null; form.r2_key = ''; uploadDone = false">Trocar arquivo</button>
          </div>
          <template v-else>
            <div class="upload-drop" @click="zipFileRef?.click()">
              <span v-if="!selectedZipFile">📁 Clique para selecionar o arquivo ZIP</span>
              <span v-else>📁 {{ selectedZipFile.name }} ({{ (selectedZipFile.size / 1024 / 1024).toFixed(1) }} MB)</span>
            </div>
            <input ref="zipFileRef" type="file" accept=".zip,.rar,.7z" style="display:none" @change="onZipSelected" />
            <div v-if="selectedZipFile && !uploadDone" class="upload-actions">
              <div v-if="isUploading" class="progress-wrap">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                </div>
                <span>{{ uploadProgress }}%</span>
              </div>
              <button v-else class="btn-primary" @click="uploadZip">⬆ Enviar para R2</button>
            </div>
            <p v-if="uploadDone" class="upload-success">✅ Upload concluído!</p>
          </template>
        </div>

        <!-- Nome do arquivo (para exibir ao cliente) -->
        <div class="form-field">
          <label>Nome do arquivo <small>(exibido ao cliente)</small></label>
          <input v-model="form.nome_arquivo" type="text" placeholder="Ensaio_Lillia_2026.zip" />
        </div>

        <!-- Mensagem personalizada -->
        <div class="form-field">
          <label>Mensagem para o cliente</label>
          <textarea v-model="form.mensagem" rows="4" placeholder="Olá! Seu ensaio está pronto com muito amor e cuidado. Que essas fotos te lembrem sempre do quanto você é especial! 💛"></textarea>
        </div>

        <!-- Imagem de fundo -->
        <div class="form-field">
          <label>Imagem de fundo da página</label>
          <div class="bg-image-picker">
            <div v-if="form.bg_image_id" class="bg-preview">
              <img :src="cfUrl(form.bg_image_id)" alt="Fundo selecionado" />
              <button class="btn-sm" @click="form.bg_image_id = ''">Remover</button>
            </div>
            <button class="btn-secondary" @click="openImageBrowser">
              {{ form.bg_image_id ? '🖼 Trocar imagem' : '🖼 Escolher imagem de fundo' }}
            </button>
          </div>
        </div>

        <!-- Ativo toggle -->
        <div class="form-field">
          <label>Link de entrega</label>
          <label class="toggle-wrap">
            <input type="checkbox" v-model="form.ativo" />
            <span class="toggle-track"><span class="toggle-thumb"></span></span>
            <span>{{ form.ativo ? '🟢 Ativo — cliente pode acessar' : '🔴 Inativo — link desabilitado' }}</span>
          </label>
        </div>

        <div class="form-actions">
          <button class="btn-secondary" @click="view = 'list'">Cancelar</button>
          <button class="btn-primary" @click="view === 'create' ? saveEntrega() : updateEntrega()">
            💾 Salvar entrega
          </button>
        </div>
      </div>
    </template>

    <!-- ─── CF Images browser modal ──────────────────────────────── -->
    <div v-if="showImageBrowser" class="modal-overlay" @click.self="showImageBrowser = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Escolher imagem de fundo</h3>
          <button class="btn-icon" @click="showImageBrowser = false">✕</button>
        </div>
        <div class="modal-grid">
          <div v-for="img in cfImages" :key="img.id" class="modal-img-card" @click="selectBgImage(img.id)">
            <img :src="cfUrl(img.id)" :alt="img.filename" loading="lazy" />
          </div>
        </div>
        <button v-if="cfImagesHasMore" class="btn-secondary load-more" @click="loadCfImages" :disabled="cfImagesLoading">
          {{ cfImagesLoading ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.entregas-editor { padding: 24px; }

.editor-header {
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;
  h2 { font-size: 20px; font-weight: 600; flex: 1; }
}

.btn-back { background: none; border: none; cursor: pointer; font-size: 14px; color: #6b7280; padding: 4px 0; &:hover { color: #1f2937; } }
.btn-primary { background: #1f2937; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer; font-weight: 500; &:disabled { opacity: 0.5; cursor: not-allowed; } &:hover:not(:disabled) { background: #111827; } }
.btn-secondary { background: #fff; color: #374151; border: 1px solid #d1d5db; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer; &:hover { background: #f9fafb; } }
.btn-sm { background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer; }
.btn-icon { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; font-size: 16px; &:hover { background: #f3f4f6; } &.btn-danger:hover { background: #fef2f2; } }

.editor-form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.form-field { display: flex; flex-direction: column; gap: 6px; label { font-size: 13px; font-weight: 500; color: #374151; } input, select, textarea { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px; font-family: inherit; resize: vertical; &:focus { outline: none; border-color: #6b7280; } } }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; }

.upload-zip-section { padding: 20px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; h3 { font-size: 15px; font-weight: 600; margin-bottom: 12px; } }
.upload-drop { border: 2px dashed #d1d5db; border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; color: #6b7280; font-size: 14px; &:hover { border-color: #9ca3af; background: #fff; } }
.upload-actions { margin-top: 12px; display: flex; gap: 12px; align-items: center; }
.progress-wrap { display: flex; align-items: center; gap: 12px; flex: 1; font-size: 13px; font-weight: 600; }
.progress-bar { flex: 1; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: #1f2937; transition: width 0.2s; }
.upload-success { color: #16a34a; font-size: 14px; margin-top: 8px; }
.current-file { font-size: 14px; color: #374151; display: flex; align-items: center; gap: 12px; }

.bg-image-picker { display: flex; flex-direction: column; gap: 12px; }
.bg-preview { display: flex; align-items: center; gap: 16px; img { width: 80px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb; } }

.toggle-wrap { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px; input { display: none; } }
.toggle-track { width: 36px; height: 20px; background: #d1d5db; border-radius: 999px; position: relative; transition: background 0.2s; input:checked ~ & { background: #1f2937; } }
.toggle-thumb { width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s; input:checked ~ .toggle-track & { transform: translateX(16px); } }

.data-table { width: 100%; border-collapse: collapse; font-size: 14px; th { text-align: left; padding: 8px 12px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; font-size: 13px; text-transform: uppercase; } td { padding: 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; } tr:hover td { background: #f9fafb; } }
.actions-cell { display: flex; gap: 4px; justify-content: flex-end; }
.status-pill { font-size: 13px; padding: 0.2em 0.6em; border-radius: 999px; &.active { background: #dcfce7; color: #15803d; } &.inactive { background: #fee2e2; color: #b91c1c; } }

.count-badge { background: #e5e7eb; color: #374151; font-size: 12px; font-weight: 600; padding: 0.1em 0.5em; border-radius: 999px; }
.text-muted { color: #6b7280; } .text-sm { font-size: 13px; }
.loading-hint, .empty-hint { color: #9ca3af; font-size: 14px; padding: 32px 0; text-align: center; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: #fff; border-radius: 12px; width: 90vw; max-width: 800px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; h3 { font-size: 16px; font-weight: 600; } }
.modal-grid { flex: 1; overflow-y: auto; padding: 16px; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px; }
.modal-img-card { aspect-ratio: 1; border-radius: 4px; overflow: hidden; cursor: pointer; border: 2px solid transparent; &:hover { border-color: #1f2937; } img { width: 100%; height: 100%; object-fit: cover; display: block; } }
.load-more { margin: 12px; &:disabled { opacity: 0.5; } }
</style>
