<script setup lang="ts">
const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';

const PAGE_SIZE = 20;

const { data: rawDepoimentos } = await useFetch('/api/public/depoimentos');

const allReviews = computed(() =>
  (rawDepoimentos.value ?? [])
    .filter((d: any) => !d.featured)
    .map(adaptDepoimento)
);

const visibleCount = ref(PAGE_SIZE);
const reviews = computed(() => allReviews.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < allReviews.value.length);

const gridRef = ref<HTMLElement | null>(null);
const sentinelRef = ref<HTMLElement | null>(null);
const { init: initAnimations } = useScrollAnimations();

async function loadMore() {
  visibleCount.value += PAGE_SIZE;
  await nextTick();
  if (gridRef.value) initAnimations(gridRef.value);
}

let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting && hasMore.value) loadMore(); },
    { rootMargin: '200px' }
  );
  if (sentinelRef.value) observer.observe(sentinelRef.value);
});

onUnmounted(() => observer?.disconnect());

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
      <div ref="gridRef" class="reviews-grid">
        <article
          v-for="(review, index) in reviews"
          :key="review.id"
          class="review-card"
          data-ani-type="polaroid"
          data-ani-batch="reviews-grid"
          data-ani-stagger="0.07"
          data-ani-batch-max="3"
        >
          <div class="header">
            <div class="avatar">
              <img
                :src="reviewAvatarUrl(review)"
                :alt="review.name"
                class="photo"
                loading="lazy"
              />
            </div>
            <div class="meta">
              <strong class="name">{{ review.name }}</strong>
              <span class="date">{{ review.data }}</span>
            </div>

            <div class="google">
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
            <span class="stars">★★★★★</span>
          </NuxtLink>

          <blockquote class="text" v-html="review.text"></blockquote>

          <div v-if="review.portfolioPath" class="portfolio">
            <NuxtLink :to="review.portfolioPath" class="thumb">
              <nuxt-img
                v-if="review.portfolioFotoCfId"
                provider="cloudflare"
                :src="`${CF_IMG_BASE}${review.portfolioFotoCfId}/public`"
                :alt="`Ensaio de ${review.name}`"
                class="img"
                width="350"
                format="avif"
                placeholder
                loading="lazy" />
            </NuxtLink>
            <NuxtLink :to="review.portfolioPath" class="btn btn--outline portfolio-btn">
              Ver ensaio
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-if="hasMore" ref="sentinelRef" class="load-sentinel" aria-hidden="true" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.depoimentos-header {
  text-align: center;
  margin-bottom: v.$space;

  .description {
    font-size: 18rem;
    color: #555;
    line-height: 1.6;
    max-width: 640rem;
    margin: 10px auto 24rem;
  }

  .badge {
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

  @include m.max(sm) {
    margin-bottom: 40rem;

    .title {
      font-size: 28rem;
    }

    .description {
      font-size: 16rem;
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

  .header {
    display: flex;
    align-items: center;
    gap: 12rem;
  }

  .avatar {
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

  .photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .initials {
    color: #fff;
    font-size: 16rem;
    font-weight: 700;
    line-height: 1;
  }

  .meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .name {
    font-size: 18rem;
    font-weight: 600;
    color: #222;
  }

  .date {
    font-size: 15rem;
    color: #999;
  }

  .google {
    flex-shrink: 0;

    .link-source {
      display: flex;
      gap: 4px;
    }
  }

  .stars {
    color: #f9a825;
    font-size: 16rem;
    letter-spacing: 2px;
  }

  .text {
    font-size: 18rem;
    line-height: 1.7;
    color: #444;
    margin: 0;
    font-style: normal;
  }

  .portfolio {
    display: flex;
    align-items: center;
    gap: 12rem;
    padding-top: 12rem;
    border-top: 1px solid #f0f0f0;
    margin-top: 4rem;
  }

  .thumb {
    overflow: hidden;
    display: block;
    flex-shrink: 0;
    width: 100%;
  }

  .img {
    transition: transform 0.3s ease;
    object-fit: cover;
    height: 100%;
    width: 100%;

    &:hover {
      transform: scale(1.05);
    }
  }

  .portfolio-btn {
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

.load-sentinel {
  height: 1px;
}
</style>
