<script setup lang="ts">
await usePageSeo('static', '/precos-ensaios-fotograficos');
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Preços de Ensaios Fotográficos' },
    ]" />
  </div>
  <SectionsPrecosList />
</template>

<style scoped lang="scss">
</style>
