<script lang="ts" setup>
const {
  data: allCategories
} = await useAsyncData(() => {
  return queryCollection('categories').all();
});

const categories = allCategories.value[0].body.categories;
</script>

<template>
  <nav>
    <template v-for="category in categories">
      <NuxtLink
        :to="'/trabalhos' + category.slug">
        <span>{{ category.title }}</span>
      </NuxtLink>
    </template>
  </nav>
</template>

<style scoped></style>
