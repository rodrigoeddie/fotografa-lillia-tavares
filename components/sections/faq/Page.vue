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
        <h1 class="faq-header__title">{{ faqData.title }}</h1>
        <p class="faq-header__description">{{ faqData.description }}</p>
      </header>

      <SectionsFaqSection :categories="faqData.categories" />

      <section class="faq-cta">
        <h2>Não encontrou sua dúvida?</h2>
        <p>Entre em contato conosco pelo WhatsApp. Teremos prazer em ajudar!</p>
        <a
          href="https://wa.me/5511999999999?text=Olá! Tenho uma dúvida sobre os ensaios fotográficos"
          target="_blank"
          rel="noopener noreferrer"
          class="faq-cta__button"
        >
          Falar no WhatsApp
        </a>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.faq-page {
  padding: 64rem 0;
  min-height: 100vh;
  background: #fafafa;
}

.container {
  max-width: 1200rem;
  margin: 0 auto;
  padding: 0 24rem;
}

.faq-header {
  text-align: center;
  margin-bottom: 64rem;
  max-width: 800rem;
  margin-left: auto;
  margin-right: auto;
}

.faq-header__title {
  font-size: 48rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 16rem;
}

.faq-header__description {
  font-size: 20rem;
  color: #666;
  line-height: 1.6;
}

.faq-cta {
  text-align: center;
  padding: 64rem 0 0 0;
  margin-top: 64rem;
  border-top: 2rem solid #e5e5e5;

  h2 {
    font-size: 32rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 16rem;
  }

  p {
    font-size: 18rem;
    color: #666;
    margin-bottom: 32rem;
  }
}

.faq-cta__button {
  display: inline-block;
  padding: 16rem 40rem;
  background: #25D366;
  color: #fff;
  text-decoration: none;
  border-radius: 8rem;
  font-weight: 600;
  font-size: 16rem;
  transition: all 0.3s ease;

  &:hover {
    background: #20BA5A;
    transform: translateY(-2rem);
    box-shadow: 0 4rem 12rem rgba(37, 211, 102, 0.3);
  }
}

@media (max-width: 768rem) {
  .faq-page {
    padding: 32rem 0;
  }

  .faq-header {
    margin-bottom: 48rem;
  }

  .faq-header__title {
    font-size: 32rem;
  }

  .faq-header__description {
    font-size: 16rem;
  }

  .faq-cta {
    padding-top: 48rem;
    margin-top: 48rem;

    h2 {
      font-size: 24rem;
    }

    p {
      font-size: 16rem;
    }
  }
}
</style>
