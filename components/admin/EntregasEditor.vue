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
const replacingZip = ref(false);
const oldZipKey = ref('');

// Background image upload
const bgFileRef = ref<HTMLInputElement | null>(null);
const isBgUploading = ref(false);
const replacingBg = ref(false);

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
  replacingZip.value = false;
  oldZipKey.value = '';
  replacingBg.value = false;
  view.value = 'create';
}

function openEdit(e: Entrega) {
  // Popula imediatamente com os dados da lista (UX responsivo)
  populateForm(e);
  activeEntrega.value = { ...e };
  view.value = 'edit';
  // Depois re-busca do servidor para garantir dados frescos
  adminFetch<Entrega>(`/api/admin/entregas/${e.sessao_id}`)
    .then((fresh) => populateForm(fresh))
    .catch(() => {}); // silently ignore — form já tem dados da lista
}

function populateForm(e: Entrega) {
  form.sessao_id = e.sessao_id;
  form.r2_key = e.r2_key ?? '';
  form.nome_arquivo = e.nome_arquivo ?? '';
  form.bg_image_id = e.bg_image_id ?? '';
  form.mensagem = e.mensagem ?? '';
  form.ativo = e.ativo === 1;
  uploadProgress.value = 0;
  uploadDone.value = false;
  selectedZipFile.value = null;
  replacingZip.value = false;
  oldZipKey.value = '';
  replacingBg.value = false;
}

function onZipSelected(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (!f) return;
  selectedZipFile.value = f;
  if (!form.nome_arquivo) form.nome_arquivo = f.name;
  uploadZip();
}

async function uploadZip() {
  if (!selectedZipFile.value) return;
  isUploading.value = true;
  uploadProgress.value = 0;
  try {
    const { url, key } = await adminFetch<{ url: string; key: string }>('/api/admin/r2/presign', {
      method: 'POST',
      body: { filename: selectedZipFile.value.name, content_type: selectedZipFile.value.type || 'application/zip' },
    });

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

    // Deletar ZIP antigo do R2 se estava substituindo
    if (oldZipKey.value) {
      try {
        await adminFetch('/api/admin/r2/delete', { method: 'POST', body: { key: oldZipKey.value } });
      } catch { /* não bloquear se falhar */ }
      oldZipKey.value = '';
    }

    form.r2_key = key;
    if (!form.nome_arquivo) form.nome_arquivo = selectedZipFile.value.name;
    uploadDone.value = true;
    replacingZip.value = false;
    props.showMessage('ZIP enviado com sucesso!', 'success');
  } catch (e: any) {
    props.showMessage('Erro no upload: ' + e.message, 'error');
  } finally {
    isUploading.value = false;
  }
}

function startReplaceZip() {
  oldZipKey.value = form.r2_key;
  form.r2_key = '';
  form.nome_arquivo = '';
  uploadDone.value = false;
  selectedZipFile.value = null;
  replacingZip.value = true;
  nextTick(() => zipFileRef.value?.click());
}

