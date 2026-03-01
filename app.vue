<script setup lang="ts">
const { init, cleanup } = useScrollAnimations()
const route = useRoute()

// Inicializa animações após cada navegação
watch(
  () => route.fullPath,
  () => {
    nextTick(() => {
      init()
    })
  },
)

onMounted(() => {
  // Primeira carga
  nextTick(() => init())
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style></style>