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
    <div class="container wrap-img-hero">
      <nuxt-img
        provider="cloudflare"
        :src='"https://images.fotografalilliatavares.com.br/images/adbbe897-d46d-4f36-4ae3-a77243e78400/public"'
        alt="Fotógrafias feitas por Lillia Tavares, fotos corportivas"
        width="1700"
        height="346"
        sizes="100vw sm:50vw md:1700px"
        format="webp"
        fetchpriority="high"
        placeholder
        preload
        class="banner-hero"/>
    </div>
    <TemplatesHeader class="from-home" />
    <slot />
    <TemplatesFooter />
  </div>
</template>

<style scoped lang="scss">
.wrap-img-hero {
  align-items: flex-end;
  height: 250rem;
  display: flex;
  position: relative;

  @include m.max(sm) {
    height: auto;
  }

  img {
    height: 100%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    object-fit: contain;
    width: 100%;
  }
}

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
