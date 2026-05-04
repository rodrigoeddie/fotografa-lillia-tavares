<script lang="ts" setup>
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block' }],
});
const { clienteData, isAuthenticated, logout } = useClientAuth();

const {
  notificacoes, unread, open: notifOpen, load: loadNotif, toggleOpen: toggleNotif,
  requestPushPermission,
} = useNotifications('cliente');

onMounted(async () => {
  if (isAuthenticated.value) {
    await loadNotif();
    // Ask for push permission once using SweetAlert if not yet granted
    if (import.meta.client && 'Notification' in window && Notification.permission === 'default') {
      const { useDialog } = await import('~/composables/useDialog');
      const { showConfirm } = useDialog();
      const accepted = await showConfirm(
        'Quer receber notificações quando seu ensaio estiver pronto?',
        'Notificações',
        'Sim, quero!',
        'Agora não',
      );
      if (accepted) await requestPushPermission();
    }
  }
});
</script>

<template>
  <div class="cliente-layout">
    <header class="cliente-header" v-if="isAuthenticated">
      <div class="container header">
        <NuxtLink to="/area-cliente/meus-ensaios" class="logo">
          <nuxt-img
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/19bd6c18-a153-4e79-c6bd-4293145da400/public"'
            alt="Logotipo Lillia Tavares Fotografia"
            width="390"
            height="107"
            class="logo-black"
            format="webp"
            fetchpriority="high"
            preload
            placeholder />
        </NuxtLink>

        <nav class="cliente-nav">
          <span class="cliente-welcome">Olá, {{ clienteData?.nome?.split(' ')[0] }}</span>
          <NuxtLink to="/area-cliente/meus-ensaios" class="nav-link">Meus ensaios</NuxtLink>

          <!-- Notificações -->
          <div class="notif-wrap">
            <button class="notif-bell" :class="{ 'has-unread': unread > 0 }" @click="toggleNotif" title="Notificações">
              <span class="material-symbols-outlined">notifications</span>
              <span v-if="unread > 0" class="notif-badge">{{ unread > 9 ? '9+' : unread }}</span>
            </button>
            <div v-if="notifOpen" class="notif-dropdown">
              <p class="notif-header">Notificações</p>
              <p v-if="notificacoes.length === 0" class="notif-empty">Nenhuma notificação</p>
              <div v-for="n in notificacoes" :key="n.id" class="notif-item" :class="{ unread: n.lida === 0 }">
                <p class="notif-titulo">{{ n.titulo }}</p>
                <p v-if="n.mensagem" class="notif-mensagem">{{ n.mensagem }}</p>
                <p class="notif-data">{{ new Date(n.criado_em).toLocaleDateString('pt-BR') }}</p>
              </div>
            </div>
          </div>

          <button class="nav-btn-logout" @click="logout">Sair</button>
        </nav>
      </div>
    </header>

    <main class="container cliente-main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.cliente-layout {
  font-family: 'Lato', sans-serif;
  min-height: 100vh;
  padding-top: 20px;
}

.container.header {
  border-bottom: 1px solid v.$green;
  justify-content: space-between;
  background: white;
  align-items: center;
  padding: 0 25rem;
  height: 90rem;
  display: flex;

  @include m.max(xs) {
    padding-left: 15px;
    padding-right: 0;
    height: 55px;
  }
}

.logo {
  margin-top: -35rem;
  width: 390rem;

  @include m.max(md) {
    margin-top: -20rem;
    width: 215px;
  }

  img {
    height: auto;
  }

  .logo-white {
    display: none;
  }

  span {
    text-indent: -9999px;
    display: block;
  }
}

.cliente-nav {
  display: flex;
  align-items: center;
  gap: 24px;
}

.cliente-welcome {
  font-size: 14px;
  color: #6b7280;
}

.nav-link {
  font-size: 14px;
  color: #374151;
  text-decoration: none;

  &:hover { color: #5e2012; }
}

.nav-btn-logout {
  font-size: 14px;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover { color: #5e2012; }
}

// Notification bell
.notif-wrap {
  position: relative;
}

.notif-bell {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  display: flex;
  align-items: center;
  position: relative;

  .material-symbols-outlined { font-size: 22px; }

  &:hover { color: #5e2012; }

  &.has-unread { color: #5e2012; }
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -6px;
  background: #5e2012;
  color: white;
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
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 100;
  overflow: hidden;
}

.notif-header {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  margin: 0;
}

.notif-empty {
  font-size: 13px;
  color: #9ca3af;
  padding: 16px;
  margin: 0;
  text-align: center;
}

.notif-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;

  &:last-child { border-bottom: none; }
  &.unread { background: #fef9f8; }
}

.notif-titulo {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 2px;
}

.notif-mensagem {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px;
}

.notif-data {
  font-size: 11px;
  color: #9ca3af;
  margin: 0;
}
.cliente-main {
  padding-right: 10px;
  padding-left: 10px;
}
</style>
