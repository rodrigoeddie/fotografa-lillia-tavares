<script setup lang="ts">
const route = useRoute();
const category = route.params.category as string;
const slugParam = route.params.slug as string;
const path = route.path;

const { data: rawWork } = await useFetch(`/api/public/portfolio/${category}/${slugParam}`);

if (!rawWork.value) {
  throw createError({ statusCode: 404, statusMessage: 'Ensaio não encontrado' });
}

const work = computed(() => rawWork.value ? adaptPortfolioWork(rawWork.value) : null);

const album = computed(() => {
  if (!work.value) return [];
  return work.value.album
    .map((item: any, index: number) => ({ ...item, index }))
    .filter((item: any) => !item.highlight);
});

const title = computed(() => (work.value?.title ?? '') + ' | Fotógrafa Lillia Tavares em Mogi das Cruzes');

const siteURI = 'https://fotografalilliatavares.com.br';

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Ensaios Fotográficos', to: '/ensaio-fotografico' },
  { label: work.value?.category?.title ?? category, to: '/ensaio-fotografico/' + category },
  { label: work.value?.title ?? slugParam },
]);

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
    name: title,
    url: siteURI + path,
  }),
  defineImage({
    '@type': 'ImageObject',
    name: computed(() => work.value?.title),
    description: computed(() => work.value?.description),
    author: { '@type': 'Person', name: 'Fotógrafa Lillia Tavares', url: siteURI + '/sobre-fotografa-lillia-tavares' },
    datePublished: computed(() => work.value?.data),
    contentUrl: computed(() => album.value?.map((item: any) => `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${item.imageId}/public`)),
    url: siteURI + path,
  }),
]);

useSeoMeta({
  title: title.value,
  description: work.value?.description,
  ogTitle: work.value?.title,
  ogDescription: work.value?.description,
  ogImage: album.value?.[0] ? `https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${album.value[0].imageId}/public` : undefined,
  ogUrl: siteURI + path,
  twitterCard: 'summary_large_image',
});

useHead({
  link: [{ rel: 'canonical', href: siteURI + path }],
});
</script>

<template>
  <div class="container no-padding" :style="{ '--color-highlight': work?.colorHighlight }">
    <SectionsGeneralHero :data="work" :breadcrumbs="breadcrumbs" />
    <SectionsGeneralGallery :album="album" />

    <div v-if="work" class="portfolio-share container">
      <BlocksShareButtons :title="work.title" />
    </div>

    <ClientOnly><SectionsScheduleTinyform :formType="work?.category?.title" /></ClientOnly>
  </div>
</template>

<style lang="scss">
.portfolio-share {
  padding: 20rem 30rem;
}
</style>
