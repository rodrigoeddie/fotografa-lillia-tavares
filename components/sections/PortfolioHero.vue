<script setup lang="ts">
const { isMobile } = useDevice();

const configPublic = useRuntimeConfig().public;
const photos = [
  {
    "colorHighlight": "#975a35",
    "imageId": '60ddc9c8-058d-441e-1608-ca6109de1200',
    "alt": 'Mulher sorrindo de roupa branca, sentada no chão',
    "path": '/ensaio-fotografico/corporativo/andresa-maia',
    "title": 'Andresa Maia',
    "description": 'Psicanálise, Terapias energéticas e espirituais',
  },
  {
    "colorHighlight": "#455754",
    "imageId": '35b38c8d-3080-48f5-35bb-766c7c1add00',
    "alt": 'Mulher negra de cabelos longos sorrindo e com o celular nas mãos',
    "path": '/ensaio-fotografico/corporativo/karoline-siqueira',
    "title": 'Karoline Siqueira',
    "description": 'Serviços de estratégia e marketing digital',
  },
];

const { data: navigation } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('works');
});

const categories = await Promise.all(
  navigation.value[0].children.map(async (category) => {
    const path = category.children[1]?.path;

    if (path) {
      const pageData = await queryCollection('works').path(path).first();

      const paisagemSlides = pageData.album
        .filter(slide => slide.format === 'paisagem' && slide.canBeThumb === true)
        .slice(0, 1);

      category.image = paisagemSlides[0];
    }

    return category;
  })
);
</script>

<template>
  <div>
    <div class="container no-padding sbs">
      <div class="intro-hero">
        <div class="about-text">
          <h1 class="title">Trabalhos</h1>
          <div class="description">
            <p>
              Com o espaço acolhedor do <NuxtLink to="/estudio">estúdio em Mogi das Cruzes</NuxtLink>, e a sensibilidade da <NuxtLink to="/sobre">fotógrafa Lillia Tavares</NuxtLink>, cada ensaio se torna uma experiência única, conheça meu trabalho.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="category-ctas">
      <nav class="menu-category">
        <NuxtLink
          to="/ensaio-fotografico"
          class="link-category link-category-all"
          :class="{'mobile': isMobile, 'desktop': !isMobile}">
          <h2 class="category-label">Todas as categorias</h2>
        </NuxtLink>

        <template v-for="item in categories">
          <NuxtLink
            :to="item.path"
            class="link-category"
            :class="{'mobile': isMobile, 'desktop': !isMobile}">
            <span class="category-label">{{ item.title }}</span>
            <nuxt-img
              provider="cloudflare"
              :src='"https://images.fotografalilliatavares.com.br/images/" + item.image.imageId + "/public"'
              :width="'405'"
              :height="'270'"
              class="thumb-category"
              fetchpriority="high"
              placeholder
              :alt="item.image.alt"
              loading="lazy"/>
          </NuxtLink>
        </template>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  background: white;

  &.sbs {
    display: flex;

    @include m.max(sm) {
      flex-direction: column;
    }
  }
}

.intro-hero {
  justify-content: space-between;
  flex-direction: column;
  background: white;
  display: flex;
  width: 100%;

  @include m.max(sm) {
    position: static;
    width: 100%;
  }

  .text {
    justify-content: flex-end;
    flex-direction: column;
    background: white;
    position: absolute;
    flex-shrink: 0;
    display: flex;
    width: 45%;
    bottom: 0;
    right: 0;
    top: 0;

    @include m.max(lg) {
      width: 50%;
    }

    @include m.max(sm) {
      width: 100%;
    }
  }

  .about-text {
    align-items: center;
    padding: 35rem;
    display: flex;
    gap: 20rem;
    
    @include m.max(xs) {
      align-items: flex-start;
      flex-direction: column;
      padding: 15px;
      gap: 10px
    }

    .description {
      padding-top: 0;
      line-height: 1em;

      strong,
      b {
        background: #892c1a;
        color: white;
        padding-right: 3rem;
        padding-left: 3rem;
      }
    }

    &.text-slide {
      text-align: right;

      .title,
      .description {
        background: #e3dfcb;
        padding-right: 30rem;
        text-align: center;

        // @media (prefers-color-scheme: dark) {
        //   background: v.$dark-red;
        // }
      }

      .title {
        padding-top: 20rem;

        @include m.max(lg) {
          padding-bottom: 0;
          padding-top: 10px;
        }
      }

      .description {
        padding-bottom: 20rem;
        margin-bottom: -35rem;

        @include m.max(lg) {
          padding-bottom: 10px;
        }

        p {
          padding-top: 0 !important;
        }
      }
    }
  }
}

