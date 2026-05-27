<script lang="ts" setup>
const $route = useRoute();
const path = $route.path;
const category = $route.params.category as string;
const slug = $route.params.slug as string;

const { data: rawPost } = await useFetch(`/api/public/blog/${category}/${slug}`);
const post = computed(() => rawPost.value ? adaptBlogPost(rawPost.value) : null);

const siteURI = 'https://fotografalilliatavares.com.br';

const breadcrumbs = computed(() => post.value ? [
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  { label: post.value.category?.title ?? category, to: '/blog/' + category },
  { label: post.value.title },
] : []);

// Meta tags + canonical via DB (page_seo)
usePageSeo('blog', slug);

// JSON-LD do post: campos dinâmicos (headline, image, datePublished) que dependem
// da entidade — não cabem em jsonld_data estático no DB. Mantido localmente.
useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    headline: computed(() => post.value?.title),
    description: computed(() => post.value?.description),
    image: computed(() => post.value?.image
      ? `https://images.fotografalilliatavares.com.br/images/${post.value.image.imageId}/public`
      : undefined),
    datePublished: computed(() => post.value?.date),
    author: { '@type': 'Person', name: 'Lillia Tavares', url: siteURI + '/sobre-fotografa-lillia-tavares' },
    url: siteURI + path,
  }),
]);

// Processar conteúdo com imagens intercaladas
const processedContent = computed(() => {
  if (!post.value?.content || !Array.isArray(post.value.content)) {
    return { content: [], endImages: [] };
  }

  const contentImages = post.value.contentImages || [];

  if (contentImages.length === 0) {
    return {
      content: post.value.content.map((block: any, idx: number) => ({ type: 'content', data: block, index: idx })),
      endImages: []
    };
  }

  const imagesForEnd = contentImages.filter((img: any) => img.showAtEnd === true);
  const imagesForContent = contentImages.filter((img: any) => img.showAtEnd !== true);

  const result: any[] = [];
  let imageIndex = 0;
  let paragraphCount = 0;

  post.value.content.forEach((block: any, idx: number) => {
    const paragraphMatches = block.match(/<p[^>]*>/g);
    const paragraphs = paragraphMatches ? paragraphMatches.length : 0;

    if (idx === 0 && imageIndex < imagesForContent.length) {
      result.push({ type: 'image', data: imagesForContent[imageIndex], position: imageIndex % 2 === 0 ? 'left' : 'right', index: imageIndex });
      imageIndex++;
    }

    result.push({ type: 'content', data: block, index: idx });
    paragraphCount += paragraphs;

    if (paragraphCount >= 3 && imageIndex < imagesForContent.length) {
      result.push({ type: 'image', data: imagesForContent[imageIndex], position: imageIndex % 2 === 0 ? 'left' : 'right', index: imageIndex });
      imageIndex++;
      paragraphCount = 0;
    }
  });

  return { content: result, endImages: imagesForEnd };
});
</script>

<template>
  <div class="container no-padding" :style="{ '--color-highlight': post?.colorHighlight }">
    <SectionsGeneralHero :data="post" :breadcrumbs="breadcrumbs" />

    <div class="blog-content">
      <template v-for="(item, idx) in processedContent.content" :key="idx">
        <!-- Renderizar imagem -->
        <div
          v-if="item.type === 'image'"
          class="content-image"
          :class="[item.position, item.data?.customClass]">
          <nuxt-img
            v-if="item.data?.imageId"
            provider="cloudflare"
            :src="`https://images.fotografalilliatavares.com.br/images/${item.data.imageId}/public`"
            :width="item.data.width"
            :height="item.data.height"
            :alt="item.data.alt || post?.title"
            format="webp"
            placeholder
            loading="lazy"
            class="img-content"
          />
        </div>

        <div v-else-if="item.type === 'content'" class="description" v-html="item.data"></div>
      </template>
      <div style="clear: both;"></div>

      <!-- Imagens do final agrupadas -->
      <div v-if="processedContent.endImages.length > 0" class="end-images-group">
        <div
          v-for="(image, idx) in processedContent.endImages"
          :key="`end-${idx}`"
          class="content-image centered"
          :class="image.customClass">
          <picture>
        <source
          v-if="image.mobileImageId"
          media="(max-width: 768px)"
          :srcset="`https://images.fotografalilliatavares.com.br/images/${image.mobileImageId}/public`"
        />
        <nuxt-img
          provider="cloudflare"
          :src="`https://images.fotografalilliatavares.com.br/images/${image.imageId}/public`"
          :width="image.width"
          :height="image.height"
          :alt="image.alt || post?.title"
          format="webp"
          placeholder
          loading="lazy"
          class="img-content"
        />
          </picture>
        </div>
      </div>
    </div>

    <SectionsGeneralGallery v-if="post?.album" :album="post.album" />

    <div v-if="post" class="blog-share container">
      <BlocksShareButtons :title="post.title" />
    </div>

    <SectionsPortfolioList v-if="post?.works" :category="post.works" class="blog-portfolio" />
    <ClientOnly><SectionsScheduleTinyform v-if="post?.showSchedule === true" :formType="post.title" /></ClientOnly>
  </div>
