<script lang="ts" setup>
const configPublic = useRuntimeConfig().public;
const isMobile = ref(false);

onMounted(() => {
  if (process.client) {
    const checkMobile = () => {
      return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    isMobile.value = checkMobile();

    const handleResize = () => {
      isMobile.value = checkMobile();
    };

    window.addEventListener('resize', handleResize);

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
  }
});

const { trackEvent } = useTracking();

const clickLogo = () => trackEvent('click-logo', { screen_name: 'Header' });
const clickWhats = () => trackEvent('click-whats', { screen_name: 'Header' });

const props = defineProps({
    lp: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: '19bd6c18-a153-4e79-c6bd-4293145da400'
    }
});

const isScrolled = ref(false);
const headerRef = ref<HTMLElement | null>(null);
let headerPassedOnce = false;
let initialHeaderTopPosition = 0;
let cachedHeaderHeight = 0;
let cachedWrapperMain: HTMLElement | null = null;
let rafId: number | null = null;

const applyScrolled = () => {
  if (isScrolled.value) return;
  isScrolled.value = true;
  headerRef.value?.classList.add('is-scrolled');
  if (cachedWrapperMain) {
    cachedWrapperMain.style.paddingTop = `${cachedHeaderHeight + 30}px`;
  }
};

const removeScrolled = () => {
  if (!isScrolled.value) return;
  isScrolled.value = false;
  headerRef.value?.classList.remove('is-scrolled');
  if (cachedWrapperMain) {
    cachedWrapperMain.style.paddingTop = '';
  }
};

const handleScroll = () => {
  // throttle via rAF — evita leituras de layout a cada pixel scrollado
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    const scrollTop = window.scrollY;

    if (scrollTop > initialHeaderTopPosition && !headerPassedOnce) {
      headerPassedOnce = true;
      applyScrolled();
    } else if (scrollTop <= initialHeaderTopPosition && headerPassedOnce) {
      headerPassedOnce = false;
      removeScrolled();
    }
  });
};

onMounted(() => {
  // Lê dimensões UMA VEZ no mount, fora do scroll handler
  if (headerRef.value) {
    initialHeaderTopPosition = headerRef.value.offsetTop;
    cachedHeaderHeight = headerRef.value.offsetHeight;
  }
  cachedWrapperMain = document.querySelector<HTMLElement>('.wrapper-main');

  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  window.removeEventListener('scroll', handleScroll);
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
          @click="clickLogo"
          aria-label="Voltar para a página inicial">
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
      </h1>

      <!-- <TemplatesSocial class="from-header" /> -->
      <TemplatesMenu class="from-header" />
    </div>

    <NuxtLink
      to="https://wa.me/5511911159795"
      class="fixed-whatsapp"
      @click="clickWhats"
      target="_blank"
      aria-label="Entrar em contato via WhatsApp"
      rel="noopener noreferrer">
      <Icon
        name="icons:whatsapp"
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

  .icon {
    font-size: 25rem;
  }
}

.header {
  justify-content: center;
  // padding-bottom: 20rem;
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
    transition: width .3s;
    margin-top: -35rem;
    width: 390rem;

    @include m.max(md) {
      width: 215px;
      margin-top: -20rem;
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

    .logo {
      width: 286rem;
      margin-top: 0;
    }
  }
}

.lp-presentes {
  :deep(.menu) {
    .link {
      color: v.$lp-presentes;

      &:after {
        color: v.$lp-presentes-ultralight;
      }

      &:hover:before,
      &:before {
        background: v.$lp-presentes-ultralight;
      }
    }
  }
}
</style>
