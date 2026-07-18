<script lang="ts" setup>
/* ────────────────────────────────────────────────────────────────────────
 * PÁGINA TEMPORARIAMENTE DESATIVADA (jul/2026) — voltará no futuro.
 * Retorna 404 até a Lillia definir a oferta/preço reais da consultoria.
 * Para reativar: remover o bloco de createError abaixo, recolocar a rota no
 * menu (migration) + sitemap (server/api/__sitemap__/urls.ts) e os links de
 * entrada na LP de coloração. Ver docs/paginas.md e docs/ia-site.md.
 * ──────────────────────────────────────────────────────────────────────── */
throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' });

// eslint-disable-next-line no-unreachable
const cfImg = useCfImg();
const { whatsappUrl } = useRuntimeConfig().public;

usePageSeo('static', '/consultoria-de-imagem-em-mogi');

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Consultoria de Imagem' },
];

const benefits = [
  {
    title: 'Estilo com intenção',
    description: 'Descubra seu estilo pessoal e aprenda a comunicar quem você é antes mesmo de dizer uma palavra.',
  },
  {
    title: 'Guarda-roupa que funciona',
    description: 'Menos peças, mais combinações: um guarda-roupa enxuto e coerente com a sua rotina e seus objetivos.',
  },
  {
    title: 'Compras sem erro',
    description: 'Chega de comprar por impulso: você sai com uma direção clara do que vestir e do que investir.',
  },
  {
    title: 'Presença profissional',
    description: 'Imagem alinhada com a sua carreira — em reuniões, redes sociais e fotos profissionais.',
  },
];

const steps = [
  {
    icon: 'chedule',
    title: 'Agendamento',
    description: 'Entre em contato pelo WhatsApp e agende sua consultoria de imagem no estúdio em Mogi das Cruzes.',
  },
  {
    icon: 'lightbulb-regular',
    title: 'Diagnóstico de estilo',
    description: 'Conversa guiada sobre rotina, objetivos e referências para mapear seu estilo pessoal.',
  },
  {
    icon: 'analise-presencial2',
    fillnone: true,
    title: 'Análise presencial',
    description: 'No estúdio, analisamos biotipo, proporções e composições que valorizam o seu corpo.',
  },
  {
    icon: 'orientacoes',
    fillnone: true,
    title: 'Guia de estilo',
    description: 'Você recebe um guia personalizado com combinações, peças-chave e direção de compras.',
  },
];

const audience = [
  'Quer se vestir bem sem depender de tendências',
  'Sente que o guarda-roupa está cheio, mas "não tem o que vestir"',
  'Está em transição de carreira ou reposicionamento profissional',
  'Vai fazer um ensaio fotográfico e quer acertar na produção',
  'Fez a análise de coloração e quer aplicar as cores no dia a dia',
  'Quer comprar menos e melhor',
];

const faqs = [
  {
    question: 'Qual a diferença entre consultoria de imagem e análise de coloração pessoal?',
    answer: 'A análise de coloração identifica a cartela de cores que harmoniza com seus tons naturais. A consultoria de imagem vai além: trabalha estilo pessoal, biotipo, guarda-roupa e a mensagem que sua imagem comunica. Juntas, elas se completam — por isso oferecemos o combo.',
  },
  {
    question: 'Preciso ter feito a análise de coloração antes da consultoria?',
    answer: 'Não. A consultoria de imagem pode ser feita de forma independente. Mas quem faz as duas aproveita mais: as cores certas potencializam as escolhas de estilo.',
  },
  {
    question: 'Como funciona o encontro presencial?',
    answer: 'O encontro acontece no estúdio, em Mogi das Cruzes, com cerca de 2h30 de duração. É uma conversa guiada + análise prática, e você recebe depois o guia de estilo personalizado em formato digital.',
  },
  {
    question: 'A consultoria serve para homens também?',
    answer: 'Sim! O método se adapta a qualquer pessoa que queira alinhar imagem pessoal e profissional — incluindo preparação para ensaios corporativos e fotos de LinkedIn.',
  },
];

/* FAQPage JSON-LD — perguntas hardcoded na página (o Service JSON-LD vem do page_seo) */
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      }),
    },
  ],
});
</script>