</template>

<style scoped lang="scss">
.container {
  background-color: white;
  margin-bottom: 30rem;
  padding: 30rem;

  .blog-content {
    color: var(--color-highlight, v.$dark-green);
    position: relative;
    padding: 30rem;

    .content-image {
      margin: 23rem 0;

      &.left {
        float: left;
        margin-right: 50rem;
        margin-bottom: 50rem;
        width: 28%;

        @media (max-width: 768px) {
          width: 100%;
        }
      }

      &.right {
        float: right;
        margin-left: 50rem;
        width: 28%;
        margin-bottom: 50rem;

        @media (max-width: 768px) {
          width: 100%;
        }
      }

      &.centered {
        float: none;
        margin: 20rem auto 50rem;
        display: block;
        text-align: center;
      }

      .img-content {
        width: 100%;
        height: auto;
        box-shadow: 0 4rem 8rem rgba(0, 0, 0, 0.1);
      }
    }

    .end-images-group {
      margin-top: 50rem;
      padding-top: 30rem;
      border-top: 1px solid #eee;
      display: flex;
      flex-wrap: wrap;
      gap: 20rem;
      justify-content: center;

      .content-image {
        margin: 0;

        &.w33 {
          width: calc(33.333% - 13.333rem);
        }

        &.w50 {
          width: calc(50% - 10rem);
        }
      }
    }

    :deep(div) {
      quote {
        padding: 15rem;
        display: inline-block;
        background: #e9e8e1;
        color: v.$green;
        font-size: 19rem;
        font-style: italic;
        margin-top: 10rem;
      }
      
      h2 {
        color: v.$green;
        font-size: 28rem;
        margin: 40rem 0 20rem;
        font-weight: bold;
      }
      
      ul {
        padding-left: 40rem;
        margin: 20rem 0;
        
        li {
          margin-bottom: 10rem;
          list-style: disc;
          font-size: 19rem;
          color: v.$green;
        }
      }

      .link-interno {
        text-decoration: none;
        display: inline-block;
        font-size: 19rem;
        padding: 10rem 8rem;
      }

      p:first-child {
        background: #f9f9f7;
        line-height: 1.5em;
        font-size: 23rem;
        color: #6a674f;
        padding: 20px;
        border-left: 5px v.$green;
      }
    }
  }

  :deep(.subtitle) {
    padding-top: 20rem;
  }

  :deep(.rows) {
    flex-wrap: wrap;
    display: flex;
    gap: 15rem;
    padding: 30rem 0;
    clear: both;

    > div {
      background: whitesmoke;
      border-radius: 5rem;
      padding: 15rem;
      width: calc(50% - 7.5rem);

      p {
        padding-left: 28rem;
      }
    }
  }

  // Responsivo
  @media (max-width: 768px) {
    .blog-content {
      .content-image {
        &.left,
        &.right {
          float: none;
          margin: 20rem auto;
          display: block;
        }

        &.w33,
        &.w50 {
          width: 100%;
        }
      }

      .end-images-group {
        .content-image {
          &.w33,
          &.w50 {
            width: 100%;
          }
        }
      }
    }
  }
}

.blog-share {
  padding: 10rem 30rem 20rem;
}
</style>