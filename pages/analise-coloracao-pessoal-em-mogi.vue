<script lang="ts" setup>
const title = 'Análise de Coloração Pessoal em Mogi das Cruzes | Lillia Tavares';
const description = 'Descubra quais cores valorizam sua beleza natural com a análise de coloração pessoal em Mogi das Cruzes. Receba sua cartela de cores personalizada e eleve sua autoestima. Agende com a fotógrafa e consultora Lillia Tavares.';
const link = 'https://fotografalilliatavares.com.br/analise-coloracao-pessoal-em-mogi';

useSchemaOrg([
  defineWebPage({
    name: title,
    url: link
  }),
]);

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: link,
  ogImage: 'https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: 'https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: link
    }
  ]
});

const benefits = [
  {
    icon: '🎨',
    title: 'Descubra suas cores',
    description: 'Saiba quais tons de roupa, maquiagem e acessórios valorizam sua tonalidade de pele, cabelo e olhos.'
  },
  {
    icon: '✨',
    title: 'Mais autoestima',
    description: 'Ao usar as cores certas, você se sente mais confiante e bonita no dia a dia e em fotos profissionais.'
  },
  {
    icon: '🛍️',
    title: 'Compras inteligentes',
    description: 'Pare de comprar roupas que não combinam. Com sua cartela de cores, cada escolha é assertiva.'
  },
  {
    icon: '📋',
    title: 'Cartela personalizada',
    description: 'Receba sua cartela de cores exclusiva para consultar sempre que precisar fazer uma escolha de cor.'
  }
];

const steps = [
  {
    icon: 'chedule',
    title: 'Agendamento',
    description: 'Entre em contato pelo WhatsApp e agende sua análise de coloração pessoal no estúdio em Mogi das Cruzes.'
  },
  {
    icon: 'analise-presencial',
    title: 'Análise presencial',
    description: 'No estúdio, fazemos a análise com tecidos coloridos para identificar qual cartela de cores harmoniza com você.'
  },
  {
    icon: 'cartela-cores',
    title: 'Cartela de cores',
    description: 'Você recebe sua cartela de cores personalizada com as tonalidades que mais valorizam sua beleza natural.'
  },
  {
    icon: 'orientacoes',
    title: 'Orientações',
    description: 'Receba dicas práticas sobre como aplicar as cores no guarda-roupa, maquiagem e acessórios do dia a dia.'
  }
];

const testimonials = [
  {
    text: 'Maravilhosa! Eu já fiz 2x fotos, fiz minha coloração pessoal, e eu amo!',
    source: 'Google'
  },
  {
    text: 'A experiência de fotos e análise de coloração pessoal com a Lillia é fantástica.',
    source: 'Google'
  }
];
</script>

<template>
  <div class="coloracao-page">
    <!-- Hero -->
    <section class="coloracao-hero container" data-ani-type="fade-up">
        <div class="coloracao-hero__content">
          <div class="coloracao-hero__text">
            <h1 class="coloracao-hero__title">Análise de Coloração Pessoal<br>em Mogi das Cruzes</h1>
            <p class="coloracao-hero__description">
              Descubra quais cores valorizam a sua beleza natural. A análise de coloração pessoal revela
              as tonalidades que harmonizam com sua pele, cabelo e olhos, trazendo mais autoestima,
              confiança e praticidade para o seu dia a dia.
            </p>
            <a
              class="coloracao-hero__btn"
              href="https://wa.me/5511911159795?text=Olá, gostaria de saber mais sobre a análise de coloração pessoal (mensagem do site)"
            >
              <Icon name="icons:whatsapp" class="icon" />
              <span>Agendar minha análise →</span>
            </a>
          </div>
          <div class="coloracao-hero__image" data-ani-type="fade-left" data-ani-delay="0.3s">
            <nuxt-img
              provider="cloudflare"
              src="https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public"
              alt="Fotógrafa e consultora de imagem Lillia Tavares realizando análise de coloração pessoal em Mogi das Cruzes"
              width="450"
              lazyload="true"
              sizes="100vw sm:50vw md:450px"
              format="webp"
              placeholder
              class="img"
            />
          </div>
        </div>
    </section>

    <!-- Benefícios -->
    <section class="coloracao-benefits container" data-ani-type="fade-up">
      <h2 class="title">Por que fazer uma análise de coloração pessoal?</h2>
      <p class="description">
        A análise de coloração pessoal vai muito além de saber se você é "verão" ou "inverno".
        É uma ferramenta prática que transforma seu dia a dia, suas compras e até suas fotos profissionais.
      </p>
      <div class="coloracao-benefits__grid">
        <div
          v-for="(benefit, index) in benefits"
          :key="index"
          class="coloracao-benefits__card"
          :data-ani-type="'fade-up'"
          :data-ani-delay="`${0.1 * (index + 1)}s`"
        >
          <span class="coloracao-benefits__icon">{{ benefit.icon }}</span>
          <h3 class="card-title">{{ benefit.title }}</h3>
          <p class="card-description">{{ benefit.description }}</p>
        </div>
      </div>
    </section>

    <!-- Como funciona -->
    <LandingsHowWorks class="coloracao-steps container" :data="{ title: 'Como funciona a análise de coloração pessoal?', list: steps }" />

    <!-- Depoimentos -->
    <SectionsGeneralTestimonials />

    <!-- Cross-sell com ensaio -->
    <section class="coloracao-crosssell container" data-ani-type="fade-up">
      <h2>Combine com um ensaio fotográfico</h2>
      <p>
        Muitas clientes aproveitam para fazer a análise de coloração pessoal junto com o ensaio fotográfico.
        Assim, as fotos já são feitas com as cores que mais valorizam a sua beleza, uma combinação perfeita
        para quem quer fotos incríveis e aprender sobre si mesma.
      </p>
      <div class="coloracao-crosssell__links">
        <NuxtLink to="/ensaio-fotografico" class="coloracao-crosssell__link">
          Ver ensaios fotográficos →
        </NuxtLink>
        <NuxtLink to="/presente-ensaio-fotografico-mogi" class="coloracao-crosssell__link">
          Presentear com ensaio + coloração →
        </NuxtLink>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="coloracao-cta container" data-ani-type="fade-up">
      <div class="container">
        <h2 class="title">Pronta para descobrir suas cores?</h2>
        <p>Agende sua análise de coloração pessoal em Mogi das Cruzes e transforme sua relação com as cores.</p>
        <a
          class="coloracao-cta__btn"
          href="https://wa.me/5511911159795?text=Olá, gostaria de agendar uma análise de coloração pessoal (mensagem do site)"
        >
          <Icon name="icons:whatsapp" class="icon" />
          <span>Agendar pelo WhatsApp</span>
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.coloracao-page {
  padding-bottom: 60rem;
}

