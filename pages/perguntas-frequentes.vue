<script setup lang="ts">
const { data: rawFaq } = await useFetch('/api/public/faq');

const faqTitle = 'Perguntas Frequentes sobre Ensaio Fotográfico em Mogi das Cruzes | Lillia Tavares';
const faqDescription = 'Tire suas dúvidas sobre ensaios fotográficos profissionais em Mogi das Cruzes: preços, agendamento, pacotes e mais.';
const faqLink = 'https://fotografalilliatavares.com.br/perguntas-frequentes';
const faqImage = 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public';

// Build FAQ structured data for FAQPage schema
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
    name: faqTitle,
    url: faqLink,
    mainEntity: allQuestions.value
  })
]);

useHead({
  title: faqTitle,
  link: [
    {
      rel: 'canonical',
      href: faqLink
    }
  ]
});

useSeoMeta({
  title: faqTitle,
  description: faqDescription,
  ogTitle: faqTitle,
  ogDescription: faqDescription,
  ogUrl: faqLink,
  ogImage: faqImage,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: faqTitle,
  twitterDescription: faqDescription,
  twitterImage: faqImage,
});
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