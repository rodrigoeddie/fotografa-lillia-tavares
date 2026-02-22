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
  <SectionsStudioAbout
    class="from-page-studio"
    :fromStudio="true" />
  <SectionsStudioBgs />
  <SectionsStudioCenarios />
  <SectionsStudioMap />
</template>
