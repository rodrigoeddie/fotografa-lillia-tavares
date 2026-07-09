<script lang="ts" setup>
const cfImg = useCfImg();
const $route = useRoute();
const category = $route.params.category as string;

// SEO via DB — já aplica todos os meta tags reativamente (useSeoMeta + useHead)
// Deve ser chamado ANTES de qualquer await
usePageSeo('static', `/blog/${category}`);

const { categorias, titleFor } = await useBlogCategorias();
const categoryTitle = computed(() => titleFor(category));
const categoryDescription = computed(
  () => categorias.value.find((c) => c.slug === category)?.descricao ?? ''
);

// Schema.org estruturado para a página de listagem da categoria
useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: () => categoryTitle.value + ' | BLOG',
    url: `https://fotografalilliatavares.com.br/blog/${category}`,
  })
]);

const { data: rawPosts, refresh: refreshBlog } = await useFetch(`/api/public/blog?categoria=${category}`);

const postsData = computed(() =>
  ((rawPosts.value as any[] | null) ?? [])
    .map(adaptBlogPost)
    .sort((a: any, b: any) => new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime())
);

watch(() => $route.fullPath, () => refreshBlog(), { immediate: false });

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(date));
</script>

<template>
  <div class="container post-list">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Blog', to: '/blog' },
      { label: categoryTitle },
    ]" />
    <div class="category-header">
      <h1 class="title">{{ categoryTitle }}</h1>
      <p v-if="categoryDescription" class="category-description">{{ categoryDescription }}</p>
    </div>

    <SectionsBlogMenuCategories />

    <div class="wrap-posts">
      <article v-for="post in postsData" :key="post.id" class="post-item">
        <NuxtLink
          :to="post.path"
          :aria-label="'Ver post: ' + post.title"
          class="thumb-post">
          <nuxt-img
            v-if="post.image"
            provider="cloudflare"
            :src="cfImg(post.image.imageId)"
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
            <Icon
              name="icons:calendar-regular"
              class="icon icon-calendar"/>
            <time :datetime="post.date" class="time">{{ formatDate(post.date) }}</time>
            <NuxtLink :to="'/blog/' + post.category.slug" class="category-link">
              <Icon
                name="icons:category"
                class="icon icon-category"/>
              <span class="category">{{ titleFor(post.category.slug) }}</span>
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

.category-description {
  max-width: 720rem;
  padding: 10rem 0 5rem;
  color: v.$green;
  font-size: 18rem;
  line-height: 1.6;
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
  padding-top: 10px;
  margin-top: 20px;
  display: block;
  width: 32%;

  .subtitle {
    min-height: 63rem;
  }

  .description {
    padding-bottom: 20rem;
    min-height: 172rem;
    display: block;
  }

  .thumb-post {
    aspect-ratio: 3 / 2;
    margin-bottom: 30rem;
    overflow: hidden;
    width: 100%;
    display: block;

    .img-thumb {
      position: absolute;
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
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

      .icon {
        font-size: 22px;
        color: #666
      }
    }

    .icon {
      font-size: 18px;
    }
  }
}
</style>
