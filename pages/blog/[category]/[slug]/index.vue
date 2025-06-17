<script lang="ts" setup>
const path = useRoute().path

const { data: post } = await useAsyncData(path, () => {
  return queryCollection('blog').path(path).first()
});

// Se você quiser listar posts relacionados por data:
// const { data: relatedPosts } = await useAsyncData('related-posts', () => {
//   return queryCollection('blog')
//     .where('category', post.value?.category)
//     .where('path', '!=', path)
//     .sort([{ date: -1 }]) // -1 para mais recente primeiro, 1 para mais antigo primeiro
//     .limit(5)
//     .all()
// });

const title = post.value.title + ' | Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';

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
        name: post.value.categoryTitle,
        item: siteURI + '/blog/' + post.value.category
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

    <SectionsPortfolio :category="post.works" />
  </div>  
</template>

<style scoped lang="scss">
.container {
  background-color: white;
  margin-bottom: 30rem;
  padding: 30rem;
}
</style>