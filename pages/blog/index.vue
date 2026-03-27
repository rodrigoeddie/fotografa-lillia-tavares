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
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://fotografalilliatavares.com.br/blog',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://fotografalilliatavares.com.br/blog'
    }
  ]
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
  <BlocksBreadcrumb :items="[
    { label: 'Home', to: '/' },
    { label: 'Blog' },
  ]" />
  <SectionsBlogList/>
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
    // flex-direction: row;
    gap: 15rem 0;
    width: 100%;
  }
  
  .subtitle {
    // min-height: 63rem;

    @include m.max(sm) {
      min-height: auto;
    }
  }

  .description {
    padding-bottom: 20rem;
    // min-height: 172rem;
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
        color: #666
      }
    }

    .icon {
      font-size: 18px;
    }
  }
}

</style>
