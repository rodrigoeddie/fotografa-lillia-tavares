<script setup lang="ts">
const precosTitle = 'Preços de Ensaios Fotográficos em Mogi das Cruzes | Lillia Tavares';
const precosDescription = 'Confira os preços e pacotes de ensaios fotográficos profissionais em Mogi das Cruzes: corporativo, gestante, casual-intimista, casal e aniversário. Atendemos o Alto Tietê.';
const precosLink = 'https://fotografalilliatavares.com.br/precos-ensaios-fotograficos';
const precosImage = 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public';

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: precosTitle,
    url: precosLink
  })
]);

useSeoMeta({
  title: precosTitle,
  description: precosDescription,
  ogTitle: precosTitle,
  ogDescription: precosDescription,
  ogUrl: precosLink,
  ogImage: precosImage,
  twitterCard: 'summary_large_image',
  twitterTitle: precosTitle,
  twitterDescription: precosDescription,
  twitterImage: precosImage,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: precosLink
    }
  ]
});
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Preços de Ensaios Fotográficos' },
    ]" />
  </div>
  <SectionsPrecosList />
</template>

<style scoped lang="scss">
</style>
