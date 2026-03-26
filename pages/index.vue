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

const homeOgImage = 'https://www.fotografalilliatavares.com.br/share.webp?v3';

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
  ogTitle: home.value?.title,
  ogDescription: home.value?.description,
  ogUrl: 'https://fotografalilliatavares.com.br',
  ogImage: homeOgImage,
  twitterCard: 'summary_large_image',
  twitterTitle: home.value?.title,
  twitterDescription: home.value?.description,
  twitterImage: homeOgImage,
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
  <div class="container wrap-hero-home">
    <SectionsHomeBanner />
    <SectionsHomeAboutCta />
  </div>
  <SectionsHomePortfolio />
  <SectionsGeneralTestimonials />
  <SectionsStudioTiny :showMap="false" class="from-home-studio" />
</template>

<style scoped lang="scss">
  .wrap-hero-home {
    justify-content: space-between;
    margin-top: 20rem;
    display: flex;

    @include m.max(xs) {
      flex-direction: column;
    }
  }
</style>
