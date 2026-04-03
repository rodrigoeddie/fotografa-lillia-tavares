<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: 'lp-corporativo'
  }
});

useSchemaOrg([
  defineWebSite({
    name: 'Fotógrafa Lillia Tavares',
    url: 'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi'
  })
]);

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
