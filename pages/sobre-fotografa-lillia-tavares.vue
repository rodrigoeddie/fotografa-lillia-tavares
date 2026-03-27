<script setup lang="ts">
const { data: sobre } = await useAsyncData('sobre-page', () => {
  return queryCollection('content').path('/pages/sobre').first()
});

const pageData = computed(() => sobre.value as any);

const sobreTitle = (pageData.value?.title || 'Sobre a Fotógrafa') + ' em Mogi das Cruzes | Lillia Tavares Fotografia';
const sobreDescription = pageData.value?.description || 'Conheça Lillia Tavares, fotógrafa profissional especializada em retratos e ensaios fotográficos em Mogi das Cruzes e região do Alto Tietê.';
const sobreImage = `https://images.fotografalilliatavares.com.br/images/${pageData.value?.image?.id || '5aaf1433-aaa7-42ed-7198-15626f964000'}/public`;
const sobreLink = 'https://fotografalilliatavares.com.br/sobre-fotografa-lillia-tavares';

useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    name: sobreTitle,
    url: sobreLink
  })
]);

useSeoMeta({
  title: sobreTitle,
  description: sobreDescription,
  ogTitle: sobreTitle,
  ogDescription: sobreDescription,
  ogImage: sobreImage,
  ogUrl: sobreLink,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: sobreTitle,
  twitterDescription: sobreDescription,
  twitterImage: sobreImage,
});

useHead({
  title: sobreTitle,
  link: [
    {
      rel: 'canonical',
      href: sobreLink
    }
  ]
});
</script>

<template>
  <BlocksBreadcrumb :items="[
    { label: 'Home', to: '/' },
    { label: 'Sobre a Fotógrafa' },
  ]" />
  <SectionsSobreContent />
</template>