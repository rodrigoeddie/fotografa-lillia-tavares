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

// SEO
useHead({
  title: pageData.value.title || 'Investimento',
  meta: [
    { name: 'description', content: pageData.value.description || '' }
  ]
});
</script>

<template>
  <div v-if="pageData">
    <SectionsPricingPageContent :data="pageData" />
  </div>
</template>
