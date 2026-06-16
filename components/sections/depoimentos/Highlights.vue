<script setup lang="ts">
const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';

const { data: rawDepoimentos } = await useFetch('/api/public/depoimentos');

const featured = computed(() =>
  (rawDepoimentos.value ?? [])
    .filter((d: any) => !!d.featured)
    .map(adaptDepoimento)
);

const swiperRef = ref<HTMLElement | null>(null);

function avatarUrl(review: { photo?: string }): string {
  if (review.photo && !review.photo.startsWith('http')) {
    return CF_IMG_BASE + review.photo + '/public';
  }
  return review.photo ?? '';
}
</script>

<template>
  <section v-if="featured.length" class="depo-highlights">
    <div class="label">Depoimentos em destaque</div>

    <ClientOnly>
      <swiper-container
        ref="swiperRef"
        class="slider"
        :pagination="{ clickable: true }"
        slides-per-view="1"
        space-between="0"
        centered-slides="true"
        observer="true"
        observe-parents="true"
      >
        <swiper-slide
          v-for="review in featured"
          :key="review.id"
          class="slide"
        >
          <div class="card">
            <div class="portfolio-col" v-if="review.portfolioFotoCfId">
              <NuxtLink :to="review.portfolioPath" class="img-link">
                <nuxt-img
                  provider="cloudflare"
                  :src="`${CF_IMG_BASE}${review.portfolioFotoCfId}/public`"
                  :alt="`Ensaio de ${review.name}`"
                  class="img"
                  width="400"
                  format="avif"
                  placeholder
                  loading="lazy"
                />
              </NuxtLink>
            </div>

            <div class="content">
              <div class="body">
                <div class="author">
                  <div class="avatar" v-if="avatarUrl(review)">
                    <img :src="avatarUrl(review)" :alt="review.name" loading="lazy" />
                  </div>
                  <div class="author-info">
                    <strong class="name">{{ review.name }}</strong>
                    <span class="stars">★★★★★</span>
                    <span class="date">{{ review.data }}</span>
                  </div>
                  <NuxtLink
                    v-if="review.link"
                    :to="review.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="google"
                    aria-label="Ver no Google"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </NuxtLink>
                </div>

                <div class="text-col">
                  <svg class="quote" viewBox="0 0 40 30" fill="none" aria-hidden="true">
                    <path d="M0 30V18C0 7.333 4.667 1.333 14 0l2 4C11.333 5.333 9.333 8 9 12h7v18H0zm21 0V18C21 7.333 25.667 1.333 35 0l2 4C32.333 5.333 30.333 8 30 12h7v18H21z" fill="currentColor"/>
                  </svg>
                  <blockquote class="text" v-html="review.text" />
                </div>
              </div>

              <NuxtLink
                v-if="review.portfolioPath"
                :to="review.portfolioPath"
                class="btn btn-ghost cta"
              >
                Ver ensaio completo
              </NuxtLink>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </section>
</template>

<style scoped lang="scss">
.depo-highlights {
  padding: 60rem 0 50rem;
  position: relative;
  overflow-x: clip;

  .label {
    font-size: 11px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #6b5f55;
    font-weight: 500;
    text-align: center;
    margin-bottom: 32rem;
  }

  .slider {
    width: 100%;
  }

  .slide {
    padding: 20rem 32rem 40rem;
    box-sizing: border-box;
  }

  .card {
    display: flex;
    align-items: stretch;
    gap: 0;
    max-width: 1700rem;
    margin: 0 auto 25rem;
    background: white;
    border-radius: 16rem;
    @include m.card-shadow;

    @include m.max(md) {
      flex-direction: column;
    }
  }

  .portfolio-col {
    flex: 0 0 30%;
    min-height: 360rem;
    overflow: hidden;

    @include m.max(md) {
      flex: none;
      min-height: 240rem;
    }
  }

  .img-link {
    display: block;
    height: 100%;
  }

  .img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.03);
    }
  }

  .content {
    flex: 1;
    padding: 48rem 48rem 40rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28rem;

    @include m.max(md) {
      padding: 32rem 24rem;
    }
  }

  .body {
    display: flex;
    gap: 40rem;
    align-items: flex-start;

    @include m.max(sm) {
      flex-direction: column;
      gap: 24rem;
    }
  }

  .author {
    flex: 0 0 320rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16rem;
    padding:  32rem 0 0;
    border-right: 1px solid rgba(42, 37, 32, 0.1);

    @include m.max(sm) {
      flex-direction: row;
      flex: none;
      text-align: left;
      padding: 0 0 20rem;
      border-right: none;
      border-bottom: 1px solid rgba(42, 37, 32, 0.1);
      gap: 16rem;
    }

    .avatar {
      width: 120rem;
      height: 120rem;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      border: 3px solid #fff;
      box-shadow: 0 6rem 24rem rgba(42, 37, 32, 0.2);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .author-info {
      display: flex;
      flex-direction: column;
      gap: 6rem;

      .name {
        font-size: 20rem;
        font-weight: 700;
        color: #1a1714;
        line-height: 1.2;
      }

      .stars {
        color: #f9a825;
        font-size: 24rem;
        letter-spacing: 3px;
      }

      .date {
        font-size: 13rem;
        color: #888;
      }
    }

    .google {
      opacity: 0.65;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }
  }

  .text-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rem;
  }

  .quote {
    width: 44rem;
    height: 34rem;
    color: v.$red;
    opacity: 0.2;
    flex-shrink: 0;
  }

  .text {
    font-size: 24rem;
    line-height: 1.75;
    color: #2a2520;
    font-style: italic;
    margin: 0;

    @include m.max(md) {
      font-size: 21rem;
    }

    @include m.max(sm) {
      font-size: 18rem;
    }
  }

  @include m.min(md) {
    .cta {
        position: absolute;
        bottom: -24rem;
        left: 70rem;
    }
  }
}
</style>
