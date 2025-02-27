
<script setup lang="ts">
  const $route       = useRoute();
  const currentPath  = $route.path;
  const configPublic = useRuntimeConfig().public;

  const visibleRef = ref(false);
  const indexRef = ref(0);
  const imgs = [
    {
      src: configPublic.cloudflareURI + "a4ac25f9-9b44-43be-803f-601c72f14600/thumb",
      title: ""
    },
    {
      src: configPublic.cloudflareURI + "45bb3714-18c8-4b40-f986-5b0074589c00/thumb",
      title: ""
    },
    {
      src: configPublic.cloudflareURI + "1a88f2d4-10c6-4c91-96a3-9ff4ac42fc00/thumb",
      title: ""
    },
    {
      src: configPublic.cloudflareURI + "c9f3cea1-c80c-4822-f585-144615c7ec00/thumb",
      title: ""
    },
  ];

  const showImg = (index) => {
    indexRef.value = index;
    visibleRef.value = true;
  };

  const onHide = () => (visibleRef.value = false);
</script>

<template>
  <div class="wrapper">
    <div class="wrap-inner row container">
      <div class="side side-text">
        <h1 class="big-title green">
          <span class="box">
            <span>Sobre o</span>
          </span>
          <span class="big">Estúdio</span>
        </h1>
        <p class="description green">
          O estúdio está localizado em <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank" class="highlight light">Mogi das cruzes</a>, no coração da cidade, com ótimas opções para estacionamento e transportes.
        </p>

        <p class="description green">
          Oferecemos <span class="highlight light">7 cenários</span> modernos e sofisticados, com fundo infinito fotográfico de <span class="highlight light">várias cores</span>, possibilitando diversas opções para seu ensaio.
        </p>

        <NuxtLink
          :to="currentPath === '/estudio' ? '/preco-ensaio-fotografico' : '/estudio'"
          class="btn btn-red">
            <span>{{ currentPath === '/estudio' ? 'Agende Seu Ensaio' : 'Ver mais' }}</span>
        </NuxtLink>
      </div>

      <Swiper
        class="side wrap-images"
        :class="{'is-studio': currentPath === '/estudio'}"
        :loop="true"
        :slides-per-view="1"
        :breakpoints="{
          450: {
              slidesPerView: 2
          },
          1024: {
              slidesPerView: 4
          },
        }">
          <SwiperSlide class="item">
            <nuxt-img
                :src='configPublic.cloudflareURI + "a4ac25f9-9b44-43be-803f-601c72f14600/thumb"'
                width="612"
                height="408"
                @click="() => showImg(0)"
                class="img-studio"
                alt="Foto de um comodo com a cortina iluminada de fundo, da esquerda pra direita: um abajour, a cama, e um cofá"
                loading="lazy" />
          </SwiperSlide>

          <SwiperSlide class="item">
            <nuxt-img
              :src='configPublic.cloudflareURI + "45bb3714-18c8-4b40-f986-5b0074589c00/thumb"'
              width="612"
              height="408"
              @click="() => showImg(1)"
              class="img-studio"
              alt="Um canto do café, com xicaras e canecas, e várias cápsulas de Dolce Gusto"
              loading="lazy" />
          </SwiperSlide>

          <SwiperSlide class="item">
            <nuxt-img
              :src='configPublic.cloudflareURI + "1a88f2d4-10c6-4c91-96a3-9ff4ac42fc00/thumb"'
              width="612"
              height="408"
              @click="() => showImg(2)"
              class="img-studio"
              alt="O escritório, uma parede verde musgo de fundo com quadros, na esquerda um sofá, no centro a mesa, e uma estante na direita"
              loading="lazy" />
          </SwiperSlide>

          <SwiperSlide class="item">
            <nuxt-img
              :src='configPublic.cloudflareURI + "c9f3cea1-c80c-4822-f585-144615c7ec00/thumb"'
              width="612"
              height="408"
              @click="() => showImg(3)"
              class="img-studio"
              alt="O fundo infinito do estúdio, há 3 rolos de cores de fundo (branco, bege, e azul)"
              loading="lazy" />
          </SwiperSlide>

          <BlocksSwiperControls class="centered studio-controls" />
      </Swiper>
    </div>

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
.wrap-images .swiper-wrapper {
  flex-wrap: wrap;
  display: flex;
  gap: 6px;

  @include m.max(md) {
    flex-wrap: nowrap;
    gap: 0;
  }
}
</style>

