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
    <TemplatesHeader class="from-home" />
    <slot />
    <TemplatesFooter />
    <TemplatesCookieConsent />
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
