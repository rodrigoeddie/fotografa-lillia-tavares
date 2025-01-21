<script lang="ts" setup>
const $route   = useRoute();
const slug     = $route.params.slug;
const category = $route.params.category;
const QUERY    = `
{
  allCategories {
    id
    title
    slug
  }
  allEnsaios {
    id
    slug
    title
    description
    local
    instagram {
      value
    }
    quote
    color {
      hex
    }
    category {
      id
      title
      slug
    }
    hero {
      id
      alt
      blurUpThumb
      format
      height
      width
      url
    }
    photos {
      id
      alt
      url
      title
      format
      blurUpThumb
      customData
    }
    seo {
      description
      image {
        url
      }
      title
    }
    _status
    _updatedAt
    _firstPublishedAt
  }
  _allEnsaiosMeta {
    count
  }
}
`;

const { data, error } = await useGraphqlQuery({ query: QUERY });
const activeCategory = data.value.allCategories.find(categoryItem => categoryItem.slug === category);

const ensaio = data.value.allEnsaios.filter(ensaioItem => ensaioItem.slug === slug)[0];

useSeoMeta({
  title: ensaio.seo.title,
  ogTitle: ensaio.seo.title,
  description: ensaio.seo.description,
  ogDescription: ensaio.seo.description,
  ogImage: ensaio.seo.image,
  twitterCard: ensaio.seo.image,
})
</script>

<template>
  <h1 class="title">{{ ensaio.title }}</h1>

  <nav>
    <template v-for="category in data.allCategories">
      <NuxtLink
        :to="'/trabalhos/' + category.slug"
        :class="{ 'active' : activeCategory.slug === category.slug }">
        <span>{{ category.title }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>

<style scoped>
.title {
  color: black;
}
</style>
