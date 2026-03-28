<script lang="ts" setup>
definePageMeta({ layout: false });

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
}
interface FlatNode extends TreeNode { depth: number }

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
      loadFileTree();
    }
  } catch {
    loginError.value = 'Senha incorreta';
  } finally {
    loginLoading.value = false;
  }
}

// Global message
const message = ref('');
const messageType = ref<'success' | 'error'>('success');

function showMessage(msg: string, type: 'success' | 'error') {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 6000);
}

// CMS Mode
const cmsMode = ref<'portfolio' | 'depoimentos' | 'menu' | 'investimento' | null>(null);
const selectedWork = ref(''); // kept here for file-sidebar highlight

// Component refs
const portfolioEditorRef = ref<any>(null);
const depEditorRef = ref<any>(null);
const menuEditorRef = ref<any>(null);
const investimentoEditorRef = ref<any>(null);

const DEP_PATH = 'depoimentos/index.json';
const MENU_PATH = 'globals/menu.json';

// ─── File Manager ─────────────────────────────────────────────────────────────
const fileSidebarOpen = ref(true);
const fileTree = ref<TreeNode[]>([]);
const expandedPaths = ref(new Set<string>());
const renamingPath = ref<string | null>(null);
const renameValue = ref('');
const creatingIn = ref<string | null>(null);
const createName = ref('');
const createType = ref<'file' | 'dir'>('file');

const ctxMenu = ref<{ visible: boolean; x: number; y: number; node: FlatNode | null }>({
  visible: false, x: 0, y: 0, node: null,
});

