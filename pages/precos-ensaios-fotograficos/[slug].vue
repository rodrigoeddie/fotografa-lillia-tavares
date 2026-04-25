<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { data: produtos } = await useFetch('/api/public/investimento');

const pageData = computed(() => {
  const found = (produtos.value as any[] | null)?.find((p: any) => p.slug === slug);
  return found ? adaptProduto(found) : null;
});

// Se não encontrar, redireciona para 404
if (!pageData.value && process.server) {
  throw createError({ statusCode: 404, message: 'Página não encontrada' });
}

const pageTitle = `${pageData.value.title ? pageData.value.title + ' |' : 'Preços |'} Ensaio Fotográfico em Mogi das Cruzes | Lillia Tavares`;
const pageDescription = pageData.value.description || `Confira os pacotes e preços para ensaio fotográfico ${pageData.value.title || ''} em Mogi das Cruzes e Alto Tietê com a fotógrafa Lillia Tavares.`;
const pageUrl = `https://fotografalilliatavares.com.br/precos-ensaios-fotograficos/${slug}`;

useSchemaOrg([
  defineWebPage({
    name: pageTitle,
    url: pageUrl
  }),
  {
    '@type': 'Service',
    '@id': pageUrl + '#service',
    name: computed(() => pageData.value?.title),
    description: pageDescription,
    url: pageUrl,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Fotógrafa Lillia Tavares',
      url: 'https://fotografalilliatavares.com.br',
      telephone: '+55-11-9111-59795',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Av. Ver. Narciso Yague Guimarães, 124 - Sala 21',
        addressLocality: 'Mogi das Cruzes',
        addressRegion: 'SP',
        postalCode: '08780-200',
        addressCountry: 'BR'
      }
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: '-23.5199319', longitude: '-46.1864729' },
      geoRadius: '50000'
    },
    offers: computed(() => (pageData.value?.packages ?? []).map((pkg: any) => ({
      '@type': 'Offer',
      name: pkg.title,
      description: pkg.subtitle,
      price: pkg.price,
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: pageUrl,
    }))),
  }
]);

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogUrl: pageUrl,
  ogImage: 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
  twitterCard: 'summary_large_image',
  twitterTitle: pageTitle,
  twitterDescription: pageDescription,
  twitterImage: 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: pageUrl
    }
  ]
});
</script>

<template>
  <div v-if="pageData">
    <div class="container">
      <BlocksBreadcrumb :items="[
        { label: 'Home', to: '/' },
        { label: 'Preços de Ensaios', to: '/precos-ensaios-fotograficos' },
        { label: pageData.title || 'Pacote' },
      ]" />
    </div>
    <SectionsPrecosInternal :data="pageData" />
  </div>
</template>
