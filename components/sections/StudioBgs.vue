<script setup lang="ts">
</script>

<template>
  <div class="wrapper">
    <div class="wrap-title">
        <h1 class="big-title red centered">
            <span class="box">
                <span>Fundo Infinito</span>
            </span>

            <span class="big">fotográfico</span>
        </h1>

        <p class="description">
            Temos 4 opções de cores para harmonizar suas fotos perfeitamente com o seu estilo
        </p>
    </div>

    <Swiper
      class="wrap-bgs"
      :loop="false"
      :slides-per-view="1"
      :breakpoints="{
        450: {
            slidesPerView: 2
        },
        700: {
            slidesPerView: 3
        },
        1024: {
            slidesPerView: 4
        },
    }">
        <SwiperSlide class="item bg-blue">
            <nuxt-img
              src='/exemplo-fundo-fotografico-azul.png'
              width="300"
              height="420"
              provider="cloudflare"
              class="img-fundo"
              alt="Exemplo de fundo fotográfico na cor branca"
              loading="lazy" />
        </SwiperSlide>
        <SwiperSlide class="item bg-beige">
            <nuxt-img
              src='/exemplo-fundo-fotografico-bege.png'
              width="300"
              height="420"
              provider="cloudflare"
              class="img-fundo"
              alt="Exemplo de fundo fotográfico na cor branca"
              loading="lazy" />
        </SwiperSlide>
        <SwiperSlide class="item bg-gray">
            <nuxt-img
              src='/exemplo-fundo-fotografico-cinza.png'
              width="300"
              height="420"
              provider="cloudflare"
              class="img-fundo"
              alt="Exemplo de fundo fotográfico na cor branca"
              loading="lazy" />
        </SwiperSlide>
        <SwiperSlide class="item bg-white">
            <nuxt-img
              src='/exemplo-fundo-fotografico-branco.png'
              width="300"
              height="420"
              provider="cloudflare"
              class="img-fundo"
              alt="Exemplo de fundo fotográfico na cor branca"
              loading="lazy" />
        </SwiperSlide>

        <BlocksSwiperControls class="centered from-bgs" />
    </Swiper>
  </div>
</template>

<style scoped lang="scss">
$blue:  #111d2c;
$beige: #b99879;
$gray:  #241f21;
$white: #e4e1e5;

.wrap-title {
    justify-content: center;
    margin-bottom: -9rem;
    align-items: center;
    display: flex;

    @include m.max(sm) {
        margin-bottom: 0;
        display: block;
    }

    .big-title {
        padding-right: 20rem;
        padding-top: 0;

        @include m.max(sm) {
            padding-right: 0;
        }

        .box {
          @media (prefers-color-scheme: dark) {
            background: white;
            color: v.$red;
          }
        }

        .big {
            text-shadow: none;
            color: white;
        }
    }

    .description {
        padding-top: 0;

        @include m.max(sm) {
            padding-bottom: 10rem;
            text-align: center;
            padding-top: 5rem;
        }
    }
}

.wrapper {
    padding-bottom: 50rem;
    background: v.$red;
    padding-top: 50rem;
    margin-top: 50rem;
}

.wrap-bgs {
    justify-content: center;
    padding-bottom: 100rem;
    margin: 0 auto;
    display: flex;
    width: 90%;

    @include m.max(xs) {
        padding-bottom: 170rem;
        display: flex;
        width: 90%;
    }

    .example {
        border: 1px;
    }

    .item {
        border: 1px solid white;
        justify-content: center;
        aspect-ratio: 500/580;
        align-items: self-end;
        display: flex;
        width: 24%;

        @include m.max(xs) {
            width: 100%;
        }

        &.bg-blue {
            background: $blue;
        }
        &.bg-beige {
            background: $beige;
        }
        &.bg-gray {
            background: $gray;
        }
        &.bg-white {
            background: $white;
        }

        img {
            border: 1px solid white;
            margin-bottom: -100rem;
            aspect-ratio: 300/420;
            display: block;
            height: auto;
            width: 60%;
        }
    }
}
</style>