<script setup lang="ts">
const { data: rawFaq } = await useFetch('/api/public/faq');

await usePageSeo('static', '/perguntas-frequentes');

// FAQPage schema com mainEntity dinâmico (perguntas vindas do API).
// Mantido localmente porque o conteúdo é dinâmico e não cabe num jsonld_data
// estático no DB. As metas básicas (title/description/og/canonical) vêm via
// usePageSeo acima. O jsonld_type='FAQPage' do registro é apenas informativo.
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