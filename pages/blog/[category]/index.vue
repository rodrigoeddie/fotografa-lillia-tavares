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
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
  
    <div class="wrap-posts">
      <article v-for="post in postsData" :key="post.id" class="post-item">
        <NuxtLink :to="post.path">
          <nuxt-img
            v-if="post.image"
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/" + post.image.imageId + "/public"'
            :width="690"
            :height="460"
            :sizes="'100vw md:50vw lg:690px'"
            class="img-thumb"
            :alt="'Imagem do post ' + post.title"
            placeholder
            loading="lazy"/>
        </NuxtLink>
        <div class="text">
          <h2 class="subtitle">
            <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
          </h2>
          <div class="description" v-if="post.description">
            {{ post.description }}
          </div>
          <div class="post-meta">
            <nuxt-icon
              name="calendar-regular"
              class="icon icon-calendar"/>
            <time :datetime="post.date" class="time">{{ formatDate(post.date) }}</time>
            <NuxtLink :to="'/blog/' + post.category" class="category-link">
              <nuxt-icon
                name="category"
                class="icon icon-category"/>
              <span class="category">{{ post.categoryTitle }}</span>
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>
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

.wrap-posts {
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;
}

.post-list {
  margin: 0 auto 30rem;
  background: white;
  padding: 20px;
}

.post-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 20rem;
  flex-direction: column;
  padding-top: 10px;
  margin-top: 20px;
  display: flex;
  gap: 30rem 0;
  width: 32%;
  
  .subtitle {
    min-height: 63rem;
  }

  .description {
    padding-bottom: 20rem;
    min-height: 172rem;
    display: block;
  }
  
  .img-thumb {
    height: auto;
    width: 100%;
  }

  &:last-child {
    border-bottom: none;
  }

  .post-meta {
    margin-bottom: 15px;
    align-items: center;
    font-size: 18px;
    color: #666;
    display: flex;
    gap: 10px;

    .time,
    .category-link {
      padding-top: 2rem;
      font-size: 13px;
      color: #999;
    }

    .category-link {
      padding-left: 20rem;
      align-items: center;
      display: flex;
      gap: 10px;

      .nuxt-icon {
        font-size: 22px;
        color: #666
      }
    }

    .nuxt-icon {
      font-size: 18px;
    }
  }
}
</style>
