<script lang="ts" setup>
definePageMeta({
  layout: 'empty-layout'
});

usePageSeo('static', '/orcamentos/dia-das-maes');

const cfImg = useCfImg();
const imgSrc = cfImg('f7c0628e-d30e-4b09-9033-16fc0815b600', 'w=500,fit=scale-down');
const imgSrcset = [
  `${cfImg('f7c0628e-d30e-4b09-9033-16fc0815b600', 'w=500,fit=scale-down')} 1x`,
  `${cfImg('f7c0628e-d30e-4b09-9033-16fc0815b600', 'w=1000,fit=scale-down')} 2x`,
].join(', ');
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
