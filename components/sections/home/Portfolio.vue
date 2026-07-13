<script lang="ts" setup>
const cfImg = useCfImg();

const { data: rawWorks } = await useFetch('/api/public/portfolio');

const works = computed(() =>
  ((rawWorks.value as any[] | null) ?? [])
    .map(adaptPortfolioWork)
    .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0)),
);

const cards = computed(() =>
  works.value
    .filter((w) => w.home === 1)
    .map((w) => {
      const slide = w.photos?.retrato?.[0] ?? w.photos?.paisagem?.[0] ?? w.album?.[0] ?? null;
      return {
        id: w.id,
        title: w.title,
        path: w.path,
        categoryTitle: w.category?.title ?? '',
        imageId: slide?.imageId ?? '',
        alt: slide?.alt ?? w.title,
      };
    })
    .filter((c) => c.imageId),
);

const featured = computed(() => cards.value[0] ?? null);
const rest = computed(() => cards.value.slice(1, 7));

const categorias = computed(() => {
  const slugsComEnsaio = new Set(works.value.map((w) => w.category?.slug).filter(Boolean));
  return Object.entries(PORTFOLIO_CATEGORIAS)
    .filter(([slug]) => slugsComEnsaio.has(slug))
    .map(([slug, title]) => ({ slug, title }));
});
</script>

<template>
  <section class="portfolio" aria-labelledby="portfolio-title">
    <div class="container">
      <div class="head">
        <div class="head-top">
          <div class="head-left">
            <p class="eyebrow">Portfólio</p>
            <h2 id="portfolio-title" class="title">
              <a href="/ensaio-fotografico" aria-label="Ver últimos trabalhos">
                Explore meus últimos trabalhos
              </a>
            </h2>
          </div>
          <p v-if="cards.length" class="count">{{ cards.length }} {{ cards.length === 1 ? 'ensaio' : 'ensaios' }}</p>
        </div>

        <nav v-if="categorias.length" class="cat-bar" aria-label="Categorias de ensaio">
          <span class="cat-bar-label">Navegando por</span>
          <a
            v-for="cat in categorias"
            :key="cat.slug"
            :href="'/ensaio-fotografico/' + cat.slug"
            class="cat-link">
            {{ cat.title }}
          </a>
          <a href="/ensaio-fotografico" class="cat-link all">Ver todos</a>
        </nav>
      </div>

      <div v-if="featured" class="grid" role="list">
        <a
          :href="featured.path"
          class="card featured"
          role="listitem"
          :aria-label="'Ver ensaio de ' + featured.title"
          data-ani-type="fade-up">
          <div class="img-wrap">
            <nuxt-img
              provider="cloudflare"
              :src="cfImg(featured.imageId)"
              :alt="featured.alt"
              sizes="100vw md:40vw lg:480px"
              width="480"
              height="720"
              format="avif"
              loading="lazy"
              class="img cover" />
          </div>
          <div class="overlay" aria-hidden="true"></div>
          <div class="info">
            <span class="cat">{{ featured.categoryTitle }}</span>
            <h3>{{ featured.title }}</h3>
            <span class="reveal-btn">Ver ensaio <Icon name="icons:arrow-right" class="icon" /></span>
          </div>
        </a>

        <a
          v-for="card in rest"
          :key="card.id"
          :href="card.path"
          class="card small"
          role="listitem"
          :aria-label="'Ver ensaio de ' + card.title"
          data-ani-type="fade-up"
          data-ani-batch="portfolio-cards"
          data-ani-stagger="0.07">
          <div class="img-wrap">
            <nuxt-img
              provider="cloudflare"
              :src="cfImg(card.imageId)"
              :alt="card.alt"
              sizes="50vw md:20vw lg:300px"
              width="300"
              height="450"
              format="avif"
              loading="lazy"
              class="img cover" />
          </div>
          <div class="overlay" aria-hidden="true"></div>
          <div class="info">
            <span class="cat">{{ card.categoryTitle }}</span>
            <h3>{{ card.title }}</h3>
            <span class="reveal-btn">Ver ensaio <Icon name="icons:arrow-right" class="icon" /></span>
          </div>
        </a>
      </div>
    </div>

    <div class="ac pb50">
      <a
        href="/ensaio-fotografico"
        aria-label="Ver todos os trabalhos"
        class="btn">
        <span>Ver todos os trabalhos</span>
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.portfolio {
  padding-top: 40rem;

  .head {
    margin-bottom: 24rem;

    .head-top {
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 16rem;
      flex-wrap: wrap;
      display: flex;
      gap: 12rem;
    }

    .eyebrow {
      text-transform: uppercase;
      letter-spacing: .2em;
      color: v.$beige;
      font-weight: 700;
      font-size: 13rem;
      margin-bottom: 8rem;
    }

    .title {
      text-transform: uppercase;
      color: v.$green;
      font-weight: 900;
      font-size: clamp(26rem, 3.5vw, 40rem);
      line-height: 1.08;
    }

    .count {
      text-transform: uppercase;
      letter-spacing: .14em;
      white-space: nowrap;
      color: v.$beige;
      font-weight: 700;
      font-size: 14rem;
    }
  }

  .cat-bar {
    border-top: 1px solid v.$light-green;
    border-bottom: 1px solid v.$light-green;
    align-items: center;
    flex-wrap: wrap;
    padding: 10rem 0;
    display: flex;
    gap: 6rem;

    .cat-bar-label {
      border-right: 1px solid v.$light-green;
      text-transform: uppercase;
      letter-spacing: .15em;
      white-space: nowrap;
      padding-right: 12rem;
      margin-right: 6rem;
      color: v.$beige;
      font-weight: 700;
      font-size: 13rem;
    }

    .cat-link {
      transition: background .18s, color .18s, border-color .18s;
      border: 1px solid transparent;
      text-transform: uppercase;
      letter-spacing: .08em;
      white-space: nowrap;
      border-radius: 999px;
      padding: 6rem 14rem;
      color: v.$green;
      font-weight: 700;
      font-size: 14rem;

      &:hover {
        background: v.$light-green;
        color: v.$dark-green;
      }

      &.all {
        border: 1px dashed v.$beige;
        margin-left: auto;

        &:hover {
          border-color: v.$green;
          background: v.$green;
          color: white;
        }
      }
    }
  }
}

