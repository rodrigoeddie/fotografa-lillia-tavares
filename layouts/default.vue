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
