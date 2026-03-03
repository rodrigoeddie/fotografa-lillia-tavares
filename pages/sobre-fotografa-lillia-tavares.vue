<script setup lang="ts">
const { data: sobre } = await useAsyncData('sobre-page', () => {
  return queryCollection('content').path('/pages/sobre').first()
});

const pageData = computed(() => sobre.value as any);

useSeoMeta({
  title: pageData.value?.title + ' - Lillia Tavares Fotografia',
  description: pageData.value?.description || '',
  ogTitle: pageData.value?.title + ' - Lillia Tavares Fotografia',
  ogDescription: pageData.value?.description || '',
  ogImage: `https://images.fotografalilliatavares.com.br/images/${pageData.value?.image?.id || '5aaf1433-aaa7-42ed-7198-15626f964000'}/public`,
  ogType: 'website'
});

useHead({
  title: pageData.value?.title + ' - Lillia Tavares Fotografia'
});
</script>

<template>
  <SectionsSobreContent />
</template>