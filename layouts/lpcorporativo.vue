<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: 'lp-corporativo'
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
    // Inicializa o stub do Facebook Pixel
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
    <slot />
    <TemplatesFooter class="lp-corporativo" :lp="'corporativo'" />
</template>

<style lang="scss">
body.lp-corporativo {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #939DAB;
    font-family: 'Montserrat', sans-serif;
    background: white;
}
</style>
