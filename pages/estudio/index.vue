<script lang="ts" setup>
const title = 'Estúdio Fotográfico em Mogi das Cruzes | Lillia Tavares';
const description = 'Conheça o estúdio fotográfico de Lillia Tavares em Mogi das Cruzes. Localizado no centro da cidade, com cenários exclusivos, iluminação profissional e fácil acesso para toda a região do Alto Tietê.';

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

const estudioLink = 'https://fotografalilliatavares.com.br/estudio';
const estudioImage = 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: estudioLink,
  ogImage: estudioImage,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: estudioImage,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: estudioLink
    }
  ]
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
