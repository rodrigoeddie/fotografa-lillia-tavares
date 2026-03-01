<script lang="ts" setup>
// Wrapper que combina o Hero e a List do portfólio.
// SectionsPortfolioList já lê $route.params.category internamente,
// então funciona tanto em /ensaio-fotografico quanto em /ensaio-fotografico/[category].
</script>

<template>
  <SectionsPortfolioHero />
  <SectionsPortfolioList class="no-padding" />
</template>
