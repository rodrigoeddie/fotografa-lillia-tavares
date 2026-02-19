<script lang="ts" setup>
const $route       = useRoute();
const configPublic = useRuntimeConfig().public;

const props = defineProps({
  fromHome: {
    type: Boolean,
    required: false,
    default: false
  },
  category: {
    type: String,
    required: false,
    default: undefined
  }
});

interface SlideFormat {
  retrato: any[];
  paisagem: any[];
}

interface EnsaioItem {
  title: string;
  description: string;
  local?: string;
  date?: string;
  category?: {
    slug: string;
    title: string;
  };
  album?: any[];
  photos: SlideFormat;
  path: string;
  homeOrder?: number;
  [key: string]: any; // Para permitir outras propriedades do body
}

interface ClassConfig {
  class: string;
  format: 'paisagem' | 'retrato';
  image: {
    width: number;
    height: number;
  };
}

const filteredSlides = (item: any): SlideFormat => {
  if (!item.album) {
    return {
      retrato: [],
      paisagem: []
    };
  }

  const retratoSlides = item.album
    .filter((slide: any) => slide.format === 'retrato' && slide.canBeThumb === true)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  const paisagemSlides = item.album
    .filter((slide: any) => slide.format === 'paisagem' && slide.canBeThumb === true)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  return {
    retrato: retratoSlides,
    paisagem: paisagemSlides
  };
}

const { data: navigation } = await useAsyncData('portfolio-navigation', () => {
  return queryCollectionNavigation('works');
});

const workPage        = ref('');
const currentCategory = ref<any>(null);

// Computed para gerar a key do useAsyncData baseada nos parâmetros atuais
const asyncDataKey = computed(() => {
  const category = $route.params.category || '';
  return `ensaios-${category}-${props.fromHome}`;
});

// Computed para gerar a query baseada nos parâmetros atuais
const queryConfig = computed(() => {
  const category = $route.params.category || '';
  return {
    category,
    fromHome: props.fromHome
  };
});

const { data: ensaiosList, refresh: refreshEnsaios } = await useAsyncData(
  asyncDataKey,
  () => {
    const query = queryCollection('works');
    const { category, fromHome } = queryConfig.value;

    if (fromHome) {
      query.limit(3);
      query.where('home', '=', true);
    }

    if (category && !props.category) {
      query.where('path', 'LIKE', `%/${category}%`);
    }

    if (props.category) {
      query.where('path', 'LIKE', `%/${props.category}%`);
    }

    query.where('id', 'NOT LIKE', `%/index.json%`);

    return query.all();
  }
);

const ensaiosData = computed(() => {
  if (!ensaiosList.value || !Array.isArray(ensaiosList.value)) {
    return [];
  }

  const items = ensaiosList.value
    .map((item: any) => {
      return {
        ...item,
        photos: filteredSlides(item),
        path: item.path
      };
    })
    .sort((a: any, b: any) => {
      if (props.fromHome) {
        if (a.homeOrder && b.homeOrder) {
          return a.homeOrder - b.homeOrder;
        }
        return 0;
      }
      return 0;
    });

  return props.category ? items.slice(0, 3) : items;
});

function atualizarConteudoComBaseNaRota(newRoute: any) {
  if (!navigation.value || !navigation.value[0]) return;

  const categories = navigation.value[0].children;
  workPage.value = navigation.value[0].path;
  const category = newRoute.params.category || '';

  currentCategory.value = categories?.find(cat => cat.path === `/ensaio-fotografico/${category}`) || null;
}

atualizarConteudoComBaseNaRota($route);

watch(
  () => $route.fullPath,
  (novoFullPath, antigoFullPath) => {
    if (novoFullPath !== antigoFullPath) {
      atualizarConteudoComBaseNaRota($route);
      // Refresh dos dados quando a rota mudar
      refreshEnsaios();
    }
  },
  { immediate: false }
);

const classes: ClassConfig[] = [
  {
    class: 'card card-column',
    format: 'paisagem',
    image: {
      width: 690,
      height: 460,
    }
  },
  {
    class: 'card side-by-side',
    format: 'retrato',
    image: {
      width: 567,
      height: 834,
    }
  },
  {
    class: 'wide side-by-side reverse',
    format: 'paisagem',
    image: {
      width: 962,
      height: 602,
    }
  },
  {
    class: 'card side-by-side card-50',
    format: 'retrato',
    image: {
      width: 567,
      height: 834,
    }
  },
  {
    class: 'card card-column card-50',
    format: 'paisagem',
    image: {
      width: 605,
      height: 403,
    }
  },
];

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>

