<script lang="ts" setup>
const slug = 'presentes';

const { data: lp } = await useLandingPage(slug);

if (lp.value?.pageSeo) {
  applyPageSeo(lp.value.pageSeo);
}

definePageMeta({
  showHeader: true,
  layout: 'lp',
  lpType: 'presentes',
});
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
