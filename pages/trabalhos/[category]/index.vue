<script lang="ts" setup>
const $route   = useRoute();
const category = $route.params.category;

const QUERY = `
{
  allCategories {
    id
    title
    slug
  }
  allEnsaios {
    id
    slug
    title
    description
    local
    instagram {
      value
    }
    quote
    color {
      hex
    }
    category {
      id
      title
      slug
    }
    hero {
      id
      alt
      blurUpThumb
      format
      height
      width
      url
    }
    photos {
      id
      alt
      url
      title
      format
      blurUpThumb
      customData
    }
    seo {
      description
      image {
        url
      }
      title
    }
    _status
    _updatedAt
    _firstPublishedAt
  }
  _allEnsaiosMeta {
    count
  }
}
`;

const { data, error } = await useGraphqlQuery({ query: QUERY });
const activeCategory = data.value.allCategories.find(categoryItem => categoryItem.slug === category);

const allEnsaios = data.value.allEnsaios.filter(ensaioItem => {
  let findCategory = false;

  ensaioItem.category.forEach(category => {
    if(category.slug === activeCategory.slug) {
      findCategory = true;
    }
  });

  return findCategory;
});

const filteredSlides = (item) => {
  const hasPaisagem = item.photos.some(slide => slide.customData.orientation === 'paisagem');
  let slides = item.photos.filter(slide => slide.customData.orientation === (hasPaisagem ? 'paisagem' : 'retrato'));

  slides = slides.slice(0, 5);

  return slides;
}
</script>

<template>
  <h1> {{ activeCategory.title }}</h1>

  <nav>
    <template v-for="category in data.allCategories">
      <NuxtLink
        :to="'/trabalhos/' + category.slug"
        :class="{ 'active' : activeCategory.slug === category.slug }">
        <span>{{ category.title }}</span>
      </NuxtLink>
    </template>
  </nav>

  <div class="wrapper-portfolio">
    <div class="container" id="container">
      <div class="wrap">
        <div class="thumb" v-for="item in allEnsaios">
          <Swiper
            :loop="true"
            :slides-per-view="1">
            <template v-for="slide in filteredSlides(item)" :key="slide">
              <SwiperSlide>
                <div class="wrap-img" :class='slide.customData.orientation'>
                  <nuxt-img
                    :src='slide.url'
                    :width="(slide.customData.orientation=='paisagem') ? 700 : 500"
                    :height="(slide.customData.orientation=='paisagem') ? 500 : 800"
                    class="img-thumb"
                    placeholder
                    loading="lazy"/>
                  <nuxt-img
                    v-if="slide.customData.orientation=='retrato'"
                    :src='slide.url'
                    width="700"
                    height="500"
                    class="bg-thumb"
                    :modifiers="{blur: 10}"
                    placeholder
                    loading="lazy"/>
                </div>
              </SwiperSlide>
            </template>
            <BlocksSwiperControls v-if="filteredSlides(item).length > 1" />
          </Swiper>

          <div class="wrap-bottom">
            <div>
              <h2 class="title">
                {{ item.title }}
              </h2>

              <div class="description" v-html="item.description"></div>
            </div>

            <NuxtLink
              :to="'/trabalhos/' + item.category[0].slug + '/' + item.slug"
              class="btn btn-red">
              <span>Ver mais</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';

.btn-title {
  padding: 40px 10px 20px;
  cursor: pointer;
  z-index: 3;
  width: 100%;

  @include m.min(md) {
    background: color.scale(v.$light-beige, $lightness: 10%);
    transition: .2s background;

    &:hover {
      background: color.scale(v.$light-beige, $lightness: 5%);
    }

    &:focus {
      background: color.scale(v.$light-beige, $lightness: 7%);
    }
  }

  .inner-btn {
    display: block;
  }

  .title-btn {
    color: color.scale(v.$beige, $lightness: -20%);
    text-transform: uppercase;
    font-weight: bold;
    line-height: 31px;
    font-size: 17px;
    flex-shrink: 0;
  }

  .description-btn {
    color: color.scale(v.$beige, $lightness: -20%);
    line-height: 15px;
    font-size: 12px;
    flex-shrink: 0;
  }
}

.container {

  @include m.min(md) {
    padding: 0 50rem;
  }

  @include m.max(md) {
    padding: 0 10px;
  }

  .wrap {
    flex-wrap: wrap;
    display: flex;
    gap: 25rem;
    width: 100%;
  }

  .thumb {
    padding-bottom: 20px;
    flex-shrink: 0;
    aspect-ratio: 1.5 / 1;
    width: calc(50% - 12.5rem);

    @include m.max(md) {
      padding-bottom: 30px;
    }

    .swiper {
      width: 100%;

      @include m.min(md) {
        height: 82%;
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

        &.retrato {
          .img-thumb {
            transform: translateX(-50%);
            z-index: 2;
            width: 35%;
            left: 50%;
          }

          .bg-thumb {
            width: 100%;
          }
        }
      }
    }

    .wrap-bottom {
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 15rem;
      display: flex;
      gap: 20rem;

      .title {
        padding-bottom: 10rem;
        text-transform: none;
        color: v.$red;

        @include m.max(md) {
          line-height: 1em;
        }
      }

      .description {
        padding-top: 0;
        color: v.$red;

        @include m.max(md) {
          line-height: 16px;
        }
      }
    }
  }
}
</style>
