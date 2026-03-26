<script lang="ts" setup>
const title = 'Presente com Ensaio Fotográfico em Mogi das Cruzes | Ideias Especiais';
const description = 'Surpreenda quem você ama com um ensaio fotográfico profissional em Mogi das Cruzes. Presente perfeito para Dia das Mães, aniversário, casais e datas especiais. Fotos que eternizam momentos.';
const link = 'https://fotografalilliatavares.com.br/presente-ensaio-fotografico-mogi';

const slug = 'presentes';

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
  ogImage: 'https://images.fotografalilliatavares.com.br/images/TODO_OG_IMAGE_ID/public',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://images.fotografalilliatavares.com.br/images/TODO_OG_IMAGE_ID/public',
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
  lpType: 'presentes'
});

const heroData = {
  title: 'Presente com Ensaio Fotográfico<br>em Mogi das Cruzes',
  subtitle: 'Surpreenda quem você ama com uma experiência única: um ensaio fotográfico profissional que transforma momentos em lembranças para toda a vida.',
  features: [
    'Memórias que duram para sempre',
    'Experiência acolhedora no estúdio',
    'Entrega com kits e vale-ensaio',
  ],
  whatsappMessage: 'Olá, gostaria de saber mais sobre presentear com um ensaio fotográfico (mensagem do site)',
  buttonText: 'Quero presentear com um ensaio →'
};

const forWho = {
  title: 'Por que um ensaio fotográfico é o presente perfeito?',
  description: 'Diferente de presentes comuns que perdem o valor com o tempo, um ensaio fotográfico profissional cria memórias que duram para sempre.',
  lists: [
    {
      title: 'Benefícios emocionais',
      list: [
        'Autoestima e confiança',
        'Memórias eternizadas',
        'Experiência única e especial',
        'Momento de cuidado pessoal'
      ]
    },
    {
      title: 'Para quais ocasiões',
      list: [
        '<b>Dia das Mães</b>',
        'Aniversários',
        'Dia dos Namorados',
        'Natal e datas especiais'
      ]
    },
    {
      title: 'O que está incluso',
      list: [
        'Ensaio profissional no estúdio',
        'Direção de poses completa',
        'Fotos editadas profissionalmente',
        'Kit presente personalizado'
      ]
    }
  ]
};

const deliverables = {
  title: 'Produtos entregáveis para presente',
  description: 'Além das fotos digitais, oferecemos kits especiais para tornar o presente ainda mais inesquecível.',
  items: [
    {
      icon: '🎁',
      title: 'Vale-Ensaio',
      description: 'Cartão personalizado com vale-ensaio fotográfico. A pessoa presenteada agenda no melhor horário.'
    },
    {
      icon: '👜',
      title: 'Nécessaire + Vale-Ensaio',
      description: 'Kit premium com nécessaire personalizada e vale-ensaio dentro. Perfeito para surpreender.'
    },
    {
      icon: '📸',
      title: 'Álbum Personalizado',
      description: 'Álbum impresso com as melhores fotos do ensaio. Uma lembrança física que dura gerações.'
    },
    {
      icon: '🖼️',
      title: 'Prints e Quadros',
      description: 'Impressões de alta qualidade em diversos tamanhos, prontas para emoldurar e decorar.'
    }
  ]
};

const cta = {
  title: 'Quer presentear alguém especial?',
  description: 'Entre em contato e monte o presente perfeito. Ajudamos você a escolher o melhor pacote para a ocasião.',
  buttonText: 'Montar presente pelo WhatsApp',
  whatsappMessage: 'Olá, gostaria de montar um presente com ensaio fotográfico (mensagem do site)',
  image: 'bdffeee4-f95f-43d4-8421-a80f9e0ea100',
  imageAlt: 'Menino de costas para sua mãe, ambos sorrindo, com fundo bege',
  features: [
    '✔ Vale-ensaio personalizado',
    '✔ Kits especiais para presente',
    '✔ Agendamento flexível',
    '✔ Estúdio em Mogi das Cruzes'
  ]
};

const map = {
  title: 'Estúdio Fotográfico em Mogi das Cruzes',
  description: `
    <p>Nosso estúdio fotográfico em Mogi das Cruzes está localizado em uma região central e de fácil acesso, ideal para quem quer presentear com um ensaio fotográfico profissional.</p>
    <p>Estamos em frente ao estacionamento da Prefeitura de Mogi das Cruzes, próximos às principais vias da cidade, pontos de ônibus e à estação de trem Estudantes.</p>
  `,
  finalDescription: `
    <p>Se você quer presentear alguém com um ensaio fotográfico em Mogi das Cruzes, nosso estúdio oferece o ambiente perfeito para criar lembranças únicas e especiais.</p>
  `,
};
</script>

