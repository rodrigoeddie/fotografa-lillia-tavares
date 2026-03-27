<script lang="ts" setup>
definePageMeta({ layout: false });

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

const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';
const ESTUDIO_LINK = `<a href='https://www.fotografalilliatavares.com.br/estudio'>Estúdio Lillia Tavares</a>`;

// Returns the correct avatar URL: CF if CF ID stored, otherwise local project file.
// Google URLs (lh3.googleusercontent.com) are intentionally ignored.
function reviewAvatarUrl(review: { id: number; photo?: string }): string {
  if (review.photo && !review.photo.startsWith('http')) {
    return CF_IMG_BASE + review.photo + '/public';
  }
  return `/assets/images/depoimentos/reviewer-${review.id}.jpg`;
}

// Auth
const authenticated = ref(false);
const loginPassword = ref('');
const loginError = ref('');
const loginLoading = ref(false);
const cmsToken = ref('');

async function doLogin() {
  loginLoading.value = true;
  loginError.value = '';
  try {
    const res = await $fetch<{ success: boolean; token: string }>('/api/cms-login', {
      method: 'POST',
      body: { password: loginPassword.value },
    });
    if (res.success) {
      cmsToken.value = res.token;
      authenticated.value = true;
      sessionStorage.setItem('cms_token', res.token);
      loadCategories();
      loadFileTree();
    }
  } catch {
    loginError.value = 'Senha incorreta';
  } finally {
    loginLoading.value = false;
  }
}

// State
const categories = ref<{ name: string; path: string; slug: string; title: string }[]>([]);
const works = ref<{ name: string; path: string }[]>([]);
const selectedCategory = ref('');
const selectedWork = ref('');
const workData = ref<WorkData | null>(null);
const saving = ref(false);
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

// Cloudflare image browser
const cfImages = ref<CfImage[]>([]);
const cfImagesLoading = ref(false);
const cfImagesPage = ref(1);
const cfImagesTotalCount = ref(0);
const cfBrowserOpen = ref(false);
const cfBrowserTarget = ref(-1);
const cfImagesError = ref('');

// Rich editor refs
const descEditorRef = ref<HTMLDivElement | null>(null);
const localEditorRef = ref<HTMLDivElement | null>(null);

const IMAGE_PRESETS: Record<string, { width: number; height: number; format: string; customClass?: string; label: string }> = {
  'paisagem-full': { width: 1700, height: 1134, format: 'paisagem', label: 'Paisagem Full (100%)' },
  'paisagem-w50': { width: 850, height: 567, format: 'paisagem', customClass: 'w50', label: 'Paisagem 50%' },
  'retrato-w33': { width: 567, height: 850, format: 'retrato', customClass: 'w33', label: 'Retrato 33%' },
  'retrato-w50': { width: 850, height: 1275, format: 'retrato', customClass: 'w50', label: 'Retrato 50%' },
  'retrato-w25': { width: 425, height: 637, format: 'retrato', customClass: 'w25', label: 'Retrato 25%' },
};

const categoryOptions = computed(() =>
  categories.value.map(c => ({ slug: c.slug, title: c.title }))
);

// Load categories
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
    showMessage('Erro ao carregar categorias: ' + e.message, 'error');
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
    showMessage('Erro ao carregar trabalhos: ' + e.message, 'error');
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
    showMessage('Erro ao carregar trabalho: ' + e.message, 'error');
  } finally {
    loading.value = false;
  }
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
    showMessage('Salvo com sucesso!', 'success');
  } catch (e: any) {
    showMessage('Erro ao salvar: ' + e.message, 'error');
  } finally {
    saving.value = false;
  }
}