.grid {
  grid-template-columns: 2fr 1fr 1fr 1fr;
  margin-bottom: 40rem;
  display: grid;
  gap: 10rem;

  @include m.max(sm) {
    grid-template-columns: 1fr 1fr;
  }
}

.card {
  border-radius: 3px;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  display: flex;

  &.featured {
    grid-column: 1;
    grid-row: 1 / 3;

    .img-wrap {
      min-height: 0;
      flex: 1;
    }

    @include m.max(xs) {
      grid-column: 1 / 3;
      grid-row: 1;
    }
  }

  &.small .img-wrap {
    aspect-ratio: 2 / 2.5;
  }

  .img-wrap {
    position: relative;
    overflow: hidden;
  }

  @include m.max(xs) {
    display: block;

    &.small .img-wrap {
      aspect-ratio: auto;
      aspect-ratio: .8;
    }

    &.featured .img-wrap {
      aspect-ratio: 1;
    }
  }

  .cover {
    transition: transform .65s cubic-bezier(.25, .46, .45, .94);
  }

  &:hover .cover {
    transform: scale(1.04);
  }

  .overlay {
    background: linear-gradient(to top,
      rgba(35, 33, 22, .82) 0%,
      rgba(35, 33, 22, .35) 48%,
      rgba(35, 33, 22, 0) 72%);
    transition: opacity .38s ease;
    pointer-events: none;
    position: absolute;
    opacity: 0;
    inset: 0;
  }

  .info {
    transition: opacity .32s ease, transform .32s ease;
    transform: translateY(8rem);
    padding: 20rem 18rem 18rem;
    position: absolute;
    opacity: 0;
    right: 0;
    left: 0;
    bottom: 0;

    .cat {
      text-transform: uppercase;
      letter-spacing: .16em;
      color: v.$light-green;
      margin-bottom: 6rem;
      font-weight: 700;
      font-size: 13rem;
      display: block;
    }

    h3 {
      text-transform: uppercase;
      letter-spacing: .02em;
      color: white;
      font-weight: 900;
      font-size: 18rem;
      line-height: 1.2;
    }

    .reveal-btn {
      transition: background .15s;
      background: v.$light-green;
      text-transform: uppercase;
      border-radius: 999px;
      letter-spacing: .1em;
      align-items: center;
      padding: 7rem 16rem;
      margin-top: 12rem;
      color: v.$green;
      font-weight: 900;
      font-size: 13rem;
      display: inline-flex;
      gap: 6rem;

      .icon {
        font-size: 12rem;
      }
    }
  }

  &.featured .info {
    padding: 32rem 26rem 26rem;

    h3 {
      font-size: 24rem;
    }
  }

  &:hover .overlay,
  &:focus-visible .overlay {
    opacity: 1;
  }

  &:hover .info,
  &:focus-visible .info {
    transform: translateY(0);
    opacity: 1;
  }

  &:hover .reveal-btn:hover {
    background: white;
  }
}

/* touch / sem hover: legenda sempre visível */
@media (hover: none) {
  .card .overlay {
    opacity: 1;
  }

  .card .info {
    transform: none;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .card .cover,
  .card .overlay,
  .card .info {
    transition: none;
  }
}
</style>
