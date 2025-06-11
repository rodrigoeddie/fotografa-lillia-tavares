<script lang="ts" setup>
const configPublic = useRuntimeConfig().public;
const isMobile = ref(false);

onMounted(() => {
  if (process.client) {
    const checkMobile = () => {
      return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    isMobile.value = checkMobile();
    
    // Listener para mudanças de tela
    const handleResize = () => {
      isMobile.value = checkMobile();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
  }
});

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

const isScrolled = ref(false); // Estado para controlar se o header está "scrolled"
const headerRef = ref<HTMLElement | null>(null); // Referência ao elemento do header
let lastScrollTop = 0;
let headerPassedOnce = false;
let initialHeaderTopPosition = 0; // Posição inicial do header (capturada apenas uma vez)

const handleScroll = () => {
  const scrollTop = window.scrollY;

  const headerElement = document.querySelector('.header');

  if (headerElement) {
    const headerRect = headerElement.getBoundingClientRect();

    // Capturar a posição inicial do header apenas uma vez
    if (initialHeaderTopPosition === 0) {
      initialHeaderTopPosition = headerRect.top + scrollTop;
    }

    // Se o header alcançou a posição 0 (topo da tela) pela primeira vez
    if (headerRect.top <= 0 && !headerPassedOnce) {
      headerPassedOnce = true;

      if (!isScrolled.value) {
        isScrolled.value = true;
        headerRef.value?.classList.add('is-scrolled');

        const wrapperMain = document.querySelector('.wrapper-main');
        if (wrapperMain && headerRef.value) {
          const headerHeight = headerRef.value.clientHeight;
          const paddingTop = headerHeight + 30;
          (wrapperMain as HTMLElement).style.paddingTop = `${paddingTop}px`;
        }
      }
    }

    // Se voltou para a posição inicial do header
    if (scrollTop <= initialHeaderTopPosition && headerPassedOnce) {
      headerPassedOnce = false;

      if (isScrolled.value) {
        isScrolled.value = false;

        const wrapperMain = document.querySelector('.wrapper-main');
        if (wrapperMain) {
          (wrapperMain as HTMLElement).style.paddingTop = '';
        }

        headerRef.value?.classList.remove('is-scrolled');
      }
    }
  }

  lastScrollTop = scrollTop;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll); // Adiciona o evento de scroll
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll); // Remove o evento de scroll ao desmontar o componente
});
</script>

<template>
  <div
    ref="headerRef"
    class="header"
    :class="{'mobile': isMobile, 'desktop': !isMobile}">
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
  padding-bottom: 20rem;
  display: flex;
  width: 100%;
  z-index: 9;

  @include m.max(md) {
    padding-bottom: 0;
  }
  
  .container {
    box-shadow: 0 -15px 15px rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid v.$green;
    justify-content: space-between;
    padding: 15rem 25rem;
    background: white;
    align-items: center;
    display: flex;
    
    @include m.max(xs) {
      padding-left: 15px;
      padding-bottom: 5px;
      padding-right: 0;
      padding-top: 5px;
    }
  }

  .logo {
    width: 270rem;

    @include m.max(md) {
      width: 140px;
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

  &.mobile:not(.from-home),
  &.is-scrolled {
    position: fixed;
    top: 0;
  }
}
</style>
