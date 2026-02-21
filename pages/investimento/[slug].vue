<script setup>
const path = useRoute().path;

// Carrega usando queryCollection que funciona com content.config.ts
const { data: pageData } = await useAsyncData(path, () => {
  return queryCollection('investimento').path(path).first();
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
