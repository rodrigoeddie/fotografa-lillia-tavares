<script setup lang="ts">
const { init, cleanup } = useScrollAnimations()
const route = useRoute()

watch(() => route.fullPath, () => {
  window.scrollTo({ top: 0 })
  cleanup()
}, { flush: 'sync' })

watch(() => route.fullPath, () => {
  nextTick(() => init())
}, { flush: 'post' })

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
