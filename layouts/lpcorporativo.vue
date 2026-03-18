<script lang="ts" setup>
import { ScrollTrigger } from 'gsap/ScrollTrigger'

useHead({
  bodyAttrs: {
    class: 'lp-corporativo'
  },
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: ''
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap'
    }
  ]
});

onMounted(() => {
  // Sem o Header (que força recalculo de layout via paddingTop),
  // o ScrollTrigger pode ter posições desatualizadas em produção.
  // Refresh após imagens/fontes terem chance de carregar.
  setTimeout(() => ScrollTrigger.refresh(), 500)
})
</script>

<template>
  <slot />
</template>

<style lang="scss">
body.lp-corporativo {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #939DAB;
    font-family: 'Montserrat', sans-serif;
    background: white;
}
</style>
