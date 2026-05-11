<script lang="ts" setup>
usePageSeo('static', '/blog');
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Blog' },
    ]" />
  </div>
  <SectionsBlogList/>
</template>

<style scoped lang="scss">
</style>
