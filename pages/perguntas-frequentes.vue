<script setup lang="ts">
const { data: faqData } = await useAsyncData('faq', () => {
  return queryCollection('faq').first();
});

useHead({
  title: (faqData.value?.title ?? '') + ' - Lillia Tavares Fotografia',
  meta: [{ name: 'description', content: faqData.value?.description ?? '' }]
});

useSeoMeta({
  title: (faqData.value?.title ?? '') + ' - Lillia Tavares Fotografia',
  description: faqData.value?.description ?? '',
  ogTitle: (faqData.value?.title ?? '') + ' - Lillia Tavares Fotografia',
  ogDescription: faqData.value?.description ?? '',
  ogType: 'website'
});
</script>

<template>
  <SectionsFaqPage />
</template>