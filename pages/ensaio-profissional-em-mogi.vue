<script lang="ts" setup>
definePageMeta({
  layout: 'lp',
  lpType: 'corporativo',
});

// SEO aplicado internamente — useLandingPage retorna refs (sync, sem await)
const { data: lp } = useLandingPage('corporativo');
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
