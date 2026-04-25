<script lang="ts" setup>
const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const { adminFetch } = useAdminFetch();
const cfURI = useRuntimeConfig().public.cloudflareURI;

interface Cliente { id: number; nome: string; email: string; }
interface Sessao {
  id: number; cliente_id: number; nome_sessao: string; produto_tipo: string;
  pacote_index: number; fotos_incluidas: number; preco_foto_extra: number;
  status: string; criado_em: string; cliente_nome: string; cliente_email: string;
}
interface Foto { id: number; sessao_id: number; cloudflare_image_id: string; ordem: number; }
interface Produto { title: string; packages: { title: string; fotos_incluidas?: number; preco_foto_extra?: number; }[]; }

const sessoes = ref<Sessao[]>([]);
const clientes = ref<Cliente[]>([]);
const produtos = ref<Produto[]>([]);
const loading = ref(false);

// ─── Visualizações ───────────────────────────────────────────────────────────
type View = 'list' | 'create' | 'edit' | 'fotos' | 'selecao';
const view = ref<View>('list');
const activeSessao = ref<Sessao | null>(null);
const fotos = ref<Foto[]>([]);
const selecao = ref<any>(null);
const editingId = ref<number | null>(null);

// ─── Form criação / edição ────────────────────────────────────────────────────
const form = reactive({
  cliente_id: '',
  nome_sessao: '',
  produto_tipo: '',
  pacote_index: 0,
  fotos_incluidas: 0,
  preco_foto_extra: 0,
});
const saving = ref(false);

// ─── Upload fotos ─────────────────────────────────────────────────────────────
const uploadQueue = ref<{ file: File; status: 'pending' | 'processing' | 'done' | 'error'; progress: number; name: string; }[]>([]);
const isUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

// ─── Status labels ────────────────────────────────────────────────────────────
const statusLabels: Record<string, string> = {
  aguardando_fotos: '⏳ Aguardando fotos',
  aguardando_selecao: '📸 Aguardando seleção',
  selecao_concluida: '✅ Seleção concluída',
  entregue: '📦 Entregue',
};

