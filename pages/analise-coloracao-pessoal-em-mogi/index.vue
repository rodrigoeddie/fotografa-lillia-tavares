<script lang="ts" setup>
usePageSeo('static', '/analise-coloracao-pessoal-em-mogi');

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
      <BlocksBreadcrumb :items="[
        { label: 'Home', to: '/' },
        { label: 'Análise de Coloração Pessoal' },
      ]" />
    </div>

    <!-- Hero -->
    <section class="c-hero" data-ani-type="fade-up">
      <div class="container c-hero__inner">
        <div class="c-hero__text">
          <span class="c-eyebrow">Imagem & Cor · Mogi das Cruzes</span>
          <h1 class="c-hero__title">As cores que<br><em>te valorizam</em>.</h1>
          <p class="c-hero__desc">
            Análise de coloração pessoal para revelar quais tons de roupa, maquiagem e acessórios
            harmonizam com sua pele, cabelo e olhos — mais autoestima, escolhas certas e fotos incríveis.
          </p>
          <div class="c-hero__actions">
            <a
              class="btn c-hero__btn-primary"
              href="https://wa.me/5511911159795?text=Olá, gostaria de saber mais sobre a análise de coloração pessoal (mensagem do site)"
            >
              <Icon name="icons:whatsapp" />
              Agendar minha análise
            </a>
            <a class="btn c-hero__btn-ghost" href="#como-funciona">Ver como funciona</a>
          </div>
        </div>
        <div class="c-hero__image">
          <nuxt-img
            provider="cloudflare"
            src="https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public"
            alt="Fotógrafa e consultora de imagem Lillia Tavares realizando análise de coloração pessoal em Mogi das Cruzes"
            width="450"
            height="600"
            loading="eager"
            fetchpriority="high"
            sizes="100vw sm:50vw md:450px"
            format="webp"
            class="img"
          />
        </div>
      </div>
    </section>

    <!-- O que é -->
    <section class="c-intro container" data-ani-type="fade-up">
      <div class="c-intro__text">
        <span class="c-eyebrow c-eyebrow--muted">O que é</span>
        <h2 class="title">Não é sobre estar<br>na moda. É sobre <em>ser vista</em>.</h2>
        <p class="description">
          A análise de coloração pessoal identifica a cartela de cores que harmoniza com seus tons
          naturais — pele, cabelo e olhos. O resultado é uma paleta personalizada que ilumina o rosto,
          valoriza a expressão e simplifica decisões diárias do guarda-roupa.
        </p>
        <p class="description">
          Combinada com a consultoria de imagem, ela vira ferramenta de posicionamento: alinha visual
          com mensagem, intenção com presença.
        </p>
        <div class="c-intro__actions">
          <a
            class="btn"
            href="https://wa.me/5511911159795?text=Olá, gostaria de agendar uma análise de coloração pessoal (mensagem do site)"
          >
            Agendar análise
          </a>
          <a class="btn btn-white" href="#como-funciona">Ver o processo</a>
        </div>
      </div>
      <div class="c-intro__image">
        <nuxt-img
          provider="cloudflare"
          src="https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public"
          alt="Análise de coloração pessoal em Mogi das Cruzes"
          width="400"
          height="520"
          loading="lazy"
          format="webp"
          class="img"
        />
      </div>
    </section>

    <!-- Benefícios -->
    <section class="c-benefits container" data-ani-type="fade-up">
      <h2 class="title c-benefits__heading">Por que fazer uma análise de coloração pessoal?</h2>
      <p class="description c-benefits__subheading">
        Uma ferramenta prática que transforma seu dia a dia, suas compras e até suas fotos profissionais.
      </p>
      <div class="c-benefits__grid">
        <div
          v-for="(benefit, i) in benefits"
          :key="i"
          class="c-benefits__card"
          :data-ani-type="'fade-up'"
          :data-ani-delay="`${0.08 * (i + 1)}s`"
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
          <h2 class="title">Quatro famílias, doze subtons.</h2>
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

    <!-- Cross-sell -->
    <section class="c-crosssell container" data-ani-type="fade-up">
      <h2 class="title c-crosssell__heading">Combine com um ensaio fotográfico</h2>
      <p class="description c-crosssell__desc">
        Muitas clientes aproveitam para fazer a análise junto com o ensaio fotográfico.
        Assim, as fotos já são feitas com as cores que mais valorizam a sua beleza — uma combinação perfeita.
      </p>
      <div class="c-crosssell__actions">
        <NuxtLink to="/ensaio-fotografico" class="btn">Ver ensaios fotográficos →</NuxtLink>
        <NuxtLink to="/presente-ensaio-fotografico-mogi" class="btn btn-white">Presentear com ensaio + coloração →</NuxtLink>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="c-cta" data-ani-type="fade-up">
      <div class="container c-cta__inner">
        <h2 class="title c-cta__title">Pronta para descobrir suas cores?</h2>
        <p class="c-cta__desc">Agende sua análise de coloração pessoal em Mogi das Cruzes e transforme sua relação com as cores.</p>
        <a
          class="btn c-cta__btn"
          href="https://wa.me/5511911159795?text=Olá, gostaria de agendar uma análise de coloração pessoal (mensagem do site)"
        >
          <Icon name="icons:whatsapp" />
          Agendar pelo WhatsApp
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.coloracao-page {
  padding-bottom: 0;
}

// ── Eyebrow ────────────────────────────────────────────────────────
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

// ── Hero ────────────────────────────────────────────────────────────
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

  &__image {
    flex-shrink: 0;
    width: 390rem;
    align-self: flex-end;

    @include m.max(md) {
      width: 280rem;
    }

    @include m.max(sm) {
      width: 180rem;
    }

    .img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

// ── Intro ───────────────────────────────────────────────────────────
.c-intro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 70rem;
  align-items: center;
  padding-top: 75rem;
  padding-bottom: 75rem;

  @include m.max(md) {
    grid-template-columns: 1fr;
    gap: 30rem;
    padding-top: 45rem;
    padding-bottom: 45rem;
  }

  .title em {
    font-style: italic;
    color: v.$beige;
    text-transform: none;
  }

  &__actions {
    display: flex;
    gap: 16rem;
    flex-wrap: wrap;
    margin-top: 30rem;
  }

  &__image {
    .img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 4rem;
    }

    @include m.max(md) {
      display: none;
    }
  }
}

// ── Benefits ────────────────────────────────────────────────────────
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

// ── Seasons ─────────────────────────────────────────────────────────
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

// ── Steps ────────────────────────────────────────────────────────────
.c-steps {
  padding-top: 60rem;
  padding-bottom: 60rem;
}

// ── Cross-sell ────────────────────────────────────────────────────────
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

// ── CTA ───────────────────────────────────────────────────────────────
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
