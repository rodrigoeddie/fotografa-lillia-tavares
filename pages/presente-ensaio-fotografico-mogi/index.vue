<script lang="ts" setup>
definePageMeta({
  showHeader: true,
  layout: 'lp',
  lpType: 'presentes',
});

const { data: lp } = useLandingPage('presentes');
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb class="lp-presentes" :items="[
      { label: 'Home', to: '/' },
      { label: 'Presentes' },
    ]" />
  </div>

  <div v-if="lp" class="wrapper-presentes">
    <LandingsBlockRenderer
      :blocks="lp.blocks"
      :lp="lp.landingPage.slug"
      :lp-class="lp.landingPage.lp_class ?? ''"
    />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-presentes {
  padding-bottom: 100rem;
}
</style>