const fileEditorOpen = ref(false);
const fileEditorPath = ref('');
const fileEditorContent = ref('');
const fileEditorSaving = ref(false);
const fileEditorLoading = ref(false);
const fileEditorDirty = ref(false);

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

  const parts = parentPath.split('/');
  const isPortfolioCategory =
    parts[0] === 'ensaio-fotografico' &&
    parts.length === 2 &&
    createType.value === 'file' &&
    name.endsWith('.json');

  try {
    await $fetch('/api/fs/action', { method: 'POST', body: { action: 'create', path: parentPath, name, type: createType.value } });

    if (isPortfolioCategory) {
      const catSlug = parts[1]!.replace(/^\d+\./, '');
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
  if (parentPath) {
    const s = new Set(expandedPaths.value);
    s.add(parentPath);
    expandedPaths.value = s;
  }
}

function fileIcon(node: FlatNode) {
  if (node.isDirectory) return expandedPaths.value.has(node.path) ? '📂' : '📁';
  if (node.name.endsWith('.json')) return '{}';
  if (node.name.endsWith('.md')) return '📝';
  return '📄';
}

// ─── Smart open ───────────────────────────────────────────────────────────────
async function openInCms(filePath: string) {
  const parts = filePath.split('/');

  if (filePath === DEP_PATH) {
    cmsMode.value = 'depoimentos';
    selectedWork.value = '';
    await nextTick();
    await depEditorRef.value?.load();
    document.querySelector('.dep-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (filePath === MENU_PATH) {
    cmsMode.value = 'menu';
    selectedWork.value = '';
    await nextTick();
    await menuEditorRef.value?.load();
    document.querySelector('.menu-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  const isInvestimento =
    parts.length === 3 &&
    parts[0] === 'investimento' &&
    filePath.endsWith('.json');

  if (isInvestimento) {
    cmsMode.value = 'investimento';
    selectedWork.value = filePath;
    await nextTick();
    await investimentoEditorRef.value?.openFile(filePath);
    document.querySelector('.inv-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  selectedWork.value = filePath;
  await nextTick();
  await portfolioEditorRef.value?.openWork(filePath);
  document.querySelector('.portfolio-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

onMounted(() => {
  const stored = sessionStorage.getItem('cms_token');
  if (stored) {
    cmsToken.value = stored;
    authenticated.value = true;
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

                <!-- Inline create row -->
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
          <AdminDepoimentosEditor
            v-if="cmsMode === 'depoimentos'"
            ref="depEditorRef"
            :show-message="showMessage"
            :portfolio-works="portfolioWorks"
          />

          <AdminMenuEditor
            v-if="cmsMode === 'menu'"
            ref="menuEditorRef"
            :show-message="showMessage"
          />

          <AdminPortfolioEditor
            v-if="cmsMode === 'portfolio'"
            ref="portfolioEditorRef"
            :show-message="showMessage"
          />

          <AdminInvestimentoEditor
            v-if="cmsMode === 'investimento'"
            ref="investimentoEditorRef"
            :show-message="showMessage"
          />
        </div>
      </div>

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
  margin: 0 auto;
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

.loading { text-align: center; padding: 40px; color: #888; }

/* Layout */
.cms-layout {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.cms-main {
  flex: 1;
  min-width: 0;
  padding: 20px;
}

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

/* File sidebar */
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
}

.fs-tree { padding: 4px 0; }

.fs-node {
  display: flex;
  align-items: center;
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

.fs-toggle { width: 16px; flex-shrink: 0; text-align: center; font-size: 9px; color: #555; }
.fs-icon { width: 18px; flex-shrink: 0; text-align: center; font-size: 13px; }
.fs-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.fs-rename-input {
  flex: 1; background: #222; border: 1px solid #3b82f6; color: #eee; font-size: 12px; padding: 1px 4px; border-radius: 3px; outline: none;
}

.fs-action-btn {
  background: none; border: none; color: #888; font-size: 11px; cursor: pointer; padding: 2px 4px; border-radius: 3px;
  &:hover { background: #2a2a2a; color: #eee; }
  &.ok { color: #4ade80; &:hover { background: #14532d; color: #86efac; } }
  &.cancel { color: #f87171; &:hover { background: #450a0a; color: #fca5a5; } }
}

.fs-node.is-selected {
  background: #1a2a3a;
  &:hover { background: #1a2a3a; }
  .fs-name { color: #93c5fd; }
}

.fs-create-row {
  display: flex; align-items: center; gap: 6px; padding: 4px 8px; background: #0d1a2a; border-top: 1px solid #1e3a5a; flex-wrap: wrap;
}

.fs-create-input {
  flex: 1; min-width: 80px; background: #111; border: 1px solid #2d4a6a; color: #eee; font-size: 12px; padding: 3px 6px; border-radius: 3px; outline: none;
}

/* Sidebar slide transition */
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

/* Context menu */
.ctx-overlay { position: fixed; inset: 0; z-index: 19998; }

.ctx-menu {
  position: fixed; z-index: 19999; background: #1e1e1e; border: 1px solid #333; border-radius: 8px; padding: 4px; min-width: 200px; box-shadow: 0 8px 24px rgba(0,0,0,0.6); font-size: 13px;
}

.ctx-item {
  display: flex; align-items: center; gap: 8px; width: 100%; background: none; border: none; color: #ddd; padding: 7px 12px; border-radius: 5px; cursor: pointer; text-align: left; white-space: nowrap;
  &:hover { background: #2a3a4a; color: #fff; }
  &.danger { color: #f87171; &:hover { background: #450a0a; color: #fca5a5; } }
}

.ctx-icon { width: 18px; text-align: center; flex-shrink: 0; opacity: 0.8; }
.ctx-sep { height: 1px; background: #333; margin: 4px 8px; }

/* File editor modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 9999;
}

.modal-content {
  background: #1a1a1a; border: 1px solid #333; border-radius: 12px; width: 90vw; max-width: 1000px; max-height: 80vh; overflow-y: auto; padding: 24px;
}

.modal-file-editor {
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

.modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 18px; color: #eee; }
}

.modal-header-actions { display: flex; align-items: center; gap: 8px; }

.modal-close {
  background: #333; border: none; color: #eee; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; font-size: 16px;
  &:hover { background: #444; }
}

.editor-dirty { font-size: 12px; color: #facc15; margin-left: 8px; }

.btn-save-file {
  background: #1e40af; border: none; color: #fff; padding: 6px 16px; border-radius: 6px; font-size: 13px; cursor: pointer;
  &:hover:not(:disabled) { background: #2563eb; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

.file-editor-textarea {
  flex: 1; width: 100%; background: #0d0d0d; border: none; color: #d4d4d4;
  font-family: 'Fira Code', 'Courier New', monospace; font-size: 13px; line-height: 1.6;
  padding: 16px 20px; resize: none; outline: none; tab-size: 2;
}
</style>
