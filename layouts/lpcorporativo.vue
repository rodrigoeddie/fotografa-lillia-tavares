<script lang="ts" setup>
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
</script>

<template>
    <slot />
    <TemplatesFooter class="lp-corporativo" :lp="'corporativo'" />
</template>

<style lang="scss">
body.lp-corporativo {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #939DAB;
    font-family: 'Montserrat', sans-serif;
    background: white;
}
</style>
