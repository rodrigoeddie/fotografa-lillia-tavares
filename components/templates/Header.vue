<script lang="ts" setup>
const cfImg = useCfImg()
const { whatsappUrl } = useRuntimeConfig().public

const isMobile = ref(false);
const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
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

const clickLogo = ()  => trackEvent('click-logo', { screen_name: 'Header' });
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
let baseWrapperPadding = 0;
let headerStartsFixed = false;
let rafId: number | null = null;

const applyScrolled = () => {
  if (isScrolled.value) return;
  isScrolled.value = true;
  headerRef.value?.classList.add('is-scrolled');
  /* compensa exatamente a altura que o header tira do fluxo ao virar fixed —
     deslocamento líquido zero (sem "pulinho"). Se o header já nasce fixed
     (mobile interno), não há o que compensar. */
  if (cachedWrapperMain && !headerStartsFixed) {
    cachedWrapperMain.style.paddingTop = `${cachedHeaderHeight + baseWrapperPadding}px`;
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
    headerStartsFixed = getComputedStyle(headerRef.value).position === 'fixed';
  }
  cachedWrapperMain = document.querySelector<HTMLElement>('.wrapper-main');
  if (cachedWrapperMain) {
    baseWrapperPadding = parseFloat(getComputedStyle(cachedWrapperMain).paddingTop) || 0;
  }

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
    :class="isMounted ? {'mobile': isMobile, 'desktop': !isMobile} : {}">
    <!-- strip utilitário (P5 — docs/header-redesign): contato imediato; some no sticky e no mobile -->
    <div class="strip">
      <div class="strip-in">
        <span class="addr">Av. Ver. Narciso Yague Guimarães, 124 · Sala 21 · Mogi das Cruzes</span>
        <span class="sep" aria-hidden="true">·</span>
        <span class="strip-links">
          <NuxtLink
            to="https://www.instagram.com/fotografalilliatavares/"
            target="_blank"
            rel="noopener noreferrer">Instagram</NuxtLink>
          <span class="sep" aria-hidden="true">·</span>
          <NuxtLink
            :to="`${whatsappUrl}?text=Olá, vim pelo seu site e queria mais informações...`"
            target="_blank"
            rel="noopener noreferrer"
            @click="clickWhats">WhatsApp (11) 91115-9795</NuxtLink>
        </span>
      </div>
    </div>

    <div class="container">
      <h1 class="logo">
        <NuxtLink
          to="/"
          @click="clickLogo"
          aria-label="Voltar para a página inicial">
          <nuxt-img
            provider="cloudflare"
            :src="cfImg('19bd6c18-a153-4e79-c6bd-4293145da400')"
            alt="Logotipo Lillia Tavares Fotografia"
            width="390"
            height="107"
            class="logo-black"
            format="avif"
            fetchpriority="high"
            preload
            />
        </NuxtLink>
      </h1>

      <!-- <TemplatesSocial class="from-header" /> -->
      <TemplatesMenu class="from-header" />
    </div>

    <NuxtLink
      :to="`${whatsappUrl}?text=Olá, vim pelo seu site e queria mais informações...`"
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
  // box-shadow: 0 0 5px;
  color: #128c7e;
  font-size: 17rem;
  position: fixed;
  bottom: 65rem;
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
  @include m.card-shadow;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: white;
  display: flex;
  width: 100%;
  z-index: 9;

  @include m.max(md) {
    padding-bottom: 0;
  }

  .strip {
    border-bottom: 1px solid v.$light-beige;
    background: v.$cream;
    width: 100%;

    @include m.max(sm) {
      display: none;
    }

    .strip-in {
      justify-content: flex-end;
      align-items: baseline;
      letter-spacing: .06em;
      padding: 7rem 25rem;
      max-width: 1750rem;
      font-size: 15rem;
      margin: 0 auto;
      display: flex;
      gap: 18rem;

      .addr {
        letter-spacing: .02em;
        color: v.$panel;
      }

      a {
        text-transform: uppercase;
        transition: color .2s;
        color: v.$rose-deep;
        font-weight: 900;
        font-size: 14rem;

        &:hover {
          text-decoration: underline;
          color: v.$dark-red;
        }
      }

      .sep {
        color: v.$beige;
        padding: 0 6rem;
      }
    }
  }

  .container {
    justify-content: space-between;
    transition: height .3s;
    align-items: center;
    padding: 0 25rem;
    height: 72rem;
    display: flex;

    @include m.max(xs) {
      padding-left: 15px;
      padding-right: 0;
      height: 55px;
    }
  }

  .logo {
    transition: width .3s;
    margin-top: -12px;
    max-width: 217px;
    width: 315rem;

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

    /* colapso do sticky: strip some primeiro, andar principal compacta.
       height só no desktop — o seletor também casa com .mobile:not(.from-home),
       onde 60rem fluido esmagaria o header (o mobile mantém os 55px do base) */
    .strip {
      display: none;
    }

    .container {
      @include m.min(sm) {
        height: 60rem;
      }
    }

    .logo {
      width: 218rem;
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
