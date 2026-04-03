<script setup lang="ts">
const { init, cleanup, refresh } = useScrollAnimations()
const route = useRoute()
const nuxtApp = useNuxtApp()

watch(() => route.fullPath, () => {
  window.scrollTo({ top: 0 })
  cleanup()
}, { flush: 'sync' })

// page:finish garante que o componente filho já montou completamente
nuxtApp.hook('page:finish', () => {
  nextTick(() => init())
})

onMounted(() => {
  nextTick(() => init())
  // Após todas as imagens carregarem, recalcula posições dos triggers
  window.addEventListener('load', () => nextTick(() => refresh()), { once: true })
})
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style></style>
