<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;
    const containerRef = ref(null);
    const visibleRef = ref(false);
    const indexRef = ref(0);
    const imgs = [
        {
            src: configPublic.cloudflareURI + "5521a1b8-36d3-4c93-b93b-f2bf8c6be200/retrato",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "993be2e4-4a5a-498c-8957-43909448c300/retrato",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "f6d249c4-f1bb-40db-7264-09ca91888d00/retrato",
            title: ""
        },
        {
            src: configPublic.cloudflareURI + "e565d57c-cc18-40a3-ffcc-3eeba2da3100/retrato",
            title: ""
        },
    ];

    const showImg = (index) => {
        indexRef.value = index;
        visibleRef.value = true;
    };

    const onHide = () => (visibleRef.value = false);

    const swiper = useSwiper(containerRef);
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

    <ClientOnly>
        <swiper-container
          class="wrap-bgs"
          ref="containerRef"
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
        }"
        :pagination="{
            clickable: true,
        }"
        :navigation="true">
            <swiper-slide class="item bg-blue">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "5521a1b8-36d3-4c93-b93b-f2bf8c6be200/retrato"'
                  width="300"
                  height="420"
                  class="img-fundo"
                  alt="Exemplo de fundo fotográfico na cor branca"
                  @click="() => showImg(0)"
                  loading="lazy" />
            </swiper-slide>
            <swiper-slide class="item bg-beige">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "993be2e4-4a5a-498c-8957-43909448c300/retrato"'
                  width="300"
                  height="420"
                  class="img-fundo"
                  alt="Exemplo de fundo fotográfico na cor branca"
                  @click="() => showImg(1)"
                  loading="lazy" />
            </swiper-slide>
            <swiper-slide class="item bg-gray">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "f6d249c4-f1bb-40db-7264-09ca91888d00/retrato"'
                  width="300"
                  height="420"
                  class="img-fundo"
                  alt="Exemplo de fundo fotográfico na cor branca"
                  @click="() => showImg(2)"
                  loading="lazy" />
            </swiper-slide>
            <swiper-slide class="item bg-white">
                <nuxt-img
                  :src='configPublic.cloudflareURI + "e565d57c-cc18-40a3-ffcc-3eeba2da3100/retrato"'
                  width="300"
                  height="420"
                  class="img-fundo"
                  alt="Exemplo de fundo fotográfico na cor branca"
                  @click="() => showImg(3)"
                  loading="lazy" />
            </swiper-slide>
        </swiper-container>
    </ClientOnly>

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

<style scoped lang="scss">
$blue:  #111d2c;
$beige: #b99879;
$gray:  #241f21;
$white: #e4e1e5;

.img-fundo {
    cursor: zoom-in;
}

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

            @media (prefers-color-scheme: dark) {
                color: white;
            }
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
    padding-top: 50rem;
    margin-top: 50rem;
    background: white;

    @media (prefers-color-scheme: dark) {
        background: v.$red;
    }
}

.wrap-bgs {
    justify-content: center;
    margin: 0 auto;
    display: flex;
    width: 90%;

    @include m.max(xs) {
        padding-bottom: 30rem;
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
        margin-bottom: 100rem;
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