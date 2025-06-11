<script lang="ts" setup>
const title = 'Sobre a fotógrafa Lillia Tavares';
const description = 'Um pouco de curiosidades, novidades, e conhecimentos da fotógrafa Lillia Tavares';

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: title,
    url: 'https://fotografalilliatavares.com.br/sobre',
  })
]);

useSeoMeta({
  title: title,
  description: description,
});

</script>

<template>
  <div class="post-list">
    <h1>SOBRE</h1>
  </div>
</template>

<style scoped lang="scss">
.post-list {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.post-item {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;

  .category {
    background: #f0f0f0;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
  }
}

.post-excerpt {
  color: #666;
  line-height: 1.5;
}
</style>
