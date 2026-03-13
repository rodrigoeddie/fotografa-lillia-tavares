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
  <div
    class="container"
    data-ani-type="fade">
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
            <span><span class="show-desktop"><b>Acompanhe</b> meus </span><span class="show-mobile">trabalhos</span></span>
          </NuxtLink>

          <NuxtLink
            to="/estudio"
            class="link">
            <Icon
              name="icons:location-pin-solid"
              class="icon icon-location-pin"/>
            <span><span class="show-desktop">Conheça meu </span><span class="show-mobile"><b>estúdio</b></span><span class="show-desktop"> (disponível para locação).</span></span>
          </NuxtLink>

          <NuxtLink
            to="/agende-seu-ensaio"
            class="link link-agende">
            <Icon
              name="icons:calendar-regular"
              class="icon icon-calendar"/>
            <span><span class="show-mobile"><b>agende</b></span><span class="show-desktop"> seu ensaio fotográfico</span></span>
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

  .show-mobile {
    @include m.max(xs) {
      text-transform: capitalize;
      font-weight: bold;
      display: inline-block;
    }
  }
  .show-desktop {
    @include m.max(xs) {
      display: none;
    }
  }

  .title {
    margin-top: 10px;
    
    @include m.max(xs) {
      font-size: 13px;
    }
  }

  .description {
    padding-top: 5px;
    
    @include m.max(xs) {
      font-size: 13px;
    }
  }

  .wrap-about {
    box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
    background: white;
    margin-top: 20rem;
    max-width: 860rem;

    @include m.max(xs) {
      height: 345rem;
    }

    .about-text {
      padding: v.$space;
      color: v.$green;

      @include m.max(xs) {
        padding: 0 0 0 15px;
        position: absolute;
        width: 65%;
        left: 0;
        top: 0;
      }
    }

    .about-ctas {
      justify-content: space-around;
      flex-direction: column;
      background: #f7f4e8;
      display: flex;
      padding: 5rem 0;

      @include m.max(xs) {
        flex-direction: row;
        padding: 6px;
      }

      .link {
        transition: color 0.2s, background-color 0.2s;
        padding: 10rem v.$space;
        align-items: center;
        color: v.$green;
        font-size: 19rem;
        display: flex;
        gap: 15rem;
        
        @include m.max(xs) {
          padding: 10rem 15rem;
          font-size: 14px;
          margin: 0 auto;
          width: 100%;
          gap: 5px;
        }

        &:nth-child(2) {
          @include m.max(xs) {
            border-bottom: transparent;
          }
        }

        &:hover {
          background-color: v.$green;
          color: white;
        }
      }

      .icon {
        font-size: 25rem;

        @include m.max(xs) {
          font-size: 15px;
        }
      }
    }

    .col-text {
      width: 79%;
      
      @include m.max(xs) {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        z-index: 2;
        width: 100%;
      }
    }

    .about-img {
      flex-shrink: 0;
      width: 320rem;

      @include m.max(xs) {
        position: absolute;
        height: 87%;
        width: 35%;
        right: 0;
        order: 1;
      }

      .cover {
        object-position: center;

        @include m.max(xs) {
          object-position: 35% 20%;
        }
      }

      .cover {
        @include m.max(xs) {
          position: relative;
        }
      }
    }
  }
</style>
