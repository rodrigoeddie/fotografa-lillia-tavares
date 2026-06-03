<script setup lang="ts">
usePageSeo('static', '/sobre-fotografa-lillia-tavares');
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Sobre a Fotógrafa' },
    ]" />
  </div>
  <SectionsSobreContent />
  <SectionsSobreTimeline />
</template>