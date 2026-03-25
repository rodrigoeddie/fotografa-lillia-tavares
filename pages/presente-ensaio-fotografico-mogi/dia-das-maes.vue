<script lang="ts" setup>
import { button } from '#build/ui';

const title = 'Presente de Dia das Mães em Mogi das Cruzes: Ensaio Fotográfico Especial';
const description = 'Se você está procurando um presente de dia das mães em Mogi das Cruzes, uma das opções mais especiais é um ensaio fotográfico profissional. Diferente de presentes comuns, como flores ou roupas, as fotos se tornam lembranças para toda a vida.';
const link = 'https://fotografalilliatavares.com.br/ensaio-dia-das-maes-mogi-das-cruzes';

const slug = 'dia-das-maes';

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
  lpType: 'dia-das-maes'
});

const cta = {
  title: 'Pronto para ter fotos profissionais?',
  description: 'Agende seu ensaio corporativo em Mogi das Cruzes e destaque-se com qualidade.',
  buttonText: 'Agendar meu ensaio agora',
  whatsappMessage: 'Olá, gostaria de ver a disponibilidade de um ensaio corporativo (mensagem do site)',
  image: 'bdffeee4-f95f-43d4-8421-a80f9e0ea100',
  imageWidth: '2000',
  imageHeight: '889',
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
    title: 'Fotos de dia das mães feitas no estúdio',
    description: 'Mais de 288 clientes atendidos em Mogi das Cruzes',
    buttonText: 'Ver Portifólio Completo',
    buttonLink: '/ensaio-fotografico/dia-das-maes',
    buttonLabel: 'Ver portfólio completo de fotos de dia das mães feitas no estúdio'
}
</script>

<template >
  <div class="wrapper-dia-das-maes">
    <LandingsHero class="lp-dia-das-maes" :lp="slug" />
    <LandingsPortfolio class="lp-dia-das-maes container" :lp="slug" :data="portfolioSection" />
    <LandingsForWho class="lp-dia-das-maes" :lp="slug" :data="forWho" />
    <LandingsHowWorks class="lp-dia-das-maes" :lp="slug" :data="howWorks" />
    <LandingsPrices class="lp-dia-das-maes" :lp="slug" />
    <SectionsGeneralTestimonials class="lp-dia-das-maes container" :lp="slug" />
    <SectionsGeneralCtaContact class="lp-dia-das-maes container" :data="cta" />
    <LandingsMap class="lp-dia-das-maes" :lp="slug" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-dia-das-maes {
  padding-bottom: 100rem;
}
</style>
