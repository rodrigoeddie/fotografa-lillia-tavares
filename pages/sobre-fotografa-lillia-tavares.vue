<script setup lang="ts">
const { data: sobre } = await useAsyncData('sobre-page', () => {
  return queryCollection('content').path('/pages/sobre').first()
});

const pageData = computed(() => sobre.value as any);

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
</template>