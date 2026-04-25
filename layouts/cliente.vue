<script lang="ts" setup>
const { clienteData, isAuthenticated, logout } = useClientAuth();
</script>

<template>
  <div class="cliente-layout">
    <header class="cliente-header">
      <div class="cliente-header-inner">
        <NuxtLink to="/area-cliente/meus-ensaios" class="cliente-logo">
          Lillia Tavares
        </NuxtLink>
        <nav v-if="isAuthenticated" class="cliente-nav">
          <span class="cliente-welcome">Olá, {{ clienteData?.nome?.split(' ')[0] }}</span>
          <NuxtLink to="/area-cliente/meus-ensaios" class="nav-link">Meus ensaios</NuxtLink>
          <button class="nav-btn-logout" @click="logout">Sair</button>
        </nav>
      </div>
    </header>

    <main class="cliente-main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss">
.cliente-layout {
  min-height: 100vh;
  background: #faf9f7;
  font-family: 'Lato', sans-serif;
}

.cliente-header {
  background: #fff;
  border-bottom: 1px solid #f0ede8;
  position: sticky;
  top: 0;
  z-index: 100;
}

.cliente-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cliente-logo {
  font-size: 18px;
  font-weight: 700;
  color: #5e2012;
  text-decoration: none;
  letter-spacing: 0.03em;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}
</style>
