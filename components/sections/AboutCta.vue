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
      <div class="col">
        <div class="about-text">
          <h1 class="title">{{ about.title }}</h1>
          <div class="description" v-html="renderedContent"></div>
        </div>

        <div class="about-ctas">
          <NuxtLink
            to="/preco-ensaio-fotografico"
            class="link">
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
            <span>Conheça meu <b>estúdio</b>, também disponível para <b>locação</b></span>
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
          :src='"https://images.fotografalilliatavares.com.br/images/9a8558fb-cbb6-46a8-cec5-636f21a9db00/public"'
          alt="Lillia Tavares sentada na mesa, com um notebook e uma câmera fotográfica"
          width="935"
          height="796"
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
  .wrap-about {
    background: white;

    // @media (prefers-color-scheme: dark) {
    //   background: v.$dark-green;
    // }

    @include m.max(md) {
      flex-wrap: wrap;
    }

    .about-text {
      padding: 180rem v.$space v.$space;

      @include m.max(lg) {
        padding-top: 100px;
      }

      @include m.max(sm) {
        padding-top: 80px;
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

      .link {
        transition: color 0.2s, background-color 0.2s;
        padding: 10rem 15rem;
        align-items: center;
        color: #fcbbae;
        font-size: 20rem;
        display: flex;
        gap: 15rem;

        @include m.max(sm) {
          font-size: 14px;
          margin: 0 auto;
          width: 320px;
        }

        &:nth-child(2) {
          border-bottom: #b35c4b 1px solid;
          border-top: #b35c4b 1px solid;
        }

        &:hover {
          background-color: v.$dark-red;
          color: white;
        }
      }

      .icon {
        font-size: 40rem;
      }
    }

    .about-img {
      flex-shrink: 0;
      width: 55%;

      @include m.max(md) {
        width: 100%;
      }

      @include m.max(sm) {
        display: none;
      }

      .cover {
        @include m.max(sm) {
          display: none;
        }
      }
    }
  }
// background: v.$green;
//     height: 100vh;

//     @include m.max(md) {
//       height: 680px;
//     }
</style>
