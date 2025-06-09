<script lang="ts" setup>
const {
  data: home
} = await useAsyncData(() => {
  return queryCollection('content').path('/').first()
});

const title = home.value?.title + ' | Fotógrafa Lillia Tavares';

useSchemaOrg([
  defineWebPage({
    name: title,
    url: 'https://fotografalilliatavares.com.br'
  })
]);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
});

definePageMeta({
  layout: 'home'
})
</script>

<template >
  <SectionsAboutCta />
  <SectionsPortfolio :fromHome="true" />
  <SectionsStudio class="from-home-studio" />
</template>
