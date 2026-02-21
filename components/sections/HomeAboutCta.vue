<script lang="ts" setup>
const configPublic = useRuntimeConfig().public;

const {
  data: sobre
} = await useAsyncData('home-sobre', () => {
  return queryCollection('content').path('/home/sobre').first()
});

// Converte o body do markdown em HTML
const description = computed(() => {
  const html = useMarkdownToHtml(sobre.value?.body);
  return html;
});
</script>

<template>
  <div class="container">
    <div class="wrap-about row">
      <div class="col col-text">
        <div class="about-text">
          <h1 class="title">{{ sobre?.title }}</h1>
          <div class="description" v-html="description"></div>
        </div>

        <div class="about-ctas">
          <NuxtLink
            to="/ensaio-fotografico"
            class="link">
            <Icon
              name="icons:image-regular"
              class="icon icon-image"/>
            <span><b>Acompanhe</b> meus trabalhos</span>
          </NuxtLink>

          <NuxtLink
            to="/estudio"
            class="link">
            <Icon
              name="icons:location-pin-solid"
              class="icon icon-location-pin"/>
            <span>Conheça meu <b>estúdio</b> (disponível para locação).</span>
          </NuxtLink>

          <NuxtLink
            to="/preco-ensaio-fotografico"
            class="link link-agende">
            <Icon
              name="icons:calendar-regular"
              class="icon icon-calendar"/>
            <span><b>agende</b> seu ensaio fotográfico</span>
          </NuxtLink>
        </div>
      </div>

      <div class="col about-img">
        <nuxt-img
          provider="cloudflare"
          :src='"https://images.fotografalilliatavares.com.br/images/5aaf1433-aaa7-42ed-7198-15626f964000/public"'
          alt="Fotógrafa Lillia Tavares segurando sua câmera fotográfica"
          width="935"
          fetchpriority="high"
          preload
          sizes="100vw sm:50vw md:935px"
          format="webp"
          placeholder
          class="img cover"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .wrap-about {
    .about-text {
      .description {
        p {
          padding-top: 7rem !important;

          &:nth-child(2),
          &:nth-child(3) {
            @include m.max(xs) {
              display: none;
            }
          }

          strong,
          b {
            background: #892c1a;
            padding-right: 3rem;
            padding-left: 3rem;
            color: white;
          }
        }
      }
    }
  }
</style>

<style scoped lang="scss">
  @use 'sass:color';

  .wrap-about {
    background: white;

    @include m.max(xs) {
      flex-wrap: wrap;
    }

    .about-text {
      padding: 45rem;

      @include m.max(sm) {
        padding: 30rem;
      }

      @include m.max(xs) {
        padding: 0 15px 15px;
      }

      .description {
        padding-top: 0;
      }
    }

    .about-ctas {
      // padding: 20rem v.$space;
      background: v.$red;
      display: flex;
      justify-content: space-around;

      @include m.max(sm) {
        flex-direction: column;
        padding: 6px;
      }

      .link {
        transition: color 0.2s, background-color 0.2s;
        padding: 15rem;
        align-items: center;
        color: #fcbbae;
        font-size: 20rem;
        display: flex;
        gap: 15rem;
        
        @include m.max(xs) {
          padding: 10rem 0;
          font-size: 14px;
          margin: 0 auto;
          width: 100%;
          gap: 5px;
        }

        &:nth-child(2) {
          @include m.max(xs) {
            border-bottom: #b35c4b 1px solid;
          }
          
          // @include m.min(xs) {
          //   border-left: #b35c4b 1px solid;
          //   border-right: #b35c4b 1px solid;
          // }
        }

        &.link-agende {
          @include m.max(xs) {
            display: none;
          }
        }

        &:hover {
          background-color: v.$dark-red;
          color: white;
        }
      }

      .icon {
        font-size: 40rem;

        @include m.max(xs) {
          font-size: 15px;
        }
      }
    }

    .col-text {
      width: 79%;
      
      @include m.max(xs) {
        width: 100%;
        order: 2;
      }
      
      .title {
        @include m.max(xs) {
          margin-top: -18px;
          text-shadow: 0px 0px 3px white, 0px 2px 3px white, 2px 0px 3px white;
        }
      }
    }

    .about-img {
      flex-shrink: 0;
      width: 21%;

      @include m.max(xs) {
        height: 225px;
        width: 100%;
        order: 1;
      }

      .cover {
        object-position: center 20%;
      }

      .cover {
        @include m.max(xs) {
          position: relative;
        }
      }
    }
  }
</style>
