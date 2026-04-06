<script lang="ts" setup>
const imgSrc = 'https://images.fotografalilliatavares.com.br/images/f7c0628e-d30e-4b09-9033-16fc0815b600/w=500,fit=scale-down';
const imgSrcset = [
  'https://images.fotografalilliatavares.com.br/images/f7c0628e-d30e-4b09-9033-16fc0815b600/w=500,fit=scale-down 1x',
  'https://images.fotografalilliatavares.com.br/images/f7c0628e-d30e-4b09-9033-16fc0815b600/w=1000,fit=scale-down 2x',
].join(', ');

definePageMeta({
  layout: 'empty-layout'
});
</script>

<template>
  <img
    :src="imgSrc"
    :srcset="imgSrcset"
    sizes="500px"
    loading="eager"
    fetchpriority="high"
    class="img-orcamento"
    alt="Orçamento Dia das Mães" />
</template>

<style lang="scss" scoped>
.img-orcamento {
    display: block;
    max-width: 500px;
    margin: 0 auto;
    height: auto;
    width: 100%;
}
</style>
