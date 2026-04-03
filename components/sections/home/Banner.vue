<script lang="ts" setup>
</script>

<template>
    <NuxtLink
      to="/presente-ensaio-fotografico-mogi/dia-das-maes"
      class="wrap-banner">
        <nuxt-img
          provider="cloudflare"
          :src='"https://images.fotografalilliatavares.com.br/images/5a652dab-c42b-4672-3810-2aaef0d0ce00/public"'
          sizes="100vw md:50vw lg:860px"
          alt="Mãe e filho"
          width="860"
          fetchpriority="high"
          preload
          loading="eager"
          format="webp"
          class="img cover"/>
        
        <div class="text">
            <h1 class="title">Dia das mães</h1>
            <p class="description">Presenteie sua mãe com um ensaio fotográfico profissional em Mogi das Cruzes. Porque a sua mãe merece se ver da forma como você a enxerga.</p>
        </div>
    </NuxtLink>
</template>

<style scoped lang="scss">
.wrap-banner {
    box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
    background: white;
    max-width: 860rem;
    width: 50%;

    @include m.max(xs) {
        max-width: none;
        width: 100%;
        height: 100%;
        aspect-ratio: 1.4 / 1;
    }

    .text {
        position: absolute;
        bottom: 30rem;
        left: 30rem;

        @include m.max(xs) {
            bottom: 15px;
            left: 15px;
        }
    }

    .title, .description {
        color: white;
        text-shadow: 0 0 10rem rgba(0, 0, 0, 0.25);
    }
}
</style>
