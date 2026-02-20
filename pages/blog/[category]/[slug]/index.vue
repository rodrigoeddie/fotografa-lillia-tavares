<script lang="ts" setup>
const path = useRoute().path

const { data: post } = await useAsyncData(path, () => {
  return queryCollection('blog').path(path).first()
});

const title = post.value.title + ' | Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';

const siteURI = 'https://fotografalilliatavares.com.br';

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
    name: title,
    url: siteURI + path,
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteURI
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: siteURI + '/blog'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.value.categoryTitle,
        item: siteURI + '/blog/' + post.value.category
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: post.value.title,
        item: siteURI + path
      }
    ]
  })
]);

useSeoMeta({
  title: title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image ? `https://images.fotografalilliatavares.com.br/images/${post.value.image.imageId}/public` : undefined,
  ogUrl: siteURI + path,
  twitterCard: 'summary_large_image',
  twitterTitle: post.value.title,
  twitterDescription: post.value.description,
  twitterImage: post.value.image ? `https://images.fotografalilliatavares.com.br/images/${post.value.image.imageId}/public` : undefined,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: siteURI + path
    }
  ]
});

// Processar conteúdo com imagens intercaladas
const processedContent = computed(() => {
  if (!post.value?.content || !Array.isArray(post.value.content)) {
    return { content: [], endImages: [] };
  }

  const contentImages = post.value.contentImages || [];

  // Se não houver imagens, retornar apenas o conteúdo com estrutura
  if (contentImages.length === 0) {
    return {
      content: post.value.content.map((block, idx) => ({
        type: 'content',
        data: block,
        index: idx
      })),
      endImages: []
    };
  }

  // Separar imagens que vão no final das que vão intercaladas
  const imagesForEnd = contentImages.filter(img => img.showAtEnd === true);
  const imagesForContent = contentImages.filter(img => img.showAtEnd !== true);

  const result = [];
  let imageIndex = 0;
  let paragraphCount = 0;

  post.value.content.forEach((block, idx) => {
    // Contar tags <p> no HTML usando regex (funciona em SSR)
    const paragraphMatches = block.match(/<p[^>]*>/g);
    const paragraphs = paragraphMatches ? paragraphMatches.length : 0;

    // Adicionar imagem antes do primeiro parágrafo (imageIndex 0)
    if (idx === 0 && imageIndex < imagesForContent.length) {
      result.push({
        type: 'image',
        data: imagesForContent[imageIndex],
        position: imageIndex % 2 === 0 ? 'left' : 'right',
        index: imageIndex
      });
      imageIndex++;
    }

    // Adicionar o bloco de conteúdo
    result.push({
      type: 'content',
      data: block,
      index: idx
    });

    paragraphCount += paragraphs;

    // Adicionar próxima imagem após 3 parágrafos
    if (paragraphCount >= 3 && imageIndex < imagesForContent.length) {
      result.push({
        type: 'image',
        data: imagesForContent[imageIndex],
        position: imageIndex % 2 === 0 ? 'left' : 'right',
        index: imageIndex
      });
      imageIndex++;
      paragraphCount = 0; // Reset contador
    }
  });

  return {
    content: result,
    endImages: imagesForEnd
  };
});
</script>

<template>
  <div class="container no-padding" :style="{ '--color-highlight': post.colorHighlight }">
    <SectionsHero :data="post" />

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
            :alt="item.data.alt || post.title"
            format="webp"
            placeholder
            loading="lazy"
            class="img-content"
          />
        </div>

        <div v-else-if="item.type === 'content'" v-html="item.data"></div>
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
          :alt="image.alt || post.title"
          format="webp"
          placeholder
          loading="lazy"
          class="img-content"
        />
          </picture>
        </div>
      </div>
    </div>

    <SectionsGallery v-if="post.album" :album="post.album" />
    <SectionsPortfolio v-if="post.works" :category="post.works" class="blog-portfolio" />
    <SectionsScheduleCustom v-if="post.showSchedule === true" :formType="post.title" />
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
</style>