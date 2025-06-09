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
        width="1920"
        fetchpriority="high"
        placeholder
        class="banner-hero"/>
    </div>
    <TemplatesHeader />
    <slot />
    <TemplatesFooter />
  </div>
</template>

<style scoped lang="scss">
.wrapper-main {
  padding-top: 30px;
}
</style>
