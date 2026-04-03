<script setup lang="ts">
const path = useRoute().path

const { data: work } = await useAsyncData(path, () => {
  return queryCollection('works').path(path).first()
});

if (!work.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ensaio não encontrado' });
}

const album     = work.value.album
                    .map((item, index) => ({
                      ...item,
                      index
                    }))
                    .filter(item => !item.highlight);
const title     = work.value.title + ' | Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';

const siteURI = 'https://fotografalilliatavares.com.br';

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Ensaios Fotográficos', to: '/ensaio-fotografico' },
  { label: work.value.category.title, to: '/ensaio-fotografico/' + work.value.category.slug },
  { label: work.value.title },
];

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
    name: title,
    url: siteURI + path,
  }),
  defineImage({
    '@type': 'ImageObject',
    name: work.value.title,
    description: work.value.description,
    author: {
      '@type': 'Person',
      name: 'Fotógrafa Lillia Tavares',
    },
    datePublished: work.value.date,
    contentUrl: album.map(item => `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${item.imageId}/${item.format}`),
    url: 'https://fotografalilliatavares.com.br' + path,
  }),
]);

useSeoMeta({
  title: title,
  description: work.value.description,
  ogTitle: work.value.title,
  ogDescription: work.value.description,
  ogImage: album[0] ? `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${album[0].imageId}/public` : undefined,
  ogUrl: siteURI + path,
  twitterCard: 'summary_large_image',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: siteURI + path
    }
  ]
});
</script>

<template>
  <div class="container no-padding" :style="{ '--color-highlight': work.colorHighlight }">
    <SectionsGeneralHero :data="work" :breadcrumbs="breadcrumbs" />
    <SectionsGeneralGallery :album="album" />
    <ClientOnly><SectionsScheduleTinyform :formType="work.category.title" /></ClientOnly>
  </div>
</template>

<style lang="scss">
</style>
