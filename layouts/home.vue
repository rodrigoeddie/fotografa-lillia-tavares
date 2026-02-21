<script lang="ts" setup>
  useSchemaOrg([
    defineWebSite({
      name: 'Fotógrafa Lillia Tavares',
      url: 'https://fotografalilliatavares.com.br'
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
  <div class="wrapper-main">
    <TemplatesHeader class="from-home" />
    <slot />
    <TemplatesFooter />
  </div>
</template>

<style scoped lang="scss">
.wrapper-main {
  padding-top: 20px;

  @include m.max(xs) {
    padding-top: 10px;
  }

  .banner-hero {
    display: block;
  }
}
</style>