async function uploadImage(file: File, index: number) {
  if (!workData.value) return;
  workData.value.album[index]._uploading = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await $fetch<any>('/api/upload', { method: 'POST', body: formData });
    if (result.success && result.result) {
      workData.value.album[index].imageId = result.result.id;
      showMessage('Imagem enviada!', 'success');
    }
  } catch (e: any) {
    console.error('[upload error]', e, 'e.data:', e.data);
    // $fetch wraps h3 errors: e.data = full error body, e.data.data = the `data` field passed to createError
    const cfErrors = e.data?.data as Array<{ code: number; message: string }> | undefined;
    const detail = Array.isArray(cfErrors) && cfErrors[0]?.message ? cfErrors[0].message : null;
    const fallback = e.data?.statusMessage || e.statusMessage || e.message;
    showMessage(detail ? `Upload falhou: ${detail}` : `Erro no upload: ${fallback}`, 'error');
  } finally {
    if (workData.value?.album[index]) workData.value.album[index]._uploading = false;
  }
}

// Cloudflare image browser
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
  workData.value.album[cfBrowserTarget.value].imageId = imageId;
  cfBrowserOpen.value = false;
  showMessage('Imagem selecionada!', 'success');
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

// Drag & drop
function onDragStart(index: number) { dragIndex.value = index; }
function onDragOver(e: DragEvent, index: number) { e.preventDefault(); dragOverIndex.value = index; }
function onDragEnd() {
  if (dragIndex.value !== null && dragOverIndex.value !== null && workData.value) {
    const [moved] = workData.value.album.splice(dragIndex.value, 1);
    workData.value.album.splice(dragOverIndex.value, 0, moved);
  }
  dragIndex.value = null;
  dragOverIndex.value = null;
}

function onFileDrop(e: DragEvent, index: number) {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files && files.length > 0 && files[0].type.startsWith('image/')) uploadImage(files[0], index);
}

function onFileSelect(e: Event, index: number) {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length > 0) uploadImage(input.files[0], index);
}

function showMessage(msg: string, type: 'success' | 'error') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 6000);
}

const highlightItems = computed(() => {
  if (!workData.value) return [];
  return workData.value.album.map((item, index) => ({ ...item, _origIndex: index })).filter(i => i.highlight);
});

const normalItems = computed(() => {
  if (!workData.value) return [];
  return workData.value.album.map((item, index) => ({ ...item, _origIndex: index })).filter(i => !i.highlight);
});

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

// ─── File Manager ─────────────────────────────────────────────────────────────
interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
}
interface FlatNode extends TreeNode { depth: number }

const fileSidebarOpen = ref(true);
const fileTree = ref<TreeNode[]>([]);
const expandedPaths = ref(new Set<string>());
const renamingPath = ref<string | null>(null);
const renameValue = ref('');
const creatingIn = ref<string | null>(null); // null = closed, '' = root, 'path' = inside folder
const createName = ref('');
const createType = ref<'file' | 'dir'>('file');

// Context menu
const ctxMenu = ref<{ visible: boolean; x: number; y: number; node: FlatNode | null }>({
  visible: false, x: 0, y: 0, node: null,
});

function openCtxMenu(e: MouseEvent, node: FlatNode) {
  e.preventDefault();
  e.stopPropagation();
  const margin = 8;
  const menuW = 220;
  const menuH = 180;
  let x = e.clientX;
  let y = e.clientY;
  if (x + menuW > window.innerWidth - margin) x = window.innerWidth - menuW - margin;
  if (y + menuH > window.innerHeight - margin) y = window.innerHeight - menuH - margin;
  ctxMenu.value = { visible: true, x, y, node };
}

function openCtxMenuRoot(e: MouseEvent) {
  e.preventDefault();
  openCtxMenu(e, { name: 'content', path: '', isDirectory: true, depth: -1 });
}

function closeCtxMenu() {
  ctxMenu.value.visible = false;
}

function ctxCreate(parentPath: string, type: 'file' | 'dir') {
  closeCtxMenu();
  creatingIn.value = parentPath;
  createName.value = '';
  createType.value = type;
  // Auto-expand parent so inline row is visible
  if (parentPath) {
    const s = new Set(expandedPaths.value);
    s.add(parentPath);
    expandedPaths.value = s;
  }
}
const fileEditorOpen = ref(false);
const fileEditorPath = ref('');
const fileEditorContent = ref('');
const fileEditorSaving = ref(false);
const fileEditorLoading = ref(false);
const fileEditorDirty = ref(false);