<template>
  <div class="container" v-if="ensaiosData.length > 0">
    <h1 class="big-title red centered">
      <span class="box">
      <span v-if="props.category">Trabalhos</span>
      <span v-else-if="currentCategory">Ensaios fotográficos da categoria</span>
      <span v-else>Explore meus</span>
      </span>
      <span class="big" v-if="props.category">com esse tema</span>
      <span class="big" v-else-if="currentCategory">{{ currentCategory.title }}</span>
      <span class="big" v-else>Últimos trabalhos</span>
    </h1>

    <div class="wrap-portfolio">
      <template v-for="(item, index) in ensaiosData" :key="item.path">
        <div :class="'thumb thumb-' + classes[index % classes.length]?.class">
          <div :class="{'inner-thumb': true, 'wrap-wide': classes[index % classes.length]?.class === 'wide side-by-side reverse'}">
            <div class="slider">
              <ClientOnly>
                <NuxtLink
                  :to="item.path">
                  <swiper-container
                    class="swiper"
                    :slides-per-view="1"
                    :effect="'flip'"
                    :pagination="{
                      clickable: true,
                    }"
                    :navigation="true">
                    <swiper-slide
                      v-for="slide in item.photos?.[classes[index % classes.length]?.format || 'paisagem'] || []"
                      :key="slide.id"
                      :class="'wrap-img ' + slide.format">
                      <nuxt-img
                        provider="cloudflare"
                        :src='"https://images.fotografalilliatavares.com.br/images/" + slide.imageId + "/public"'
                        :width="classes[index % classes.length]?.image.width || 690"
                        :height="classes[index % classes.length]?.image.height || 460"
                        :sizes="'100vw md:50vw lg:' + (classes[index % classes.length]?.image.width || 690) + 'px'"
                        class="img-thumb"
                        :alt="slide.alt"
                        placeholder
                        loading="lazy"/>
                      <nuxt-img
                        provider="cloudflare"
                        v-if="slide.format=='retrato'"
                        :src='"https://images.fotografalilliatavares.com.br/images/" + slide.imageId + "/public"'
                        :width="classes[index % classes.length]?.image.width || 690"
                        :height="classes[index % classes.length]?.image.height || 460"
                        :sizes="'100vw md:50vw lg:' + (classes[index % classes.length]?.image.width || 690) + 'px'"
                        class="bg-thumb"
                        :alt="slide.alt"
                        placeholder
                        loading="lazy"/>
                    </swiper-slide>
                  </swiper-container>
                </NuxtLink>
              </ClientOnly>
            </div>

            <div class="wrap-info">
              <div class="wrap-text">
                <h3 class="title">
                  {{ item.title }}
                </h3>

                <ul class="info-list">
                  <li class="category" v-if="item.category && item.category.slug">
                    <NuxtLink
                      :to="workPage + '/' + item.category.slug">
                      <span>{{ item.category.title }}</span>
                    </NuxtLink>
                  </li>
                  <li class="place">
                    <Icon
                      name="icons:location-pin-solid"
                      class="icon icon-location-pin"/>
                    <span v-html="item.local"></span>
                  </li>
                  <li class="place" v-if="item.date">
                    <Icon
                      name="icons:location-pin-solid"
                      class="icon icon-location-pin"/>
                    <span v-html="formatDate(item.date)"></span>
                  </li>
                </ul>

                <div class="description ensaio-description" v-html="item.description"></div>

                <NuxtLink
                  :to="item.path"
                  class="link">
                    <span>Veja mais sobre esse ensaio</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <template v-if="index == 2 && props.fromHome">
          <NuxtLink
            class="link-see-more big-title red big-title-home"
            :to="workPage">
                <span class="big">veja todos os Trabalhos</span>
                <span class="box">
                  <span>Clique aqui</span>
                </span>
          </NuxtLink>
        </template>

        <template v-if="(index - 1) % 5 === 0">
          <NuxtLink
            class="btn-agende btn-agende-01"
            :to="'/preco-ensaio-fotografico'">
            <span>Gostou? Agende o seu</span>
          </NuxtLink>
        </template>

        <template v-if="ensaiosData.length > 2">
          <template v-if="(index - 1) % 5 === 0 || (index === 1)">
            <NuxtLink
              class="btn-agende btn-agende-02"
              :to="'/preco-ensaio-fotografico'">
              <span>Gostou? Agende o seu</span>
            </NuxtLink>
          </template>
        </template>
      </template>

      <template v-if="props.category">
        <NuxtLink
          class="link-see-more big-title red big-title-home"
          :to="'/ensaio-fotografico/' + props.category">
              <span class="big">veja todos os Trabalhos</span>
              <span class="box">
                <span>Clique aqui</span>
              </span>
        </NuxtLink>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  :deep(.swiper) {
      --swiper-navigation-size: 30rem !important;
  }

  .highlight-new {
    background: rgba(169, 122, 9, 0.7);
    border-bottom: 10rem solid #4d3703b3;
    transition: background .2s;
    margin-bottom: 15px;
    line-height: 110rem;
    text-align: center;
    font-weight: 700;
    font-size: 60rem;
    display: block;
    color: white;
    width: 100%;

    @include m.max(sm) {
      font-size: 50rem;
    }

    &:hover {
      background: #815d06b3;
    }
  }

  .slider {
    background: #f6f6f6;
    width: 100%;
  }

  .big-title-home {
    justify-content: center;
    margin-bottom: -8rem;
    padding-top: 0;
    width: 100%;

    @include m.max(sm) {
      margin-bottom: 0;
    }
  }

  .big-title {
    @include m.max(sm) {
      padding-top: 35rem;
    }
  }

  .wrap-portfolio {
    padding-bottom: 30rem;
    margin-bottom: 50rem;
    flex-wrap: wrap;
    display: flex;
    gap: 15rem;

    .btn-agende {
      transition: color .2s, background .2s, border .2s;
      border: 1px solid transparent;
      text-transform: uppercase;
      justify-content: center;
      background: v.$green;
      align-items: center;
      font-size: 30rem;
      color: white;
      display: flex;

      span {
        transform: rotate(-90deg);
        transform-origin: center;
        text-align: center;
        display: block;
        flex-shrink: 0;
        width: 472rem;

        @include m.max(md) {
          width: 320rem;
        }

        @include m.max(sm) {
          transform: none;
          width: 100%;
        }
      }

      &.btn-agende-01 {
        width: 4%;

        @include m.max(sm) {
          padding: 10px 0;
          font-size: 25px;
          width: 100%;
        }
      }

      &.btn-agende-02 {
        width: calc(8% - 15rem);

        @include m.max(lg) {
          font-size: 28px;
        }

        @include m.max(sm) {
          display: none;
        }
      }

      &:hover {
        background: white !important;
        border-color: v.$green;
        color: v.$green;
      }
    }

    .thumb {
      background: white;
      border: 1px solid v.$green;

      .wrap-info {
        color: v.$green;
        padding: 30rem;

        .title {
          font-size: 23rem;
        }

        .info-list {
          line-height: 28rem;
          padding-top: 10rem;
          font-size: 19rem;

          li {
            padding-left: 25rem;
          }

          li.category {
            &:before {
              content: '';

              background-color: v.$green;
              display: inline-block;
              position: absolute;
              border-radius: 50%;
              height: 12rem;
              width: 12rem;
              left: 2rem;
              top: 8rem;
            }
          }

          li.place .icon {
            position: absolute;
            left: -1rem;
          }
        }

        .ensaio-description {
          padding-bottom: 40rem;
        }
      }

      &.thumb-card {
        width: calc(48% - 15rem);

        @include m.max(md) {
          width: 100%;
        }

        &.side-by-side {
          .slider {
            aspect-ratio: 1/1.47;
            flex-shrink: 0;
            width: 62%;

            @include m.max(sm) {
              width: 50%;
            }
          }
        }

        &.card-50 {
          width: calc(50% - 15rem);

          @include m.max(sm) {
            width: 100%;
          }
        }

        &.card-60 {
          width: calc(60% - 15rem);

          @include m.max(sm) {
            width: 100%;
          }
        }

        &.card-40 {
          width: 40%;

          @include m.max(sm) {
            width: 100%;
          }
        }

        .slider {
          aspect-ratio: 568/378;
          height: 100%;

          .swiper {
            height: 100%;
          }
        }
      }

      &.card-column .inner-thumb {
        flex-direction: column;
        display: flex;
      }

      &.side-by-side .inner-thumb {
        display: flex;
        height: 100%;

        .swiper {
          height: 100%;
        }
      }

      &.thumb-wide {
        background-color: transparent;
        width: 92%;
        padding: 0;

        @include m.max(md) {
          width: 100%;
        }

        .slider {
          width: calc(65% - 6rem);
          aspect-ratio: 2/1.25;
          flex-shrink: 0;

          @include m.max(xs) {
            width: 50%;
          }
        }

        &.reverse {
          .wrap-wide {
            background: white;
            padding: 0;
            display: flex;
            width: 100%;

            @include m.max(sm) {
              flex-wrap: wrap;
            }
          }

          .slider {
            @include m.max(xs) {
              width: 100%;
            }
          }

          .wrap-info {
            width: calc(34%);

            @include m.max(xs) {
              width: 100%;
            }
          }
        }

        .link-see-more {
          margin-top: 10rem;
          padding-top: 0;
          width: 100%;

          .box {
            justify-content: flex-end;
            font-size: 33rem;
            width: 550rem;

            @include m.max(lg) {
              width: 398rem;
            }

            @include m.max(md) {
              justify-content: center;
              font-size: 30rem;
              width: 214rem;
            }

            @include m.max(sm) {
              font-size: 15px;
              width: auto;
            }
          }

          &:hover {
            border-color: v.$red;
            color: v.$red;

            .box {
              background: v.$red;
            }
          }
        }
      }

      .link {
        text-decoration: underline;
        align-items: flex-end;
        font-size: 20rem;
        color: v.$green;
        display: flex;
      }
    }

    .swiper {
      width: 100%;

      @include m.min(md) {
        height: 89%;
      }

      @include m.max(md) {
        height: 60vw;
      }

      .wrap-img {
        height: 100%;

        img {
          position: absolute;
          object-fit: cover;
          height: 100%;
          width: 100%;
        }

        &.paisagem {
          aspect-ratio: 600/400;
        }
      }
    }
  }
</style>
