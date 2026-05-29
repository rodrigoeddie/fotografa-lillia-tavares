<script lang="ts" setup>
useHead({
  title: 'ADM - Fotógrafa Lillia Tavares',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block' }],
});

const { authenticated, isSuperAdmin, canAccess, loginEmail, loginPassword, loginError, loginLoading, doLogin, logout } = useAdminAuth();
const { message, messageType, showMessage } = useAdminNotification();

const route = useRoute();
watchEffect(() => {
  if (!authenticated.value) return;
  const section = route.path.replace(/^\/admin\/?/, '').split('/')[0];
  if (section && !canAccess(section)) {
    navigateTo('/admin');
  }
});
const { adminFetch } = useAdminFetch();

const {
  notificacoes: adminNotifs, unread: adminUnread, open: adminNotifOpen,
  load: loadAdminNotif, toggleOpen: toggleAdminNotif, requestPushPermission,
} = useNotifications('admin', adminFetch);

const fileSidebarOpen = ref(true);

async function handleLogin() {
  await doLogin();
  await loadAdminNotif();
  // Ask push permission on first login
  if (import.meta.client && 'Notification' in window && Notification.permission === 'default') {
    const accepted = window.confirm('Receber notificações quando clientes finalizarem a seleção?');
    if (accepted) await requestPushPermission();
  }
}

watch(authenticated, (v) => {
  if (v) loadAdminNotif();
});

// Provide showMessage and fileManager to child pages
provide('showMessage', showMessage);
</script>

<template>
  <!-- Login Screen -->
  <div v-if="!authenticated" class="login-screen">
    <form class="login-box" @submit.prevent="handleLogin">
      <h1>Administração</h1>
      <input v-model="loginEmail" type="email" placeholder="Email" autofocus autocomplete="email" />
      <input v-model="loginPassword" type="password" placeholder="Senha" autocomplete="current-password" />
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
            <span class="material-symbols-outlined" style="font-size:18px;vertical-align:middle">menu</span> Menu
          </button>
          <NuxtLink to="/admin" class="cms-title-link"><h1>Administração</h1></NuxtLink>
        </div>
        <div class="cms-header-right">
          <!-- Notificações -->
          <div class="notif-wrap" v-if="authenticated">
            <button class="notif-bell" :class="{ 'has-unread': adminUnread > 0 }" @click="toggleAdminNotif" title="Notificações">
              <span class="material-symbols-outlined">notifications</span>
              <span v-if="adminUnread > 0" class="notif-badge">{{ adminUnread > 9 ? '9+' : adminUnread }}</span>
            </button>
            <div v-if="adminNotifOpen" class="notif-dropdown">
              <p class="notif-header">Notificações</p>
              <p v-if="adminNotifs.length === 0" class="notif-empty">Nenhuma notificação</p>
              <div v-for="n in adminNotifs" :key="n.id" class="notif-item" :class="{ unread: n.lida === 0 }">
                <p class="notif-titulo">{{ n.titulo }}</p>
                <p v-if="n.mensagem" class="notif-mensagem">{{ n.mensagem }}</p>
                <p class="notif-data">{{ new Date(n.criado_em).toLocaleDateString('pt-BR') }}</p>
              </div>
            </div>
          </div>

          <NuxtLink to="/" class="back-link">
            <span class="material-symbols-outlined"> arrow_back </span>
            <span>Voltar ao site</span>
          </NuxtLink>
          <button class="btn-logout" @click="logout">
            <span class="material-symbols-outlined"> exit_to_app </span>
            <span>Sair</span>
          </button>
        </div>
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
              <div class="fs-db-label">------</div>
              <NuxtLink v-if="canAccess('clientes')"      to="/admin/clientes"      class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">group</span> Clientes</NuxtLink>
              <NuxtLink v-if="canAccess('sessoes')"       to="/admin/sessoes"       class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">photo_library</span> Ensaios</NuxtLink>
              <NuxtLink v-if="canAccess('entregas')"      to="/admin/entregas"      class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">folder_zip</span> Entregas</NuxtLink>
              <template v-if="canAccess('hero-banners') || canAccess('portfolio')">
                <div class="fs-db-label" style="margin-top:1rem">Site</div>
                <NuxtLink v-if="canAccess('hero-banners')"   to="/admin/hero-banners"   class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">panorama</span> Banners</NuxtLink>
                <NuxtLink v-if="canAccess('portfolio')"      to="/admin/portfolio"      class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">camera_alt</span> Portfolio</NuxtLink>
                <NuxtLink v-if="canAccess('investimento')"   to="/admin/investimento"   class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">payments</span> Preços</NuxtLink>
                <NuxtLink v-if="canAccess('depoimentos')"    to="/admin/depoimentos"    class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">star</span> Avaliações</NuxtLink>
                <NuxtLink v-if="canAccess('faq')"            to="/admin/faq"            class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">help_outline</span> FAQ</NuxtLink>
                <NuxtLink v-if="canAccess('blog')"           to="/admin/blog"           class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">edit_note</span> Blog</NuxtLink>
                <NuxtLink v-if="canAccess('cenarios')"       to="/admin/cenarios"       class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">domain</span> Cenários</NuxtLink>
                <NuxtLink v-if="canAccess('landing-pages')"  to="/admin/landing-pages"  class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">view_compact_alt</span> Landing Pages</NuxtLink>
                <NuxtLink v-if="canAccess('menu')"           to="/admin/menu"           class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">menu</span> Menu</NuxtLink>
              </template>
              <template v-if="canAccess('seo') || canAccess('cache') || isSuperAdmin">
                <div class="fs-db-label" style="margin-top:1rem">Ferramentas</div>
                <NuxtLink v-if="canAccess('seo')"    to="/admin/seo"       class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">search</span> SEO</NuxtLink>
                <NuxtLink v-if="canAccess('cache')"  to="/admin/cache"     class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">cached</span> Cache</NuxtLink>
                <NuxtLink v-if="isSuperAdmin"        to="/admin/usuarios"  class="fs-db-link" active-class="fs-db-link--active"><span class="material-symbols-outlined">manage_accounts</span> Usuários</NuxtLink>
              </template>
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
  width: 1800rem;
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

  h1 {
    font-size: 24px;
  }

  .back-link {
    text-decoration: none;
    align-items: center;
    color: #888;
    display: flex;
    gap: 5rem;

    .material-symbols-outlined {
      font-size: 18px;
    }

    &:hover {
      color: #fff;
    }
  }
}

