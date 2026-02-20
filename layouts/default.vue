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
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=4335671090015485&ev=PageView&noscript=1" /></noscript>
    <TemplatesHeader />
    <slot />
    <TemplatesFooter />
  </div>
</template>

<style scoped lang="scss">
.wrapper-main {
  padding-top: 20px;

  @include m.max(sm) {
    padding-top: 55px !important;
  }
}
</style>
