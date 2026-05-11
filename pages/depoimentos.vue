<script setup lang="ts">
usePageSeo('static', '/depoimentos');
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Depoimentos' },
    ]" />
  </div>
  <SectionsDepoimentosList />
  <ClientOnly><SectionsScheduleTinyform :formType="'noType'" /></ClientOnly>
</template>