function removeZip() {
  form.r2_key = '';
  form.nome_arquivo = '';
  uploadDone.value = false;
  selectedZipFile.value = null;
  replacingZip.value = false;
  oldZipKey.value = '';
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

function startReplaceBg() {
  replacingBg.value = true;
  nextTick(() => bgFileRef.value?.click());
}

async function uploadBgImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  isBgUploading.value = true;
  try {
    const fd = new FormData();
    fd.append('file', file);
    const token = import.meta.client ? sessionStorage.getItem('cms_token') : null;
    const res = await $fetch<any>('/api/upload', {
      method: 'POST',
      body: fd,
      headers: token ? { 'x-cms-token': token } : {},
    });
    form.bg_image_id = res.result?.id ?? '';
    if (!form.bg_image_id) throw new Error('ID de imagem não retornado');
    replacingBg.value = false;
    props.showMessage('Imagem de fundo enviada!', 'success');
  } catch (err: any) {
    props.showMessage('Erro ao enviar imagem: ' + (err.statusMessage || err.message), 'error');
  } finally {
    isBgUploading.value = false;
    if (bgFileRef.value) bgFileRef.value.value = '';
  }
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

          <!-- Estado: arquivo já existe e não estamos substituindo -->
          <div v-if="form.r2_key && !replacingZip" class="file-card">
            <div class="file-card-icon">📦</div>
            <div class="file-card-info">
              <strong>{{ form.nome_arquivo || form.r2_key.split('/').pop() }}</strong>
              <span class="text-muted text-sm">Arquivo salvo no R2</span>
            </div>
            <div class="file-card-actions">
              <button class="btn-sm" @click="startReplaceZip">🔄 Substituir</button>
              <button class="btn-sm btn-danger-sm" @click="removeZip">🗑 Remover</button>
            </div>
          </div>

          <!-- Estado: sem arquivo, ou em processo de substituição -->
          <template v-else-if="!form.r2_key || replacingZip">
            <!-- Uploading -->
            <div v-if="isUploading" class="upload-progress-card">
              <span>⬆ Enviando {{ selectedZipFile?.name }}…</span>
              <div class="progress-bar" style="margin-top:8px">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <span class="progress-pct">{{ uploadProgress }}%</span>
            </div>

            <!-- Drop zone (antes de selecionar) -->
            <div v-else-if="!selectedZipFile" class="upload-drop" @click="zipFileRef?.click()">
              📁 Clique para selecionar o arquivo ZIP
            </div>

            <!-- Selecionado, aguardando início (não deve aparecer pois auto-inicia) -->
            <div v-else-if="selectedZipFile && !uploadDone" class="upload-drop disabled">
              📁 {{ selectedZipFile.name }} — preparando…
            </div>

            <input ref="zipFileRef" type="file" accept=".zip,.rar,.7z" style="display:none" @change="onZipSelected" />
          </template>

          <!-- Upload concluído -->
          <p v-if="uploadDone" class="upload-success">✅ Upload concluído!</p>
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
            <!-- Imagem presente -->
            <div v-if="form.bg_image_id && !replacingBg" class="bg-card">
              <img :src="cfUrl(form.bg_image_id)" alt="Fundo atual" class="bg-thumb" />
              <div class="bg-card-actions">
                <button class="btn-sm" @click="startReplaceBg">🔄 Substituir</button>
                <button class="btn-sm btn-danger-sm" @click="form.bg_image_id = ''; replacingBg = false">🗑 Remover</button>
              </div>
            </div>

            <!-- Sem imagem ou substituindo -->
            <template v-else>
              <div class="upload-drop" style="padding: 16px;" @click="bgFileRef?.click()">
                <span v-if="isBgUploading">⏳ Enviando imagem...</span>
                <span v-else>🖼 Clique para escolher uma imagem de fundo</span>
              </div>
            </template>

            <input ref="bgFileRef" type="file" accept="image/*" style="display:none" :disabled="isBgUploading" @change="uploadBgImage" />
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
.upload-progress-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; font-size: 14px; color: #374151; }
.progress-pct { display: block; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; margin-top: 4px; }
.upload-drop.disabled { cursor: default; opacity: 0.6; &:hover { border-color: #d1d5db; background: transparent; } }

.file-card { display: flex; align-items: center; gap: 12px; background: #fff; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 16px; }
.file-card-icon { font-size: 28px; flex-shrink: 0; }
.file-card-info { flex: 1; display: flex; flex-direction: column; gap: 2px; strong { font-size: 14px; color: #1f2937; } }
.file-card-actions { display: flex; gap: 8px; flex-shrink: 0; }
.btn-danger-sm { background: #fef2f2; border-color: #fecaca; color: #b91c1c; &:hover { background: #fee2e2; } }

.bg-image-picker { display: flex; flex-direction: column; gap: 12px; }
.bg-card { display: flex; align-items: center; gap: 16px; }
.bg-thumb { width: 120px; height: 80px; object-fit: cover; border-radius: 6px; border: 1px solid #e5e7eb; display: block; flex-shrink: 0; }
.bg-card-actions { display: flex; flex-direction: column; gap: 8px; }

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
