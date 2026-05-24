<script lang="ts" setup>
</script>

<template>
    <div class="wrap-about row">
      <div class="col col-text">
        <div class="about-text">
          <h1 class="title">
            <NuxtLink
            to="/sobre-fotografa-lillia-tavares">
              <span>Fotógrafa Lillia Tavares</span>
            </NuxtLink>
          </h1>

          <div class="description">
            <p>Com <NuxtLink to="/estudio-fotografico-em-mogi-das-cruzes">estúdio em Mogi das Cruzes</NuxtLink>, atendendo todo o Alto Tietê, é especializada em retratos e ensaios corporativos.</p>
            <p>Transforma cada sessão em uma experiência acolhedora, criando um ambiente onde os modelos se sentem à vontade.</p>
          </div>
        </div>

        <div class="about-ctas">
          <NuxtLink
            to="/ensaio-fotografico"
            class="link"
            data-track-event="cta-ver-portfolio">
            <Icon
              name="icons:image-regular"
              class="icon icon-image"/>
            <span><span class="show-desktop"><b>Acompanhe</b> meus </span><span class="show-mobile">trabalhos</span></span>
          </NuxtLink>

          <NuxtLink
            to="/estudio-fotografico-em-mogi-das-cruzes"
            class="link"
            data-track-event="cta-ver-estudio">
            <Icon
              name="icons:location-pin-solid"
              class="icon icon-location-pin"/>
            <span><span class="show-desktop">Conheça meu </span><span class="show-mobile"><b>estúdio</b></span><span class="show-desktop"> (disponível para locação).</span></span>
          </NuxtLink>

          <NuxtLink
            to="/agende-seu-ensaio"
            class="link link-agende"
            data-track-event="cta-agendar-home">
            <Icon
              name="icons:calendar-regular"
              class="icon icon-calendar"/>
            <span><span class="show-mobile"><b>agende</b></span><span class="show-desktop"> seu ensaio fotográfico</span></span>
          </NuxtLink>
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
    margin-top: 0;
    
    @include m.max(xs) {
      margin-top: 10px;
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
    box-shadow:
      0 1px 0 #ECE4D2,
      0 14px 30px -12px rgba(42, 37, 32, 0.25),
      0 4px 10px -4px rgba(42, 37, 32, 0.10);
    background: white;
    max-width: 860rem;
    width: 40%;

    @include m.max(xs) {
      height: auto;
      width: 100%;
    }

    .about-text {
      padding: v.$space;
      color: v.$green;

      @include m.max(xs) {
        padding: 40px 15px 15px 15px;
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
      width: 100%;
      
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
