
<script setup lang="ts">
  const $route      = useRoute();
  const currentPath = $route.path;
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
          :to="currentPath === '/estudio' ? '/agende-seu-ensaio' : '/estudio'"
          class="btn btn-red">
            <span>{{ currentPath === '/estudio' ? 'Agende Seu Ensaio' : 'Ver mais' }}</span>
        </NuxtLink>
      </div>

      <div class="side wrap-images">
          <nuxt-img
              src='assets/images/cenario-intimista-e-casual-do-estudio-fotografa-lillia-tavares.png'
              width="1280"
              height="853"
              class="img-studio"
              format="webp"
              quality="85"
              loading="lazy"/>
          <nuxt-img
              src='assets/images/cantinho-do-cafe-do-estudio-fotografa-lillia-tavares.png'
              width="1280"
              height="853"
              class="img-studio"
              format="webp"
              quality="85"
              loading="lazy"/>
          <nuxt-img
              src='assets/images/escritorio-e-cenario-do-estudio-fotografa-lillia-tavares.png'
              width="1280"
              height="853"
              class="img-studio"
              format="webp"
              quality="85"
              loading="lazy"/>
          <nuxt-img
              src='assets/images/fundo-fotografico-do-estudio-fotografa-lillia-tavares.png'
              width="1280"
              height="853"
              class="img-studio"
              format="webp"
              quality="85"
              loading="lazy"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper {
    overflow: hidden;

    &.from-page-studio {
      .container {
        background: white;
      }
    }

    .wrap-inner {
      @include m.max(md) {
        flex-wrap: wrap;
      }
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
          top: 0;
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

      @include m.max(md) {
        align-items: flex-start;
        width: 50%;
      }

      .big-title {
        padding-bottom: 30rem;
        padding-top: 0;

        @include m.max(md) {
          padding-bottom: 10rem;
        }
      }

      .title {
        font-size: 45rem;
      }

      .description {
        line-height: 1.3em;
        font-size: 26rem;

        @include m.max(md) {
          font-size: 19rem;
        }
      }

      .btn {
        margin-top: 60rem;
        float: right;

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

      @include m.max(md) {
        width: 50%;
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
      }

      img {
        height: auto;
        width: calc(50% - 3px);
      }
    }
  }
</style>
