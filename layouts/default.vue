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
    <a href="#main-content" class="skip-to-content">Ir para o conteúdo principal</a>
    <TemplatesHeader />
    <SectionsHero />
    <main id="main-content">
      <slot />
    </main>
    <SectionsFaqDynamic />
    <TemplatesFooter />
    <TemplatesCookieConsent />
  </div>
</template>

<style scoped lang="scss">
.wrapper-main {
  /* desktop sem padding: o header (com strip) encosta no topo; a compensação
     do header fixo é calculada no JS do Header.vue (deslocamento líquido zero) */
  @include m.max(sm) {
    padding-top: 55px;
  }
}

.skip-to-content {
  position: absolute;
  left: -9999rem;
  top: 8rem;
  z-index: 9999;
  padding: 8rem 16rem;
  background: v.$green;
  color: #fff;
  font-size: 16rem;
  border-radius: 0 0 4rem 0;
  text-decoration: none;

  &:focus {
    left: 0;
  }
}
</style>
