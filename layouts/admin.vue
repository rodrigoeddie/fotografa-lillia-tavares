<script lang="ts" setup>
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

const { authenticated, loginPassword, loginError, loginLoading, doLogin, restoreSession } = useAdminAuth();
const { message, messageType, showMessage } = useAdminNotification();
const fm = useAdminFileManager(showMessage);

const fileSidebarOpen = ref(true);

onMounted(() => {
  restoreSession();
  if (authenticated.value) {
    fm.loadFileTree();
  }
});

async function handleLogin() {
  await doLogin();
  if (authenticated.value) {
    fm.loadFileTree();
  }
}

// Provide showMessage and fileManager to child pages
provide('showMessage', showMessage);
provide('fileManager', fm);
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!authenticated" class="login-screen">
    <form class="login-box" @submit.prevent="handleLogin">
      <h1>CMS Admin</h1>
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
          <NuxtLink to="/admin" class="cms-title-link"><h1>CMS Admin</h1></NuxtLink>
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
            <div class="fs-header" @contextmenu.prevent="fm.openCtxMenuRoot($event)">
              <span>content/</span>
            </div>

            <div class="fs-tree">
              <template v-for="node in fm.flatTree.value" :key="node.path">
                <div
                  class="fs-node"
                  :style="{ paddingLeft: `${node.depth * 14 + 8}px` }"
                  :class="{ 'is-dir': node.isDirectory, 'is-selected': fm.selectedWork.value === node.path || (fm.fileEditorPath.value === node.path && fm.fileEditorOpen.value) }"
                  @contextmenu.prevent="fm.openCtxMenu($event, node)"
                  @click="node.isDirectory ? fm.toggleDir(node.path) : fm.openInCms(node.path)">

                  <!-- Rename mode -->
                  <template v-if="fm.renamingPath.value === node.path">
                    <input
                      v-model="fm.renameValue.value"
                      class="fs-rename-input"
                      @click.stop
                      @keydown.enter="fm.confirmRename()"
                      @keydown.esc="fm.renamingPath.value = null"
                      @vue:mounted="(el: any) => el.el?.focus()"
                    />
                    <button class="fs-action-btn ok" @click.stop="fm.confirmRename()">✓</button>
                    <button class="fs-action-btn cancel" @click.stop="fm.renamingPath.value = null">✕</button>
                  </template>

                  <!-- Normal mode -->
                  <template v-else>
                    <span class="fs-toggle">{{ node.isDirectory ? (fm.expandedPaths.value.has(node.path) ? '▾' : '▸') : '' }}</span>
                    <span class="fs-icon">{{ fm.fileIcon(node) }}</span>
                    <span class="fs-name" :title="node.path">{{ node.name }}</span>
                  </template>
                </div>

                <!-- Inline create row -->
                <div
                  v-if="fm.creatingIn.value === node.path"
                  class="fs-create-row"
                  :style="{ paddingLeft: `${(node.depth + 1) * 14 + 8}px` }"
                  @click.stop>
                  <input
                    v-model="fm.createName.value"
                    class="fs-create-input"
                    :placeholder="fm.createType.value === 'dir' ? 'nome-da-pasta' : 'arquivo.json'"
                    @keydown.enter="fm.confirmCreate()"
                    @keydown.esc="fm.creatingIn.value = null"
                    @vue:mounted="(el: any) => el.el?.focus()"
                  />
                  <button class="fs-action-btn ok" @click="fm.confirmCreate()">✓</button>
                  <button class="fs-action-btn cancel" @click="fm.creatingIn.value = null">✕</button>
                </div>
              </template>

              <!-- Create at root -->
              <div v-if="fm.creatingIn.value === ''" class="fs-create-row" style="padding-left: 8px" @click.stop>
                <input
                  v-model="fm.createName.value"
                  class="fs-create-input"
                  :placeholder="fm.createType.value === 'dir' ? 'nome-da-pasta' : 'arquivo.json'"
                  @keydown.enter="fm.confirmCreate()"
                  @keydown.esc="fm.creatingIn.value = null"
                  @vue:mounted="(el: any) => el.el?.focus()"
                />
                <button class="fs-action-btn ok" @click="fm.confirmCreate()">✓</button>
                <button class="fs-action-btn cancel" @click="fm.creatingIn.value = null">✕</button>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Main CMS content (child page) -->
        <div class="cms-main">
          <slot />
        </div>
      </div>

      <!-- Context Menu -->
      <Teleport to="body">
        <div v-if="fm.ctxMenu.value.visible" class="ctx-overlay" @click="fm.closeCtxMenu()" @contextmenu.prevent="fm.closeCtxMenu()"></div>
        <div v-if="fm.ctxMenu.value.visible" class="ctx-menu" :style="{ left: fm.ctxMenu.value.x + 'px', top: fm.ctxMenu.value.y + 'px' }">
          <template v-if="fm.ctxMenu.value.node && !fm.ctxMenu.value.node.isDirectory">
            <button class="ctx-item" @click="fm.openInCms(fm.ctxMenu.value.node!.path); fm.closeCtxMenu()">
              <span class="ctx-icon">🖥</span> Abrir no CMS
            </button>
            <button class="ctx-item" @click="fm.openFileEditor(fm.ctxMenu.value.node!.path); fm.closeCtxMenu()">
              <span class="ctx-icon">📄</span> Editar texto bruto
            </button>
            <div class="ctx-sep"></div>
            <button class="ctx-item" @click="fm.startRename(fm.ctxMenu.value.node!); fm.closeCtxMenu()">
              <span class="ctx-icon">✎</span> Renomear
            </button>
            <button class="ctx-item danger" @click="fm.deleteItem(fm.ctxMenu.value.node!); fm.closeCtxMenu()">
              <span class="ctx-icon">🗑</span> Deletar
            </button>
          </template>
          <template v-else-if="fm.ctxMenu.value.node && fm.ctxMenu.value.node.isDirectory">
            <button class="ctx-item" @click="fm.ctxCreate(fm.ctxMenu.value.node!.path, 'file')">
              <span class="ctx-icon">+</span> Novo arquivo aqui
            </button>
            <button class="ctx-item" @click="fm.ctxCreate(fm.ctxMenu.value.node!.path, 'dir')">
              <span class="ctx-icon">📁</span> Nova pasta aqui
            </button>
            <div class="ctx-sep"></div>
            <button class="ctx-item" v-if="fm.ctxMenu.value.node!.path !== ''" @click="fm.startRename(fm.ctxMenu.value.node!); fm.closeCtxMenu()">
              <span class="ctx-icon">✎</span> Renomear
            </button>
            <button class="ctx-item danger" v-if="fm.ctxMenu.value.node!.path !== ''" @click="fm.deleteItem(fm.ctxMenu.value.node!); fm.closeCtxMenu()">
              <span class="ctx-icon">🗑</span> Deletar
            </button>
          </template>
        </div>
      </Teleport>

      <!-- File Editor Modal -->
      <Teleport to="body">
        <div v-if="fm.fileEditorOpen.value" class="modal-overlay" @click.self="fm.fileEditorOpen.value = false">
          <div class="modal-content modal-file-editor">
            <div class="modal-header">
              <div>
                <h3>Editando: <code>{{ fm.fileEditorPath.value }}</code></h3>
                <span v-if="fm.fileEditorDirty.value" class="editor-dirty">● não salvo</span>
              </div>
              <div class="modal-header-actions">
                <button class="btn-save-file" @click="fm.saveFileEditor()" :disabled="fm.fileEditorSaving.value || !fm.fileEditorDirty.value">
                  {{ fm.fileEditorSaving.value ? 'Salvando...' : '💾 Salvar' }}
                </button>
                <button class="modal-close" @click="fm.fileEditorOpen.value = false">✕</button>
              </div>
            </div>
            <div v-if="fm.fileEditorLoading.value" class="loading">Carregando...</div>
            <textarea
              v-else
              v-model="fm.fileEditorContent.value"
              class="file-editor-textarea"
              spellcheck="false"
              @input="fm.fileEditorDirty.value = true"
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
  padding-top: 20px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 1px solid #333;
  padding-bottom: 16px;
  h1 { font-size: 24px; }
  .back-link { color: #888; text-decoration: none; &:hover { color: #fff; } }
}

.cms-title-link {
  text-decoration: none;
  color: inherit;
  &:hover h1 { color: #93c5fd; }
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