.cms-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

// Notification bell (reused in both layouts)
.notif-wrap { position: relative; }

.notif-bell {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0;

  .material-symbols-outlined { font-size: 22px; }
  &:hover { color: #fff; }
  &.has-unread { color: #e8a87c; }
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: #e8a87c;
  color: #111;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 4px;
  line-height: 1.3;
}

.notif-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 300px;
  background: #1e1e1e;
  border: 1px solid #2a2a2a;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  z-index: 200;
  overflow: hidden;
}

.notif-header {
  font-size: 13px;
  font-weight: 700;
  color: #ccc;
  padding: 12px 16px;
  border-bottom: 1px solid #2a2a2a;
  margin: 0;
}

.notif-empty {
  font-size: 13px;
  color: #555;
  padding: 16px;
  margin: 0;
  text-align: center;
}

.notif-item {
  padding: 12px 16px;
  border-bottom: 1px solid #222;

  &:last-child { border-bottom: none; }
  &.unread { background: #1a1208; }
}

.notif-titulo {
  font-size: 13px;
  font-weight: 600;
  color: #ddd;
  margin: 0 0 2px;
}

.notif-mensagem {
  font-size: 12px;
  color: #888;
  margin: 0 0 4px;
}

.notif-data {
  font-size: 11px;
  color: #555;
  margin: 0;
}

.btn-logout {
  background: transparent;
  border: 1px solid #444;
  color: #888;
  padding: 6px 14px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 5rem;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.15s, color 0.15s;

  .material-symbols-outlined {
    font-size: 18px;
    vertical-align: middle;
  }

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
  }
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
  padding: 0 10px 20px 20px;
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
  width: 133px;
  flex-shrink: 0;
  background: #111;
  border-right: 1px solid #222;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.fs-db-nav {
  padding: 0 8px 6px;
  border-bottom: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.fs-db-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #555;
  font-weight: 700;
  padding: 20px 4px 4px;

  &:first-child {
    padding-top: 0;
  }
}

.fs-db-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 5px;
  font-size: 13px;
  color: #aaa;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  .material-symbols-outlined {
    font-size: 18px;
    flex-shrink: 0;
    opacity: 0.7;
  }

  &:hover { background: #1e1e1e; color: #eee; }
  &--active {
    background: #252525;
    color: #fff;
    .material-symbols-outlined { opacity: 1; }
  }
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
