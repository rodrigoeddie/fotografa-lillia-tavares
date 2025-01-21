<script lang="ts" setup>
  import { SpeedInsights } from '@vercel/speed-insights/vue';
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
