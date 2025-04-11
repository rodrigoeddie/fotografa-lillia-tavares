<script setup lang="ts">
const path = useRoute().path

const { data: work } = await useAsyncData(path, () => {
  return queryCollection('works').path(path).first()
});

const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('works');
});

const workPage  = navigation.value[0].path;
const highlight = work.value.album
                    .map((item, index) => ({
                      ...item,
                      index
                    }))
                    .filter(item => item.highlight);

const album     = work.value.album
                    .map((item, index) => ({
                      ...item,
                      index
                    }))
                    .filter(item => !item.highlight)
                    ;
const title     = work.value.title + ' | Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';

const siteURI = 'https://fotografalilliatavares.com.br';

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
    name: title,
    url: siteURI + path,
  }),
  defineImage({
    '@type': 'ImageObject',
    name: work.value.title,
    description: work.value.description,
    author: {
      '@type': 'Person',
      name: 'Fotógrafa Lillia Tavares',
    },
    datePublished: work.value.date,
    contentUrl: album.map(item => `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${item.imageId}/${item.format}`),
    url: 'https://fotografalilliatavares.com.br' + path,
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteURI
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ensaios Fotográficos',
        item: siteURI + '/ensaio-fotografico'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: work.value.category.title,
        item: siteURI + '/ensaio-fotografico/' + work.value.category.slug
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: work.value.title,
        item: siteURI + path
      }
    ]
  })
]);

useSeoMeta({
  title: title,
  description: work.value.description
});

const visibleRef = ref(false);
const indexRef = ref(0);
const imgs = ref([]);

work.value.album.map(item => {
  imgs.value.push({
    src: `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${item.imageId}/${item.format}`,
    title: "",
  });
});

const showImg = (index) => {
  console.log(index);
  indexRef.value = index;
  visibleRef.value = true;
};

const onHide = () => (visibleRef.value = false);
</script>
<template>
  <div class="container no-padding" :style="{ '--color-highlight': work.colorHighlight }">
    <div class="wrap-hero">
      <nav aria-label="breadcrumb">
        <ul class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink to="/ensaio-fotografico">Trabalhos</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink :to="`/ensaio-fotografico/${work.category.slug}`">{{ work.category.title }}</NuxtLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">{{ work.title }}</li>
        </ul>
      </nav>

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

              <NuxtLink
                :to="workPage + '/' + work.category.slug">
                <span class="list-item-text">{{ work.category.title }}</span>
              </NuxtLink>
            </li>

            <li class="place">
              <h2>
                <nuxt-icon
                  name="location-pin-solid"
                  class="icon icon-location-pin"/>
                <span>Local do Ensaio:</span>
              </h2>
              <span class="list-item-text" v-html="work.local"></span>
            </li>

            <li class="site" v-if="work.site">
              <h2>
                <nuxt-icon
                  name="external-link"
                  class="icon icon-external-link"/>
                <span>Site:</span>
              </h2>
              <a
                class="list-item-text"
                :href="work.site"
                target="_blank">Cliquei aqui para acessar</a>
            </li>

            <li class="site" v-if="work.instagram">
              <h2>
                <nuxt-icon
                  name="instagram"
                  class="icon icon-instagram"/>
                <span>Instagram:</span>
              </h2>

              <a
                class="list-item-text"
                target="_blank"
                :href='work.instagram.uri'>
                {{ work.instagram.title }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div :class="{'has-two': highlight[1]}" class="wrap-img-hero">
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

    <div class="portfolio-images">
      <template v-for="item in album">
        <nuxt-img
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/" + item.imageId + "/public"'
            :sizes="'100vw md:50vw lg:' + item.width + 'px'"
            :width="item.width"
            :height="item.height"
            :alt="item.alt"
            :class="[item.format, item.customClass]"
            placeholder
            @click="() => showImg(item.index)"
            loading="lazy"/>
      </template>

      <div class="empty"></div>
      <div class="empty"></div>
    </div>

    <SectionsScheduleCustom />

    <VueEasyLightbox
      :visible="visibleRef"
      :imgs="imgs"
      :index="indexRef"
      :rotateDisabled="true"
      :zoomDisabled="true"
      @hide="onHide"
    />
  </div>
</template>

<style lang="scss">
nav[aria-label="breadcrumb"] {
  position: absolute;
  top: 160rem;

  @include m.max(sm) {
    top: 110rem;
  }

  .breadcrumb {
    padding: 0 0 0 35rem;
    z-index: 3;
  }
}

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

    img {
      height: auto;
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
    color: var(--color-highlight, v.$dark-green);
    justify-content: flex-end;
    flex-direction: column;
    background: white;
    display: flex;
    width: 45%;

    @include m.max(sm) {
      width: 100%;
    }

    @media (prefers-color-scheme: dark) {
      // background: v.$dark-green;
      background: var(--color-highlight, v.$dark-green);
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

    @media (prefers-color-scheme: dark) {
      background: white;
    }

    .info-list {
      font-size: 18rem;
      flex-wrap: wrap;
      color: white;
      display: flex;
      width: 100%;
      gap: 20rem;

      @media (prefers-color-scheme: dark) {
        color: var(--color-highlight, v.$dark-green);
      }

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
    height: auto;
  }

  .paisagem {
    &.w50 {
      width: 50%;

      @include m.max(sm) {
        width: 100%;
      }
    }
  }

  .retrato {
    width: 33.3%;

    &.w50 {
      width: 50%;

      @include m.max(sm) {
        width: 100%;
      }
    }

    &.w25 {
      width: 25%;

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
