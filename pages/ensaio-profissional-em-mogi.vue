<script lang="ts" setup>
const title = 'Ensaio Profissional em Mogi das Cruzes | Fotos para LinkedIn e Empresas';
const description = 'Ensaio fotográfico profissional em Mogi das Cruzes para LinkedIn, currículo e redes sociais. Estúdio completo, direção de poses e entrega rápida. Agende seu horário.';
const link = 'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi';

const slug = 'corporativo';

// O conteúdo fica em /investimento/{slug} mas a URL é /precos-ensaios-fotograficos/{slug}
const { data: pageData } = await useAsyncData(`investimento-${slug}`, () => {
  return queryCollection('investimento').path(`/investimento/${slug}`).first();
});

useSchemaOrg([
  defineWebPage({
    name: title,
    url: link
  })
]);

useSeoMeta({
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: link,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: link
    }
  ]
});

definePageMeta({
  layout: 'lpcorporativo'
});
</script>

<template >
  <div class="wrapper-corporativo">
    <LandingsHero class="lp-corporativo" :lp="slug" />
    <LandingsPortfolio class="lp-corporativo" :lp="slug" />
    <section class="container">
      <h1 class="title-lp title-precos">
        Confira nossos preços para ensaio fotográfico profissional em Mogi das Cruzes
      </h1>
      <SectionsGeneralPricingGrid :data="pageData" :lp="slug" class="from-lp-corporativo" />
    </section>
    <SectionsGeneralTestimonials class="from-lp-corporativo" :lp="slug" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-corporativo {
  padding-bottom: 100rem;
}

.title-precos {
  margin-bottom: -20rem;
}
</style>
