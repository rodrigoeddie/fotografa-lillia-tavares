<script lang="ts" setup>
const title = 'Sobre o Estúdio';
const description = 'O estúdio está localizado em Mogi das cruzes, no coração da cidade, com ótimas opções para estacionamento e transportes.';

useSchemaOrg([
  defineWebPage({
    name: title + ' | Fotógrafa Lillia Tavares',
    url: 'https://fotografalilliatavares.com.br/estudio'
  }),
  defineLocalBusiness({
    '@type': 'LocalBusiness',
    name: 'Estúdio Fotográfico Lillia Tavares',
    image: 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/0e29fb7d-191c-4447-7a71-95448ed4fd00/public', // Substitua pela URL da imagem do estúdio
    '@id': 'https://fotografalilliatavares.com.br/estudio',
    url: 'https://fotografalilliatavares.com.br/estudio',
    telephone: '+55-11-9111-59795',
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday'
        ],
        opens: '09:00',
        closes: '18:00'
      },
    ],
    sameAs: [
      'https://www.facebook.com/fotografalilliatavares',
      'https://www.instagram.com/fotografalilliatavares',
      'https://www.tiktok.com/@fotografalilliatavares',
      'https://wa.me/5511911159795',
    ]
  })
]);

useSeoMeta({
  title: title,
  description: description
});

const configPublic = useRuntimeConfig().public;
</script>

<template>
  <div class="container">
      <NuxtLink
      class="hero"
      to="blog/cenarios-tematicos/nosso-cenario-do-natal-2025">
          <picture>
              <source
                  :srcset="configPublic.cloudflareURI + '308d3d3e-4db0-4d27-a9f4-cddf45d84500/public'"
                  media="(max-width: 768px)"
                  width="768"
                  height="1152">
              <nuxt-img
                  :src="configPublic.cloudflareURI + 'bf482491-462d-4e2e-1500-2fceba068700/public'"
                  width="1920"
                  height="681"
                  class="img-hero"
                  alt="Natal 2025" />
          </picture>
      </NuxtLink>
  </div>
  <SectionsStudio
    class="from-page-studio"
    :fromStudio="true" />
  <SectionsStudioBgs />
  <SectionsStudioCenarios />
  <SectionsStudioMap />
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
