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
  }),
  defineLocalBusiness({
    name: 'Fotógrafa Lillia Tavares',
    image: 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
    '@id': 'https://fotografalilliatavares.com.br',
    url: 'https://fotografalilliatavares.com.br',
    telephone: '+55-11-9111-59795',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Av. Ver. Narciso Yague Guimarães, 124 - Sala 21 - Vila Partenio',
      addressLocality: 'Mogi das Cruzes',
      addressRegion: 'SP',
      postalCode: '08780-200',
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-23.5199319',
      longitude: '-46.1864729'
    },
    sameAs: [
      'https://www.facebook.com/fotografalilliatavares',
      'https://www.instagram.com/fotografalilliatavares',
    ],
  }),
]);

const homeOgImage = 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public';

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
  ogImageAlt: 'Fotógrafa Lillia Tavares segurando sua câmera fotográfica'
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
