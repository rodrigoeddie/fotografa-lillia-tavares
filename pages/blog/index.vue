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
const posts = (await queryCollection('blog')
  .where('id', 'NOT LIKE', `%/index.md%`)
  .all())
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

    <div class="wrap-posts">
      <article v-for="post in posts" :key="post.id" class="post-item">
        <nuxt-img
          v-if="post.image"
          provider="cloudflare"
          :src='"https://images.fotografalilliatavares.com.br/images/" + post.image + "/public"'
          :width="690"
          :height="460"
          :sizes="'100vw md:50vw lg:690px'"
          class="img-thumb"
          :alt="'Imagem do post ' + post.title"
          placeholder
          loading="lazy"/>
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
