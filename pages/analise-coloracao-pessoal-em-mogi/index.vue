<script lang="ts" setup>
const cfImg = useCfImg();
const { whatsappUrl } = useRuntimeConfig().public;

usePageSeo('static', '/analise-coloracao-pessoal-em-mogi');

/* Preço vem do sistema de produtos (admin › Investimento). A seção de preço só
   renderiza quando o produto "analise-coloracao-pessoal" estiver ATIVO e com
   pacotes cadastrados — nada aparece até a Lillia definir os valores no admin. */
const { data: produtosData } = await useFetch('/api/public/investimento');
const coloracaoProduto = computed(() => {
  const found = ((produtosData.value as any[] | null) ?? []).find(
    (p) => p.slug === 'analise-coloracao-pessoal',
  );
  return found ? adaptProduto(found) : null;
});

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Análise de Coloração Pessoal' },
];

const seasons = [
  {
    name: 'Primavera',
    description: 'Quente, clara e luminosa. Pêssego, coral, verde-folha e azul-piscina.',
    swatches: ['#F5C16C', '#E89F71', '#A8C97F', '#7BBFD4', '#F0D5A8'],
  },
  {
    name: 'Verão',
    description: 'Fria, suave e empoeirada. Rosa-antigo, azul-pó e cinza-lavanda.',
    swatches: ['#D8A8C6', '#A6B8D4', '#C5C9A8', '#E5C5D5', '#9BB2D0'],
  },
  {
    name: 'Outono',
    description: 'Quente, profunda e terrosa. Ferrugem, mostarda, verde-musgo e caramelo.',
    swatches: ['#A6643C', '#7D6A3E', '#B8956A', '#5C6B3F', '#C28755'],
  },
  {
    name: 'Inverno',
    description: 'Fria, intensa e contrastada. Vinho, preto, branco-óptico e royal.',
    swatches: ['#1F1F2A', '#7B1E3A', '#1F4D6B', '#E8E8EC', '#5A3B7E'],
  },
];

const benefits = [
  {
    title: 'Descubra suas cores',
    description: 'Saiba quais tons de roupa, maquiagem e acessórios valorizam sua tonalidade de pele, cabelo e olhos.',
  },
  {
    title: 'Mais autoestima',
    description: 'Ao usar as cores certas, você se sente mais confiante e bonita no dia a dia e em fotos profissionais.',
  },
  {
    title: 'Compras inteligentes',
    description: 'Pare de comprar roupas que não combinam. Com sua cartela de cores, cada escolha é assertiva.',
  },
  {
    title: 'Cartela personalizada',
    description: 'Receba sua cartela de cores exclusiva para consultar sempre que precisar fazer uma escolha de cor.',
  },
];

const steps = [
  {
    icon: 'chedule',
    title: 'Agendamento',
    description: 'Entre em contato pelo WhatsApp e agende sua análise de coloração pessoal no estúdio em Mogi das Cruzes.',
  },
  {
    icon: 'analise-presencial2',
    fillnone: true,
    title: 'Análise presencial',
    description: 'No estúdio, fazemos a análise com tecidos coloridos para identificar qual cartela de cores harmoniza com você.',
  },
  {
    icon: 'cartela-cores',
    fillnone: true,
    title: 'Cartela de cores',
    description: 'Você recebe sua cartela de cores personalizada com as tonalidades que mais valorizam sua beleza natural.',
  },
  {
    icon: 'orientacoes',
    fillnone: true,
    title: 'Orientações',
    description: 'Receba dicas práticas sobre como aplicar as cores no guarda-roupa, maquiagem e acessórios do dia a dia.',
  },
];
</script>

