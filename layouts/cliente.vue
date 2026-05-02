<script lang="ts" setup>
useHead({
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block' }],
});
const { clienteData, isAuthenticated, logout } = useClientAuth();
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
.cliente-main {
  padding-right: 10px;
  padding-left: 10px;
}
</style>
