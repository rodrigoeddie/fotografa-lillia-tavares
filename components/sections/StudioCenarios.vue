<script setup lang="ts">
    const configPublic = useRuntimeConfig().public;
</script>

<template>
    <NuxtLink
      to="/estudio/cenarios"
      class="wrapper">
        <div class="wrap-title">
            <h1 class="big-title red centered">
                <span class="box">
                    <span>Conheça os</span>
                </span>

                <span class="big">Cenários</span>
            </h1>
        </div>

        <nuxt-img
          :src='configPublic.cloudflareURI + "dc8fe42c-c8b0-4895-ea43-1e9f9274ea00/paisagem"'
          width="1920"
          height="559"
          class="img-fundo"
          alt="Exemplos de cenário"
          loading="lazy" />
    </NuxtLink>
</template>

<style scoped lang="scss">
.img-fundo {
    height: auto;
}

.wrapper {
    background-color: #360e06;
    padding-bottom: 60rem;
    padding-top: 60rem;
    display: block;
}

.wrap-title {
    background-color: #360e06;
    justify-content: center;
    display: inline-flex;
    align-items: center;
    padding-bottom: 5rem;
    padding-top: 5rem;
    z-index: 2;

    @include m.max(sm) {
        margin-bottom: 15rem;
        width: 100%;
    }

    @include m.min(sm) {
        transform: translate(-50%, -50%);
        padding-left: 12rem;
        position: absolute;
        left: 50%;
        top: 50%;
    }

    .big-title {
        padding-right: 20rem;
        padding-top: 0;

        @include m.max(sm) {
            padding-right: 0;
        }

        .box {
          @media (prefers-color-scheme: dark) {
            background: white;
            color: v.$red;
          }
        }

        .big {
            text-shadow: none;

            @media (prefers-color-scheme: dark) {
                color: white;
            }
        }
    }
}
</style>