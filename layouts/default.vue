<script lang="ts" setup>
  import { SpeedInsights } from '@vercel/speed-insights/vue';

  useSchemaOrg([
    defineWebSite({
      name: 'Fotógrafa Lillia Tavares',
      url: 'https://fotografalilliatavares.com.br'
    })
  ])
</script>
<template>
  <div class="wrapper-main">
    <TemplatesHeader />
    <slot />
    <TemplatesFooter />
    <SpeedInsights />
  </div>
</template>

<style scoped lang="scss"></style>
