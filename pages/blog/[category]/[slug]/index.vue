<script lang="ts" setup>
const path = useRoute().path

const { data: post } = await useAsyncData(path, () => {
  return queryCollection('blog').path(path).first()
});

// const { data: navigation } = await useAsyncData('navigation', () => {
//   return queryCollectionNavigation('works');
// });

const title     = post.value.title + ' | Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';

const siteURI = 'https://fotografalilliatavares.com.br';

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
    name: title,
    url: siteURI + path,
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteURI
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: siteURI + '/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.value.category.title,
        item: siteURI + '/blog/' + post.value.category.slug
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.value.title,
        item: siteURI + path
      }
    ]
  })
]);

useSeoMeta({
  title: title,
  description: post.value.description
});

</script>

<template>
  <div class="container">
    <h1 class="title">BLOG</h1>

    <h2 class="subtitle">{{ post.title }}</h2>
    <p class="description">{{ post.description }}</p>
  </div>
</template>

<style scoped lang="scss">
.container {
  background-color: white;
  margin-bottom: 30rem;
  padding: 30rem;
}
</style>
