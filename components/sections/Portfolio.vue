<script lang="ts" setup>

const filteredSlides = (item) => {
  const hasPaisagem = item.album.some(slide => slide.format === 'paisagem');
  let slides = item.album.filter(slide => 
    slide.format === (hasPaisagem ? 'paisagem' : 'retrato') && slide.canBeThumb === true
  );

  slides = slides.slice(0, 2);
  return slides;
}

const {
  data: ensaiosList
} = await useAsyncData(() => {
  return queryCollection('works').all();
});

const ensaiosData = Array.isArray(ensaiosList.value) ? ensaiosList.value.map(item => {
  return {
    ...item.body,
    photos: filteredSlides(item.body),
    path: item.path
  };
}) : [];

const classes = ['card card-column', 'card side-by-side', 'wide side-by-side reverse'];
</script>

<template>
  <div class="container">
    <h1 class="big-title red centered">
      <span class="box">
        <span>Explore meus</span>
      </span>
      <span class="big">Últimos trabalhos</span>
    </h1>

    <div class="wrap-portfolio">
      <template v-for="(item, index) in ensaiosData">
        <div :class="'thumb thumb-' + classes[index]">
          <div v-if="index == 2" class="wrap-wide">
            <div class="wrap-info">
              <div class="wrap-text">
                <h2 class="title">
                  {{ item.title }}
                </h2>

                <ul class="info-list">
                  <li class="category">
                    <NuxtLink
                      :to="'/trabalhos/' + item.category">
                        <span>{{ item.category }}</span>
                    </NuxtLink>
                  </li>
                  <li class="place">
                    <nuxt-icon
                      name="location-pin-solid"
                      class="icon icon-location-pin"/>
                    <span v-html="item.local"></span>
                  </li>
                </ul>

                <div class="description" v-html="item.description"></div>
              </div>

              <NuxtLink
                :to="item.path"
                class="btn btn-green-light">
                  <span>Ver mais</span>
              </NuxtLink>
            </div>

            <Swiper
              :loop="true"
              :slides-per-view="1">
              <SwiperSlide
                v-for="slide in item.photos"
                :class="'wrap-img ' + slide.format">
                <nuxt-img
                  :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + slide.uri + "/thumb"'
                  :width="(slide.format=='paisagem') ? 700 : 500"
                  :height="(slide.format=='paisagem') ? 500 : 800"
                  class="img-thumb"
                  loading="lazy"/>
                <nuxt-img
                  v-if="slide.format=='retrato'"
                  :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + slide.uri + "/thumb"'
                  width="700"
                  height="500"
                  class="bg-thumb"
                  :modifiers="{blur: 10}"
                  loading="lazy"/>
              </SwiperSlide>

              <BlocksSwiperControls v-if="item.photos.length > 1" />
            </Swiper>
          </div>

          <template v-if="index != 2">
            <Swiper
              :loop="true"
              :slides-per-view="1">
              <SwiperSlide
                v-for="slide in item.photos"
                :key="slide.id"
                :class="'wrap-img ' + slide.format">
                <nuxt-img
                  :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + slide.uri + "/thumb"'
                  :width="(slide.format=='paisagem') ? 700 : 500"
                  :height="(slide.format=='paisagem') ? 500 : 800"
                  class="img-thumb"
                  loading="lazy"/>
                <nuxt-img
                  v-if="slide.format=='retrato'"
                  :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + slide.uri + "/thumb"'
                  width="700"
                  height="500"
                  class="bg-thumb"
                  :modifiers="{blur: 10}"
                  loading="lazy"/>
              </SwiperSlide>

              <BlocksSwiperControls v-if="item.photos.length > 1" />
            </Swiper>

            <div class="wrap-info">
              <div class="wrap-text">
                <h2 class="title">
                  {{ item.title }}
                </h2>

                <ul class="info-list">
                  <li class="category">
                    <NuxtLink
                      :to="'/trabalhos/' + item.category">
                        <span>{{ item.category }}</span>
                    </NuxtLink>
                  </li>
                  <li class="place">
                    <nuxt-icon
                      name="location-pin-solid"
                      class="icon icon-location-pin"/>
                    <span v-html="item.local"></span>
                  </li>
                </ul>

                <div class="description" v-html="item.description"></div>
              </div>

              <NuxtLink
                :to="item.path"
                class="btn btn-green-light">
                  <span>Ver mais</span>
              </NuxtLink>
            </div>
          </template>

          <template v-if="index == 2">
            <NuxtLink
              class="link-see-more big-title red"
              :to="'/trabalhos/'">
                  <span class="big">veja todos os Trabalhos</span>
                  <span class="box">
                    <span>Clique aqui</span>
                  </span>
            </NuxtLink>
          </template>
        </div>

        <template v-if="index == 1">
          <NuxtLink
            class="btn-agende btn-agende-01"
            :to="'/agende-seu-ensaio/'">
              <span>Agende seu ensaio</span>
          </NuxtLink>

          <NuxtLink
            class="btn-agende btn-agende-02"
            :to="'/agende-seu-ensaio/'">
              <span>Agende seu ensaio</span>
          </NuxtLink>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .big-title {
    margin-bottom: -8rem;
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
      }

      &.btn-agende-01 {
        width: calc(16% - 15rem);

        @include m.min(md) {
          width: calc(10% - 15rem);
        }
      }

      &.btn-agende-02 {
        width: calc(8% - 15rem);
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

      .wrap-info {
        padding-bottom: 50rem;
        padding-top: 20rem;
        color: v.$dark-red;

        .title {
          font-size: 23rem;
        }

        .btn {
          position: absolute;
          bottom: -7rem;
          right: 0;
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

        &.side-by-side {
          .swiper {
            aspect-ratio: 1/1.3;
            flex-shrink: 0;
            width: 60%;
          }
        }
      }

      &.card-column {
        flex-direction: column;
        display: flex;
      }

      &.side-by-side {
        display: flex;

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
        flex-wrap: wrap;
        padding: 0;

        .swiper {
          aspect-ratio: 2/1;
          width: calc(65% - 6rem);
          flex-shrink: 0;
        }

        &.reverse {
          .wrap-wide {
            background: white;
            padding: 30rem;
            flex-shrink: 0;
            display: flex;
            width: 100%;
          }

          .wrap-info {
            margin-right: 20rem;
            width: calc(34%);
            padding-left: 0;
            padding-top: 0;
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

            @include m.max(md) {
              justify-content: center;
              font-size: 30rem;
              width: 214rem;
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

        &.paisagem {
          aspect-ratio: 600/400;
        }
      }
    }
  }
</style>