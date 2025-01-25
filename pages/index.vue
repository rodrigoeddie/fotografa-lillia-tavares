<script lang="ts" setup>
const {
  data: home
} = await useAsyncData(() => {
  return queryCollection('content').path('/').first()
});

useSchemaOrg([
  defineWebPage({
    name: home.value?.title + ' | Fotógrafa Lillia Tavares',
    url: 'https://fotografalilliatavares.com.br'
  })
]);

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description
})
</script>

<template>
  <SectionsAbout />
  <SectionsPortfolio />
  <SectionsStudio class="from-home-studio" />
</template>