.coloracao-hero {
  background: v.$green;
  color: white;
  padding: 0 0 0 40rem;

  @include m.max(sm) {
    padding: 30rem 0;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 40rem;

    @include m.max(sm) {
      flex-direction: column-reverse;
      gap: 20rem;
    }
  }

  &__text {
    flex: 1;
  }

  &__title {
    font-size: 36rem;
    font-weight: 700;
    margin-bottom: 20rem;
    color: white;

    @include m.max(sm) {
      font-size: 26rem;
    }
  }

  &__description {
    font-size: 19rem;
    line-height: 1.6;
    margin-bottom: 30rem;
    opacity: 0.95;

    @include m.max(sm) {
      font-size: 17rem;
    }
  }

  &__btn {
    transition: box-shadow .3s ease, background .3s ease;
    box-shadow: 5rem 5rem 0 rgba(255,255,255,0.3);
    border-radius: 8rem;
    font-size: 22rem;
    border: 2rem solid white;
    padding: 18rem 28rem;
    align-items: center;
    font-weight: bold;
    display: inline-flex;
    color: white;
    gap: 12rem;
    text-decoration: none;

    @include m.max(sm) {
      font-size: 18rem;
      padding: 14rem 22rem;
    }

    .icon {
      font-size: 35rem;
    }

    &:hover {
      box-shadow: 10rem 10rem 0 rgba(255,255,255,0.3);
      background: rgba(0, 0, 0, 0.15);
    }
  }

  &__image {
    flex-shrink: 0;
    width: 350rem;
    overflow: hidden;

    @include m.max(sm) {
      width: 250rem;
    }

    .img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

.coloracao-benefits {
  padding: 60rem 0;

  .title,
  .description {
    text-align: center;
    color: v.$green;
  }

  .description {
    padding-bottom: 15rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25rem;
    
    @include m.max(sm) {
        grid-template-columns: repeat(2, 1fr);
        gap: 15rem;
    }
  }

  &__card {
    background: white;
    border-radius: 8rem;
    padding: 30rem 20rem;
    text-align: center;
    border: 2rem solid v.$light-green;

    @include m.max(sm) {
      padding: 25rem 15rem;
    }
  }

  &__icon {
    font-size: 40rem;
    display: block;
    margin-bottom: 15rem;
  }
}

.coloracao-testimonials {
  padding: 60rem 0;

  h2 {
    text-align: center;
    margin-bottom: 30rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 25rem;
    max-width: 900rem;
    margin: 0 auto;

    @include m.max(xs) {
      grid-template-columns: 1fr;
    }
  }

  &__quote {
    background: white;
    border-radius: 8rem;
    padding: 30rem;
    border-left: 4rem solid v.$green;

    p {
      font-size: 18rem;
      line-height: 1.5;
      font-style: italic;
      margin-bottom: 10rem;
      color: #333;
    }

    cite {
      font-size: 14rem;
      color: #888;
      font-style: normal;
    }
  }
}

.coloracao-crosssell {
  padding: 40rem 0 60rem;
  text-align: center;

  h2 {
    margin-bottom: 15rem;
  }

  p {
    max-width: 700rem;
    margin: 0 auto 30rem;
    font-size: 19rem;
    line-height: 1.5;
  }

  &__links {
    display: flex;
    justify-content: center;
    gap: 30rem;
    flex-wrap: wrap;
  }

  &__link {
    font-size: 18rem;
    font-weight: 700;
    color: v.$green;
    text-decoration: underline;
    transition: color 0.3s;

    &:hover {
      color: v.$dark-green;
    }
  }
}

.coloracao-cta {
  background: v.$green;
  color: white;
  padding: 60rem 0;
  text-align: center;

  h2 {
    color: white;
    margin-bottom: 15rem;
  }

  p {
    font-size: 19rem;
    margin-bottom: 30rem;
    opacity: 0.95;
  }

  &__btn {
    transition: box-shadow .3s ease, background .3s ease;
    box-shadow: 5rem 5rem 0 rgba(255,255,255,0.3);
    border-radius: 8rem;
    font-size: 22rem;
    border: 2rem solid white;
    padding: 18rem 28rem;
    align-items: center;
    font-weight: bold;
    display: inline-flex;
    color: white;
    gap: 12rem;
    text-decoration: none;

    .icon {
      font-size: 35rem;
    }

    &:hover {
      box-shadow: 10rem 10rem 0 rgba(255,255,255,0.3);
      background: rgba(0, 0, 0, 0.15);
    }
  }
}
</style>
