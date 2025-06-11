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
});

const { data: posts } = await queryCollection('blog').all();
console.log(posts);
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};
</script>

<template>
  <div class="post-list">
    <h1>BLOG</h1>
    <article v-for="post in posts" :key="post._id" class="post-item">
      <h2>
        <NuxtLink :to="post._path">{{ post.title }}</NuxtLink>
      </h2>
      <div class="post-meta">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span class="category">{{ post.category }}</span>
      </div>
      <div class="post-excerpt" v-if="post.excerpt">
        {{ post.excerpt }}
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.post-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-item {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  .category {
    background: #f0f0f0;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }
}

.post-excerpt {
  color: #666;
  line-height: 1.5;
}
</style>
