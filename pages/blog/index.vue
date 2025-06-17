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

const posts = await queryCollection('blog')
                      .where('id', 'NOT LIKE', `%/index.md%`)
                      .all();

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
    <h1 class="title">BLOG</h1>

    <article v-for="post in posts" :key="post.id" class="post-item">
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
  background: white;
  margin: 0 auto 30rem;
  padding: 20px;
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
