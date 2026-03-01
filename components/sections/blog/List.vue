<script lang="ts" setup>
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
        <NuxtLink :to="post.path" :aria-label="'Ver post: ' + post.title">
          <nuxt-img
            v-if="post.image"
            provider="cloudflare"
            :src='"https://images.fotografalilliatavares.com.br/images/" + post.image.imageId + "/public"'
            :width="822"
            :height="548"
            :sizes="'100vw md:50vw lg:822px'"
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
            <Icon
              name="icons:calendar-regular"
              class="icon icon-calendar"/>
            <time :datetime="post.date" class="time">{{ formatDate(post.date) }}</time>
            <NuxtLink :to="'/blog/' + post.category.slug" class="category-link">
              <Icon
                name="icons:category"
                class="icon icon-category"/>
              <span class="category">{{ post.category.title }}</span>
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

  @include m.max(sm) {
    flex-direction: column;
  }
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
  width: 49.5%;

  @include m.max(sm) {
    gap: 15rem 0;
    width: 100%;
  }

  .subtitle {
    @include m.max(sm) {
      min-height: auto;
    }
  }

  .description {
    padding-bottom: 20rem;
    display: block;

    @include m.max(sm) {
      min-height: auto;
    }
  }

  .img-thumb {
    height: auto;
    width: 100%;

    @include m.max(sm) {
      aspect-ratio: 200 / 110;
      object-fit: cover;
      height: 100%;
    }
  }

  &:last-child {
    @include m.max(sm) {
      border-bottom: none;
    }
  }

  .post-meta {
    margin-bottom: 15px;
    align-items: center;
    font-size: 18px;
    color: #666;
    display: flex;
    gap: 10px;

    @include m.max(sm) {
      margin-bottom: 0;
    }

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

      .icon {
        font-size: 22px;
        color: #666;
      }
    }

    .icon {
      font-size: 18px;
    }
  }
}
</style>