async function load() {
  loading.value = true;
  try {
    const [s, c] = await Promise.all([
      adminFetch<Sessao[]>('/api/admin/sessoes'),
      adminFetch<Cliente[]>('/api/admin/clientes'),
    ]);
    sessoes.value = s;
    clientes.value = c;
    // Carrega produtos do investimento para preencher select
    await loadProdutos();
  } catch (e: any) {
    props.showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function loadProdutos() {
  try {
    const tree = await $fetch<any[]>('/api/fs/tree');
    const investNode = tree.find((n: any) => n.name === 'investimento' && n.isDirectory);
    if (!investNode?.children) return;

    const prods: Produto[] = [];
    for (const subdir of investNode.children) {
      if (!subdir.isDirectory) continue;
      const indexFile = subdir.children?.find((c: any) => c.name === 'index.json');
      if (!indexFile) continue;
      try {
        const raw = await $fetch<{ content: string }>('/api/fs/raw', { params: { path: indexFile.path } });
        const data = JSON.parse(raw.content);
        if (data.title && data.packages) prods.push(data);
      } catch {}
    }
    produtos.value = prods;
  } catch {}
}

const produtoSelecionado = computed(() =>
  produtos.value.find((p) => p.title === form.produto_tipo) ?? null,
);

let initializingEdit = false;

watch(() => form.produto_tipo, () => {
  if (initializingEdit) return;
  form.pacote_index = 0;
  autoFillPacote();
});
watch(() => form.pacote_index, () => {
  if (initializingEdit) return;
  autoFillPacote();
});

function autoFillPacote() {
  const pkg = produtoSelecionado.value?.packages[form.pacote_index];
  if (pkg) {
    form.fotos_incluidas = pkg.fotos_incluidas ?? 0;
    form.preco_foto_extra = pkg.preco_foto_extra ?? 0;
  }
}

function openCreate() {
  editingId.value = null;
  Object.assign(form, { cliente_id: '', nome_sessao: '', produto_tipo: '', pacote_index: 0, fotos_incluidas: 0, preco_foto_extra: 0 });
  view.value = 'create';
}

function openEdit(s: Sessao) {
  initializingEdit = true;
  editingId.value = s.id;
  Object.assign(form, {
    cliente_id: String(s.cliente_id),
    nome_sessao: s.nome_sessao,
    produto_tipo: s.produto_tipo,
    pacote_index: Number(s.pacote_index),
    fotos_incluidas: Number(s.fotos_incluidas),
    preco_foto_extra: Number(s.preco_foto_extra),
  });
  view.value = 'edit';
  setTimeout(() => { initializingEdit = false; }, 50);
}

async function updateSessao() {
  if (!form.nome_sessao || !form.produto_tipo) {
    props.showMessage('Preencha nome da sessão e tipo do produto', 'error');
    return;
  }
  if (!editingId.value) {
    props.showMessage('ID da sessão inválido', 'error');
    return;
  }
  saving.value = true;
  try {
    const sessao = sessoes.value.find((s) => s.id === editingId.value);
    const body = {
      nome_sessao: form.nome_sessao,
      produto_tipo: form.produto_tipo,
      pacote_index: Number(form.pacote_index),
      fotos_incluidas: Number(form.fotos_incluidas),
      preco_foto_extra: Number(form.preco_foto_extra),
      status: sessao?.status ?? 'aguardando_fotos',
    };
    console.log('[updateSessao] id:', editingId.value, 'body:', body);
    const result = await adminFetch(`/api/admin/sessoes/${editingId.value}`, {
      method: 'PUT',
      body,
    });
    console.log('[updateSessao] result:', result);
    props.showMessage('Sessão atualizada!', 'success');
    await load();
    view.value = 'list';
  } catch (e: any) {
    console.error('[updateSessao] error:', e);
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

async function createSessao() {
  if (!form.cliente_id || !form.nome_sessao || !form.produto_tipo) {
    props.showMessage('Preencha cliente, nome da sessão e tipo do produto', 'error');
    return;
  }
  saving.value = true;
  try {
    const res = await adminFetch<{ id: number }>('/api/admin/sessoes', {
      method: 'POST',
      body: { ...form, cliente_id: Number(form.cliente_id) },
    });
    props.showMessage('Sessão criada!', 'success');
    await load();
    // Abre direto para upload de fotos
    const nova = sessoes.value.find((s) => s.id === res.id);
    if (nova) openFotos(nova);
    else view.value = 'list';
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

async function updateStatus(sessao: Sessao, status: string) {
  const body = {
    nome_sessao: sessao.nome_sessao,
    produto_tipo: sessao.produto_tipo,
    pacote_index: sessao.pacote_index,
    fotos_incluidas: sessao.fotos_incluidas,
    preco_foto_extra: sessao.preco_foto_extra,
    status,
  };
  console.log('[updateStatus] id:', sessao.id, 'body:', body);
  try {
    const result = await adminFetch(`/api/admin/sessoes/${sessao.id}`, {
      method: 'PUT',
      body,
    });
    console.log('[updateStatus] result:', result);
    const idx = sessoes.value.findIndex((s) => s.id === sessao.id);
    if (idx !== -1) sessoes.value[idx] = { ...sessoes.value[idx], status };
    if (activeSessao.value?.id === sessao.id) activeSessao.value = { ...activeSessao.value, status };
    props.showMessage('Status atualizado', 'success');
  } catch (e: any) {
    console.error('[updateStatus] error:', e);
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

async function deleteSessao(s: Sessao) {
  if (!confirm(`Excluir sessão "${s.nome_sessao}"? As fotos cadastradas serão removidas.`)) return;
  try {
    await adminFetch(`/api/admin/sessoes/${s.id}`, { method: 'DELETE' });
    props.showMessage('Sessão removida', 'success');
    sessoes.value = sessoes.value.filter((x) => x.id !== s.id);
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

// ─── Fotos ───────────────────────────────────────────────────────────────────

async function openFotos(s: Sessao) {
  activeSessao.value = s;
  uploadQueue.value = [];
  view.value = 'fotos';
  await loadFotos(s.id);
}

async function loadFotos(sessaoId: number) {
  try {
    fotos.value = await adminFetch<Foto[]>(`/api/admin/sessoes/${sessaoId}/fotos`);
  } catch (e: any) {
    props.showMessage('Erro ao carregar fotos: ' + (e.statusMessage || e.message), 'error');
  }
}

function onFilesSelected(e: Event) {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const file of Array.from(input.files)) {
    uploadQueue.value.push({ file, status: 'pending', progress: 0, name: file.name });
  }
  input.value = '';
}

async function startUpload() {
  if (isUploading.value || !activeSessao.value) return;
  isUploading.value = true;
  const pending = uploadQueue.value.filter((q) => q.status === 'pending');

  for (const item of pending) {
    item.status = 'processing';
    item.progress = 0;
    try {
      // 1. Aplica marca d'água no canvas (client-side)
      const watermarkedBlob = await applyWatermark(item.file);
      item.progress = 40;

      // 2. Faz upload para Cloudflare Images via API existente
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

      // 3. Salva o imageId na sessão via D1
      await adminFetch(`/api/admin/sessoes/${activeSessao.value!.id}/fotos`, {
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
  await loadFotos(activeSessao.value!.id);
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
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;

      ctx.drawImage(img, 0, 0, w, h);

      // Marca d'água: texto diagonal repetido
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
        'image/jpeg',
        0.78,
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

async function removePhoto(foto: Foto) {
  if (!activeSessao.value) return;
  if (!confirm('Remover esta foto da sessão?')) return;
  try {
    await adminFetch(`/api/admin/sessoes/${activeSessao.value.id}/fotos`, {
      method: 'DELETE',
      body: { foto_id: foto.id },
    });
    fotos.value = fotos.value.filter((f) => f.id !== foto.id);
    props.showMessage('Foto removida', 'success');
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

// ─── Seleção do cliente (leitura) ─────────────────────────────────────────────

async function openSelecao(s: Sessao) {
  activeSessao.value = s;
  view.value = 'selecao';
  try {
    selecao.value = await adminFetch<any>(`/api/admin/sessoes/${s.id}/selecao`);
  } catch (e: any) {
    props.showMessage('Erro ao carregar seleção: ' + (e.statusMessage || e.message), 'error');
  }
}

function cfUrl(imageId: string) {
  return `${cfURI}${imageId}/public`;
}

onMounted(load);
</script>

<template>
  <div class="sessoes-editor">
    <!-- ─── Lista ──────────────────────────────────────────────────────── -->
    <template v-if="view === 'list'">
      <div class="editor-header">
        <h2>Sessões de Seleção <span class="count-badge">{{ sessoes.length }}</span></h2>
        <button class="btn-primary" @click="openCreate">+ Nova sessão</button>
      </div>

      <div v-if="loading" class="loading-hint">Carregando...</div>
      <div v-else-if="sessoes.length === 0" class="empty-hint">Nenhuma sessão cadastrada.</div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Sessão</th>
            <th>Produto / Pacote</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in sessoes" :key="s.id">
            <td>{{ s.cliente_nome }}<br /><small class="text-muted">{{ s.cliente_email }}</small></td>
            <td>{{ s.nome_sessao }}</td>
            <td>{{ s.produto_tipo }}<br /><small class="text-muted">Pacote {{ s.pacote_index + 1 }} · {{ s.fotos_incluidas }} fotos</small></td>
            <td>
              <select class="status-select" :value="s.status" @change="updateStatus(s, ($event.target as HTMLSelectElement).value)">
                <option value="aguardando_fotos">⏳ Aguardando fotos</option>
                <option value="aguardando_selecao">📸 Aguardando seleção</option>
                <option value="selecao_concluida">✅ Seleção concluída</option>
                <option value="entregue">📦 Entregue</option>
              </select>
            </td>
            <td class="actions-cell">
              <button class="btn-icon" title="Editar sessão" @click="openEdit(s)">✏️</button>
              <button class="btn-icon" title="Gerenciar fotos" @click="openFotos(s)">🖼</button>
              <button class="btn-icon" title="Ver seleção do cliente" @click="openSelecao(s)">👁</button>
              <button class="btn-icon btn-danger" title="Excluir" @click="deleteSessao(s)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <!-- ─── Criar / Editar sessão ──────────────────────────────────────── -->
    <template v-else-if="view === 'create' || view === 'edit'">
      <div class="editor-header">
        <button class="btn-back" @click="view = 'list'">← Voltar</button>
        <h2>{{ view === 'create' ? 'Nova sessão' : 'Editar sessão' }}</h2>
      </div>
      <div class="editor-form-card">
        <div class="form-grid">
          <div class="form-field">
            <label>Cliente</label>
            <select v-model="form.cliente_id" :disabled="view === 'edit'">
              <option value="">Selecione um cliente</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }} ({{ c.email }})</option>
            </select>
          </div>
          <div class="form-field">
            <label>Nome da sessão <small>(ex: Ensaio Mês Maio 2026)</small></label>
            <input v-model="form.nome_sessao" type="text" placeholder="Nome descritivo" />
          </div>
          <div class="form-field">
            <label>Tipo do produto</label>
            <select v-model="form.produto_tipo">
              <option value="">Selecione o produto</option>
              <option v-for="p in produtos" :key="p.title" :value="p.title">{{ p.title }}</option>
            </select>
          </div>
          <div class="form-field" v-if="produtoSelecionado">
            <label>Pacote</label>
            <select v-model.number="form.pacote_index">
              <option v-for="(pkg, i) in produtoSelecionado.packages" :key="i" :value="i">
                {{ pkg.title }}
              </option>
            </select>
          </div>
          <div class="form-field">
            <label>Fotos incluídas no pacote</label>
            <input v-model.number="form.fotos_incluidas" type="number" min="0" />
            <small v-if="form.fotos_incluidas === 0 && produtoSelecionado" class="field-hint warn">⚠️ Defina no editor de Investimento</small>
          </div>
          <div class="form-field">
            <label>Preço foto extra (R$)</label>
            <input v-model.number="form.preco_foto_extra" type="number" min="0" step="1" />
            <small v-if="form.preco_foto_extra === 0 && produtoSelecionado" class="field-hint warn">⚠️ Defina no editor de Investimento</small>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-secondary" @click="view = 'list'">Cancelar</button>
          <button class="btn-primary" @click="view === 'create' ? createSessao() : updateSessao()" :disabled="saving">
            {{ saving ? 'Salvando...' : (view === 'create' ? '✓ Criar sessão' : '💾 Salvar alterações') }}
          </button>
        </div>
      </div>
    </template>

    <!-- ─── Gerenciar fotos ──────────────────────────────────────────── -->
    <template v-else-if="view === 'fotos' && activeSessao">
      <div class="editor-header">
        <button class="btn-back" @click="view = 'list'; load()">← Voltar</button>
        <div>
          <h2>{{ activeSessao.nome_sessao }}</h2>
          <p class="text-muted text-sm">{{ activeSessao.cliente_nome }} · {{ statusLabels[activeSessao.status] }}</p>
        </div>
        <div class="header-actions">
          <select class="status-select" :value="activeSessao.status" @change="updateStatus(activeSessao!, ($event.target as HTMLSelectElement).value)">
            <option value="aguardando_fotos">⏳ Aguardando fotos</option>
            <option value="aguardando_selecao">📸 Aguardando seleção</option>
            <option value="selecao_concluida">✅ Seleção concluída</option>
            <option value="entregue">📦 Entregue</option>
          </select>
        </div>
      </div>

      <!-- Upload area -->
      <div class="upload-section">
        <div class="upload-drop" @click="fileInputRef?.click()" @dragover.prevent @drop.prevent="(e) => { const dt = (e as DragEvent).dataTransfer; if (dt) { const fakeEvent = { target: { files: dt.files } } as any; onFilesSelected(fakeEvent); } }">
          <span>🖼 Arraste fotos aqui ou clique para selecionar</span>
          <small>A marca d'água será aplicada automaticamente antes do upload</small>
        </div>
        <input ref="fileInputRef" type="file" accept="image/*" multiple style="display:none" @change="onFilesSelected" />

        <div v-if="uploadQueue.length > 0" class="upload-queue">
          <div class="upload-queue-header">
            <span>{{ uploadQueue.filter(q=>q.status==='done').length }}/{{ uploadQueue.length }} fotos processadas</span>
            <button class="btn-primary" @click="startUpload" :disabled="isUploading || uploadQueue.every(q=>q.status==='done')">
              {{ isUploading ? '⏳ Processando...' : '▶ Iniciar upload' }}
            </button>
          </div>
          <div v-for="(item, i) in uploadQueue" :key="i" class="queue-item">
            <span class="queue-status" :class="item.status">
              {{ item.status === 'done' ? '✅' : item.status === 'error' ? '❌' : item.status === 'processing' ? '⏳' : '⬜' }}
            </span>
            <span class="queue-name">{{ item.name }}</span>
            <div v-if="item.status === 'processing'" class="progress-bar">
              <div class="progress-fill" :style="{ width: item.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fotos existentes -->
      <div class="fotos-section">
        <h3>Fotos da sessão <span class="count-badge">{{ fotos.length }}</span></h3>
        <div v-if="fotos.length === 0" class="empty-hint">Nenhuma foto adicionada ainda.</div>
        <div v-else class="fotos-grid">
          <div v-for="foto in fotos" :key="foto.id" class="foto-card">
            <img :src="cfUrl(foto.cloudflare_image_id)" :alt="`Foto ${foto.id}`" loading="lazy" />
            <button class="foto-remove" @click="removePhoto(foto)" title="Remover foto">✕</button>
          </div>
        </div>
      </div>
    </template>

    <!-- ─── Seleção do cliente ───────────────────────────────────────── -->
    <template v-else-if="view === 'selecao' && activeSessao">
      <div class="editor-header">
        <button class="btn-back" @click="view = 'list'">← Voltar</button>
        <h2>Seleção — {{ activeSessao.nome_sessao }}</h2>
      </div>

      <div v-if="!selecao" class="loading-hint">Carregando...</div>
      <template v-else>
        <div class="selecao-summary">
          <div class="summary-stat">
            <span class="stat-value">{{ selecao.selecionadas }}</span>
            <span class="stat-label">fotos selecionadas</span>
          </div>
          <div class="summary-stat">
            <span class="stat-value">{{ activeSessao.fotos_incluidas }}</span>
            <span class="stat-label">incluídas no pacote</span>
          </div>
          <div class="summary-stat" :class="{ 'stat-extra': selecao.extras > 0 }">
            <span class="stat-value">{{ selecao.extras }}</span>
            <span class="stat-label">fotos extras</span>
          </div>
          <div class="summary-stat" :class="{ 'stat-extra': selecao.valor_extras > 0 }">
            <span class="stat-value">{{ selecao.valor_extras > 0 ? `R$ ${selecao.valor_extras.toFixed(2).replace('.', ',')}` : '—' }}</span>
            <span class="stat-label">valor extras</span>
          </div>
        </div>

        <div class="selecao-grid">
          <div
            v-for="foto in selecao.fotos"
            :key="foto.id"
            class="selecao-card"
            :class="{ selected: foto.selecionada === 1 }"
          >
            <div class="selecao-img-wrap">
              <img :src="cfUrl(foto.cloudflare_image_id)" :alt="`Foto ${foto.id}`" loading="lazy" />
              <span v-if="foto.selecionada === 1" class="selecao-check">✓</span>
            </div>
            <div v-if="foto.comentario" class="selecao-comment">
              💬 {{ foto.comentario }}
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.sessoes-editor { padding: 24px; }

.editor-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  h2 { font-size: 20px; font-weight: 600; flex: 1; }

  .header-actions { margin-left: auto; }
}

.btn-back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #6b7280;
  padding: 4px 0;

  &:hover { color: #1f2937; }
}

.btn-primary {
  background: #1f2937; color: #fff; border: none; border-radius: 6px;
  padding: 8px 16px; font-size: 14px; cursor: pointer; font-weight: 500;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #111827; }
}

.btn-secondary {
  background: #fff; color: #374151; border: 1px solid #d1d5db; border-radius: 6px;
  padding: 8px 16px; font-size: 14px; cursor: pointer;
  &:hover { background: #f9fafb; }
}

.editor-form-card {
  background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px;
}

.form-grid {
  display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
}

.form-field {
  display: flex; flex-direction: column; gap: 6px;
  label { font-size: 13px; font-weight: 500; color: #374151; }
  input, select {
    padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;
    &:focus { outline: none; border-color: #6b7280; }
  }
}

.field-hint { font-size: 11px; color: #6b7280; &.warn { color: #b45309; } }

.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }

.data-table {
  width: 100%; border-collapse: collapse; font-size: 14px;
  th {
    text-align: left; padding: 8px 12px; background: #f9fafb;
    border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151;
    font-size: 13px; text-transform: uppercase; letter-spacing: 0.02em;
  }
  td { padding: 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
  tr:hover td { background: #f9fafb; }
}

.status-select {
  padding: 4px 8px; border: 1px solid #d1d5db; border-radius: 6px;
  font-size: 13px; background: #fff; cursor: pointer;
}

.actions-cell { display: flex; gap: 4px; justify-content: flex-end; }

.btn-icon {
  background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; font-size: 16px;
  &:hover { background: #f3f4f6; }
  &.btn-danger:hover { background: #fef2f2; }
}

/* Upload */
.upload-section { margin-bottom: 32px; }

.upload-drop {
  border: 2px dashed #d1d5db; border-radius: 8px; padding: 32px; text-align: center;
  cursor: pointer; display: flex; flex-direction: column; gap: 8px; color: #6b7280;
  &:hover { border-color: #9ca3af; background: #f9fafb; }
  small { font-size: 13px; color: #9ca3af; }
}

.upload-queue { margin-top: 16px; }
.upload-queue-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 14px; }

.queue-item {
  display: flex; align-items: center; gap: 8px; padding: 6px 0;
  border-bottom: 1px solid #f3f4f6; font-size: 13px;
}
.queue-status { font-size: 16px; width: 24px; text-align: center; }
.queue-name { flex: 1; color: #374151; }
.progress-bar { width: 80px; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
.progress-fill { height: 100%; background: #1f2937; transition: width 0.2s; }

/* Fotos grid */
.fotos-section h3 { font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.fotos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.foto-card {
  position: relative; border-radius: 6px; overflow: hidden; aspect-ratio: 1;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}
.foto-remove {
  position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.6); color: #fff;
  border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer;
  font-size: 10px; display: flex; align-items: center; justify-content: center;
  &:hover { background: rgba(220,38,38,0.85); }
}

/* Seleção */
.selecao-summary {
  display: flex; gap: 24px; margin-bottom: 24px;
  padding: 16px 24px; background: #f9fafb; border-radius: 8px; flex-wrap: wrap;
}
.summary-stat {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  .stat-value { font-size: 28px; font-weight: 700; color: #1f2937; }
  .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
  &.stat-extra .stat-value { color: #d97706; }
}

.selecao-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.selecao-card {
  border-radius: 6px; overflow: hidden; border: 2px solid transparent;
  &.selected { border-color: #22c55e; }
}
.selecao-img-wrap {
  position: relative; aspect-ratio: 1;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
}
.selecao-check {
  position: absolute; bottom: 4px; right: 4px; background: #22c55e; color: #fff;
  border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
}
.selecao-comment {
  padding: 6px 8px; font-size: 12px; color: #374151; background: #fff;
  border-top: 1px solid #f3f4f6;
}

.count-badge { background: #e5e7eb; color: #374151; font-size: 12px; font-weight: 600; padding: 0.1em 0.5em; border-radius: 999px; }
.text-muted { color: #6b7280; }
.text-sm { font-size: 13px; }
.loading-hint, .empty-hint { color: #9ca3af; font-size: 14px; padding: 32px 0; text-align: center; }
</style>
