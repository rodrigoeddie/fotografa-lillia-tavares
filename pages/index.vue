<script lang="ts" setup>
usePageSeo('static', '/');
</script>

<template>
  <SectionsHomeHero />
  <SectionsHomePortfolio />
  <SectionsGeneralTestimonials />
  <SectionsStudioTiny :showMap="false" class="from-home-studio" />
</template>
