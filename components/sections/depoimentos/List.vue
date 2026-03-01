<script setup lang="ts">
const { data } = await useAsyncData('depoimentos', () =>
  queryCollection('depoimentos').first()
);

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  });
}
</script>

<template>
  <section class="depoimentos-page">
    <div class="container">
      <header class="depoimentos-header">
        <h1 class="depoimentos-header__title">{{ data?.title }}</h1>
        <p class="depoimentos-header__description">{{ data?.description }}</p>
        <div class="depoimentos-header__badge">
          <span class="stars">★★★★★</span>
          <span class="count">{{ data?.reviews?.length }}+ avaliações no Google</span>
        </div>
      </header>

      <div class="reviews-grid">
        <article
          v-for="review in data?.reviews"
          :key="review.id"
          class="review-card"
        >
          <div class="review-card__header">
            <div class="review-card__avatar">
              <img
                v-if="review.photo"
                :src="review.photo"
                :alt="review.name"
                class="review-card__photo"
                loading="lazy"
              />
              <span v-else class="review-card__initials">{{ initials(review.name) }}</span>
            </div>
            <div class="review-card__meta">
              <strong class="review-card__name">{{ review.name }}</strong>
              <span class="review-card__date">{{ review.date }}</span>
            </div>
            <div class="review-card__google">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-label="Google">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
          </div>

          <div class="review-card__stars">★★★★★</div>

          <blockquote class="review-card__text">{{ review.text }}</blockquote>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.depoimentos-page {
  padding: 64rem 0 80rem;
}

.depoimentos-header {
  text-align: center;
  margin-bottom: 64rem;

  &__title {
    font-size: 42rem;
    font-weight: 700;
    margin-bottom: 16rem;
    color: v.$dark-red;
  }

  &__description {
    font-size: 18rem;
    color: #555;
    line-height: 1.6;
    max-width: 640rem;
    margin: 0 auto 24rem;
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(418rem, 1fr));
  gap: 24rem;
  margin-bottom: 64rem;
}

.review-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12rem;
  padding: 24rem;
  display: flex;
  flex-direction: column;
  gap: 12rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;

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
