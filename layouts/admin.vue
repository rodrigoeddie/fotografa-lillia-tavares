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
      <div class="login-mark">L</div>
      <h1>Administração</h1>
      <p class="login-sub">Fotógrafa Lillia Tavares</p>
      <label>
        <span>E-mail</span>
        <input v-model="loginEmail" type="email" placeholder="email@gmail.com" autofocus autocomplete="email" />
      </label>

      <label>
        <span>Senha</span>
        <input v-model="loginPassword" type="password" placeholder="•••••" autocomplete="current-password" />
      </label>

      <button type="submit" :disabled="loginLoading">{{ loginLoading ? 'Verificando...' : 'Entrar' }}</button>
      <p v-if="loginError" class="login-error">{{ loginError }}</p>
    </form>
  </div>

  <!-- CMS -->
  <div v-else class="admin-cms" :class="{ 'sidebar-collapsed': !fileSidebarOpen }">
    <!-- Sidebar -->
    <Transition name="slide-sidebar">
      <aside v-show="fileSidebarOpen" class="sidebar">
        <NuxtLink to="/admin" class="brand">
          <span class="brand-mark">L</span>
          <span class="brand-text">
            <span class="brand-name">Lillia Tavares</span>
            <span class="brand-sub">Administração</span>
          </span>
        </NuxtLink>

        <nav class="nav">
          <template v-if="canAccess('clientes') || canAccess('sessoes') || canAccess('entregas')">
            <div class="nav-label">Sistema</div>
            <NuxtLink v-if="canAccess('clientes')" to="/admin/clientes" class="nav-item" active-class="active"><span class="material-symbols-outlined">group</span> Clientes</NuxtLink>
            <NuxtLink v-if="canAccess('sessoes')" to="/admin/sessoes" class="nav-item" active-class="active"><span class="material-symbols-outlined">photo_library</span> Ensaios</NuxtLink>
            <NuxtLink v-if="canAccess('entregas')" to="/admin/entregas" class="nav-item" active-class="active"><span class="material-symbols-outlined">folder_zip</span> Entregas</NuxtLink>
          </template>

          <template v-if="canAccess('hero-banners') || canAccess('portfolio')">
            <div class="nav-label">Site</div>
            <NuxtLink v-if="canAccess('hero-banners')" to="/admin/hero-banners" class="nav-item" active-class="active"><span class="material-symbols-outlined">panorama</span> Banners</NuxtLink>
            <NuxtLink v-if="canAccess('portfolio')" to="/admin/portfolio" class="nav-item" active-class="active"><span class="material-symbols-outlined">camera_alt</span> Portfolio</NuxtLink>
            <NuxtLink v-if="canAccess('investimento')" to="/admin/investimento" class="nav-item" active-class="active"><span class="material-symbols-outlined">payments</span> Preços</NuxtLink>
            <NuxtLink v-if="canAccess('depoimentos')" to="/admin/depoimentos" class="nav-item" active-class="active"><span class="material-symbols-outlined">star</span> Avaliações</NuxtLink>
            <NuxtLink v-if="canAccess('faq')" to="/admin/faq" class="nav-item" active-class="active"><span class="material-symbols-outlined">help_outline</span> FAQ</NuxtLink>
            <NuxtLink v-if="canAccess('blog')" to="/admin/blog" class="nav-item" active-class="active"><span class="material-symbols-outlined">edit_note</span> Blog</NuxtLink>
            <NuxtLink v-if="canAccess('cenarios')" to="/admin/cenarios" class="nav-item" active-class="active"><span class="material-symbols-outlined">domain</span> Cenários</NuxtLink>
            <NuxtLink v-if="canAccess('landing-pages')" to="/admin/landing-pages" class="nav-item" active-class="active"><span class="material-symbols-outlined">view_compact_alt</span> Landing Pages</NuxtLink>
            <NuxtLink v-if="canAccess('menu')" to="/admin/menu" class="nav-item" active-class="active"><span class="material-symbols-outlined">menu</span> Menu</NuxtLink>
            <NuxtLink v-if="canAccess('linktree')" to="/admin/linktree" class="nav-item" active-class="active"><span class="material-symbols-outlined">link</span> Linktree</NuxtLink>
          </template>

          <template v-if="canAccess('seo') || canAccess('cache') || isSuperAdmin">
            <div class="nav-label">Ferramentas</div>
            <NuxtLink v-if="canAccess('seo')" to="/admin/seo" class="nav-item" active-class="active"><span class="material-symbols-outlined">search</span> SEO</NuxtLink>
            <NuxtLink v-if="canAccess('cache')" to="/admin/cache" class="nav-item" active-class="active"><span class="material-symbols-outlined">cached</span> Cache</NuxtLink>
            <NuxtLink v-if="isSuperAdmin" to="/admin/usuarios" class="nav-item" active-class="active"><span class="material-symbols-outlined">manage_accounts</span> Usuários</NuxtLink>
          </template>
        </nav>
      </aside>
    </Transition>

    <!-- Main -->
    <div class="main">
      <header class="topbar">
        <button class="topbar-toggle" @click="fileSidebarOpen = !fileSidebarOpen" title="Alternar menu">
          <span class="material-symbols-outlined">menu</span>
        </button>

        <div class="topbar-spacer"></div>

        <div class="topbar-actions">
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
            <span class="material-symbols-outlined">arrow_back</span>
            <span>Voltar ao site</span>
          </NuxtLink>
          <button class="btn-logout" @click="logout">
            <span class="material-symbols-outlined">exit_to_app</span>
            <span>Sair</span>
          </button>
        </div>
      </header>

      <Transition name="fade">
        <div v-if="message" class="notification" :class="messageType">{{ message }}</div>
      </Transition>

      <!-- Main CMS content (child page) -->
      <div class="cms-main">
        <div class="cms-main-inner">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;

