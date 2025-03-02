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

<style scoped lang="scss"></style>
