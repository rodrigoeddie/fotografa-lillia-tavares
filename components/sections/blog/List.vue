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
  <h1
    class="big-title green centered"
    data-ani-type="fade">
    <span class="box">
      Dicas e Inspirações
    </span>
    <span class="big">
      Fotográficas
    </span>
  </h1>

  <div class="container">
    <div class="wrap-posts">
      <article
        v-for="post in posts"
        :key="post.id"
        class="post-item"
        data-ani-type="polaroid"
        data-ani-batch="wrap-posts"
        data-ani-stagger="0.07">
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
            <span
              class="category-link">
              <Icon
                name="icons:calendar-regular"
                class="icon icon-calendar"/>
              <time :datetime="post.date" class="time">{{ formatDate(post.date) }}</time>
            </span>
            <NuxtLink
              :to="'/blog/' + post.category.slug"
              class="category-link">
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
  padding-bottom: v.$bigSpace;
  flex-wrap: wrap;
  display: flex;
  gap: 15rem 0;

  @include m.max(xs) {
    flex-direction: column;
  }
}

.post-item {
  width: calc(25% - v.$space/2);
  border: 1px solid v.$green;
  flex-direction: column;
  background: white;
  display: flex;

  @include m.max(lg) {
    width: calc(33% - v.$space/2);
  }

  @include m.max(md) {
    width: calc(50% - v.$space/2);
  }

  @include m.max(xs) {
    width: 100%;
  }

  .text {
    padding: v.$space;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .subtitle {
    color: v.$green;

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
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    color: #666;
    display: flex;

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
      align-items: center;
      display: flex;
      gap: 5px;

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
