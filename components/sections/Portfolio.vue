<script lang="ts" setup>
const $route       = useRoute();
const configPublic = useRuntimeConfig().public;

const props = defineProps({
  fromHome: {
    type: Boolean,
    required: false,
    default: false
  }
});

const filteredSlides = (item) => {
  if (!item.album) {
    return {
      retrato: [],
      paisagem: []
    };
  }

  const retratoSlides = item.album
    .filter(slide => slide.format === 'retrato' && slide.canBeThumb === true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  const paisagemSlides = item.album
    .filter(slide => slide.format === 'paisagem' && slide.canBeThumb === true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  return {
    retrato: retratoSlides,
    paisagem: paisagemSlides
  };
}

const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('works');
});

const categories = navigation.value[0].children;
const workPage   = navigation.value[0].path;
const category   = $route.params.category || '';

const currentCategory = categories.find(cat => cat.path === `/ensaio-fotografico/${category}`);

const {
  data: ensaiosList
} = await useAsyncData(() => {
  const query = queryCollection('works')

  if(props.fromHome) {
    query.limit(3);
    query.where('home', '=', true);
  }

  if (category) {
    query.where('path', 'LIKE', `%/${category}%`);
  }

  query.where('id', 'NOT LIKE', `%/index.json%`);

  return query.all();
});

const ensaiosData = Array.isArray(ensaiosList.value) ? ensaiosList.value
  .map(item => {
    return {
      ...item.body,
      photos: filteredSlides(item.body),
      path: item.path
    };
  })
  .sort((a, b) => {
    if (props.fromHome) {
      if (a.homeOrder && b.homeOrder) {
        return a.homeOrder - b.homeOrder;
      }

      return 0;
    }

    return 0;
  }) : [];

const classes = [
  {
    class: 'card card-column',
    format: 'paisagem',
  },
  {
    class: 'card side-by-side',
    format: 'retrato',
  },
  {
    class: 'wide side-by-side reverse',
    format: 'paisagem',
  },
  {
    class: 'card side-by-side card-60',
    format: 'retrato',
  },
  {
    class: 'card card-column card-40',
    format: 'paisagem',
  },
];

const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>

