<script lang="ts" setup>
const configPublic = useRuntimeConfig().public;

const {
  data: about
} = await useAsyncData(() => {
  return queryCollection('content').path('/about').first()
});

const renderElement = (el) => {
  if (typeof el === 'string') {
    return el;
  }

  const [tag, attrs, ...children] = el;

  if (tag != 'h1') {
    const attrsString = Object.entries(attrs)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}="${value.join(' ')}"`;
        }
        return `${key}="${value}"`;
      })
      .join(' ');

    const childrenString = children.map(child => (typeof child === 'string' ? child : renderElement(child))).join('');

    return `<${tag} ${attrsString}>${childrenString}</${tag}>`;
  }
};

const renderedContent = ref('');

if (about.value?.body?.value) {
  renderedContent.value = about.value.body.value.map(renderElement).join('');
}
</script>

<template>
  <div class="container">
    <div class="wrap-about row">
      <div class="col col-text">
        <div class="about-text">
          <h1 class="title">{{ about.title }}</h1>
          <div class="description" v-html="renderedContent"></div>
        </div>

        <div class="about-ctas">
          <NuxtLink
            to="/preco-ensaio-fotografico"
            class="link link-agende">
            <nuxt-icon
              name="calendar-regular"
              class="icon icon-calendar"/>
            <span><u>Clique aqui</u> e <b>agende</b> seu ensaio fotográfico</span>
          </NuxtLink>

          <NuxtLink
            to="/estudio"
            class="link">
            <nuxt-icon
              name="location-pin-solid"
              class="icon icon-location-pin"/>
            <span>Conheça meu <b>estúdio</b>, (disponível para locação).</span>
          </NuxtLink>

          <NuxtLink
            to="/ensaio-fotografico"
            class="link">
            <nuxt-icon
              name="image-regular"
              class="icon icon-image"/>
            <span>Acompanhe meus últimos <b>trabalhos</b> realizados</span>
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
          padding-top: 15rem !important;

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
        padding: 0 30rem 30rem;
      }

      .description {
        padding-top: 0;
      }
    }

    .about-ctas {
      padding: 20rem v.$space;
      flex-direction: column;
      background: v.$red;
      display: flex;

      @include m.max(sm) {
        padding: 6px;
      }

      .link {
        transition: color 0.2s, background-color 0.2s;
        padding: 10rem 15rem;
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
          border-bottom: #b35c4b 1px solid;

          @include m.min(xs) {
            border-top: #b35c4b 1px solid;
          }
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
      @include m.max(xs) {
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
      width: 50%;

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
