<script setup lang="ts">
const path = useRoute().path

const { data: work } = await useAsyncData(path, () => {
  return queryCollection('works').path(path).first()
})

const highlight = work.value.body.album.filter(item => item.highlight);
const album = work.value.body.album.filter(item => !item.highlight);
</script>

<template>
  <div class="container no-padding">
    <div class="wrap-hero">
      <div class="text">
        <div class="about-text text-slide">
          <h1 class="title" v-html="work.title"></h1>
          <div class="description" v-html="work.description"></div>
        </div>

        <div class="about-ctas">
          <ul class="info-list">
            <li class="category">
              <h2>
                <nuxt-icon
                  name="category"
                  class="icon icon-category"/>
                <span>Categoria:</span>
              </h2>

              <span class="list-item-text">{{ work.body.category.title }}</span>
            </li>

            <li class="place">
              <h2>
                <nuxt-icon
                  name="location-pin-solid"
                  class="icon icon-location-pin"/>
                <span>Local do Ensaio:</span>
              </h2>
              <span class="list-item-text" v-html="work.body.local"></span>
            </li>

            <li class="site">
              <h2>
                <nuxt-icon
                  name="external-link"
                  class="icon icon-external-link"/>
                <span>Site:</span>
              </h2>
              <a
                class="list-item-text"
                :href="work.body.site"
                target="_blank">Cliquei aqui para acessar</a>
            </li>

            <li class="site">
              <h2>
                <nuxt-icon
                  name="instagram"
                  class="icon icon-instagram"/>
                <span>Instagram:</span>
              </h2>
              <a
                class="list-item-text"
                :href="work.body.instagram.uri"
                target="_blank">{{ work.body.instagram.title }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div :class="{'has-two': highlight[1]}" class="wrap-img-hero">
        <nuxt-img
          :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + highlight[0].uri + "/" + highlight[0].format'
          width="1920"
          :alt="highlight[0].alt"
          loading="lazy"/>
        <nuxt-img
          v-if="highlight[1]"
          :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + highlight[1].uri + "/" + highlight[1].format'
          width="1920"
          :alt="highlight[1].alt"
          loading="lazy"/>
      </div>
    </div>

    <div class="portfolio-images">
      <template v-for="item in album">
        <nuxt-img
            :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + item.uri + "/" + item.format'
            width="1920"
            :alt="item.alt"
            :class="[item.format, item.customClass]"
            loading="lazy"/>
      </template>

      <div class="empty"></div>
      <div class="empty"></div>
    </div>
  </div>
</template>

<style lang="scss">
.empty {
  min-width: 33%;
  height: 1px;
}

.wrap-hero {
  display: flex;

  @include m.max(sm) {
    flex-direction: column;
  }

  .wrap-img-hero {
    flex-shrink: 0;
    display: flex;
    width: 55%;

    @include m.max(sm) {
      flex-direction: column;
      width: 100%;
    }

    &.has-two {
      img {
        object-fit: cover;
        flex-shrink: 0;
        width: 50%;

        @include m.max(sm) {
          width: 100%;
        }
      }
    }
  }

  .title {
    font-family: v.$openExtra;
    padding-bottom: 1px;
  }

  .text {
    justify-content: flex-end;
    flex-direction: column;
    background: white;
    display: flex;
    width: 45%;

    @include m.max(sm) {
      width: 100%;
    }

    @media (prefers-color-scheme: dark) {
      background: v.$dark-green;
      color: white
    }
  }

  .about-text {
    padding: 180rem v.$space v.$space;

    a {
      text-decoration: underline;
    }

    .description {
      padding-top: 0;

      p {
        padding-top: 15rem !important;
      }

      strong,
      b {
        background: #892c1a;
        color: white;
        padding-right: 3rem;
        padding-left: 3rem;
      }
    }

    &.text-slide {
      .title {
        padding-top: 20rem;
        padding-bottom: 30rem;
      }

      .description {
        padding-bottom: 20rem;

        p {
          padding-top: 0 !important;
        }
      }
    }
  }

  .about-ctas {
    padding: 20rem v.$space;
    background: #892c1a;
    display: flex;

    .info-list {
      font-size: 18rem;
      flex-wrap: wrap;
      color: white;
      display: flex;
      width: 100%;
      gap: 20rem;

      .nuxt-icon {
        margin-right: 10rem;
      }

      li {
        width: calc(50% - 10rem);

        h2 {
          font-weight: bold;
          font-size: 19rem;
        }

        .list-item-text {
          padding-left: 29rem;
        }
      }
    }
  }
}

.portfolio-images {
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;

  img {
    // border: 1px solid white;
    object-fit: cover;
  }

  .retrato {
    width: 33%;
    
    &.w50 {
      width: 50%;

      @include m.max(sm) {
        width: 100%;
      }
    }

    @include m.max(sm) {
      width: 100%;
    }
  }
}
</style>
