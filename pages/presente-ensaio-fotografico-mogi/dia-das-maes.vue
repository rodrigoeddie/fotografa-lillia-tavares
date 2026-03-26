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
  // imageHeight: '889',
  imageAlt: 'Menino de costas para sua mãe, ambos sorrindo, com fundo bege, eles estão sentados no chão, a mãe tem um vestido vermelho e o menino uma camisa marrom',
  features: [
    '✔ Direção completa durante o ensaio',
    '✔ Ideal para LinkedIn e redes sociais',
    '✔ Entrega rápida',
    '✔ Estúdio em Mogi das Cruzes'
  ]
};

const forWho = {
  title: 'Ideias de presente para o Dia das Mães em Mogi das Cruzes',
  description: 'Se você ainda está em dúvida sobre o que escolher, existem várias opções de presente. Mas algumas criam apenas momentos passageiros, enquanto outras se transformam em lembranças para toda a vida.',
  lists: [
    {
      title: 'Experiência para mães',
      list: [
        '<b>Ensaio fotográfico</b>',
        'Spa / Dia de beleza',
        'Jantar especial',
      ]
    },
    {
      title: 'Presentes clássicos',
      list: [
        'Flores',
        'Perfume',
        'Roupas ou acessórios',
      ]
    },
    {
      title: 'Experiências personalizadas',
      list: [
        'Álbum personalizado',
        '<small><b>Análise de coloração pessoal</b></small>',
        'Consultoria de imagem',
      ]
    }
  ]
};

const howWorks = [
  {
    title: 'Agendamento rápido',
    description: 'Escolha o melhor dia e horário de forma simples e rápida pelo WhatsApp',
    icon: 'chedule',
  },
  {
    title: 'Experiência no estúdio',
    description: 'Sua família será guiada em cada momento para se sentir confortável e sair linda nas fotos',
    icon: 'camera',
  },
  {
    title: 'Escolha das fotos',
    description: 'Selecione suas imagens favoritas com calma e sem pressão',
    icon: 'choose',
  },
  {
    title: 'Entrega especial',
    description: 'Receba fotos profissionais prontas para guardar como lembrança para toda a vida',
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

const map = {
  title: 'Estúdio Fotográfico em Mogi das Cruzes',
  description: `
    <p>Nosso estúdio fotográfico em Mogi das Cruzes está localizado em uma região central e de fácil acesso, ideal para quem busca praticidade na hora de realizar seu ensaio de Dia das Mães.</p>
    <p>Estamos em frente ao estacionamento da Prefeitura de Mogi das Cruzes, próximos às principais vias da cidade, pontos de ônibus e à estação de trem Estudantes, facilitando a chegada de clientes de toda a região.</p>
  `,
  finalDescription: `
    <p>Se você está procurando um ensaio fotográfico em Mogi das Cruzes para o Dia das Mães, nosso estúdio oferece um ambiente preparado para criar lembranças únicas e especiais.</p>
  `,
}
</script>

<template >
  <div class="wrapper-dia-das-maes">
    <LandingsHero class="lp-dia-das-maes" :lp="slug" />
    <LandingsPortfolio class="lp-dia-das-maes container" :lp="slug" :data="portfolioSection" />
    <LandingsHowWorks class="lp-dia-das-maes" :lp="slug" :data="howWorks" />
    <LandingsPrices class="lp-dia-das-maes" :lp="slug" />
    <SectionsGeneralTestimonials class="lp-dia-das-maes container" :lp="slug" />
    <SectionsGeneralCtaContact class="lp-dia-das-maes container" :data="cta" />
    <LandingsForWho class="lp-dia-das-maes" :lp="slug" :data="forWho" />
    <LandingsColoracao class="lp-dia-das-maes" :lp="slug" />
    <LandingsMap class="lp-dia-das-maes" :lp="slug" :data="map" />

    <section class="hub-backlink lp-dia-das-maes container" data-ani-type="fade-up">
      <p>Veja outras ideias de presente com ensaio fotográfico</p>
      <NuxtLink to="/presente-ensaio-fotografico-mogi" class="hub-backlink__link">
        Explorar todas as opções de presente →
      </NuxtLink>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.wrapper-dia-das-maes {
  padding-bottom: 100rem;
}

.hub-backlink {
  text-align: center;
  padding: 50rem 20rem;
  margin-bottom: 40rem;
  background: v.$lp-dia-das-maes-ultralight;
  border-radius: 8rem;

  p {
    font-size: 22rem;
    color: v.$lp-dia-das-maes-dark;
    margin-bottom: 15rem;
    font-weight: 600;
  }

  &__link {
    font-size: 20rem;
    font-weight: 700;
    color: v.$lp-dia-das-maes;
    text-decoration: underline;
    transition: color 0.3s ease;

    &:hover {
      color: v.$lp-dia-das-maes-dark;
    }
  }
}
</style>
