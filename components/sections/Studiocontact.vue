
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
            <span>Visite nosso</span>
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
              src='assets/images/cenario-intimista-e-casual-do-estudio-fotografa-lillia-tavares.png'
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
      </div>

      <h2 class="title title-map">Estamos localizados em <a href="https://maps.app.goo.gl/2NPyJTUvUs9z12fW7" target="_blank" class="highlight light"><span>Mogi das cruzes, SP</span>. <nuxt-icon name="external-link" class="icon"/></a></h2>
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14634.106001989638!2d-46.1804627!3d-23.5135586!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cdd92db136d28b%3A0x7dbfca477fd7474f!2sEst%C3%BAdio%20fotogr%C3%A1fico%20Lillia%20Tavares%20em%20Mogi%20das%20Cruzes!5e0!3m2!1spt-BR!2sbr!4v1724005767992!5m2!1spt-BR!2sbr" width="100%" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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

    .title-map {
      padding: 40rem 0 20rem;
      text-align: center;
      display: block;
      width: 100%;

      .icon {
        font-size: 14rem;
        top: -2rem;
      }

      a {
        transition: background-color 0.2s, color 0.2s;
        background: #f4f2e9;
        padding: 3rem 7rem;

        @media (prefers-color-scheme: dark) {
          background: v.$dark-red;
        }

        span {
          text-decoration: underline;
        }

        &:hover {
          background-color: v.$red;
          color: white;
        }
      }
    }
  }
</style>
