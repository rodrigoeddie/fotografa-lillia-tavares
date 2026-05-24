<script lang="ts" setup>
usePageSeo('static', '/');
</script>

<template>
  <div class="container wrap-hero-home">
    <SectionsHomeAboutCta />
    <SectionsHomeCTAServices />
  </div>
  <SectionsHomePortfolio />
  <SectionsGeneralTestimonials />
  <SectionsStudioTiny :showMap="false" class="from-home-studio" />
</template>

<style scoped lang="scss">
  .wrap-hero-home {
    justify-content: space-between;
    margin-top: 15rem;
    display: flex;

    @include m.max(xs) {
      flex-direction: column;
    }
  }
</style>
