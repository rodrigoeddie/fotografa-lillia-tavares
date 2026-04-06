<script lang="ts" setup>
  useHead({
    htmlAttrs: { lang: 'pt-BR' },
    meta: [
      { name: 'robots', content: 'noindex, nofollow' }
    ],
  });
</script>

<template>
  <div class="wrapper-main">
    <slot />
  </div>
</template>

<style scoped lang="scss">
</style>
