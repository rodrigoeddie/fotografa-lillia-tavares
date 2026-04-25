<script lang="ts" setup>
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

const { authenticated, loginPassword, loginError, loginLoading, doLogin, restoreSession } = useAdminAuth();
const { message, messageType, showMessage } = useAdminNotification();

const fileSidebarOpen = ref(true);

onMounted(() => {
  restoreSession();
});

async function handleLogin() {
  await doLogin();
}

// Provide showMessage and fileManager to child pages
provide('showMessage', showMessage);
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!authenticated" class="login-screen">
    <form class="login-box" @submit.prevent="handleLogin">
      <h1>Administração</h1>
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
          <button class="btn-sidebar-toggle" @click="fileSidebarOpen = !fileSidebarOpen" :class="{ active: fileSidebarOpen }" title="Menu">
            <span class="toggle-icon">☰</span> Menu
          </button>
          <NuxtLink to="/admin" class="cms-title-link"><h1>Administração</h1></NuxtLink>
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
            <!-- Navegação DB -->
            <div class="fs-db-nav">
              <div class="fs-db-label">banco de dados</div>
              <NuxtLink to="/admin/clientes" class="fs-db-link" active-class="fs-db-link--active">👥 Clientes</NuxtLink>
              <NuxtLink to="/admin/sessoes" class="fs-db-link" active-class="fs-db-link--active">🖼 Fotos para Seleção</NuxtLink>
              <NuxtLink to="/admin/entregas" class="fs-db-link" active-class="fs-db-link--active">📦 Entregas</NuxtLink>
              <div class="fs-db-label" style="margin-top:1rem">conteúdo</div>
              <NuxtLink to="/admin/investimento" class="fs-db-link" active-class="fs-db-link--active">💰 Investimento</NuxtLink>
              <NuxtLink to="/admin/depoimentos" class="fs-db-link" active-class="fs-db-link--active">⭐ Depoimentos</NuxtLink>
              <NuxtLink to="/admin/faq" class="fs-db-link" active-class="fs-db-link--active">❓ FAQ</NuxtLink>
              <NuxtLink to="/admin/blog" class="fs-db-link" active-class="fs-db-link--active">📝 Blog</NuxtLink>
              <NuxtLink to="/admin/portfolio" class="fs-db-link" active-class="fs-db-link--active">🎨 Portfolio</NuxtLink>
              <NuxtLink to="/admin/cenarios" class="fs-db-link" active-class="fs-db-link--active">🏛 Cenários</NuxtLink>
              <div class="fs-db-label" style="margin-top:1rem">ferramentas</div>
              <NuxtLink to="/admin/seo" class="fs-db-link" active-class="fs-db-link--active">🔍 SEO</NuxtLink>
            </div>
          </div>
        </Transition>

        <!-- Main CMS content (child page) -->
        <div class="cms-main">
          <slot />
        </div>
      </div>
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

.fs-db-nav {
  padding: 10px 8px 6px;
  border-bottom: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fs-db-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #555;
  font-weight: 700;
  padding: 0 4px 4px;
}

.fs-db-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 5px;
  font-size: 12px;
  color: #aaa;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover { background: #1e1e1e; color: #eee; }
  &--active { background: #252525; color: #fff; }
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
