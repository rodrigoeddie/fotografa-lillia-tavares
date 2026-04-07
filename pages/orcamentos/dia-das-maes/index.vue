<script lang="ts" setup>
const imgSrc = 'https://images.fotografalilliatavares.com.br/images/f7c0628e-d30e-4b09-9033-16fc0815b600/w=500,fit=scale-down';
const imgSrcset = [
  'https://images.fotografalilliatavares.com.br/images/f7c0628e-d30e-4b09-9033-16fc0815b600/w=500,fit=scale-down 1x',
  'https://images.fotografalilliatavares.com.br/images/f7c0628e-d30e-4b09-9033-16fc0815b600/w=1000,fit=scale-down 2x',
].join(', ');
const title = 'Presente de Dia das Mães em Mogi das Cruzes: Ensaio Fotográfico Especial';
const description = 'Se você está procurando um presente de dia das mães em Mogi das Cruzes, uma das opções mais especiais é um ensaio fotográfico profissional. Diferente de presentes comuns, como flores ou roupas, as fotos se tornam lembranças para toda a vida.';
const link = 'https://fotografalilliatavares.com.br/presente-ensaio-fotografico-mogi/dia-das-maes';
const imageShare = '737d6560-9e6a-49b4-b503-4c7d56dad900';
const slug = 'dia-das-maes';

useSchemaOrg([
  defineWebPage({
    name: title,
    url: link
  })
]);

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: link,
  ogImage: `https://images.fotografalilliatavares.com.br/images/${imageShare}/public`,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `https://images.fotografalilliatavares.com.br/images/${imageShare}/public`,
});

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
