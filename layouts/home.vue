<script lang="ts" setup>
  useSchemaOrg([
    defineWebSite({
      name: 'Fotógrafa Lillia Tavares',
      url: 'https://fotografalilliatavares.com.br'
    })
  ]);
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
