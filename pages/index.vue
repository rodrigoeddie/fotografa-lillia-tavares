<script lang="ts" setup>
const { data: home } = await useAsyncData(() => {
  return queryCollection('content').path('/').first();
});

await usePageSeo('static', '/');

definePageMeta({
  layout: 'home',
});

const configPublic = useRuntimeConfig().public;
</script>

<template>
  <div class="container wrap-hero-home">
    <SectionsHomeBanner />
    <SectionsHomeAboutCta />
  </div>
  <SectionsHomePortfolio />
  <SectionsGeneralTestimonials />
  <SectionsStudioTiny :showMap="false" class="from-home-studio" />
</template>

<style scoped lang="scss">
  .wrap-hero-home {
    justify-content: space-between;
    margin-top: 20rem;
    display: flex;

    @include m.max(xs) {
      flex-direction: column;
    }
  }
</style>
