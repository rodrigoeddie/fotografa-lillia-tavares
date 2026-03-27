<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

// O conteúdo fica em /investimento/{slug} mas a URL é /precos-ensaios-fotograficos/{slug}
const { data: pageData } = await useAsyncData(`investimento-${slug}`, () => {
  return queryCollection('investimento').path(`/investimento/${slug}`).first();
});

// Se não encontrar, redireciona para 404
if (!pageData.value) {
  throw createError({
    statusCode: 404,
    message: 'Página não encontrada'
  });
}

const pageTitle = `${pageData.value.title ? pageData.value.title + ' |' : 'Preços |'} Ensaio Fotográfico em Mogi das Cruzes | Lillia Tavares`;
const pageDescription = pageData.value.description || `Confira os pacotes e preços para ensaio fotográfico ${pageData.value.title || ''} em Mogi das Cruzes e Alto Tietê com a fotógrafa Lillia Tavares.`;
const pageUrl = `https://fotografalilliatavares.com.br/precos-ensaios-fotograficos/${slug}`;

useSchemaOrg([
  defineWebPage({
    name: pageTitle,
    url: pageUrl
  })
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
    <SectionsPrecosInternal :data="pageData" />
  </div>
</template>
