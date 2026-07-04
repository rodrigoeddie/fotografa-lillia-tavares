<script lang="ts" setup>
usePageSeo('static', '/estudio-fotografico-em-mogi-das-cruzes');

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
  <SectionsGeneralTestimonials />
  <SectionsStudioLocation />
</template>
