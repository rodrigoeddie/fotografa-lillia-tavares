<script setup lang="ts">
const { data: rawFaq } = await useFetch('/api/public/faq');

usePageSeo('static', '/perguntas-frequentes');

const allQuestions = computed(() =>
  (rawFaq.value ?? []).flatMap((cat: any) =>
    (cat.perguntas ?? []).map((q: any) => ({
      '@type': 'Question' as const,
      name: q.pergunta,
      acceptedAnswer: { '@type': 'Answer' as const, text: q.resposta },
    }))
  )
);

useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
    mainEntity: allQuestions.value,
  }),
]);
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Perguntas Frequentes' },
    ]" />
  </div>
  <SectionsFaqPage />
</template>