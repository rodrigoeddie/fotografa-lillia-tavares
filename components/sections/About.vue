<script lang="ts" setup>
const QUERY = `
{
  about {
    description
  }
}
`;
const { data, error } = await useGraphqlQuery({ query: QUERY });
</script>

<template>
  <div class="container">
    <div class="wrap-about row">
      <div class="col">
        <div class="about-text">
          <h1 class="title">Sobre</h1>
          <div class="description" v-html="data.about.description"></div>
        </div>

        <div class="about-ctas">
          <NuxtLink
            to="/agende-seu-ensaio"
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
            to="/trabalhos"
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
          src="assets/images/lillia-tavares-no-escritorio.png"
          alt="Lillia Tavares sentada na mesa, com um notebook e uma câmera fotográfica"
          width="1021"
          height="680"
          format="webp"
          quality="85"
          fit="fill"
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

          a {
            transition: background-color 0.2s, color 0.2s;
            text-decoration: underline;
            background: #f4f2e9;

            &:hover {
              background-color: v.$red;
              color: white;
            }
          }

          strong,
          b {
            background: #892c1a;
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

    @include m.max(md) {
      flex-wrap: wrap;
    }

    .about-text {
      padding: 180rem v.$space v.$space;

      .description {
        padding-top: 0;
      }
    }

    .about-ctas {
      padding: 20rem v.$space;
      flex-direction: column;
      background: #892c1a;
      display: flex;

      .link {
        transition: color 0.2s, background-color 0.2s;
        padding: 10rem 15rem;
        align-items: center;
        color: #fcbbae;
        font-size: 20rem;
        display: flex;
        gap: 15rem;

        &:nth-child(2) {
          border-bottom: #b35c4b 1px solid;
          border-top: #b35c4b 1px solid;
        }

        &:hover {
          background-color: #6d1d0b;
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
    }
  }
// background: v.$green;
//     height: 100vh;

//     @include m.max(md) {
//       height: 680px;
//     }
</style>
