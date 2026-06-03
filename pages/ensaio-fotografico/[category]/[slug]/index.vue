<script setup lang="ts">
const route = useRoute();
const category = route.params.category as string;
const slugParam = route.params.slug as string;
const path = route.path;

// Deve ser chamado antes de qualquer await para preservar o contexto Nuxt no SSR.
// O slug no DB é apenas o slugParam (sem category).
usePageSeo('portfolio', `${category}/${slugParam}`);

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

const siteURI = 'https://fotografalilliatavares.com.br';

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Ensaios Fotográficos', to: '/ensaio-fotografico' },
  { label: work.value?.category?.title ?? category, to: '/ensaio-fotografico/' + category },
  { label: work.value?.title ?? slugParam },
]);

// JSON-LD com ImageObject contendo a galeria (dinâmico, não cabe no DB)
useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
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
