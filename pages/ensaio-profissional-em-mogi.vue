<script lang="ts" setup>
const title = 'Ensaio Profissional em Mogi das Cruzes | Fotos para LinkedIn e Empresas';
const description = 'Ensaio fotográfico profissional em Mogi das Cruzes para LinkedIn, currículo e redes sociais. Estúdio completo, direção de poses e entrega rápida. Agende seu horário.';
const link = 'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi';

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
  <LandingsHero class="lp-corporativo" :lp="'corporativo'" />
  <SectionsGeneralTestimonials class="from-lp-corporativo" :lp="'corporativo'" />
</template>

