<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;
const pageUrl = `https://fotografalilliatavares.com.br/precos-ensaios-fotograficos/${slug}`;

// SEO/SchemaOrg precisam ser chamados ANTES de qualquer await (preserva contexto Nuxt).
// Os valores reativos virão de `pageData` depois que o useFetch resolver.
const produtos = useFetch('/api/public/investimento').data;

const { data: rawPortfolio } = useFetch(`/api/public/portfolio?categoria=${slug}`);
const portfolioItems = computed(() => {
  const works = (rawPortfolio.value as any[] | null) ?? [];
  return works.map(adaptPortfolioWork).slice(0, 4);
});

const pageData = computed(() => {
  const list = produtos.value as any[] | null;
  const found = list?.find((p: any) => p.slug === slug);
  return found ? adaptProduto(found) : null;
});

useSeoMeta({
  title:              () => pageData.value ? `${pageData.value.title} | Ensaio Fotográfico em Mogi das Cruzes | Lillia Tavares` : 'Preços de Ensaios | Lillia Tavares',
  description:        () => pageData.value?.description ?? `Confira os pacotes e preços para ensaio fotográfico em Mogi das Cruzes e Alto Tietê com a fotógrafa Lillia Tavares.`,
  ogTitle:            () => pageData.value ? `${pageData.value.title} | Ensaio Fotográfico em Mogi das Cruzes` : 'Preços de Ensaios',
  ogDescription:      () => pageData.value?.description ?? undefined,
  ogUrl:              pageUrl,
  ogImage:            'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
  twitterCard:        'summary_large_image',
  twitterTitle:       () => pageData.value?.title,
  twitterDescription: () => pageData.value?.description ?? undefined,
  twitterImage:       'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public',
});

useHead({
  link: [{ rel: 'canonical', href: pageUrl }],
});

useSchemaOrg([
  defineWebPage({
    name: () => pageData.value?.title ? `${pageData.value.title} | Lillia Tavares` : 'Preços de Ensaios',
    url: pageUrl,
  }),
  {
    '@type': 'Service',
    '@id': pageUrl + '#service',
    name: computed(() => pageData.value?.title),
    description: computed(() => pageData.value?.description),
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

    <div v-if="portfolioItems.length > 0" class="portfolio-section">
      <div class="container">
        <h2 class="portfolio-title" data-ani-type="fade">Conheça meus trabalhos</h2>
        <div class="wrap-portfolio">
          <BlocksCardSimplePortfolio
            v-for="(item, index) in portfolioItems"
            :key="item.path"
            :item="item"
            :eager="index === 0"
            class="lenght-items-4"
            data-ani-type="polaroid"
            data-ani-batch="wrap-portfolio"
            data-ani-stagger="0.07"
          />
        </div>
        <div class="ac">
          <NuxtLink :to="`/ensaio-fotografico/${slug}`" class="btn" data-ani-type="fade">
            <span>Ver todos os trabalhos</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.portfolio-section {
  padding: 60rem 0 80rem;
}

.portfolio-title {
  color: v.$green;
  text-align: center;
  margin-bottom: 30rem;
}

.wrap-portfolio {
  display: flex;
  flex-wrap: wrap;
  gap: 20rem;

  @include m.max(xs) {
    gap: 10rem;
  }
}

.ac {
  text-align: center;
  margin-top: 30rem;
}
</style>
