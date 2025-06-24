
<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: {}
  }
});

const route = useRoute();
const workPage = '/' + (route.path.split('/')[1] || '');

let highlight = props.data.album
  .map((item, index) => ({
    ...item,
    index
  }))
  .filter(item => item.highlight);

if (highlight.length === 0 && props.data.image) {
  highlight = [{
    ...props.data.image,
    index: 0
  }];
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};
</script>

<template>
  <div class="wrap-hero">
    <div class="text">
      <nav aria-label="breadcrumb">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink :to="workPage">{{ workPage.replace(/\//g, '').replace(/-/g, ' ') }}</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink :to="workPage + `/${data.category.slug}`">{{ data.category.title }}</NuxtLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ data.title }}</li>
        </ul>
      </nav>

      <div class="about-text text-slide">
        <h1 class="title" v-html="data.title"></h1>
        <div class="description" v-html="data.description"></div>
      </div>

      <BlocksTestimonial
        v-if="data.testimonial"
        :name="data.title"
        :testimonial="data.testimonial" />

      <div class="about-ctas">
        <ul class="info-list">
          <li class="category">
            <h2>
              <nuxt-icon
                name="category"
                class="icon icon-category"/>
              <span>Categoria:</span>
            </h2>

            <NuxtLink
              :to="workPage + '/' + data.category.slug">
              <span class="list-item-text">{{ data.category.title }}</span>
            </NuxtLink>
          </li>

          <li class="time" v-if="data.date">
            <h2>
              <nuxt-icon
                name="calendar-regular"
                class="icon icon-calendar"/>
              <span>Data:</span>
            </h2>
            <time :datetime="data.date" class="list-item-text">{{ formatDate(data.date) }}</time>
          </li>

          <li class="place" v-if="data.local">
            <h2>
              <nuxt-icon
                name="location-pin-solid"
                class="icon icon-location-pin"/>
              <span>Local:</span>
            </h2>
            <span class="list-item-text" v-html="data.local"></span>
          </li>

          <li class="site" v-if="data.site">
            <h2>
              <nuxt-icon
                name="external-link"
                class="icon icon-external-link"/>
              <span>Site:</span>
            </h2>
            <a
              class="list-item-text"
              :href="data.site"
              target="_blank">Cliquei aqui para acessar</a>
          </li>

          <li class="site" v-if="data.instagram">
            <h2>
              <nuxt-icon
                name="instagram"
                class="icon icon-instagram"/>
              <span>Instagram:</span>
            </h2>

            <a
              class="list-item-text"
              target="_blank"
              :href='data.instagram.uri'>
              {{ data.instagram.title }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div :class="{'has-two': highlight[1], 'has-video': data.video}" class="wrap-img-hero">
      <div class="video" v-if="data.video" v-html="data.video"></div>

      <nuxt-img
          provider="cloudflare"
          :src='"https://images.fotografalilliatavares.com.br/images/" + highlight[0].imageId + "/public"'
          :width="highlight[0].width"
          :height="highlight[0].height"
          :alt="highlight[0].alt"
          placeholder
          @click="() => showImg(highlight[0].index)"
          fetchpriority="high"/>
      <nuxt-img
        v-if="highlight[1]"
          provider="cloudflare"
          :src='"https://images.fotografalilliatavares.com.br/images/" + highlight[1].imageId + "/public"'
          :width="highlight[1].width"
          :height="highlight[1].height"
          :alt="highlight[1].alt"
          placeholder
          @click="() => showImg(highlight[1].index)"
          fetchpriority="high"/>
    </div>
  </div>
</template>

<style lang="scss">
nav[aria-label="breadcrumb"] {
  height: 100%;

  .breadcrumb {
    padding: 0 0 0 35rem;
    flex-wrap: wrap;
    z-index: 3;

    .breadcrumb-item {
      text-transform: capitalize;
    }
  }
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

    img {
      object-fit: cover;
      height: auto;
      width: 100%;
    }

    .video iframe {
      height: 100%;
      width: 100%;
      border: 0;
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

    &.has-video {
      .video,
      img {
        object-fit: cover;
        flex-shrink: 0;
        width: 50%;

        @include m.max(sm) {
          width: 100%;
        }
      }

      img {
        width: 54.3%;
      }

      .video {
        width: 45.7%;
      }
    }
  }

  .title {
    font-family: v.$openExtra;
    padding-bottom: 1px;
  }

  .text {
    color: var(--color-highlight, v.$dark-green);
    justify-content: space-between;
    flex-direction: column;
    background: white;
    padding-top: 30rem;
    display: flex;
    width: 45%;

    @include m.max(sm) {
      width: 100%;
    }
  }

  .about-text {
    padding: 30rem v.$space 20rem;

    @include m.max(sm) {
      padding-top: 20rem;
    }

    a {
      text-decoration: underline;
    }

    .description {
      padding-top: 0;

      @include m.max(sm) {
        line-height: 1.3em;
        font-size: 19rem;
      }

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

        @include m.max(sm) {
          padding-top: 0;
        }
      }

      .description {
        padding-bottom: 20rem;

        @include m.max(sm) {
          padding-bottom: 0;
        }

        p {
          padding-top: 0 !important;
        }
      }
    }
  }

  .about-ctas {
    background: var(--color-highlight, v.$dark-green);
    padding: 20rem v.$space;
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
</style>
