<script setup lang="ts">
defineProps<{
  href: string
  target?: string
  rel?: string
}>()
</script>

<template>
  <NuxtLink :href="href" :target="target" :rel="rel">
    <slot />
  </NuxtLink>
</template>
