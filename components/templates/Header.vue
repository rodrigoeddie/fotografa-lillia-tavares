<script lang="ts" setup>
const configPublic = useRuntimeConfig().public;

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
          :src='configPublic.cloudflareURI + "054a1bce-78a3-4e53-7afa-a30d92e86500/logo"'
          alt="Logo Lillia Tavares Fotografia"
          width="385"
          class="logo-black"
          fetchpriority="high"
          loading="lazy"/>
        <nuxt-img
          :src='configPublic.cloudflareURI + "8a01bb94-bd4f-4e5b-aecf-b260b8726e00/logo"'
          alt="Logo Lillia Tavares Fotografia"
          width="385"
          class="logo-white"
          fetchpriority="high"
          loading="lazy"/>
        <span>Lillia Tavares Fotografia</span>
      </NuxtLink>
    </h1>

    <!-- <TemplatesSocial class="from-header" /> -->
    <TemplatesMenu class="from-header" />

    <NuxtLink
      to="https://wa.me/5511911159795"
      class="fixed-whatsapp"
      target="_blank">
      <nuxt-icon
        name="whatsapp"
        class="icon"/>
      <span class="txt-social">Whatsapp</span>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.fixed-whatsapp {
  transition: color .2s, border .2s;
  background-color: white;
  border: 2px solid #128c7e;
  padding: 5rem 15rem;
  border-radius: 8rem;
  align-items: center;
  box-shadow: 0 0 5px;
  color: #128c7e;
  font-size: 17rem;
  position: fixed;
  bottom: 20rem;
  display: flex;
  right: 20rem;
  gap: 10rem;

  &:hover {
    border-color: #075e54;
    color: #075e54;
  }

  .nuxt-icon {
    font-size: 25rem;
  }
}

.header {
  height: 100rem;
  z-index: 9;

  @include m.max(md) {
    height: 80px
  }

  .logo {
    position: absolute;
    left: v.$space;
    width: 385rem;
    top: 45rem;

    .logo-black {
      @media (prefers-color-scheme: dark) {
        display: none;
      }
    }

    .logo-white {
      display: none;

      @media (prefers-color-scheme: dark) {
        display: block;
      }
    }

    span {
      text-indent: -9999px;
      display: block;
    }

    @include m.max(md) {
      width: 180px;
      left: 20px;
      top: 50px;
    }
  }
}
</style>
