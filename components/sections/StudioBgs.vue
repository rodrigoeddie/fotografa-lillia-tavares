<script setup lang="ts">
</script>

<template>
  <div class="wrapper">
    <div class="wrap-title">
        <h1 class="big-title red centered">
            <span class="box">
                <span>Fundo Infinito</span>
            </span>

            <span class="big">fotográfico</span>
        </h1>

        <p class="description">
            Temos 4 opções de cores para harmonizar suas fotos perfeitamente com o seu estilo
        </p>
    </div>

    <div class="wrap-bgs">
        <div class="item bg-blue">
            <nuxt-img
                src='e565d57c-cc18-40a3-ffcc-3eeba2da3100'
                width="300"
                height="420"
                provider="cloudflare"
                class="img-fundo"
                alt="Exemplo de fundo fotográfico na cor branca"
                loading="lazy" />
        </div>
        <div class="item bg-beige">
            <nuxt-img
                src='e565d57c-cc18-40a3-ffcc-3eeba2da3100'
                width="300"
                height="420"
                provider="cloudflare"
                class="img-fundo"
                alt="Exemplo de fundo fotográfico na cor branca"
                loading="lazy" />
        </div>
        <div class="item bg-gray">
            <nuxt-img
                src='e565d57c-cc18-40a3-ffcc-3eeba2da3100'
                width="300"
                height="420"
                provider="cloudflare"
                class="img-fundo"
                alt="Exemplo de fundo fotográfico na cor branca"
                loading="lazy" />
        </div>
        <div class="item bg-white">
            <nuxt-img
                src='e565d57c-cc18-40a3-ffcc-3eeba2da3100'
                width="300"
                height="420"
                provider="cloudflare"
                class="img-fundo"
                alt="Exemplo de fundo fotográfico na cor branca"
                loading="lazy" />
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$blue:  #111d2c;
$beige: #b99879;
$gray:  #241f21;
$white: #e4e1e5;

.wrap-title {
    justify-content: center;
    margin-bottom: -9rem;
    align-items: center;
    display: flex;

    .big-title {
        padding-right: 20rem;
        padding-top: 0;

        .box {
          @media (prefers-color-scheme: dark) {
            background: white;
            color: v.$red;
          }
        }

        .big {
            text-shadow: none;
            color: white;
        }
    }

    .description {
        padding-top: 0;
    }
}

.wrapper {
    padding-bottom: 100rem;
    background: v.$red;
    padding-top: 50rem;
    margin-top: 50rem;
}

.wrap-bgs {
    justify-content: center;
    display: flex;

    .example {
        border: 1px;
    }

    .item {
        border: 1px solid white;
        justify-content: center;
        aspect-ratio: 500/580;
        align-items: self-end;
        max-width: 505rem;
        display: flex;
        width: 24%;

        &.bg-blue {
            background: $blue;
        }
        &.bg-beige {
            background: $beige;
        }
        &.bg-gray {
            background: $gray;
        }
        &.bg-white {
            background: $white;
        }

        img {
            aspect-ratio: 300/420;
            border: 1px solid white;
            margin-bottom: -10%;
            display: block;
            height: auto;
            width: 60%;
        }
    }
}
</style>