<script setup lang="ts">
const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';

const { data: rawDepoimentos } = await useFetch('/api/public/depoimentos');

const reviews = computed(() =>
  (rawDepoimentos.value ?? []).map(adaptDepoimento)
);

function reviewAvatarUrl(review: { id: number; photo?: string }): string {
  if (review.photo && !review.photo.startsWith('http')) {
    return CF_IMG_BASE + review.photo + '/public';
  }

  return `${review.photo}`;
}
</script>

<template>
  <section class="depoimentos-page">
    <div class="container">
      <section class="depo-pg-hero" data-ani-type="fade-up">
        <div>
          <span class="eyebrow">Depoimentos verificados</span>
          <h1 class="big-title green">
            Cada ensaio vira uma história.
          </h1>

          <p class="description">
            Reuni aqui depoimentos reais, todos verificados publicamente no Google.
            Cada um deles veio de uma sessão completa, clique em <b>"Acesse o ensaio"</b>
            para ver as fotos do depoimento.
          </p>
          <div class="wrap-btns">
            <a class="btn btn-primary" href="https://wa.me/5511911159795">Agendar meu ensaio</a>
            <a class="btn btn-ghost" href="https://g.page/r/CU9H139Hyr99EBM/review" target="_blank">Deixar uma avaliação</a>
          </div>
        </div>

        <aside class="depo-pg-rating">
          <span class="stars">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18 22l-6-3.6L6 22l1.5-7.2L2 10l7.1-1.1z"/></svg>
          </span>
          <div class="score">5.0</div>
          <div class="meta">média entre {{ reviews.length }}+ avaliações</div>
        </aside>
      </section>

      <div class="reviews-grid">
        <article
          v-for="(review, index) in reviews"
          :key="review.id"
          class="review-card"
          data-ani-type="polaroid"
          data-ani-batch="reviews-grid"
          data-ani-stagger="0.07"
          data-ani-batch-max="3"
        >
          <div class="review-card__header">
            <div class="review-card__avatar">
              <img
                :src="reviewAvatarUrl(review)"
                :alt="review.name"
                class="review-card__photo"
                loading="lazy"
              />
            </div>
            <div class="review-card__meta">
              <strong class="review-card__name">{{ review.name }}</strong>
              <span class="review-card__date">{{ review.data }}</span>
            </div>

            <div class="review-card__google">
              <NuxtLink
                :to="review.link"
                target="_blank"
                class="link-source"
                rel="noopener noreferrer">
                <span>Via:</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-label="Google">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>{{ review.source }}</span>
              </NuxtLink>
            </div>
          </div>

          <NuxtLink :to="review.link" target="_blank" rel="noopener noreferrer">
            <span class="review-card__stars">★★★★★</span>
          </NuxtLink>

          <blockquote class="review-card__text" v-html="review.text"></blockquote>

          <div v-if="review.portfolioPath" class="review-card__portfolio">
            <NuxtLink :to="review.portfolioPath" class="review-card__portfolio-thumb">
              <nuxt-img
                v-if="review.portfolioFotoCfId"
                provider="cloudflare"
                :src="`${CF_IMG_BASE}${review.portfolioFotoCfId}/public`"
                :alt="`Ensaio de ${review.name}`"
                class="review-card__portfolio-img"
                width="350"
                format="avif"
                placeholder
                loading="lazy" />
            </NuxtLink>
            <NuxtLink :to="review.portfolioPath" class="btn btn--outline review-card__portfolio-btn">
              Ver ensaio
            </NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.wrap-btns {
  padding-top: 20rem;
  display: flex;
  gap: 20rem;

  @include m.max(sm) {
    align-items: center;
    flex-direction: column;
  }

  .btn {
    @include m.max(sm) {
      width: 390rem;
    }
  }
}

