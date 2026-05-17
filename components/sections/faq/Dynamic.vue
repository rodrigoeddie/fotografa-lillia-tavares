<script setup lang="ts">
const route = useRoute();

const { data: config } = await useFetch('/api/public/page-faq', {
  query: computed(() => ({ route: route.path })),
  key: 'page-faq-dynamic',
});
</script>

<template>
  <SectionsFaqBlock v-if="config?.faq_slug" :slug="config.faq_slug" />
</template>