.category-ctas {
  width: 1700rem;
  margin: 0 auto;
  max-width: 100%;
  justify-content: center;
  padding: 20rem 0;
  padding-bottom: 20rem;
  align-items: center;
  padding-top: 50rem;
  display: flex;

  @include m.max(sm) {
    padding: 20rem;
  }

  .title-category {
    color: v.$dark-green;
    font-size: 30rem;
    font-weight: 700;
    width: 100%;
    // @media (prefers-color-scheme: light) {
    // }
  }

  .btn {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;

    &:hover {
      background-color: #6d1d0b !important;
      color: white;
    }
  }

  .menu-category {
    justify-content: space-between;
    flex-wrap: wrap;
    color: white;
    display: flex;
    width: 100%;
    gap: 15rem;
  }

  .link-category {
    border: 1px solid transparent;
    transition: background .3s;
    width: calc(25% - 20rem);
    justify-content: center;
    aspect-ratio: 400/230;
    background: white;
    font-weight: 700;
    font-size: 30rem;
    overflow: hidden;
    display: flex;
    height: 100%;

    @include m.max(sm) {
      width: calc(50% - 10rem);
      font-size: 18rem;
    }

    &:before {
      content: '';

      background: linear-gradient(0deg, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 90%);
      transition: background .4s;
      position: absolute;
      // opacity: 0;
      z-index: 1;
      bottom: 0;
      right: 0;
      top: 50%;
      left: 0;
    }

    .category-label {
      padding: 0 0 20rem 0;
      transition: top .4s;
      text-align: center;
      position: absolute;
      color: black;
      bottom: 20rem;
      z-index: 2;
      right: 0;
      left: 0;
    }

    .thumb-category {
      transition: opacity .5s, transform .5s, filter .5s;
      transform: scale(1.3);
      // aspect-ratio: 400/266;
      aspect-ratio: 400/230;
      position: absolute;
      filter: blur(2px);
      object-fit: cover;
      height: 100%;
      width: 100%;
      opacity: .2;
      bottom: 0;
      right: 0;
      left: 0;
      top: 0;
    }

    &.router-link-active,
    &.desktop:hover {
      align-items: flex-end;

      &:before {
        background: linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(255, 255, 255, 0) 90%);
        opacity: 1;
      }

      .category-label {
        color: white;
      }

      .thumb-category {
        transform: scale(1);
        opacity: 1 !important;
        filter: blur(0);
      }
    }

    &.router-link-active {
      pointer-events: none;
      border-color: white;

      .thumb-category {
        opacity: .75;
      }

      &:after {
        content: '';

        background: #4b1407;
        position: absolute;
        display: block;
        height: 20rem;
        z-index: 3;
        bottom: 0;
        right: 0;
        left: 0;
      }
    }
  }
}

.wrap-highlights {
  width: 55%;

  @include m.max(sm) {
    aspect-ratio: 1.35/1;
    height: 100%;
    width: 100%;
  }

  .about-ctas {
    color: var(--color-highlight, v.$dark-green);
    position: absolute;
    bottom: 30rem;
    left: 130rem;
    z-index: 2;

    @include m.max(sm) {
      background-color: v.$dark-green;
      height: 60rem;
      left: 100rem;
      width: 100%;
      bottom: 0;
      right: 0;
    }

    .btn {
      @include m.max(sm) {
        justify-content: flex-start;
        padding-left: 25rem;
        position: absolute;
        width: 100%;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;
      }
    }
  }

  .about-highlight {
    background-color: var(--color-highlight, v.$dark-green);
    transform: rotate(-90deg);
    transform-origin: 0 0;
    padding-left: 30rem;
    padding-top: 20rem;
    position: absolute;
    color: white;
    height: 100rem;
    z-index: 2;
    top: 100%;
    bottom: 0;
    right: 0;
    left: 0;

    .description {
      padding-top: 0;

      @include m.max(sm) {
        font-size: 12px;
      }
    }

    // .btn {
    //   // color: var(--color-highlight, v.$dark-green);
    //   margin-top: 10rem;
    //   font-size: 35rem;
    //   display: none;
    // }
  }

  .img-hero {
    position: absolute;
    object-fit: cover;
    display: block;
    height: 100%;
    width: 100%;

    @include m.max(sm) {
      height: calc(100% - 60rem);
    }
  }
}
</style>