.eyebrow {
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #6b5f55;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    
    @include m.max(sm) {
      justify-content: center;
      width: 100%;
    }
}

  .depo-pg-hero {
    padding: 60rem 0 40rem;
    align-items: center;
    display: flex;
    gap: 50rem;

    @include m.max(sm) {
      flex-direction: column;
    }
  }
  .depo-pg-hero h1 em { font-style: italic; color: v.$green; }

  .depo-pg-rating {
    box-shadow: 0 24px 38px -18px rgba(42, 37, 32, 0.30);
    background: white;
    border-radius: 2px;
    text-align: center;
    position: relative;
    padding: 30rem;
    width: 50%;

    @include m.max(sm) {
      width: 100%;
    }
  }
  .depo-pg-rating::before {
    content: "Avaliações públicas no Google";
    position: absolute;
    top: -12px; left: 50%;
    transform: translateX(-50%);
    background: v.$red;
    color: white;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 999px;
    white-space: nowrap;
  }
  .description {
    padding-top: 0;
    margin-top: 0;

    @include m.max(sm) {
      text-align: center;
    }
  }
  .depo-pg-rating .score {
    font-size: 92px;
    line-height: 1;
    color: v.$red;
    font-weight: bold;
    margin: 20rem 0 10rem;

    @include m.max(sm) {
      font-size: 50px;
    }
  }
  .depo-pg-rating .stars { color: #F5B748; display: inline-flex; gap: 4px; margin-bottom: var(--s-3); }
  .depo-pg-rating .meta { font-size: 12px; color: var(--ink-soft); letter-spacing: 0.18em; text-transform: uppercase; }
  .depo-pg-rating .breakdown {
    margin-top: 30rem;
    padding-top: 30rem;
    border-top: 1px dashed 1px;
    text-align: left;
  }
  .depo-pg-rating .breakdown .row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px;
    padding: 4px 0;
    color: black;
  }
  .depo-pg-rating .breakdown .row strong {
    color: v.$green;
    font-weight: 600;
    font-size: 17px;
  }


.review-card__google {
    .link-source {
        display: flex;
        gap: 4px;
    }
}

.depoimentos-header {
  text-align: center;
  margin-bottom: v.$space;

  &__description {
    font-size: 18rem;
    color: #555;
    line-height: 1.6;
    max-width: 640rem;
    margin: 10px auto 24rem;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 10rem;
    background: #fff8e1;
    border: 1px solid #ffe082;
    border-radius: 40rem;
    padding: 8rem 20rem;

    .stars {
      color: #f9a825;
      font-size: 20rem;
      letter-spacing: 2px;
    }

    .count {
      font-size: 14rem;
      font-weight: 600;
      color: #555;
    }
  }
}

.reviews-grid {
  margin-bottom: 64rem;
  column-gap: 24rem;
  padding: 15rem;
  columns: 4;

  @include m.max(sm) {
    columns: 1;
  }
}

.review-card {
  break-inside: avoid;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  border: 1px solid #e8e8e8;
  flex-direction: column;
  margin-bottom: 24rem;
  border-radius: 12rem;
  background: #fff;
  padding: 24rem;
  display: flex;
  gap: 12rem;

  &:hover {
    box-shadow: 0 6rem 20rem rgba(0, 0, 0, 0.08);
    transform: translateY(-2rem);
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 12rem;
  }

  &__avatar {
    flex-shrink: 0;
    width: 44rem;
    height: 44rem;
    border-radius: 50%;
    overflow: hidden;
    background: v.$dark-red;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__initials {
    color: #fff;
    font-size: 16rem;
    font-weight: 700;
    line-height: 1;
  }

  &__meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  &__name {
    font-size: 18rem;
    font-weight: 600;
    color: #222;
  }

  &__date {
    font-size: 15rem;
    color: #999;
  }

  &__google {
    flex-shrink: 0;
  }

  &__stars {
    color: #f9a825;
    font-size: 16rem;
    letter-spacing: 2px;
  }

  &__text {
    font-size: 18rem;
    line-height: 1.7;
    color: #444;
    margin: 0;
    font-style: normal;
  }

  &__portfolio {
    display: flex;
    align-items: center;
    gap: 12rem;
    padding-top: 12rem;
    border-top: 1px solid #f0f0f0;
    margin-top: 4rem;
  }

  &__portfolio-thumb {
    overflow: hidden;
    display: block;
    flex-shrink: 0;
    width: 100%;
  }

  &__portfolio-img {
    transition: transform 0.3s ease;
    object-fit: cover;
    height: 100%;
    width: 100%;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__portfolio-btn {
    font-size: 14rem;
    padding: 6rem 16rem;
    flex-shrink: 0;
    position: absolute;
    bottom: -15rem;
    left: 50%;
    transform: translateX(-50%);
  }
}

.depoimentos-cta {
  text-align: center;
  border-top: 1px solid #e8e8e8;
  padding-top: 48rem;

  p {
    font-size: 20rem;
    color: #444;
    margin-bottom: 20rem;
  }
}

@include m.max(sm) {
  .depoimentos-header {
    margin-bottom: 40rem;

    &__title {
      font-size: 28rem;
    }

    &__description {
      font-size: 16rem;
    }
  }

  .reviews-grid {
    grid-template-columns: 1fr;
  }
}
</style>
