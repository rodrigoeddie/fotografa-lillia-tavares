<script setup lang="ts">
import { gsap } from 'gsap'

const { init, cleanup } = useScrollAnimations()
const route = useRoute()
const pageWrapper = ref<HTMLElement | null>(null)

// flush:'sync' → roda antes do Vue re-renderizar → blur no conteúdo ANTIGO
watch(() => route.fullPath, () => {
  const el = pageWrapper.value
  if (!el) return
  gsap.killTweensOf(el)
  gsap.set(el, { filter: 'blur(12px)' })
  window.scrollTo({ top: 0 })
  cleanup()
}, { flush: 'sync' })

// flush:'post' → roda após o DOM ser atualizado → remove blur do conteúdo NOVO
watch(() => route.fullPath, () => {
  const el = pageWrapper.value
  if (!el) { init(); return }
  gsap.killTweensOf(el)
  gsap.to(el, {
    filter: 'blur(0px)',
    duration: 0.45,
    ease: 'power2.out',
    onComplete: () => init(),
  })
}, { flush: 'post' })

onMounted(() => nextTick(() => init()))
onBeforeUnmount(() => cleanup())
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="#cfaf96" :height="2" />
    <NuxtLayout>
      <div ref="pageWrapper" style="will-change: filter;">
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>

<style></style>
