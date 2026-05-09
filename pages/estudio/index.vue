<script lang="ts" setup>
await usePageSeo('static', '/estudio');

const configPublic = useRuntimeConfig().public;
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Estúdio Fotográfico' },
    ]" />
  </div>
  <SectionsStudioAbout
    class="from-page-studio"
    :fromStudio="true" />
  <SectionsStudioBgs />
  <SectionsStudioCenarios />
  <SectionsStudioMap />
</template>
