<script lang="ts" setup>
const configPublic = useRuntimeConfig().public;

const { gtag } = useGtag();

const clickLogo = () => {
  gtag('event', 'click-logo', {
    app_name: 'Site',
    screen_name: 'Header'
  })
}
const clickWhats = () => {
  gtag('event', 'click-whats', {
    app_name: 'Site',
    screen_name: 'Header'
  })
}

import { gsap } from 'gsap';

const isScrolled = ref(false); // Estado para controlar se o header está "scrolled"
const headerRef = ref<HTMLElement | null>(null); // Referência ao elemento do header

const handleScroll = () => {
  console.log(document.querySelector('[data-component="sections/hero"]'));

  const scrollTop     = window.scrollY; // Obtém a posição do scroll
  const heroHeight    = 200
  const footerVisible = document.querySelector('[data-component="templates/footer"]')?.getBoundingClientRect().top || 0;

  if (scrollTop > heroHeight && footerVisible > window.innerHeight) {
    if (!isScrolled.value) {
      isScrolled.value = true;
      headerRef.value?.classList.add('is-scrolled');

      if (!headerRef.value?.dataset.show) {
        gsap.fromTo(
          headerRef.value,
          { top: '-100%', opacity: 1 },
          { top: '0%', opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      }
    }
  } else {
    if (isScrolled.value) {
      isScrolled.value = false;

      if (!headerRef.value?.dataset.show) {
        gsap.to(headerRef.value, {
          opacity: 0,
          duration: 0.1,
          onComplete: () => {
            headerRef.value?.classList.remove('is-scrolled');
            gsap.to(headerRef.value, { opacity: 1, duration: 0.1, clearProps: 'transform' });
          },
        });
      } else {
        headerRef.value?.classList.remove('is-scrolled');
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll); // Adiciona o evento de scroll
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll); // Remove o evento de scroll ao desmontar o componente
});
</script>

<template>
  <div ref="headerRef" class="header">
    <div class="container">
      <h1 class="logo">
        <NuxtLink
          to="/"
          @click="clickLogo">
          <nuxt-img
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/054a1bce-78a3-4e53-7afa-a30d92e86500/public"'
            alt="Logo Lillia Tavares Fotografia"
            width="385"
            height="164"
            class="logo-black"
            fetchpriority="high"
            placeholder />
          <nuxt-img
            :src='"https://images.fotografalilliatavares.com.br/images/8a01bb94-bd4f-4e5b-aecf-b260b8726e00/public"'
            alt="Logo Lillia Tavares Fotografia"
            width="385"
            height="164"
            class="logo-white"
            fetchpriority="high"
            placeholder />
          <span>Lillia Tavares Fotografia</span>
        </NuxtLink>
      </h1>

      <!-- <TemplatesSocial class="from-header" /> -->
      <TemplatesMenu class="from-header" />
    </div>

    <NuxtLink
      to="https://wa.me/5511911159795"
      class="fixed-whatsapp"
      @click="clickWhats"
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
  justify-content: center;
  position: absolute;
  display: flex;
  width: 100%;
  z-index: 9;
  top: 0;

  .container {
    height: 100rem;
  }

  @include m.max(md) {
    height: 80px
  }

  .logo {
    position: absolute;
    left: v.$space;
    width: 385rem;
    top: 45rem;

    img {
      height: auto;
    }

    .logo-black {
      // @media (prefers-color-scheme: dark) {
      //   display: none;
      // }
    }

    .logo-white {
      display: none;

      // @media (prefers-color-scheme: dark) {
      //   display: block;
      // }
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

  &.is-scrolled {
    background: white;
    position: fixed;

    // @media (prefers-color-scheme: dark) {
    //   background: v.$dark-green;
    // }

    .logo {
      width: 185rem;
      top: 10rem;
    }

    .menu.from-header {
      bottom: 25rem;
    }
  }
}
</style>
