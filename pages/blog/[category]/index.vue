<script lang="ts" setup>
const $route = useRoute();
const category = $route.params.category as string;

const categoryData = await queryCollection('blog')
                              .where('path', 'LIKE', `%/${category}%`)
                              .where('id', 'LIKE', `%/index.md%`)
                              .first();

const { data: posts, refresh: refreshBlog } = await useAsyncData(
  `posts-${category}`,
  () => {
    const query = queryCollection('blog');
    
    query.where('path', 'LIKE', `%/${category}%`);
    query.where('id', 'NOT LIKE', `%/index.md%`);

    return query.all();
  }
);

const categoryTitle = categoryData.value?.title || category;
const categoryDescription = categoryData.value?.description || '';

const title = categoryTitle + ' | BLOG';
const description = categoryDescription || 'Blog de Lillia Tavares Fotografia, onde compartilho dicas, histórias e novidades sobre fotografia de ensaio.';

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: title,
    url: `https://fotografalilliatavares.com.br/blog/${category}`,
  })
]);

useSeoMeta({
  title: title,
  description: description,
});

const postsData = computed(() => {
  if (!posts.value || !Array.isArray(posts.value)) {
    return [];
  }

  return posts.value
    .map((item: any) => {
      return {
        ...item,
        ...(item.body as any),
      };
    });
});

watch(
  () => $route.fullPath,
  () => {
    refreshBlog();
  },
  { immediate: false }
);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};
</script>

<template>
  <div class="container post-list">
    <div v-if="categoryData" class="category-header">
      <h1 class="title">{{ categoryData.title }}</h1>
      <p v-if="categoryData.description" class="description">{{ categoryData.description }}</p>

      <div class="category-content description" v-if="categoryData.body">
        <ContentRenderer :value="categoryData" />
      </div>
    </div>
    <h1 v-else>{{ categoryTitle }}</h1>
  
    <article v-for="post in postsData" :key="post.id" class="post-item">
      <h2 class="subtitle">
        <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
      </h2>
      <div class="description" v-if="post.description">
        {{ post.description }}
      </div>
      <div class="post-meta">
        <time :datetime="post.date" class="time">{{ formatDate(post.date) }}</time>
        <NuxtLink :to="'/blog/' + post.category">
          <span class="category">{{ post.categoryTitle }}</span>
        </NuxtLink>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.post-list {
  margin: 0 auto 30rem;
  background: white;
  padding: 20px;
}

:deep(h2) {
  font-weight: bold;
  font-size: 25rem;
}
:deep(h2 + *) {
  padding-bottom: 30rem;
  padding-top: 15rem;
}

.time {
  font-size: 12px;
}

.post-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 20rem;
  padding-top: 10px;
  margin-top: 20px;

  &:last-child {
    border-bottom: none;
  }
}

.post-meta {
  margin-bottom: 15px;
  font-size: 18px;
  display: flex;
  color: #666;
  gap: 15px;

  .category {
    background: #f0f0f0;
    padding: 5px 15px;
    border-radius: 4px;
  }
}

.description {
  padding-bottom: 20rem;
  display: block;
}

.post-meta {
  align-items: center;
  display: flex;
}
</style>
