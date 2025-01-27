<script lang="ts" setup>
const { gtag } = useGtag();

const clickLogo = () => {
  gtag('event', 'click-logo', {
    app_name: 'Site',
    screen_name: 'Header'
  })
}
</script>

<template>
  <div class="container header">
    <h1 class="logo">
      <NuxtLink to="/" @click="clickLogo">
        <nuxt-img
          src="assets/images/logo-lillia-tavares-fotografia.png"
          alt="Logo Lillia Tavares Fotografia"
          width="385"
          loading="lazy"/>
        <span>Lillia Tavares Fotografia</span>
      </NuxtLink>
    </h1>

    <!-- <TemplatesSocial class="from-header" /> -->
    <TemplatesMenu class="from-header" />
  </div>
</template>

<style scoped lang="scss">
.header {
  height: 100rem;
  z-index: 9;

  @include m.max(sm) {
    height: 80px
  }

  .logo {
    position: absolute;
    left: v.$space;
    width: 385rem;
    top: 45rem;

    span {
      text-indent: -9999px;
      display: block;
    }

    @include m.max(sm) {
      width: 180px;
      left: 20px;
      top: 50px;
    }
  }
}
</style>
