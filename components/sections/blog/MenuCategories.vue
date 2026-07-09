<script setup lang="ts">
const { categorias } = await useBlogCategorias();

const categories = computed(() =>
  categorias.value.map((c) => ({
    slug: c.slug,
    title: c.titulo,
    path: `/blog/${c.slug}`,
  }))
);
</script>

<template>
  <nav v-if="categories.length" class="menu-category" aria-label="Categorias do blog">
    <NuxtLink to="/blog" class="link-category" :exact-active-class="'router-link-active'">
      <span class="category-label">Todas</span>
    </NuxtLink>

    <NuxtLink
      v-for="item in categories"
      :key="item.slug"
      :to="item.path"
      class="link-category">
      <span class="category-label">{{ item.title }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped lang="scss">
.menu-category {
  justify-content: center;
  padding: 15rem 0 25rem;
  flex-wrap: wrap;
  display: flex;
  width: 100%;
  gap: 15rem;
}

.link-category {
  transition: background-color 0.2s, color 0.2s;
  border: 1px solid v.$green;
  border-radius: 5rem;
  align-items: center;
  background: white;
  padding: 10rem 20rem;
  color: v.$green;
  font-size: 18rem;
  line-height: 1em;
  display: flex;

  @include m.max(sm) {
    font-size: 16rem;
  }

  &.router-link-active {
    background-color: v.$green;
    color: white;
  }

  &:not(.router-link-active):hover {
    background: transparent;
  }
}
</style>
