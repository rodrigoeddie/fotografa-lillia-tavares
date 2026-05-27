<script lang="ts" setup>
  useSchemaOrg([
    defineWebSite({
      name: 'Fotógrafa Lillia Tavares',
      url: 'https://fotografalilliatavares.com.br'
    })
  ]);

  useHead({
    htmlAttrs: { lang: 'pt-BR' },
  });
</script>
<template>
  <div class="wrapper-main">
    <TemplatesHeader />
    <SectionsHero />
    <slot />
    <SectionsFaqDynamic />
    <TemplatesFooter />
    <TemplatesCookieConsent />
  </div>
</template>

<style scoped lang="scss">
.wrapper-main {
  padding-top: 20px;

  @include m.max(sm) {
    padding-top: 55px;
  }
}
</style>
