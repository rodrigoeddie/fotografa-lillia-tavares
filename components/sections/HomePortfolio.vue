<script lang="ts" setup>
const $route       = useRoute();
const configPublic = useRuntimeConfig().public;

const filteredSlides = (item) => {
  if (!item.album) {
    return {
      retrato: []
    };
  }

  const retratoSlides = item.album
    .filter(slide => slide.format === 'retrato' && slide.canBeThumb === true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  return {
    retrato: retratoSlides
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

    query.limit(3);
    query.where('home', '=', true);

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
  }) : [];

const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};
</script>

<template>
  <div class="container no-padding">
    <NuxtLink :to="workPage">
      <h1 class="big-title red centered">
        <span class="box">
          <span v-if="!currentCategory">Explore meus</span>
          <span v-if="currentCategory">Ensaios fotográficos da categoria</span>
        </span>
        <span class="big" v-if="!currentCategory">Últimos trabalhos</span>
        <span class="big" v-if="currentCategory">{{ currentCategory.title }}</span>
      </h1>
    </NuxtLink>

    <div class="wrap-portfolio">
      <template v-for="(item, index) in ensaiosData">
        <div class="thumb thumb-vertical">
          <div class="inner-thumb">
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
                      v-for="slide in item.photos['retrato']"
                      :key="slide.id"
                      :class="'wrap-img ' + slide.format">
                      <nuxt-img
                        provider="cloudflare"
                        :src='"https://images.fotografalilliatavares.com.br/images/" + slide.imageId + "/public"'
                        width="384"
                        height="594"
                        sizes="'100vw md:50vw lg:384px"
                        class="bg-thumb"
                        :alt="slide.alt"
                        format="webp"
                        placeholder
                        loading="lazy"/>
                    </swiper-slide>
                  </swiper-container>
                </NuxtLink>
              </ClientOnly>
            </div>

            <div class="wrap-info">
              <div class="wrap-text">
                <h2 class="title">
                  {{ item.title }}
                </h2>

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

                <NuxtLink
                  :to="item.path"
                  class="btn btn-red">
                    <span>Acesse esse ensaio</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </template>

      <SectionsHomeTestimonials />
    </div>
  </div>
</template>

<style scoped lang="scss">
  :deep(.swiper) {
      --swiper-navigation-size: 30rem !important;
  }

  .btn.btn-red {
    font-size: 12px;
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
    aspect-ratio: 384/450;
    background: #f6f6f6;
    flex-shrink: 0;
    width: 100%;
  }

  .big-title-home {
    justify-content: center;
    margin-bottom: -8rem;
    padding-top: 0 !important;
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
    justify-content: space-between;
    margin-bottom: 50rem;
    flex-wrap: wrap;
    display: flex;
    gap: 15rem;

    @include m.max(sm) {
      display: block;
    }

    .btn {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      margin-left: -31rem;
      margin-right: -31rem;
      margin-bottom: -31rem;
    }

    .thumb {
      border: 1px solid v.$green;
      width: calc(33% - 7rem);
      background: white;

      @include m.max(sm) {
        margin-bottom: 20px;
        margin-left: 3%;
        width: 94%;
      }

      .wrap-info {
        color: v.$green;
        padding: 30rem;

        .wrap-text {
          padding-bottom: 45rem;
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

              background-color: v.$green;
              display: inline-block;
              position: absolute;
              border-radius: 50%;
              height: 12rem;
              width: 12rem;
              left: 2rem;
              top: 16rem;
              
              @include m.max(sm) {
                top: 9rem;
              }
            }
          }

          li.place .nuxt-icon {
            position: absolute;
            left: -1rem;
            top: 7rem;
              
            @include m.max(sm) {
              top: -2rem;
            }
          }

          :deep(a) {
            display: block;
            padding: 5px 0;

            @include m.max(sm) {
              padding: 0;
            }
          }
        }

        .ensaio-description {
          padding-bottom: 40rem;
        }
      }

      .link {
        text-decoration: underline;
        align-items: flex-end;
        padding-top: 30rem;
        font-size: 30rem;
        color: v.$green;
        display: flex;
      }
    }

    .swiper {
      height: 100%;
      width: 100%;

      // @include m.max(md) {
      //   height: 60vw;
      // }

      .wrap-img {
        height: 100%;

        img {
          position: absolute;
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
      }
    }
  }
</style>