<template>
  <div class="consultoria-page">
    <div class="container">
      <BlocksBreadcrumb :items="breadcrumbs" />
    </div>

    <!-- Intro -->
    <section class="c-intro container" data-ani-type="fade-up">
      <div class="intro-image">
        <!-- TODO: trocar pela foto da consultoria quando existir (hoje reusa a da coloração) -->
        <nuxt-img
          provider="cloudflare"
          :src="cfImg('5aaf1433-aaa7-42ed-7198-15626f964000')"
          alt="Consultoria de imagem e estilo em Mogi das Cruzes"
          width="400"
          height="520"
          loading="lazy"
          format="webp"
          class="img"
        />
      </div>

      <div class="intro-text">
        <span class="eyebrow">Imagem &amp; Estilo</span>
        <h2 class="big-title pt0">Consultoria de Imagem em Mogi das Cruzes</h2>
        <p class="description voz-lillia intro-quote">
          "Sua imagem fala por você. Meu trabalho é fazer com que ela diga exatamente o que você quer."
        </p>
        <p class="description">
          A consultoria de imagem e estilo traduz quem você é em escolhas concretas: peças, cores,
          combinações e presença. É um processo prático — do diagnóstico de estilo ao guia
          personalizado — pensado para a sua rotina real.
        </p>
        <p class="description">
          E se você já fez (ou quer fazer) a
          <NuxtLink to="/analise-coloracao-pessoal-em-mogi">análise de coloração pessoal</NuxtLink>,
          o combo une as duas em um único processo.
        </p>
        <div class="intro-actions">
          <a href="#pacotes" class="btn">Ver pacotes</a>
          <a
            class="btn btn-white"
            :href="`${whatsappUrl}?text=Olá, gostaria de saber mais sobre a consultoria de imagem (mensagem do site)`"
          >
            <Icon name="icons:whatsapp" />
            Tirar dúvidas
          </a>
        </div>
      </div>
    </section>

    <!-- Benefícios -->
    <section class="c-benefits container" data-ani-type="fade-up">
      <div class="ac">
        <h2 class="big-title">O que a consultoria de imagem resolve?</h2>
      </div>
      <p class="description benefits-subheading">
        Não é sobre seguir regras de moda — é sobre ter clareza do que vestir, comprar e comunicar.
      </p>
      <div class="benefits-grid">
        <div v-for="(benefit, i) in benefits" :key="i" class="benefit-card">
          <div class="num">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="card-title">{{ benefit.title }}</h3>
          <p class="card-description">{{ benefit.description }}</p>
        </div>
      </div>
    </section>

    <!-- Como funciona -->
    <LandingsHowWorks
      id="como-funciona"
      class="c-steps container"
      :data="{ title: 'Como funciona a consultoria de imagem?', list: steps }"
    />

    <!-- Pacotes -->
    <!-- TODO: valores FICTÍCIOS (placeholder) — confirmar oferta/preço real com a Lillia (ROADMAP decisão #8) -->
    <section id="pacotes" class="c-pricing" data-ani-type="fade-up">
      <div class="container">
        <div class="pricing-header">
          <span class="eyebrow centered">Investimento</span>
          <h2 class="big-title pt0 centered">Escolha o seu processo</h2>
          <p class="description">
            Sozinha ou em combo com a análise de coloração pessoal — as duas portas de entrada para a sua imagem.
          </p>
        </div>
        <div class="pricing-grid">
          <BlocksPricingCard
            title="Consultoria de Imagem"
            subtitle="Estilo, biotipo e guarda-roupa"
            :price="590"
            :num-parcelas="3"
            :price-parcelas="210"
            type="Consultoria de Imagem"
            :features="[
              '1 encontro presencial no estúdio (≈ 2h30)',
              'Diagnóstico de estilo pessoal',
              'Análise de biotipo e proporções',
              'Guia de estilo digital personalizado',
              'Direção de compras (lista de peças-chave)',
            ]"
          />
          <BlocksPricingCard
            title="Combo Coloração + Consultoria"
            subtitle="O processo completo de imagem"
            :price="890"
            :num-parcelas="3"
            :price-parcelas="320"
            type="Combo Coloração + Consultoria"
            :is-recommended="true"
            :features="[
              'Tudo da Consultoria de Imagem',
              'Análise de coloração pessoal com tecidos',
              'Cartela de cores personalizada',
              'Cores aplicadas a maquiagem e acessórios',
              'Guia integrado: estilo + cores',
            ]"
          />
        </div>
      </div>
    </section>

    <!-- Para quem é -->
    <section class="c-audience container" data-ani-type="fade-up">
      <div class="ac">
        <h2 class="big-title">A consultoria é para você que…</h2>
      </div>
      <ul class="audience-list">
        <li v-for="(item, i) in audience" :key="i" class="audience-item">
          <span class="check" aria-hidden="true">✓</span>
          {{ item }}
        </li>
      </ul>
    </section>

    <!-- Cross-sell -->
    <section class="c-crosssell container" data-ani-type="fade-up">
      <h2 class="big-title green">Complete a experiência</h2>
      <p class="description crosssell-desc">
        Descubra suas cores com a análise de coloração pessoal — ou celebre sua nova imagem com um
        ensaio fotográfico no estúdio.
      </p>
      <div class="crosssell-actions">
        <NuxtLink to="/analise-coloracao-pessoal-em-mogi" class="btn">Análise de coloração pessoal</NuxtLink>
        <NuxtLink to="/ensaio-fotografico" class="btn btn-white">Ver ensaios fotográficos</NuxtLink>
      </div>
    </section>

    <!-- FAQ -->
    <section class="c-faq" data-ani-type="fade-up">
      <div class="container faq-inner">
        <h2 class="big-title pt0 centered">Perguntas frequentes</h2>
        <div class="faq-list">
          <BlocksFaqItem
            v-for="(faq, i) in faqs"
            :key="i"
            :question="faq.question"
            :answer="faq.answer"
            :is-open="i === 0"
          />
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="c-cta" data-ani-type="fade-up">
      <div class="container cta-inner">
        <h2 class="big-title white pt0">Pronta para vestir quem você é?</h2>
        <p class="cta-desc voz-lillia">Vamos construir juntas uma imagem que trabalha a seu favor.</p>
        <a
          class="btn cta-btn"
          :href="`${whatsappUrl}?text=Olá, gostaria de agendar uma consultoria de imagem (mensagem do site)`"
        >
          <Icon name="icons:whatsapp" />
          Agendar pelo WhatsApp
        </a>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.consultoria-page {
  padding-bottom: 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14rem;
  font-weight: 700;
  font-size: 13rem;
  color: v.$rose-deep;
  display: block;

  &.centered {
    text-align: center;
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
    text-align: center;
  }

  .intro-image {
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

  .intro-text {
    max-width: 600rem;

    a {
      text-decoration: underline;
    }
  }

  .intro-quote {
    font-size: 22rem;
    color: v.$rose-deep;
    padding-top: 10rem;
  }

  .intro-actions {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30rem;
    gap: 16rem;

    @include m.max(sm) {
      justify-content: center;
    }

    .btn {
      gap: 8rem;
    }
  }
}

.c-benefits {
  padding-bottom: 70rem;

  .benefits-subheading {
    text-align: center;
    max-width: 620rem;
    padding-bottom: 40rem;
    margin: 0 auto;
  }

  .benefits-grid {
    grid-template-columns: repeat(4, 1fr);
    display: grid;
    gap: 24rem;

    @include m.max(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include m.max(xs) {
      grid-template-columns: 1fr;
    }
  }

  .benefit-card {
    border: 1.5px solid v.$light-green;
    border-radius: 8rem;
    padding: 28rem 22rem;
    background: white;

    .card-description {
      margin-bottom: 0;
    }

    .num {
      font-family: v.$lato;
      margin-bottom: 12rem;
      color: v.$rose;
      font-weight: 900;
      font-size: 42rem;
      line-height: 1;
    }
  }
}

.c-steps {
  padding-bottom: 60rem;
  padding-top: 0;
}

.c-pricing {
  background: v.$cream;
  padding: 70rem 0;

  @include m.max(sm) {
    padding: 45rem 0;
  }

  .pricing-header {
    text-align: center;
    margin-bottom: 55rem;

    .description {
      max-width: 560rem;
      margin: 0 auto;
      padding-top: 0;
    }

    .big-title.centered {
      text-align: center;
    }
  }

  .pricing-grid {
    grid-template-columns: repeat(2, minmax(0, 420rem));
    justify-content: center;
    align-items: stretch;
    display: grid;
    gap: 30rem;

    @include m.max(sm) {
      grid-template-columns: minmax(0, 420rem);
    }
  }
}

.c-audience {
  padding: 70rem 0;

  .audience-list {
    grid-template-columns: repeat(2, minmax(0, 480rem));
    justify-content: center;
    margin-top: 40rem;
    display: grid;
    gap: 14rem 40rem;

    @include m.max(sm) {
      grid-template-columns: 1fr;
    }
  }

  .audience-item {
    align-items: baseline;
    color: v.$green;
    font-size: 19rem;
    line-height: 1.5;
    display: flex;
    gap: 10rem;

    .check {
      color: v.$rose-deep;
      font-weight: 900;
      flex-shrink: 0;
    }
  }
}

.c-crosssell {
  padding-bottom: 70rem;
  text-align: center;

  .crosssell-desc {
    padding-bottom: 32rem;
    max-width: 680rem;
    margin: 0 auto;
  }

  .crosssell-actions {
    justify-content: center;
    flex-wrap: wrap;
    display: flex;
    gap: 20rem;
  }
}

.c-faq {
  background: v.$light-green;
  padding: 70rem 0;

  .faq-inner {
    max-width: 900rem;

    .big-title.centered {
      text-align: center;
      padding-bottom: 40rem;
    }
  }
}

.c-cta {
  background: v.$rose-deep;
  padding: 75rem 0;

  .cta-inner {
    flex-direction: column;
    align-items: center;
    text-align: center;
    display: flex;
    gap: 18rem;
  }

  .cta-desc {
    color: v.$cream;
    font-size: 24rem;
    max-width: 560rem;
    margin: 0;

    @include m.max(sm) {
      font-size: 19rem;
    }
  }

  .cta-btn {
    background: v.$cream !important;
    border-color: v.$cream !important;
    color: v.$rose-deep !important;
    margin-top: 8rem;
    gap: 10rem;

    &:hover {
      background: white !important;
    }
  }
}
</style>
