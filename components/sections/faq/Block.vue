<script setup lang="ts">
defineProps<{ slug: string }>();

const { data: rawFaq } = await useFetch('/api/public/faq', { key: 'faq-block' });
const categories = computed(() => (rawFaq.value ?? []).map(adaptFaqCategoria));
</script>

<template>
  <SectionsFaqSection :categories="categories" :slug="slug" />
</template>
