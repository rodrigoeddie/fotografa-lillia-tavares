<script setup lang="ts">
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

const categories = navigation.value[0].children;
</script>

<template>
  <div class="container no-padding sbs">
    <div class="intro-hero">
      <div class="about-text">
        <h1 class="title">Trabalhos</h1>
        <div class="description">
          <p>
            Ao unir o espaço amplo e acolhedor do nosso estúdio, a sensibilidade artística da <strong>fotógrafa Lillia Tavares</strong> e a beleza única de cada cliente, transformamos cada ensaio em uma experiência verdadeiramente singular.
          </p>
          <p>
            Confira abaixo o resultado de alguns de nossos trabalhos!
          </p>
        </div>
      </div>

      <div class="about-ctas">
        <nav class="menu-category">
          <NuxtLink
            to="/ensaio-fotografico"
            class="link-category">
            <span class="txt">Todos</span>
          </NuxtLink>

          <template v-for="item in categories">
            <NuxtLink
              :to="item.path"
              class="link-category">
              {{ item.title }}
            </NuxtLink>
          </template>
        </nav>
      </div>
    </div>

    <ClientOnly>
      <swiper-container
        :loop="false"
        :slides-per-view="1"
        class="wrap-highlights"
        :pagination="{
          clickable: true,
        }"
        :navigation="false">
        <swiper-slide
          v-for="slide in photos">
          <div class="about-highlight" :style="{ '--color-highlight': slide.colorHighlight }">
            <div class="about-text text-slide">
              <h2 class="title">{{ slide.title }}</h2>
              <div class="description">
                <p>
                  {{ slide.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="about-ctas">
            <NuxtLink
              :to="slide.path"
              class="btn btn-green-light">
                <span>Ver mais</span>
            </NuxtLink>
          </div>

          <nuxt-img
            :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + slide.imageId + "/public"'
            width="1920"
            class="img-hero"
            loading="lazy"/>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.container {
  background: white;

  @media (prefers-color-scheme: dark) {
    background: v.$dark-green;
  }

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
  width: 45%;

  @media (prefers-color-scheme: dark) {
    background: v.$dark-green;
  }

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

    // @media (prefers-color-scheme: dark) {
    //   background: v.$dark-green;
    // }
  }

  .about-text {
    padding: 180rem v.$space v.$space;

    @include m.max(lg) {
      padding-top: 100px;
    }

    @include m.max(sm) {
      padding-top: 80px;
      background: white;
    }

    @media (prefers-color-scheme: dark) and (max-width: 900px) {
      background: v.$dark-green;
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
      text-align: right;

      .title,
      .description {
        background: #e3dfcb;
        padding-right: 30rem;
        text-align: center;

        @media (prefers-color-scheme: dark) {
          background: v.$dark-red;
        }
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

  .about-ctas {
    justify-content: center;
    padding: 20rem v.$space;
    background: #892c1a;
    align-items: center;
    height: 150rem;
    display: flex;

    @include m.max(lg) {
      height: 80rem;
    }

    @include m.max(sm) {
      padding: 20rem;
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
      display: flex;
      color: white;
      gap: 20rem;

      // @media (prefers-color-scheme: dark) {
      // }
    }

    .link-category {
      margin-left: 25rem;
      display: list-item;
      font-size: 25rem;
      list-style: disc;

      @include m.max(sm) {
        text-indent: -5rem;
        margin-left: 15rem;
        font-size: 18rem;
      }

      &.router-link-active {
        text-decoration: underline;
        font-weight: bold;
      }

      &:first-child {
        list-style: none;
        margin-left: 0;
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
