<script setup lang="ts">
const { data: faqData } = await useAsyncData('faq', () => {
  return queryCollection('faq').first();
});

if (!faqData.value) {
  throw createError({
    statusCode: 404,
    message: 'Conteúdo não encontrado'
  });
}
</script>

<template>
  <div class="faq-page">
    <div class="container">
      <header class="faq-header">
        <h1 class="big-title red centered">
          <span class="box">
            Perguntas
          </span>
          <span class="big">
            Frequentes
          </span>
        </h1>
        <p class="description">{{ faqData.description }}</p>
      </header>

      <SectionsFaqSection :categories="faqData.categories" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.faq-header {
  margin-bottom: v.$bigSpace;
  text-align: center;
  max-width: 800rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
