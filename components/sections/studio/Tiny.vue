
<script setup lang="ts">
  const props = defineProps({
    showMap: {
      type: Boolean,
      default: false
    }
  });

  const $route      = useRoute();
  const currentPath = $route.path;
  const configPublic = useRuntimeConfig().public;
</script>

<template>
  <div
    class="wrapper"
    data-ani-type="fade-up">
    <div class="wrap-inner row container">
      <div class="side side-text">
        <h1 class="big-title green">
          <span class="box">
            <span>Conheça nosso</span>
          </span>
          <span class="big">Estúdio</span>
        </h1>

        <p class="description green">
          Se antes de agendar você deseja conhecer o estúdio, fique à vontade para marcar uma visita conosco ❤️
        </p>

        <NuxtLink
          :to="currentPath === '/estudio' ? '/agende-seu-ensaio' : '/estudio'"
          class="btn btn-red">
            <span>Sobre o estúdio</span>
        </NuxtLink>
      </div>

      <div class="side wrap-images">
          <nuxt-img
              :src='configPublic.cloudflareURI + "a4ac25f9-9b44-43be-803f-601c72f14600/thumb"'
              width="612"
              height="408"
              class="img-studio"
              alt="Foto de um comodo com a cortina iluminada de fundo, da esquerda pra direita: um abajour, a cama, e um cofá"
              loading="lazy" />
          <nuxt-img
              :src='configPublic.cloudflareURI + "1a88f2d4-10c6-4c91-96a3-9ff4ac42fc00/thumb"'
              width="612"
              height="408"
              class="img-studio"
              alt="O escritório, uma parede verde musgo de fundo com quadros, na esquerda um sofá, no centro a mesa, e uma estante na direita"
              loading="lazy" />
      </div>

      <SectionsStudioMap v-if="showMap" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper {
    overflow: hidden;

    .wrap-inner {
      margin-bottom: 50rem;
      margin-top: 50rem;
      flex-wrap: wrap;

      @include m.max(md) {
        flex-wrap: wrap;
        margin: 0;
      }
    }

    .side-text {
      padding: 6px 0 35rem 35rem;
      justify-content: flex-end;
      flex-direction: column;
      padding-right: 30rem;
      display: flex;
      width: 32%;

      @include m.max(lg) {
        padding-bottom: 0;
      }

      @include m.max(md) {
        align-items: flex-start;
        width: 50%;
      }

      @include m.max(sm) {
        width: 100%;
        padding-bottom: 30px;
        padding-top: 30px;
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
      padding: 6px;
      background: white;
      flex-wrap: wrap;
      flex-shrink: 0;
      display: flex;
      z-index: 3;
      width: 68%;
      gap: 6px;

      @include m.max(md) {
        width: 50%;
      }

      @include m.max(sm) {
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
      }

      img {
        height: auto;
        width: calc(50% - 3px);

        @include m.max(sm) {
          width: 100%;
        }
      }
    }
  }
</style>