<style scoped lang="scss">
  @use "sass:color";
  @mixin faux-bold($color: black) {
    $darker-color: color.adjust($color, $lightness: 30%);

    text-shadow:
      0.5px 0 $darker-color,
      -0.5px 0 $darker-color,
      0 0.5px $darker-color,
      0 -0.5px $darker-color,
      0.5px 0.5px $darker-color,
      -0.5px -0.5px $darker-color,
      0.5px -0.5px $darker-color,
      -0.5px 0.5px $darker-color;
  }

  .wrapper {
    overflow: hidden;

    .studio-controls {
      @include m.max(sm) {
        bottom: 10rem;
      }
    }

    &.from-page-studio {
      @include m.max(md) {
        background: white;
        padding-top: 80px;
      }

      @media (prefers-color-scheme: dark) and (max-width: 1023px) {
        background: v.$dark-green;
      }

      .container {
        background: white;

        @media (prefers-color-scheme: dark) {
          background: transparent;
        }
      }

      .side-text {
        padding-bottom: 0;

        @include m.max(md) {
          padding-bottom: 30px;
        }
      }
    }

    .wrap-inner {
      flex-wrap: wrap;
      // @include m.max(md) {
      //   flex-wrap: wrap;
      // }
    }

    &.from-home-studio {
      @include m.min(md) {
        &:before {
          content: '';

          background: white;
          position: absolute;
          display: block;
          width: 100vw;
          left: 50vw;
          bottom: 0;
          top: -1px;
        }
      }

      @media (prefers-color-scheme: dark) and (min-width: 1024px) {
        &:before {
          background-image:  linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, v.$dark-red 1px);
          // background: v.$dark-red;
        }
      }

      @include m.min(md) {
        &:after {
          content: '';

          background-image:  linear-gradient(#7B785B 1px, transparent 1px), linear-gradient(to right, #7B785B 1px, #ffffff 1px);
          background-color: #ffffff;
          background-size: 20px 20px;
          position: absolute;
          opacity: 0.05;
          width: 100vw;
          left: 50vw;
          bottom: 0;
          top: 0;
        }
      }

      @media (prefers-color-scheme: dark) and (min-width: 1024px) {
        &:after {
          background-image:  linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, v.$dark-green 1px);
          // background: v.$dark-green;
        }
      }

      // .container {
      //   width: 1890rem;
      // }
    }

    .side-text {
      padding: 6px 0 35rem 35rem;
      justify-content: flex-end;
      flex-direction: column;
      padding-right: 30rem;
      display: flex;
      width: 32%;

      @include m.max(lg) {
        width: 45%;
      }

      @include m.max(md) {
        align-items: flex-start;
        width: 100%;
      }

      .big-title {
        padding-bottom: 30rem;
        padding-top: 0;

        @include m.max(lg) {
          padding-bottom: 0;
        }

        @include m.max(md) {
          padding-bottom: 10rem;
        }

        .big {
          @media (prefers-color-scheme: dark) and (max-width: 1024px) {
              @include faux-bold(v.$dark-green);
              color: white;
          }
        }

        .box {
          @media (prefers-color-scheme: dark) and (max-width: 1024px) {
            background: white;
            color: v.$dark-green;
            @include faux-bold(white);
          }
        }
      }

      .title {
        font-size: 45rem;
      }

      .description {
        line-height: 1.3em;
        font-size: 26rem;

        @include m.max(md) {
          font-size: 16px;
        }

        @media (prefers-color-scheme: dark) and (max-width: 1024px) {
          color: white;
        }
      }

      .btn {
        margin-top: 60rem;
        float: right;

        @include m.max(lg) {
          margin-top: 20px;
        }

        @include m.max(md) {
          display: inline-flex;
          margin-top: 30rem;
        }
      }
    }

    .wrap-images {
      padding: 6px 6px 0 6px;
      background: white;
      flex-wrap: wrap;
      width: 1242rem;
      flex-shrink: 0;
      display: flex;
      z-index: 3;
      gap: 6px;

      @include m.max(lg) {
        width: 55%;
      }

      &.is-studio {
        padding: 6px;
      }

      @include m.max(sm) {
        padding-bottom: 75rem !important;
      }

      @media (prefers-color-scheme: dark) {
        background:  v.$dark-red;
      }

      @include m.max(md) {
        width: 100%;
      }

      &:before {
        content: '';

        background-image:  linear-gradient(#7B785B 1px, transparent 1px), linear-gradient(to right, #7B785B 1px, #ffffff 1px);
        background-color: #ffffff;
        background-size: 20px 20px;
        position: absolute;
        opacity: 0.05;
        bottom: 0;
        right: 0;
        left: 0;
        top: 0;

        @media (prefers-color-scheme: dark) {
          background-image:  linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, v.$dark-red 1px);
        }
      }

      .item {
        height: auto;
        width: calc(50% - 3px) !important;

        @include m.max(md) {
          width: 50% !important;
        }

        @media (max-width: 450px) {
          width: 100% !important;
        }

        .img-studio {
          display: block;
          height: auto;
          width: 100%;
        }
      }
    }
  }
</style>
