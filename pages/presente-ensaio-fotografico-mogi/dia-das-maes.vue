<script lang="ts" setup>
definePageMeta({
  layout: 'lp',
  lpType: 'dia-das-maes',
});

const { data: lp } = useLandingPage('dia-das-maes');
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