<template>
  <div class="coloracao-page">
    <div class="container">
      <BlocksBreadcrumb :items="breadcrumbs" />
    </div>

    <!-- O que é -->
    <section class="c-intro container" data-ani-type="fade-up">
      <div class="c-intro__image">
        <nuxt-img
          provider="cloudflare"
          :src="cfImg('5aaf1433-aaa7-42ed-7198-15626f964000')"
          alt="Análise de coloração pessoal em Mogi das Cruzes"
          width="400"
          height="520"
          loading="lazy"
          format="webp"
          class="img"
        />
      </div>

      <div class="c-intro__text">
        <h2 class="big-title pt0">Análise de Coloração Pessoal</h2>
        <h3 class="subtitle">Não é sobre estar na moda. É sobre <em>ser vista</em>.</h3>
        <p class="description">
          A análise de coloração pessoal identifica a cartela de cores que harmoniza com seus tons
          naturais, pele, cabelo e olhos. O resultado é uma paleta personalizada que ilumina o rosto,
          valoriza a expressão e simplifica decisões diárias do guarda-roupa.
        </p>
      </div>
    </section>

    <!-- Benefícios -->
    <section class="c-benefits container" data-ani-type="fade-up" data-ani-delay="0.5">
      <div class="ac">
        <h2 class="big-title">Por que fazer uma análise de coloração pessoal?</h2>
      </div>
      <p class="description c-benefits__subheading">
        Uma ferramenta prática que transforma seu dia a dia, suas compras e até suas fotos profissionais.
      </p>
      <div class="c-benefits__grid">
        <div
          v-for="(benefit, i) in benefits"
          :key="i"
          class="c-benefits__card"
        >
          <div class="c-benefits__num">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="card-title">{{ benefit.title }}</h3>
          <p class="card-description">{{ benefit.description }}</p>
        </div>
      </div>
    </section>

    <!-- Estações -->
    <section class="c-seasons" data-ani-type="fade-up">
      <div class="container">
        <div class="c-seasons__header">
          <span class="c-eyebrow c-eyebrow--center">Sistema de 12 estações</span>
          <h2 class="big-title pt0">Quatro famílias, doze subtons.</h2>
          <p class="description">
            Cada estação tem três variações de profundidade, intensidade e temperatura. Sua cartela final é única.
          </p>
        </div>
        <div class="c-seasons__grid">
          <div
            v-for="(season, i) in seasons"
            :key="i"
            class="c-seasons__card"
            :data-ani-type="'fade-up'"
            :data-ani-delay="`${0.1 * (i + 1)}s`"
          >
            <h3 class="card-title">{{ season.name }}</h3>
            <div class="c-seasons__swatches">
              <span
                v-for="(color, j) in season.swatches"
                :key="j"
                class="c-seasons__swatch"
                :style="{ background: color }"
              />
            </div>
            <p class="card-description">{{ season.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Como funciona -->
    <LandingsHowWorks
      id="como-funciona"
      class="c-steps container"
      :data="{ title: 'Como funciona a análise de coloração pessoal?', list: steps }"
    />

    <!-- Investimento (dinâmico: só aparece quando o produto está ativo no admin) -->
    <section
      v-if="coloracaoProduto && coloracaoProduto.packages.length"
      class="c-investment container"
      data-ani-type="fade-up"
    >
      <div class="ac">
        <span class="c-eyebrow c-eyebrow--center">Investimento</span>
        <h2 class="big-title pt0">Quanto custa a análise de coloração pessoal?</h2>
      </div>
      <SectionsGeneralPricingGrid :data="coloracaoProduto" />
      <div class="c-investment__foot">
        <NuxtLink to="/precos-ensaios-fotograficos/analise-coloracao-pessoal" class="btn btn-white">
          Ver todos os detalhes
        </NuxtLink>
      </div>
    </section>

    <!-- Cross-sell -->
    <section class="c-crosssell container" data-ani-type="fade-up">
      <h2 class="big-title green">Combine com um ensaio fotográfico</h2>
      <p class="description c-crosssell__desc">
        Muitas clientes aproveitam para fazer a análise junto com o ensaio fotográfico.
        Assim, as fotos já são feitas com as cores que mais valorizam a sua beleza, uma combinação perfeita.
      </p>
      <div class="c-crosssell__actions">
        <NuxtLink to="/ensaio-fotografico" class="btn">Ver ensaios fotográficos</NuxtLink>
        <NuxtLink to="/presente-ensaio-fotografico-mogi" class="btn btn-white">Presentear com ensaio + coloração</NuxtLink>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="c-cta" data-ani-type="fade-up">
      <div class="container c-cta__inner">
        <h2 class="big-title white pt0">Pronta para descobrir suas cores?</h2>
        <p class="c-cta__desc">Agende sua análise de coloração pessoal em Mogi das Cruzes e transforme sua relação com as cores.</p>
        <a
          class="btn c-cta__btn"
          :href="`${whatsappUrl}?text=Olá, gostaria de agendar uma análise de coloração pessoal (mensagem do site)`"
        >
          <Icon name="icons:whatsapp" />
          Agendar pelo WhatsApp
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.c-intro__image {
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  height: 300rem;
  width: 300rem;

  .img {
    object-position: center;
    position: absolute;
    object-fit: cover;
    height: 100%;
    width: 100%;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
  }
}

.c-intro__text {
  max-width: 600rem;
}

.coloracao-page {
  padding-bottom: 0;
}

.c-eyebrow {
  display: block;
  font-size: 13rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: v.$beige;
  margin-bottom: 14rem;
  font-weight: 700;

  &--muted {
    color: v.$beige;
    opacity: 0.8;
  }

  &--center {
    text-align: center;
  }
}

.c-hero {
  background: v.$green;
  color: white;

  &__inner {
    display: flex;
    align-items: flex-end;
    gap: 40rem;
    padding-left: 40rem;
    padding-right: 0;

    @include m.max(sm) {
      flex-direction: column-reverse;
      align-items: center;
      padding: 30rem 16rem;
      gap: 24rem;
    }
  }

  &__text {
    flex: 1;
    padding: 55rem 0 55rem;

    @include m.max(sm) {
      padding: 0;
    }
  }

  &__title {
    font-family: v.$lato;
    font-size: 52rem;
    font-weight: 300;
    line-height: 1.05;
    margin-bottom: 22rem;
    color: white;

    em {
      font-style: italic;
      opacity: 0.8;
    }

    @include m.max(md) {
      font-size: 38rem;
    }

    @include m.max(sm) {
      font-size: 30rem;
    }
  }

  &__desc {
    font-size: 19rem;
    line-height: 1.65;
    margin-bottom: 32rem;
    opacity: 0.88;

    @include m.max(sm) {
      font-size: 16rem;
    }
  }

  &__actions {
    display: flex;
    gap: 16rem;
    flex-wrap: wrap;
    align-items: center;
  }

  &__btn-primary {
    background: white !important;
    color: v.$green !important;
    border-color: white !important;
    gap: 10rem;
  }

  &__btn-ghost {
    background: transparent !important;
    color: white !important;
    border-color: rgba(255, 255, 255, 0.6) !important;

    &:hover {
      background: rgba(255, 255, 255, 0.12) !important;
      border-color: white !important;
    }
  }
}

.c-intro {
  justify-content: center;
  padding-bottom: 75rem;
  padding-top: 75rem;
  display: flex;
  gap: 40rem;

  @include m.max(sm) {
    flex-direction: column;
    align-items: center;
  }

  @include m.max(sm) {
    text-align: center;
  }

  .title em {
    font-style: italic;
    color: v.$beige;
    text-transform: none;

    @include m.max(sm) {
      text-align: center;
    }
  }

  &__actions {
    display: flex;
    gap: 16rem;
    flex-wrap: wrap;
    margin-top: 30rem;
  }
}

.c-benefits {
  padding-bottom: 70rem;

  &__heading,
  &__subheading {
    text-align: center;
  }

  &__subheading {
    max-width: 620rem;
    margin: 0 auto;
    padding-bottom: 40rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24rem;

    @include m.max(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.max(xs) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: white;
    border: 1.5px solid v.$light-green;
    border-radius: 8rem;
    padding: 28rem 22rem;
    position: relative;

    .card-description {
      margin-bottom: 0;
    }
  }

  &__num {
    font-size: 42rem;
    font-weight: 900;
    color: v.$light-green;
    line-height: 1;
    margin-bottom: 12rem;
    font-family: v.$lato;
  }
}

.c-seasons {
  background: v.$light-green;
  padding: 70rem 0;

  @include m.max(sm) {
    padding: 45rem 0;
  }

  &__header {
    text-align: center;
    margin-bottom: 50rem;

    .title,
    .description {
      text-align: center;
    }

    .description {
      max-width: 520rem;
      margin: 0 auto;
      padding-top: 0;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 22rem;

    @include m.max(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.max(xs) {
      grid-template-columns: 1fr;
    }
  }

  &__card {
    background: white;
    border-radius: 8rem;
    padding: 26rem 22rem;

    .card-description {
      font-size: 16rem;
      margin-bottom: 0;
    }
  }

  &__swatches {
    display: flex;
    gap: 7rem;
    margin-bottom: 16rem;
    margin-top: 4rem;
  }

  &__swatch {
    width: 26rem;
    height: 26rem;
    border-radius: 50%;
    display: block;
    border: 1px solid rgba(0, 0, 0, 0.07);
  }
}

.c-steps {
  padding-top: 60rem;
  padding-bottom: 60rem;
}

.c-investment {
  padding-top: 60rem;
  padding-bottom: 40rem;

  .ac {
    text-align: center;
  }

  &__foot {
    display: flex;
    justify-content: center;
    margin-top: 10rem;
  }
}

.c-crosssell {
  padding: 70rem 0;
  text-align: center;

  &__heading {
    margin-bottom: 0;
  }

  &__desc {
    max-width: 680rem;
    margin: 0 auto;
    padding-bottom: 32rem;
  }

  &__actions {
    display: flex;
    justify-content: center;
    gap: 20rem;
    flex-wrap: wrap;
  }
}

.c-cta {
  background: v.$green;
  padding: 75rem 0;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18rem;
  }

  &__title {
    color: white !important;
    margin: 0;
  }

  &__desc {
    font-size: 19rem;
    color: white;
    opacity: 0.88;
    max-width: 560rem;
    margin: 0;

    @include m.max(sm) {
      font-size: 16rem;
    }
  }

  &__btn {
    background: white !important;
    color: v.$green !important;
    border-color: white !important;
    gap: 10rem;
    margin-top: 8rem;
  }
}
</style>