* { box-sizing: border-box; }

/* ─── Login ─────────────────────────────── */
.login-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: t.$bg;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-box {
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: t.$radius;
  box-shadow: t.$shadow;
  padding: 40px;
  width: 380px;
  text-align: center;

  .login-mark {
    width: 46px;
    height: 46px;
    margin: 0 auto 18px;
    border-radius: 12px;
    background: linear-gradient(135deg, t.$accent, #c98159);
    color: t.$accent-ink;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 22px;
  }

  h1 {
    font-weight: 680;
    font-size: 22px;
    color: t.$text;
    margin: 0;
  }

  .login-sub {
    color: t.$text-3;
    font-size: 13px;
    margin: 4px 0 28px;
  }

  label {
    display: block;
    text-align: left;
    margin-bottom: 16px;

    span {
      display: block;
      font-size: 12.5px;
      font-weight: 600;
      color: t.$text-2;
      margin-bottom: 7px;
    }
  }

  input {
    width: 100%;
    padding: 11px 13px;
    background: t.$bg;
    border: 1px solid t.$border-strong;
    color: t.$text;
    border-radius: t.$radius-sm;
    font-size: 15px;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
      outline: none;
      border-color: t.$accent-line;
      box-shadow: 0 0 0 3px t.$accent-dim;
    }
  }

  button {
    width: 100%;
    margin-top: 8px;
    padding: 12px;
    background: t.$accent;
    color: t.$accent-ink;
    border: none;
    border-radius: t.$radius-sm;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s;

    &:hover:not(:disabled) { background: t.$accent-hi; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  .login-error {
    color: t.$danger;
    margin-top: 14px;
    font-size: 13.5px;
  }
}

/* ─── Shell ─────────────────────────────── */
.admin-cms {
  display: flex;
  align-items: stretch;
  min-height: 100vh;
  background: t.$bg;
  color: t.$text;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
}

/* ─── Sidebar ─────────────────────────────── */
.sidebar {
  width: t.$sidebar-w;
  flex-shrink: 0;
  background: t.$surface;
  border-right: 1px solid t.$border;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px 20px;
  text-decoration: none;
  color: inherit;

  .brand-mark {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: linear-gradient(135deg, t.$accent, #c98159);
    color: t.$accent-ink;
    display: grid;
    place-items: center;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
  }

  .brand-text { display: flex; flex-direction: column; line-height: 1.25; }
  .brand-name { font-size: 14px; font-weight: 650; letter-spacing: 0.2px; }
  .brand-sub { font-size: 11px; color: t.$text-3; }

  &:hover .brand-name { color: t.$accent-hi; }
}

.nav {
  padding: 4px 12px 24px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-label {
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: t.$text-3;
  padding: 18px 10px 7px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 11px;
  border-radius: t.$radius-sm;
  color: t.$text-2;
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  position: relative;
  white-space: nowrap;

  .material-symbols-outlined { font-size: 20px; flex-shrink: 0; opacity: 0.85; }

  &:hover { background: t.$surface-2; color: t.$text; }

  &.active {
    background: t.$accent-dim;
    color: t.$accent-hi;

    .material-symbols-outlined { opacity: 1; }

    &::before {
      content: '';
      position: absolute;
      left: -12px;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background: t.$accent;
    }
  }
}

/* ─── Main ─────────────────────────────── */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 32px;
  border-bottom: 1px solid t.$border;
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(15, 17, 20, 0.82);
  backdrop-filter: blur(10px);
}

.topbar-spacer { flex: 1; }

.topbar-toggle {
  width: 38px;
  height: 38px;
  border-radius: t.$radius-sm;
  background: t.$surface-2;
  border: 1px solid t.$border;
  color: t.$text-2;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;

  .material-symbols-outlined { font-size: 20px; }
  &:hover { color: t.$text; border-color: t.$border-strong; }
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Notification bell */
.notif-wrap { position: relative; }

.notif-bell {
  width: 38px;
  height: 38px;
  border-radius: t.$radius-sm;
  background: t.$surface-2;
  border: 1px solid t.$border;
  cursor: pointer;
  color: t.$text-2;
  display: grid;
  place-items: center;
  position: relative;
  transition: color 0.15s, border-color 0.15s;

  .material-symbols-outlined { font-size: 20px; }
  &:hover { color: t.$text; border-color: t.$border-strong; }
  &.has-unread { color: t.$accent; }
}

.notif-badge {
  position: absolute;
  top: 4px;
  right: 5px;
  background: t.$accent;
  color: t.$accent-ink;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 4px;
  line-height: 1.3;
}

.notif-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  width: 300px;
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: t.$radius;
  box-shadow: t.$shadow;
  z-index: 200;
  overflow: hidden;
}

.notif-header {
  font-size: 13px;
  font-weight: 700;
  color: t.$text;
  padding: 13px 16px;
  border-bottom: 1px solid t.$border;
  margin: 0;
}

.notif-empty {
  font-size: 13px;
  color: t.$text-3;
  padding: 20px 16px;
  margin: 0;
  text-align: center;
}

.notif-item {
  padding: 12px 16px;
  border-bottom: 1px solid t.$border;

  &:last-child { border-bottom: none; }
  &.unread { background: t.$accent-dim; }
}

.notif-titulo { font-size: 13px; font-weight: 600; color: t.$text; margin: 0 0 2px; }
.notif-mensagem { font-size: 12px; color: t.$text-2; margin: 0 0 4px; }
.notif-data { font-size: 11px; color: t.$text-3; margin: 0; }

.back-link {
  text-decoration: none;
  align-items: center;
  color: t.$text-2;
  display: flex;
  gap: 7px;
  font-size: 13px;
  padding: 9px 14px;
  border-radius: t.$radius-sm;
  border: 1px solid t.$border;
  background: t.$surface-2;
  transition: color 0.15s, border-color 0.15s;

  .material-symbols-outlined { font-size: 18px; }
  &:hover { color: t.$text; border-color: t.$border-strong; }
}

.btn-logout {
  background: t.$surface-2;
  border: 1px solid t.$border;
  color: t.$text-2;
  padding: 9px 14px;
  border-radius: t.$radius-sm;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-size: 13px;
  transition: border-color 0.15s, color 0.15s;

  .material-symbols-outlined { font-size: 18px; }

  &:hover { border-color: t.$danger; color: t.$danger; }
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
  border-radius: t.$radius-sm;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  box-shadow: t.$shadow;

  &.success { background: t.$success-bg; color: t.$success; border: 1px solid rgba(89, 212, 153, 0.4); }
  &.error { background: t.$danger-bg; color: t.$danger; border: 1px solid rgba(242, 119, 122, 0.4); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Content */
.cms-main {
  flex: 1;
  min-width: 0;
  padding: 30px 32px 60px;
}

.cms-main-inner {
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
}

/* Sidebar slide transition */
.slide-sidebar-enter-active,
.slide-sidebar-leave-active {
  transition: width 0.25s ease, opacity 0.2s ease;
  overflow: hidden;
}
.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  width: 0 !important;
  opacity: 0;
}

@media (max-width: 899px) {
  .cms-main { padding: 22px 18px 48px; }
  .topbar { padding: 12px 18px; }
  .back-link span:last-child { display: none; }
  .btn-logout span:last-child { display: none; }
}
</style>
