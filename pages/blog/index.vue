<script lang="ts" setup>
const title = 'Blog da fotógrafa Lillia Tavares';
const description = 'Um pouco de curiosidades, novidades, e conhecimentos da fotógrafa Lillia Tavares';

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: title,
    url: 'https://fotografalilliatavares.com.br/blog',
  })
]);

useSeoMeta({
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://fotografalilliatavares.com.br/blog',
});

useHead({
  link: [{ rel: 'canonical', href: 'https://fotografalilliatavares.com.br/blog' }]
});
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Blog' },
    ]" />
  </div>
  <SectionsBlogList/>
</template>

<style scoped lang="scss">
</style>
