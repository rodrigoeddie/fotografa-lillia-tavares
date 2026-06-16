<script setup lang="ts">
const cfImg = useCfImg();

const route = useRoute();

interface Banner {
  id: number;
  titulo: string | null;
  subtitulo: string | null;
  descricao: string | null;
  bg_image: string;
  bg_image_mobile: string | null;
  cta_nome: string | null;
  cta_url: string | null;
  cta_target: string;
}

const { data: banners } = await useFetch<Banner[]>('/api/public/hero-banners', {
  query: computed(() => ({ route: route.path })),
  watch: [() => route.path],
});

const list = computed<Banner[]>(() => banners.value ?? []);

const swiperRef = ref<HTMLElement | null>(null);
const swiper    = useSwiper(swiperRef, {
  slidesPerView: 1,
  loop: true,
  autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
  pagination: { clickable: true },
  init: false,
});
</script>

<template>
    <div class="container">
        <section v-if="list.length > 0" class="hero-banners">
        <ClientOnly>
            <swiper-container
              ref="swiperRef"
              class="hero-swiper"
              :loop="list.length > 1"
              :autoplay="list.length > 1 ? JSON.stringify({ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }) : undefined"
              :pagination="list.length > 1 ? JSON.stringify({ clickable: true }) : undefined"
              :navigation="list.length > 1"
              init="false"
            >
            <swiper-slide
                v-for="banner in list"
                :key="banner.id"
                class="hero-slide"
            >
                <component
                    :is="banner.cta_url ? 'NuxtLink' : 'div'"
                    :to="banner.cta_url || undefined"
                    :target="banner.cta_url && banner.cta_target === 'blank' ? '_blank' : undefined"
                    :rel="banner.cta_url && banner.cta_target === 'blank' ? 'noopener noreferrer' : undefined"
                    class="hero-slide-link"
                >
                    <picture v-if="banner.bg_image" class="hero-picture">
                        <source
                            v-if="banner.bg_image_mobile"
                            :srcset="cfImg(banner.bg_image_mobile)"
                            media="(max-width: 768px)"
                        />
                        <img
                            :src="cfImg(banner.bg_image)"
                            :alt="banner.titulo ?? ''"
                            class="img-hero"
                            loading="eager"
                            width="1920"
                            height="400"
                        />
                    </picture>

                    <div class="hero-inner">
                        <div class="hero-text">
                            <h2 v-if="banner.titulo" class="hero-titulo">{{ banner.titulo }}</h2>
                            <p v-if="banner.subtitulo" class="hero-subtitulo">{{ banner.subtitulo }}</p>
                            <p v-if="banner.descricao" class="hero-descricao">{{ banner.descricao }}</p>
                        </div>
                        <span v-if="banner.cta_nome" class="hero-cta">{{ banner.cta_nome }}</span>
                    </div>
                </component>
            </swiper-slide>
            </swiper-container>
        </ClientOnly>
        </section>
    </div>
</template>

<style scoped lang="scss">
.hero-banners {
  width: 100%;
  margin-bottom: 25rem;
}

.hero-swiper {
  width: 100%;

  /* pagination bullets */
  &::part(bullet) {
    background: rgba(255, 255, 255, .5);
    opacity: 1;
  }
  &::part(bullet-active) {
    background: v.$beige;
  }

  /* nav arrows */
  &::part(button-prev),
  &::part(button-next) {
    color: rgba(255, 255, 255, .7);
  }
}

.hero-slide {
  position: relative;
  width: 100%;
  aspect-ratio: 4.8;
  overflow: hidden;
  background: #1a1a1a;
}

.hero-slide-link {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.hero-picture {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.img-hero {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  padding: 0 v.$space;

  @include m.max(sm) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 60%;

  @include m.max(sm) {
    max-width: 100%;
  }
}

.hero-titulo {
  font-size: clamp(18px, 2vw, 28px);
  font-weight: 700;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0, 0, 0, .4);
}

.hero-subtitulo {
  font-size: clamp(13px, 1.2vw, 17px);
  color: rgba(255, 255, 255, .88);
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, .3);
}

.hero-descricao {
  font-size: clamp(12px, 1vw, 14px);
  color: rgba(255, 255, 255, .75);
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, .3);
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
  padding: clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px);
  background: v.$beige;
  color: #1a1a1a;
  border-radius: 4px;
  font-size: clamp(12px, 1vw, 15px);
  font-weight: 600;
  text-decoration: none;
  letter-spacing: .03em;
  transition: background .2s, transform .15s;

  &:hover {
    background: v.$light-beige;
    transform: translateY(-1px);
  }

  @include m.max(sm) {
    align-self: flex-start;
  }
}
</style>
