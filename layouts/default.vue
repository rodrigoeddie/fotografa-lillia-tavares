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
    <TemplatesHeader />
    <slot />
    <TemplatesFooter />
  </div>
</template>

<style scoped lang="scss">
.wrapper-main {
  padding-top: 20px !important;

  @include m.max(sm) {
    padding-top: 73px !important;
  }
}
</style>
