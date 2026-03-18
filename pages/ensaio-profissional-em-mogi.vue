<script lang="ts" setup>
const title = 'Ensaio Profissional em Mogi das Cruzes | Fotos para LinkedIn e Empresas';
const description = 'Ensaio fotográfico profissional em Mogi das Cruzes para LinkedIn, currículo e redes sociais. Estúdio completo, direção de poses e entrega rápida. Agende seu horário.';
const link = 'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi';

const slug = 'corporativo';

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

const cta = {
  title: 'Pronto para ter fotos profissionais incríveis para o seu LinkedIn e redes sociais?',
  description: 'Agende seu ensaio fotográfico corporativo em Mogi das Cruzes hoje mesmo e destaque-se com fotos de alta qualidade.',
  buttonText: 'Agendar Ensaio pelo WhatsApp',
  whatsappMessage: 'Olá, gostaria de ver a disponibilidade de um ensaio corporativo (mensagem do site)'
};
</script>

<template >
  <div class="wrapper-corporativo">
    <LandingsHero class="lp-corporativo" :lp="slug" />
    <LandingsPortfolio class="lp-corporativo" :lp="slug" />
    <LandingsPrices class="lp-corporativo" :lp="slug" />
    <SectionsGeneralTestimonials class="lp-corporativo" :lp="slug" />
    <SectionsGeneralCtaContact class="lp-corporativo" :data="cta" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-corporativo {
  padding-bottom: 100rem;
}
</style>
