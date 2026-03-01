<script setup lang="ts">
const { data } = await useAsyncData('depoimentos-meta', () =>
  queryCollection('depoimentos').first()
);

useSeoMeta({
  title: 'Depoimentos - Lillia Tavares Fotografia',
  description: data.value?.description ?? 'Veja os depoimentos de clientes que já viveram a experiência de um ensaio fotográfico com Lillia Tavares.',
  ogTitle: 'Depoimentos - Lillia Tavares Fotografia',
  ogDescription: data.value?.description ?? '',
  ogImage: 'https://images.fotografalilliatavares.com.br/og-image.jpg',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <SectionsDepoimentosList />
  <SectionsScheduleTinyform :formType="'noType'" />
</template>