<template>
  <div class="container no-padding">
    <template v-if="props.fromHome">
      <NuxtLink
        class="highlight-new"
        :to="'/ensaio-fotografico/dia-das-maes-2025'">
            <span> Dia das Mães 2025 </span>
      </NuxtLink>
    </template>

    <h1 class="big-title red centered">
      <span class="box">
        <span v-if="!currentCategory">Explore meus</span>
        <span v-if="currentCategory">Ensaios fotográficos da categoria</span>
      </span>
      <span class="big" v-if="!currentCategory">Últimos trabalhos</span>
      <span class="big" v-if="currentCategory">{{ currentCategory.title }}</span>
    </h1>

    <div class="wrap-portfolio">
      <template v-for="(item, index) in ensaiosData">
        <div :class="'thumb thumb-' + classes[index % classes.length].class">
          <div :class="{'inner-thumb': true, 'wrap-wide': classes[index % classes.length].class === 'wide side-by-side reverse'}">
            <div class="slider">
              <ClientOnly>
                <swiper-container
                  class="swiper"
                  :slides-per-view="1"
                  :pagination="{
                    clickable: true,
                  }"
                  :navigation="true">
                  <swiper-slide
                    v-for="slide in item.photos[classes[index % classes.length].format]"
                    :key="slide.id"
                    :class="'wrap-img ' + slide.format">
                    <nuxt-img
                      :src='configPublic.cloudflareURI + slide.imageId + "/thumb"'
                      :width="(slide.format=='paisagem') ? 700 : 500"
                      :height="(slide.format=='paisagem') ? 500 : 800"
                      class="img-thumb"
                      :alt="slide.alt"
                      loading="lazy"/>
                    <nuxt-img
                      v-if="slide.format=='retrato'"
                      :src='configPublic.cloudflareURI + slide.imageId + "/thumb"'
                      width="700"
                      height="500"
                      class="bg-thumb"
                      :alt="slide.alt"
                      loading="lazy"/>
                  </swiper-slide>
                </swiper-container>
              </ClientOnly>
            </div>

            <div class="wrap-info">
              <div class="wrap-text">
                <h3 class="title">
                  {{ item.title }}
                </h3>

                <ul class="info-list">
                  <li class="category" v-if="item.category.slug">
                    <NuxtLink
                      :to="workPage + '/' + item.category.slug">
                      <span>{{ item.category.title }}</span>
                    </NuxtLink>
                  </li>
                  <li class="place">
                    <nuxt-icon
                      name="location-pin-solid"
                      class="icon icon-location-pin"/>
                    <span v-html="item.local"></span>
                  </li>
                  <li class="place" v-if="item.date">
                    <nuxt-icon
                      name="location-pin-solid"
                      class="icon icon-location-pin"/>
                    <span v-html="formatDate(item.date)"></span>
                  </li>
                </ul>

                <div class="description" v-html="item.description"></div>
              </div>
            </div>
          </div>

          <NuxtLink
            :to="item.path"
            class="btn btn-green-light">
              <span>Ver mais</span>
          </NuxtLink>
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

        <template v-if="index == 1 || index == 6">
          <NuxtLink
            class="btn-agende btn-agende-01"
            :to="'/preco-ensaio-fotografico'">
            <span>Agende seu ensaio</span>
          </NuxtLink>
        </template>

        <template v-if="(index == 1 && ensaiosData.length > 2) || index == 6">
          <NuxtLink
            class="btn-agende btn-agende-02"
            :to="'/preco-ensaio-fotografico'">
            <span>Agende seu ensaio</span>
          </NuxtLink>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
    margin-bottom: 50rem;
    flex-wrap: wrap;
    display: flex;
    gap: 15rem;

    .btn-agende {
      transition: color .2s, background .2s, border .2s;
      border: 1px solid transparent;
      justify-content: center;
      background: v.$green;
      align-items: center;
      font-weight: bold;
      font-size: 50rem;
      color: white;
      display: flex;

      @media (prefers-color-scheme: dark) {
        background: v.$dark-green;
      }

      @include m.max(md) {
        font-size: 30rem;
      }

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
        width: calc(16% - 15rem);

        @include m.min(md) {
          width: calc(10% - 15rem);
        }

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
      padding: 30rem;

      @media (prefers-color-scheme: dark) {
        background: v.$red;
      }

      @include m.max(sm) {
        padding: 10px;
      }

      .wrap-info {
        padding-bottom: 50rem;
        padding-top: 20rem;
        color: v.$dark-red;

        @media (prefers-color-scheme: dark) {
          color: white
        }

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

              background-color: v.$dark-red;
              display: inline-block;
              position: absolute;
              border-radius: 50%;
              height: 12rem;
              width: 12rem;
              left: 2rem;
              top: 8rem;

              @media (prefers-color-scheme: dark) {
                background: white;
              }
            }
          }

          li.place .nuxt-icon {
            position: absolute;
            left: -1rem;
          }
        }
      }

      &.thumb-card {
        width: calc(45% - 15rem);

        @include m.max(md) {
          width: 100%;
        }

        &.side-by-side {
          .slider {
            aspect-ratio: 1/1.47;
            flex-shrink: 0;
            width: 60%;

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
          width: calc(40% - 15rem);

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
        padding-bottom: 35rem;
        display: flex;
      }

      &.side-by-side .inner-thumb {
        display: flex;
        height: 100%;

        .swiper {
          height: 100%;
        }

        .wrap-info {
          padding-left: 20rem;
          padding-top: 0;
        }
      }

      &.thumb-wide {
        background-color: transparent;
        width: calc(92% - 15rem);
        // flex-wrap: wrap;
        padding: 0;

        @include m.max(md) {
          width: 100%;
        }

        .slider {
          aspect-ratio: 2/1;
          width: calc(65% - 6rem);
          flex-shrink: 0;

          @include m.max(xs) {
            width: 50%;
          }
        }

        &.reverse {
          .wrap-wide {
            background: white;
            padding: 30rem;
            display: flex;
            width: 100%;
            gap: 20rem;

            @media (prefers-color-scheme: dark) {
              background: v.$red;
            }

            @include m.max(sm) {
              flex-wrap: wrap;
              padding: 10px;
            }
          }

          .slider {
            @include m.max(xs) {
              width: 100%;
            }
          }

          .wrap-info {
            margin-right: 20rem;
            width: calc(34%);
            padding-left: 0;
            padding-top: 0;

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

      .btn {
        position: absolute;
        padding: 30rem;
        bottom: 0;
        right: 0;

        @media (prefers-color-scheme: dark) {
          // background: black;
        }
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

        // &.retrato {
        // }

        &.paisagem {
          aspect-ratio: 600/400;
        }
      }
    }
  }
</style>