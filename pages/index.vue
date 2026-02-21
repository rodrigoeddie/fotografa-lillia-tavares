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
  description: home.value?.description,
  ogTitle: home.value?.title,
  ogDescription: home.value?.description,
  ogUrl: 'https://fotografalilliatavares.com.br',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://fotografalilliatavares.com.br'
    }
  ]
});

definePageMeta({
  layout: 'home'
})

const configPublic = useRuntimeConfig().public;
</script>

<template >
  <SectionsHomeAboutCta />
  <SectionsHomePortfolio />
  <SectionsHomeTestimonials />
  <SectionsStudio class="from-home-studio" />
</template>
