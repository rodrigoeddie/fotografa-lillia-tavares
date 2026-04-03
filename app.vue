<script setup lang="ts">
const { init, cleanup } = useScrollAnimations()
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
  const doInit = () => nextTick(() => init())
  if (document.readyState === 'complete') {
    doInit()
  } else {
    window.addEventListener('load', doInit, { once: true })
  }
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
