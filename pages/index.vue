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
});

definePageMeta({
  layout: 'home'
})

const configPublic = useRuntimeConfig().public;
</script>

<template >
  <SectionsHomeAboutCta :data="home" />
  <SectionsHomePortfolio />
  <SectionsStudio class="from-home-studio" />
</template>

<style scoped lang="scss">
.hero {
    overflow: hidden;

    .img-hero {
        display: block;
        margin: 0 auto;
        height: auto;
    }
}
</style>
