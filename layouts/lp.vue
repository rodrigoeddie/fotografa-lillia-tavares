<script lang="ts" setup>
const route = useRoute();
const lpType = computed(() => route.meta.lpType as string || 'corporativo');
const showHeader = computed(() => route.meta.showHeader as boolean || false);

const logo = computed(() => {
    if (lpType.value === 'corporativo') {
        return "de7d6be6-8fed-43b0-e2ca-7b5643bd9d00";
    } else if (lpType.value === 'dia-das-maes') {
        return "4cb733c9-64af-48fd-2578-c43f3a26d800";
    } else if (lpType.value === 'presentes') {
        return "4cb733c9-64af-48fd-2578-c43f3a26d800";
    }

    return '19bd6c18-a153-4e79-c6bd-4293145da400';
});

useHead({
  bodyAttrs: {
    class: computed(() => `lp-${lpType.value}`)
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap'
    }
  ]
});

useSchemaOrg([
  defineWebSite({
    name: 'Fotógrafa Lillia Tavares',
    url: 'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi'
  })
]);

// Scripts de terceiros otimizados
useScript({
  key: 'facebook-pixel',
  src: 'https://connect.facebook.net/en_US/fbevents.js',
  async: true,
}, {
  stub: ({ fn }) => {
    // @ts-ignore
    window.fbq = fn;
    // @ts-ignore
    window.fbq.queue = [];
  },
  use() {
    // @ts-ignore
    if (typeof window.fbq !== 'undefined') {
      // @ts-ignore
      window.fbq('init', '4335671090015485');
      // @ts-ignore
      window.fbq('track', 'PageView');
    }
  }
});

useScript({
  key: 'smartlook',
  src: 'https://web-sdk.smartlook.com/recorder.js',
  async: true,
}, {
  stub: ({ fn }) => {
    // @ts-ignore
    window.smartlook = fn;
    // @ts-ignore
    window.smartlook.api = [];
  },
  use() {
    // @ts-ignore
    if (typeof window.smartlook !== 'undefined') {
      // @ts-ignore
      window.smartlook('init', '03d8d5209060cf01f72fb068bb5405e907929694', { region: 'eu' });
    }
  }
});
</script>

<template>
  <div :class="showHeader ? `wrapper-main` : ''">
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=4335671090015485&ev=PageView&noscript=1" /></noscript>
    <TemplatesHeader v-if="showHeader" :class="`lp-${lpType}`" :lp="lpType" :logo="logo" />
    <slot />
    <TemplatesFooter :class="`lp-${lpType}`" :lp="lpType" :logo="logo" />
  </div>
</template>

<style lang="scss">
body.lp-corporativo {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #939DAB;
    font-family: 'Montserrat', sans-serif;
    background: white;
}

body.lp-dia-das-maes {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #aba093;
    font-family: 'Montserrat', sans-serif;
    background: white;
}

body.lp-presentes {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #b8909a;
    font-family: 'Montserrat', sans-serif;
    background: white;
}

.wrapper-main {
  padding-top: 20px;

  @include m.max(sm) {
    padding-top: 55px !important;
  }
}
</style>