<template>
  <div class="wrapper-presentes">
    <!-- Hero Section -->
    <section class="hero-presentes lp-presentes" data-ani-type="fade-up">
      <div class="container">
        <div class="hero-presentes__content">
          <h1 class="hero-presentes__title" v-html="heroData.title"></h1>
          <p class="hero-presentes__subtitle">{{ heroData.subtitle }}</p>
          <ul class="hero-presentes__features">
            <li v-for="feature in heroData.features" :key="feature">{{ feature }}</li>
          </ul>
          <a
            class="hero-presentes__btn"
            :href="`https://wa.me/5511911159795?text=${encodeURIComponent(heroData.whatsappMessage)}`"
          >
            <Icon name="icons:whatsapp" class="icon" />
            <span>{{ heroData.buttonText }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Gift Grid - Campanhas -->
    <LandingsGiftGrid class="lp-presentes" :lp="slug" />

    <!-- Produtos Entregáveis -->
    <section class="deliverables lp-presentes container" data-ani-type="fade-up">
      <h2 class="section-title">{{ deliverables.title }}</h2>
      <p class="section-description">{{ deliverables.description }}</p>
      <div class="deliverables__grid">
        <div
          v-for="(item, index) in deliverables.items"
          :key="index"
          class="deliverables__card"
          :data-ani-type="'fade-up'"
          :data-ani-delay="`${0.1 * (index + 1)}s`"
        >
          <span class="deliverables__icon">{{ item.icon }}</span>
          <h3 class="deliverables__card-title">{{ item.title }}</h3>
          <p class="deliverables__card-description">{{ item.description }}</p>
        </div>
      </div>
    </section>

    <!-- Por que ensaio é presente perfeito -->
    <LandingsForWho class="lp-presentes" :lp="slug" :data="forWho" />

    <!-- Depoimentos -->
    <SectionsGeneralTestimonials class="lp-presentes container" />

    <!-- CTA -->
    <SectionsGeneralCtaContact class="lp-presentes container" :data="cta" />

    <!-- Mapa -->
    <LandingsMap class="lp-presentes" :lp="slug" :data="map" />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-presentes {
  padding-bottom: 100rem;
}

.hero-presentes {
  background: v.$lp-presentes;
  color: white;
  padding: 80rem 0;
  text-align: center;

  @include m.max(sm) {
    padding: 40rem 0;
  }

  &__content {
    max-width: 800rem;
    margin: 0 auto;
  }

  &__title {
    font-size: 40rem;
    font-weight: 700;
    margin-bottom: 20rem;
    text-transform: uppercase;
    color: #EAEAEA;

    @include m.max(sm) {
      font-size: 28rem;
    }
  }

  &__subtitle {
    font-size: 20rem;
    line-height: 1.5;
    margin-bottom: 30rem;
    opacity: 0.95;

    @include m.max(sm) {
      font-size: 18rem;
    }
  }

  &__features {
    list-style: none;
    display: flex;
    justify-content: center;
    gap: 30rem;
    margin-bottom: 40rem;
    font-size: 18rem;

    li::before {
      content: '✓ ';
      font-weight: bold;
    }

    @include m.max(sm) {
      flex-direction: column;
      gap: 10rem;
      font-size: 16rem;
    }
  }

  &__btn {
    transition: box-shadow .3s ease, background .3s ease;
    box-shadow: 5rem 5rem 0 white;
    border-radius: 8rem;
    font-size: 25rem;
    border: 3rem solid white;
    padding: 20rem 30rem;
    align-items: center;
    font-weight: bold;
    display: inline-flex;
    color: white;
    gap: 15rem;
    text-decoration: none;

    @include m.max(sm) {
      font-size: 20rem;
      padding: 15rem 25rem;
    }

    .icon {
      font-size: 40rem;
    }

    &:hover {
      box-shadow: 10rem 10rem 0 white;
      background: rgba(0, 0, 0, 0.2);
    }
  }
}

.deliverables {
  margin-bottom: 70rem;
  padding-top: 40rem;

  .section-title {
    text-align: center;
    margin-bottom: 15rem;
  }

  .section-description {
    text-align: center;
    max-width: 700rem;
    margin: 0 auto 50rem;
    font-size: 20rem;
    line-height: 1.5;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25rem;
    max-width: 1200rem;
    margin: 0 auto;

    @include m.max(sm) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.max(xs) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: white;
    border-radius: 8rem;
    padding: 30rem 20rem;
    text-align: center;
    border: 2rem solid v.$lp-presentes-light;
  }

  &__icon {
    font-size: 45rem;
    display: block;
    margin-bottom: 15rem;
  }

  &__card-title {
    font-size: 20rem;
    font-weight: 700;
    margin-bottom: 10rem;
    color: v.$lp-presentes-dark;
  }

  &__card-description {
    font-size: 16rem;
    line-height: 1.5;
    color: #555;
  }
}
</style>