const flatTree = computed<FlatNode[]>(() => {
  const result: FlatNode[] = [];
  function walk(nodes: TreeNode[], depth: number) {
    for (const node of nodes) {
      result.push({ ...node, depth });
      if (node.isDirectory && expandedPaths.value.has(node.path)) {
        walk(node.children || [], depth + 1);
      }
    }
  }
  walk(fileTree.value, 0);
  return result;
});

async function loadFileTree() {
  try {
    fileTree.value = await $fetch<TreeNode[]>('/api/fs/tree', { params: { _t: Date.now() } });
  } catch (e: any) {
    showMessage('Erro ao carregar árvore de arquivos: ' + e.message, 'error');
  }
}

function toggleDir(path: string) {
  const s = new Set(expandedPaths.value);
  s.has(path) ? s.delete(path) : s.add(path);
  expandedPaths.value = s;
}

async function openFileEditor(filePath: string) {
  fileEditorPath.value = filePath;
  fileEditorOpen.value = true;
  fileEditorLoading.value = true;
  fileEditorDirty.value = false;
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(filePath)}`);
    let content = res.content;
    if (filePath.endsWith('.json')) {
      try { content = JSON.stringify(JSON.parse(content), null, 2); } catch { /* keep as-is */ }
    }
    fileEditorContent.value = content;
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + e.message, 'error');
    fileEditorOpen.value = false;
  } finally {
    fileEditorLoading.value = false;
  }
}

async function saveFileEditor() {
  fileEditorSaving.value = true;
  try {
    await $fetch('/api/fs/raw', {
      method: 'POST',
      body: { path: fileEditorPath.value, content: fileEditorContent.value },
    });
    fileEditorDirty.value = false;
    showMessage('Arquivo salvo!', 'success');
  } catch (e: any) {
    showMessage('Erro ao salvar: ' + e.message, 'error');
  } finally {
    fileEditorSaving.value = false;
  }
}

function startRename(node: FlatNode) {
  renamingPath.value = node.path;
  renameValue.value = node.name;
}

async function confirmRename() {
  if (!renamingPath.value || !renameValue.value.trim()) { renamingPath.value = null; return; }
  try {
    await $fetch('/api/fs/action', { method: 'POST', body: { action: 'rename', path: renamingPath.value, newName: renameValue.value.trim() } });
    await loadFileTree();
    showMessage('Renomeado!', 'success');
  } catch (e: any) {
    showMessage('Erro ao renomear: ' + e.message, 'error');
  } finally {
    renamingPath.value = null;
  }
}

async function deleteItem(node: FlatNode) {
  if (!confirm(`Deletar "${node.name}"? ${node.isDirectory ? 'Isso irá deletar tudo dentro da pasta.' : ''}`)) return;
  try {
    await $fetch('/api/fs/action', { method: 'POST', body: { action: 'delete', path: node.path } });
    await loadFileTree();
    if (fileEditorPath.value.startsWith(node.path)) fileEditorOpen.value = false;
    showMessage('Deletado!', 'success');
  } catch (e: any) {
    showMessage('Erro ao deletar: ' + e.message, 'error');
  }
}

function startCreate(parentPath: string) {
  creatingIn.value = parentPath;
  createName.value = '';
  createType.value = 'file';
}

const PORTFOLIO_TEMPLATE = (catSlug: string, catTitle: string) => JSON.stringify({
  artigo: 'a',
  home: false,
  homeOrder: 99,
  colorHighlight: '#0e2b42',
  title: '',
  description: '<p></p>',
  category: { slug: catSlug, title: catTitle },
  local: "<a href='https://www.fotografalilliatavares.com.br/estudio'>Estúdio Lillia Tavares</a>",
  album: [],
}, null, 2);

async function confirmCreate() {
  if (!createName.value.trim()) { creatingIn.value = null; return; }
  const parentPath = creatingIn.value || '';
  const name = createName.value.trim();

  // Detect if inside an ensaio-fotografico category folder — e.g. ensaio-fotografico/01.corporativo
  const parts = parentPath.split('/');
  const isPortfolioCategory =
    parts[0] === 'ensaio-fotografico' &&
    parts.length === 2 &&
    createType.value === 'file' &&
    name.endsWith('.json');

  try {
    await $fetch('/api/fs/action', { method: 'POST', body: { action: 'create', path: parentPath, name, type: createType.value } });

    // Pre-fill portfolio template
    if (isPortfolioCategory) {
      const catSlug = parts[1].replace(/^\d+\./, '');
      const catTitle = catSlug.charAt(0).toUpperCase() + catSlug.slice(1).replace(/-/g, ' ');
      const newFilePath = parentPath ? `${parentPath}/${name}` : name;
      await $fetch('/api/fs/raw', { method: 'POST', body: { path: newFilePath, content: PORTFOLIO_TEMPLATE(catSlug, catTitle) } });
      showMessage('Arquivo criado com template de portfolio!', 'success');
    } else {
      showMessage('Criado!', 'success');
    }

    if (parentPath) { const s = new Set(expandedPaths.value); s.add(parentPath); expandedPaths.value = s; }
    await loadFileTree();
  } catch (e: any) {
    showMessage('Erro ao criar: ' + e.message, 'error');
  } finally {
    creatingIn.value = null;
  }
}

function fileIcon(node: FlatNode) {
  if (node.isDirectory) return expandedPaths.value.has(node.path) ? '📂' : '📁';
  if (node.name.endsWith('.json')) return '{}';
  if (node.name.endsWith('.md')) return '📝';
  return '📄';
}

// ─── CMS Mode ────────────────────────────────────────────────────────────────
const cmsMode = ref<'portfolio' | 'depoimentos' | null>(null);

// ─── Depoimentos CMS ─────────────────────────────────────────────────────────
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

const depData = ref<DepoimentosData | null>(null);
const depSaving = ref(false);
const depLoading = ref(false);
const DEP_PATH = 'depoimentos/index.json';

async function loadDepoimentos() {
  depLoading.value = true;
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(DEP_PATH)}`, { params: { _t: Date.now() } });
    depData.value = JSON.parse(res.content);
  } catch (e: any) {
    showMessage('Erro ao carregar depoimentos: ' + e.message, 'error');
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
    showMessage('Depoimentos salvos!', 'success');
  } catch (e: any) {
    showMessage('Erro ao salvar: ' + e.message, 'error');
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

// Upload de avatar para depoimentos (imagem pequena de perfil)
const avatarUploading = ref<number | null>(null);

// Depoimentos: search, collapse, drag-to-reorder
const depSearch = ref('');
const collapsedDeps = ref<Set<number>>(new Set());
const depDragIdx = ref<number | null>(null);
const depDragOverIdx = ref<number | null>(null);

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
      showMessage('Avatar enviado!', 'success');
    }
  } catch (e: any) {
    const cfErrors = e.data?.data as Array<{ code: number; message: string }> | undefined;
    const detail = Array.isArray(cfErrors) && cfErrors[0]?.message ? cfErrors[0].message : null;
    const fallback = e.data?.statusMessage || e.statusMessage || e.message;
    showMessage(detail ? `Upload falhou: ${detail}` : `Erro no upload: ${fallback}`, 'error');
  } finally {
    avatarUploading.value = null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Smart open: portfolio JSONs (ensaio-fotografico/cat/file.json) load in the CMS editor.
 * depoimentos/index.json opens the depoimentos CMS.
 * Everything else opens in the raw text editor.
 */
async function openInCms(filePath: string) {
  const parts = filePath.split('/');

  // Depoimentos
  if (filePath === DEP_PATH) {
    cmsMode.value = 'depoimentos';
    selectedWork.value = '';
    await loadDepoimentos();
    await nextTick();
    document.querySelector('.dep-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const isPortfolioWork =
    parts.length === 3 &&
    parts[0] === 'ensaio-fotografico' &&
    filePath.endsWith('.json');

  if (!isPortfolioWork) {
    openFileEditor(filePath);
    return;
  }

  cmsMode.value = 'portfolio';
  // Pre-load depoimentos for the testimonial selector
  if (!depData.value) loadDepoimentos();

  const categoryPath = `${parts[0]}/${parts[1]}`;

  // Load category + works if not already loaded
  if (selectedCategory.value !== categoryPath) {
    selectedCategory.value = categoryPath;
    await loadWorks(categoryPath);
  }

  selectedWork.value = filePath;
  // Scroll the main content into view smoothly
  await nextTick();
  document.querySelector('.editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
// ──────────────────────────────────────────────────────────────────────────────

// Compute URL for the work being edited
const pageUrl = computed(() => {
  if (!selectedWork.value) return null;
  // selectedWork = 'ensaio-fotografico/01.corporativo/01.some-slug.json'
  const parts = selectedWork.value.split('/');
  if (parts.length < 3) return null;
  const category = parts[1]?.replace(/^\d+\./, '');
  const slug = parts[2]?.replace(/\.json$/, '').replace(/^\d+\./, '');
  return `/ensaio-fotografico/${category}/${slug}`;
});

const portfolioWorks = computed(() => {
  const results: { label: string; value: string }[] = [];
  const root = fileTree.value.find(n => n.name === 'ensaio-fotografico');
  if (!root?.children) return results;
  for (const catNode of root.children) {
    if (!catNode.isDirectory || !catNode.children) continue;
    const catSlug = catNode.name.replace(/^\d+\./, '');
    for (const workNode of catNode.children) {
      if (workNode.isDirectory || !workNode.name.endsWith('.json') || workNode.name === 'index.json') continue;
      const workSlug = workNode.name.replace(/\.json$/, '').replace(/^\d+\./, '');
      results.push({ label: `${catSlug} / ${workSlug}`, value: `${catSlug}/${workSlug}` });
    }
  }
  return results;
});

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

watch(selectedCategory, (val) => { if (val) loadWorks(val); });
watch(selectedWork, (val) => { if (val) loadWork(val); });

onMounted(() => {
  const stored = sessionStorage.getItem('cms_token');
  if (stored) {
    cmsToken.value = stored;
    authenticated.value = true;
    loadCategories();
    loadFileTree();
  }
});
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!authenticated" class="login-screen">
    <form class="login-box" @submit.prevent="doLogin">
      <h1>CMS Portfolio</h1>
      <input v-model="loginPassword" type="password" placeholder="Senha" autofocus autocomplete="current-password" />
      <button type="submit" :disabled="loginLoading">{{ loginLoading ? 'Verificando...' : 'Entrar' }}</button>
      <p v-if="loginError" class="login-error">{{ loginError }}</p>
    </form>
  </div>

  <!-- CMS -->
  <div v-else class="admin-cms">
    <div class="container">
        <header class="cms-header">
        <div class="cms-header-left">
            <button class="btn-sidebar-toggle" @click="fileSidebarOpen = !fileSidebarOpen" :class="{ active: fileSidebarOpen }" title="Arquivos">
            <span class="toggle-icon">☰</span> Arquivos
            </button>
            <h1>CMS Portfolio</h1>
        </div>
        <NuxtLink to="/" class="back-link">← Voltar ao site</NuxtLink>
        </header>

        <Transition name="fade">
        <div v-if="message" class="notification" :class="messageType">{{ message }}</div>
        </Transition>

        <div class="cms-layout">
        <!-- File Sidebar -->
        <Transition name="slide-sidebar">
            <div v-show="fileSidebarOpen" class="file-sidebar">
            <div class="fs-header" @contextmenu.prevent="openCtxMenuRoot">
                <span>content/</span>
            </div>

            <div class="fs-tree">
                <template v-for="node in flatTree" :key="node.path">
                <div
                    class="fs-node"
                    :style="{ paddingLeft: `${node.depth * 14 + 8}px` }"
                    :class="{ 'is-dir': node.isDirectory, 'is-selected': selectedWork === node.path || (fileEditorPath === node.path && fileEditorOpen) }"
                    @contextmenu.prevent="openCtxMenu($event, node)"
                    @click="node.isDirectory ? toggleDir(node.path) : openInCms(node.path)">

                    <!-- Rename mode -->
                    <template v-if="renamingPath === node.path">
                    <input
                        v-model="renameValue"
                        class="fs-rename-input"
                        @click.stop
                        @keydown.enter="confirmRename"
                        @keydown.esc="renamingPath = null"
                        @vue:mounted="(el: any) => el.el?.focus()"
                    />
                    <button class="fs-action-btn ok" @click.stop="confirmRename">✓</button>
                    <button class="fs-action-btn cancel" @click.stop="renamingPath = null">✕</button>
                    </template>

                    <!-- Normal mode -->
                    <template v-else>
                    <span class="fs-toggle">{{ node.isDirectory ? (expandedPaths.has(node.path) ? '▾' : '▸') : '' }}</span>
                    <span class="fs-icon">{{ fileIcon(node) }}</span>
                    <span class="fs-name" :title="node.path">{{ node.name }}</span>
                    </template>
                </div>

                <!-- Inline create row — shown right after the target parent folder's block -->
                <div
                    v-if="creatingIn === node.path"
                    class="fs-create-row"
                    :style="{ paddingLeft: `${(node.depth + 1) * 14 + 8}px` }"
                    @click.stop>
                    <input
                    v-model="createName"
                    class="fs-create-input"
                    :placeholder="createType === 'dir' ? 'nome-da-pasta' : 'arquivo.json'"
                    @keydown.enter="confirmCreate"
                    @keydown.esc="creatingIn = null"
                    @vue:mounted="(el: any) => el.el?.focus()"
                    />
                    <button class="fs-action-btn ok" @click="confirmCreate">✓</button>
                    <button class="fs-action-btn cancel" @click="creatingIn = null">✕</button>
                </div>
                </template>

                <!-- Create at root -->
                <div v-if="creatingIn === ''" class="fs-create-row" style="padding-left: 8px" @click.stop>
                <input
                    v-model="createName"
                    class="fs-create-input"
                    :placeholder="createType === 'dir' ? 'nome-da-pasta' : 'arquivo.json'"
                    @keydown.enter="confirmCreate"
                    @keydown.esc="creatingIn = null"
                    @vue:mounted="(el: any) => el.el?.focus()"
                />
                <button class="fs-action-btn ok" @click="confirmCreate">✓</button>
                <button class="fs-action-btn cancel" @click="creatingIn = null">✕</button>
                </div>
            </div>
            </div>
        </Transition>

        <!-- Main CMS content -->
        <div class="cms-main">
        <div v-if="loading || depLoading" class="loading">Carregando...</div>

        <!-- ─── Depoimentos Editor ─────────────────────────── -->
        <div v-if="depData && !depLoading && cmsMode === 'depoimentos'" class="dep-editor">
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

        <!-- Editor -->
        <div v-if="workData && !loading" class="editor">
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
        </div><!-- /editor -->
        </div><!-- /cms-main -->
        </div><!-- /cms-layout -->

        <!-- Context Menu -->
        <Teleport to="body">
        <div v-if="ctxMenu.visible" class="ctx-overlay" @click="closeCtxMenu" @contextmenu.prevent="closeCtxMenu"></div>
        <div v-if="ctxMenu.visible" class="ctx-menu" :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }">
            <template v-if="ctxMenu.node && !ctxMenu.node.isDirectory">
            <button class="ctx-item" @click="openInCms(ctxMenu.node!.path); closeCtxMenu()">
                <span class="ctx-icon">🖥</span> Abrir no CMS
            </button>
            <button class="ctx-item" @click="openFileEditor(ctxMenu.node!.path); closeCtxMenu()">
                <span class="ctx-icon">📄</span> Editar texto bruto
            </button>
            <div class="ctx-sep"></div>
            <button class="ctx-item" @click="startRename(ctxMenu.node!); closeCtxMenu()">
                <span class="ctx-icon">✎</span> Renomear
            </button>
            <button class="ctx-item danger" @click="deleteItem(ctxMenu.node!); closeCtxMenu()">
                <span class="ctx-icon">🗑</span> Deletar
            </button>
            </template>
            <template v-else-if="ctxMenu.node && ctxMenu.node.isDirectory">
            <button class="ctx-item" @click="ctxCreate(ctxMenu.node!.path, 'file')">
                <span class="ctx-icon">+</span> Novo arquivo aqui
            </button>
            <button class="ctx-item" @click="ctxCreate(ctxMenu.node!.path, 'dir')">
                <span class="ctx-icon">📁</span> Nova pasta aqui
            </button>
            <div class="ctx-sep"></div>
            <button class="ctx-item" v-if="ctxMenu.node!.path !== ''" @click="startRename(ctxMenu.node!); closeCtxMenu()">
                <span class="ctx-icon">✎</span> Renomear
            </button>
            <button class="ctx-item danger" v-if="ctxMenu.node!.path !== ''" @click="deleteItem(ctxMenu.node!); closeCtxMenu()">
                <span class="ctx-icon">🗑</span> Deletar
            </button>
            </template>
        </div>
        </Teleport>

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

        <!-- File Editor Modal -->
        <Teleport to="body">
        <div v-if="fileEditorOpen" class="modal-overlay" @click.self="fileEditorOpen = false">
            <div class="modal-content modal-file-editor">
            <div class="modal-header">
                <div>
                <h3>Editando: <code>{{ fileEditorPath }}</code></h3>
                <span v-if="fileEditorDirty" class="editor-dirty">● não salvo</span>
                </div>
                <div class="modal-header-actions">
                <button class="btn-save-file" @click="saveFileEditor" :disabled="fileEditorSaving || !fileEditorDirty">
                    {{ fileEditorSaving ? 'Salvando...' : '💾 Salvar' }}
                </button>
                <button class="modal-close" @click="fileEditorOpen = false">✕</button>
                </div>
            </div>
            <div v-if="fileEditorLoading" class="loading">Carregando...</div>
            <textarea
                v-else
                v-model="fileEditorContent"
                class="file-editor-textarea"
                spellcheck="false"
                @input="fileEditorDirty = true"
            ></textarea>
            </div>
        </div>
        </Teleport>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #111;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-box {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 40px;
  width: 360px;
  text-align: center;

  h1 { color: #eee; font-size: 22px; margin-bottom: 24px; }

  input {
    width: 100%;
    padding: 12px 14px;
    background: #222;
    border: 1px solid #444;
    color: #eee;
    border-radius: 6px;
    font-size: 16px;
    margin-bottom: 16px;
    &:focus { outline: none; border-color: #2563eb; }
  }

  button {
    width: 100%;
    padding: 12px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    &:hover { background: #1d4ed8; }
    &:disabled { opacity: 0.5; }
  }

  .login-error { color: #f87171; margin-top: 12px; font-size: 14px; }
}

.admin-cms {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #111;
  color: #eee;
  min-height: 100vh;
}

.cms-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
  h1 { font-size: 24px; }
  .back-link { color: #888; text-decoration: none; &:hover { color: #fff; } }
}

.notification {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  min-width: 320px;
  max-width: 600px;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
  &.success { background: #1a3a1a; color: #4ade80; border: 1px solid #166534; }
  &.error { background: #3a1a1a; color: #f87171; border: 1px solid #7f1d1d; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }


.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;

  label { font-size: 13px; color: #aaa; font-weight: 500; }
  input[type="text"], input[type="number"], input[type="password"], select, textarea {
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

.row-fields { display: flex; gap: 8px; input { flex: 1; } }

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

/* ─── Depoimentos Editor ─────────────────────────────────── */
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
  .dep-avatar-placeholder { font-size: 12px; color: #555; }
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

.dep-preview {
  display: none; /* replaced by inline avatar-thumb */
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

/* Testimonial selector in portfolio editor sidebar */
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

/* ─── Portfolio editor ───────────────────────────────────── */
.editor { display: flex; gap: 24px; }

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
  padding: 24px;
  text-align: center;
  color: #f87171;
  font-size: 14px;
  background: #3a1a1a;
  border: 1px solid #7f1d1d;
  border-radius: 6px;
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
  .editor { flex-direction: column; }
  .editor-sidebar { width: 100%; position: static; max-height: none; }
  .album-item {
    &.grid-w33, &.grid-w25 { width: calc(50% - 2px); }
  }
}

/* ─── Layout com sidebar ─────────────────────────────────── */
.cms-layout {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.cms-main {
  flex: 1;
  min-width: 0;
}

/* ─── Header esquerda ────────────────────────────────────── */
.cms-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-sidebar-toggle {
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  color: #60a5fa;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: #253d55; }
}

/* ─── Arquivo · sidebar ──────────────────────────────────── */
.file-sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #111;
  border-right: 1px solid #222;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.fs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 8px;
  border-bottom: 1px solid #222;
  h4 { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.08em; }
}

.fs-tree {
  padding: 4px 0;
}

.fs-node {
  display: flex;
  align-items: center;
  gap: 0;
  height: 28px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: #ccc;
  padding-right: 4px;
  position: relative;
  &:hover { background: #1a1a1a; }
  &.is-dir { color: #93c5fd; font-weight: 500; }
}

.fs-indent {
  flex-shrink: 0;
}

.fs-toggle {
  width: 16px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
  color: #555;
}

.fs-icon {
  width: 18px;
  flex-shrink: 0;
  text-align: center;
  font-size: 13px;
}

.fs-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fs-rename-input {
  flex: 1;
  background: #222;
  border: 1px solid #3b82f6;
  color: #eee;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 3px;
  outline: none;
}

.fs-action-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  &:hover { background: #2a2a2a; color: #eee; }
  &.ok { color: #4ade80; &:hover { background: #14532d; color: #86efac; } }
  &.cancel { color: #f87171; &:hover { background: #450a0a; color: #fca5a5; } }
  &.danger { color: #f87171; &:hover { background: #450a0a; color: #fca5a5; } }
}

.fs-node.is-selected {
  background: #1a2a3a;
  &:hover { background: #1a2a3a; }
  .fs-name { color: #93c5fd; }
}

/* ─── Context menu ───────────────────────────────────────── */
.ctx-overlay {
  position: fixed;
  inset: 0;
  z-index: 19998;
}

.ctx-menu {
  position: fixed;
  z-index: 19999;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 4px;
  min-width: 200px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.6);
  font-size: 13px;
}

.ctx-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  background: none;
  border: none;
  color: #ddd;
  padding: 7px 12px;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  white-space: nowrap;
  &:hover { background: #2a3a4a; color: #fff; }
  &.danger { color: #f87171; &:hover { background: #450a0a; color: #fca5a5; } }
}

.ctx-icon {
  width: 18px;
  text-align: center;
  flex-shrink: 0;
  opacity: 0.8;
}

.ctx-sep {
  height: 1px;
  background: #333;
  margin: 4px 8px;
}

.fs-create-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #0d1a2a;
  border-top: 1px solid #1e3a5a;
  flex-wrap: wrap;
}

.fs-new-input,
.fs-create-input {
  flex: 1;
  min-width: 80px;
  background: #111;
  border: 1px solid #2d4a6a;
  color: #eee;
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 3px;
  outline: none;
}

/* ─── Transição slide da sidebar ─────────────────────────── */
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: width 0.25s ease, opacity 0.25s ease;
  overflow: hidden;
}
.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  width: 0 !important;
  opacity: 0;
}

/* ─── Modal editor de arquivo ────────────────────────────── */
.modal-file-editor {
  width: 90vw;
  max-width: 1100px;
  height: 82vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0;

  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #2a2a2a;
    flex-shrink: 0;
    h3 { font-size: 14px; color: #ccc; font-weight: 400; }
    code { background: #222; padding: 1px 6px; border-radius: 4px; font-size: 13px; color: #93c5fd; }
  }
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-dirty {
  font-size: 12px;
  color: #facc15;
  margin-left: 8px;
}

.btn-save-file {
  background: #1e40af;
  border: none;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  &:hover:not(:disabled) { background: #2563eb; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.file-editor-textarea {
  flex: 1;
  width: 100%;
  background: #0d0d0d;
  border: none;
  color: #d4d4d4;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  padding: 16px 20px;
  resize: none;
  outline: none;
  tab-size: 2;
}
</style>