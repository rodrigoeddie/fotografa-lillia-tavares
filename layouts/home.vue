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
    <div class="container">
      <nuxt-img
        provider="cloudflare"
        :src='"https://images.fotografalilliatavares.com.br/images/adbbe897-d46d-4f36-4ae3-a77243e78400/public"'
        alt="Fotógrafias feitas por Lillia Tavares, fotos corportivas"
        width="1700"
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
.wrapper-main {
  padding-top: 30px;

  @include m.max(xs) {
    padding-top: 10px;
  }

  .banner-hero {
    display: block;
  }
}
</style>
