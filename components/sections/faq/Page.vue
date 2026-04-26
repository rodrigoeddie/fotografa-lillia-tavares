<script setup lang="ts">
const { data: rawFaq } = await useFetch('/api/public/faq');

const categories = computed(() => (rawFaq.value ?? []).map(adaptFaqCategoria));

if (!rawFaq.value) {
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
        <h1 class="big-title green centered">
          <span class="box">
            Perguntas
          </span>
          <span class="big">
            Frequentes
          </span>
        </h1>
        <p class="description">Tire suas dúvidas sobre ensaios fotográficos, pacotes, agendamento e muito mais.</p>
      </header>

      <SectionsFaqSection :categories="categories" />
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
