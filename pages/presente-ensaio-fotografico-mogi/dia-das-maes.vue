<script lang="ts" setup>
const slug = 'dia-das-maes';

const { data: lp } = await useLandingPage(slug);

if (lp.value?.pageSeo) {
  applyPageSeo(lp.value.pageSeo);
}

definePageMeta({
  layout: 'lp',
  lpType: 'dia-das-maes',
});
</script>

<template>
  <div v-if="lp" class="wrapper-dia-das-maes">
    <LandingsBlockRenderer
      :blocks="lp.blocks"
      :lp="lp.landingPage.slug"
      :lp-class="lp.landingPage.lp_class ?? ''"
    />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-dia-das-maes {
  padding-bottom: 100rem;
}
</style>
