<script setup lang="ts">
const path = useRoute().path

const { data: work } = await useAsyncData(path, () => {
  return queryCollection('works').path(path).first()
});

const album     = work.value.album
                    .map((item, index) => ({
                      ...item,
                      index
                    }))
                    .filter(item => !item.highlight);
const title     = work.value.title + ' | Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';

const siteURI = 'https://fotografalilliatavares.com.br';

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
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteURI
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ensaios Fotográficos',
        item: siteURI + '/ensaio-fotografico'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: work.value.category.title,
        item: siteURI + '/ensaio-fotografico/' + work.value.category.slug
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: work.value.title,
        item: siteURI + path
      }
    ]
  })
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
    <SectionsHero :data="work" />
    <SectionsGallery :album="album" />
    <SectionsScheduleCustom :formType="work.category.title" />
  </div>
</template>

<style lang="scss">
</style>
