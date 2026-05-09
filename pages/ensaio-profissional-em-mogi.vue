<script lang="ts" setup>
const slug = 'corporativo';

const { data: lp } = await useLandingPage(slug);

if (lp.value?.pageSeo) {
  applyPageSeo(lp.value.pageSeo);
}

definePageMeta({
  layout: 'lp',
  lpType: 'corporativo',
});
</script>

<template>
  <div v-if="lp" class="wrapper-corporativo">
    <LandingsBlockRenderer
      :blocks="lp.blocks"
      :lp="lp.landingPage.slug"
      :lp-class="lp.landingPage.lp_class ?? ''"
    />
  </div>
</template>

<style lang="scss" scoped>
.wrapper-corporativo {
  padding-bottom: 100rem;
}
</style>
