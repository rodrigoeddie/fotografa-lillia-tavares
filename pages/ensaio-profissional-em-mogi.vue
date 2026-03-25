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
  layout: 'lp',
  lpType: 'corporativo'
});

const cta = {
  title: 'Pronto para ter fotos profissionais?',
  description: 'Agende seu ensaio corporativo em Mogi das Cruzes e destaque-se com qualidade.',
  buttonText: 'Agendar meu ensaio agora',
  whatsappMessage: 'Olá, gostaria de ver a disponibilidade de um ensaio corporativo (mensagem do site)',
  image: 'efcab108-fb74-4ac1-431e-5f18938ada00',
  features: [
    '✔ Direção completa durante o ensaio',
    '✔ Ideal para LinkedIn e redes sociais',
    '✔ Entrega rápida',
    '✔ Estúdio em Mogi das Cruzes'
  ]
};

const forWho = [
  {
    title: 'Redes Sociais',
    list: [
      'LinkedIn',
      'Instagram',
      'Facebook',
      'Site institucional'
    ]
  },
  {
    title: 'Empresários',
    list: [
      'Advogados',
      'Médicos',
      'Psicólogos',
      'Influenciadores...',
    ]
  },
  {
    title: 'Outros',
    list: [
      'Inscrições para comissários',
      'Executivos',
      'Currículos...',
    ]
  }
];

const howWorks = [
  {
    title: 'Agendamento',
    description: 'Agende seu horário em poucos minutos',
    icon: 'chedule',
  },
  {
    title: 'Ensaio',
    description: 'Receba direção completa durante o ensaio',
    icon: 'camera',
  },
  {
    title: 'Seleção',
    description: 'Escolha suas melhores fotos',
    icon: 'choose',
  },
  {
    title: 'Entrega',
    description: 'Receba imagens profissionais prontas para uso',
    icon: 'envelope',
  },
];

const portfolioSection = {
    title: 'Fotos corporativas feitas no estúdio',
    description: 'Mais de 288 clientes atendidos em Mogi das Cruzes',
    buttonText: 'Ver Portifólio Completo',
    buttonLink: '/ensaio-fotografico/corporativo',
    buttonLabel: 'Ver portfólio completo de fotos corporativas feitas no estúdio'
}
</script>

<template >
  <div class="wrapper-corporativo">
    <LandingsHero class="lp-corporativo" :lp="slug" />
    <LandingsPortfolio class="lp-corporativo" :lp="slug" :data="portfolioSection" />
    <LandingsForWho class="lp-corporativo" :lp="slug" :data="forWho" />
    <LandingsHowWorks class="lp-corporativo" :lp="slug" :data="howWorks" />
    <LandingsPrices class="lp-corporativo" :lp="slug" />
    <SectionsGeneralTestimonials class="lp-corporativo" :lp="slug" />
    <SectionsGeneralCtaContact class="lp-corporativo" :data="cta" />
    <LandingsMap class="lp-corporativo" :lp="slug" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-corporativo {
  padding-bottom: 100rem;
}
</style>
