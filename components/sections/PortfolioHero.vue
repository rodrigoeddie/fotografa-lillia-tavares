<script setup lang="ts">
const photos = [
  {
    "uri": '60ddc9c8-058d-441e-1608-ca6109de1200',
    "alt": 'Mulher sorrindo de roupa branca, sentada no chão',
    "path": 'trabalhos/andresa-maia',
    "title": '<a href="https://www.instagram.com/dre_terapeuta/" target="_blank">Andresa Maia</a>',
    "description": 'Psicanálise, Terapias energéticas e espirituais',
  },
  {
    "uri": '35b38c8d-3080-48f5-35bb-766c7c1add00',
    "alt": 'Mulher negra de cabelos longos sorrindo e com o celular nas mãos',
    "path": 'trabalhos/karoline-siqueira',
    "title": '<a href="https://www.instagram.com/salviacomunicacao/" target="_blank">Karoline Siqueira</a>',
    "description": 'Serviços de estratégia e marketing digital',
  },
];
</script>

<template>
  <div class="container no-padding">
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
    </div>

    <Swiper
      :loop="true"
      :slides-per-view="1">
      <SwiperSlide
        v-for="slide in photos"
        class="wrap-hero">
        <div class="text">
          <div class="about-text text-slide">
            <h2 class="title" v-html="slide.title"></h2>
            <div class="description">
              <p>
                {{ slide.description }}
              </p>
            </div>
          </div>

          <div class="about-ctas">
            <NuxtLink
              :to="slide.path"
              class="btn btn-green-light">
                <span>Ver mais</span>
            </NuxtLink>

            <BlocksSwiperControls v-if="photos.length > 1" />
          </div>
        </div>

        <nuxt-img
          :src='"https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/" + slide.uri + "/public"'
          width="1920"
          class="img-hero"
          loading="lazy"/>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped lang="scss">
.intro-hero {
  background: white;
  position: absolute;
  width: 45%;
  z-index: 2;
  top: 0;

  @media (prefers-color-scheme: dark) {
    background: v.$dark-green;
  }

  @include m.max(sm) {
    position: static;
    width: 100%;
  }
}

.intro-hero,
.wrap-hero {
  display: flex;

  @include m.max(sm) {
    flex-direction: column-reverse;
  }

  .text {
    justify-content: flex-end;
    flex-direction: column;
    background: white;
    flex-shrink: 0;
    display: flex;
    width: 45%;

    @include m.max(sm) {
      width: 100%;
    }

    @media (prefers-color-scheme: dark) {
      background: v.$dark-green;
    }
  }

  .about-text {
    padding: 180rem v.$space v.$space;

    @include m.max(sm) {
      padding-top: 80px;
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
      }

      .description {
        padding-bottom: 20rem;
        margin-bottom: -35rem;

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
  }

  .img-hero {
    width: 55%;

    @include m.max(sm) {
      width: 100%;
    }
  }
}

.wrap-hero {
  @include m.max(sm) {
    display: none;
  }
}
</style>
