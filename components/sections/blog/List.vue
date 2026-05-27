<script lang="ts" setup>
const { data: rawPosts } = await useFetch('/api/public/blog');

const posts = computed(() =>
  ((rawPosts.value as any[] | null) ?? [])
    .map(adaptBlogPost)
    .sort((a: any, b: any) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
);

const formatDate = (date: string) => new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
</script>

<template>
  <h1
    class="big-title green centered"
    data-ani-type="fade">
    Dicas e Inspirações Fotográficas
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
        <NuxtLink
          :to="post.path"
          :aria-label="'Ver post: ' + post.title"
          class="thumb-post">
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

        <div class="wrap-text">
          <h2 class="subtitle">
            <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
          </h2>
          <div class="description" v-if="post.description">
            {{ post.description }}
          </div>
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
      </article>
      <div class="post-item empty"></div>
      <div class="post-item empty"></div>
      <div class="post-item empty"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap-posts {
  justify-content: space-between;
  padding-bottom: v.$bigSpace;
  flex-wrap: wrap;
  display: flex;
  gap: 20rem 0;

  @include m.max(xs) {
    flex-direction: column;
  }
}

.post-item {
  box-shadow:
      0 1px 0 #ECE4D2,
      0 14px 30px -12px rgba(42, 37, 32, 0.25),
      0 4px 10px -4px rgba(42, 37, 32, 0.10);
  width: calc(25% - 15rem);
  background: white;

  @include m.max(lg) {
    width: calc(33% - v.$space/2);
  }

  @include m.max(md) {
    width: calc(50% - v.$space/2);
  }

  @include m.max(xs) {
    width: 100%;
  }

  .thumb-post {
    aspect-ratio: 2.8/2;
    overflow: hidden;
    display: block;
    width: 100%;

    .img-thumb {
      position: absolute;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }

  .wrap-text {
    justify-content: space-between;
    padding: 15rem 15rem 40rem 15rem;
    flex-direction: column;
    display: flex;
    
    .subtitle {
      border-bottom: 1px solid #ccc;
      min-height: 100rem;
      font-size: 24rem;
      color: v.$green;
      
      @include m.max(sm) {
        min-height: auto;
        padding-bottom: 10rem;
      }
    }
  
    .description {
      padding-bottom: 20rem;
      display: block;
  
      @include m.max(sm) {
        min-height: auto;
      }
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
    position: absolute;
    font-size: 18px;
    color: #666;
    display: flex;
    bottom: 15rem;
    right: 15rem;
    left: 15rem;

    @include m.max(sm) {
      margin-bottom: 0;
    }

    .time,
    .category-link {
      padding-top: 2rem;
      font-size: 11px;
      color: #999;
    }

    .category-link {
      align-items: center;
      display: flex;
      gap: 5px;

      .icon {
        font-size: 22rem;
        color: #666;
      }
    }
  }

  &.empty {
    box-shadow: none;
    background: transparent;
  }
}
</style>
