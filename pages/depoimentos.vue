<script setup lang="ts">
const { data } = await useAsyncData('depoimentos-meta', () =>
  queryCollection('depoimentos').first()
);

const depTitle = 'Depoimentos de Clientes | Ensaios Fotográficos em Mogi das Cruzes - Lillia Tavares';
const depDescription = data.value?.description ?? 'Veja os depoimentos de clientes que já viveram a experiência de um ensaio fotográfico profissional com Lillia Tavares em Mogi das Cruzes e região do Alto Tietê.';
const depLink = 'https://fotografalilliatavares.com.br/depoimentos';
const depImage = 'https://images.fotografalilliatavares.com.br/images/TODO_OG_IMAGE_ID/public';

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: depTitle,
    url: depLink
  })
]);

useSeoMeta({
  title: depTitle,
  description: depDescription,
  ogTitle: depTitle,
  ogDescription: depDescription,
  ogImage: depImage,
  ogUrl: depLink,
  twitterCard: 'summary_large_image',
  twitterTitle: depTitle,
  twitterDescription: depDescription,
  twitterImage: depImage,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: depLink
    }
  ]
});
</script>

<template>
  <SectionsDepoimentosList />
  <SectionsScheduleTinyform :formType="'noType'" />
</template>
