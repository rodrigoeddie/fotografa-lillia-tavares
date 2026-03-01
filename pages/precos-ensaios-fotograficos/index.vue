<script setup lang="ts">
useSeoMeta({
  title: 'Preço dos ensaios fotográficos - Lillia Tavares',
  description: 'Confira nossos pacotes de ensaios fotográficos: corporativo, gestante, casual-intimista, casal e aniversário. Encontre o pacote perfeito para você.',
  ogTitle: 'Preço dos ensaios fotográficos - Lillia Tavares',
  ogDescription: 'Confira nossos pacotes de ensaios fotográficos: corporativo, gestante, casual-intimista, casal e aniversário. Encontre o pacote perfeito para você.',
  ogImage: 'https://images.fotografalilliatavares.com.br/og-image.jpg',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <SectionsPrecosIndex />
</template>

<style scoped lang="scss">
.investment-page {
  padding: 64rem 0;
  min-height: 100vh;
}

.container {
  max-width: 1200rem;
  margin: 0 auto;
  padding: 0 24rem;
}

.investment-header {
  text-align: center;
  margin-bottom: 64rem;
  max-width: 800rem;
  margin-left: auto;
  margin-right: auto;
  
  &__title {
    font-size: 40rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 16rem;
  }
  
  &__description {
    font-size: 18rem;
    color: #666;
    line-height: 1.6;
  }
}

.investment-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280rem, 1fr));
  gap: 32rem;
  margin-bottom: 64rem;
}

.category-card {
  background: #fff;
  border: 2rem solid #e5e5e5;
  border-radius: 8rem;
  padding: 32rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    border-color: #333;
    box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.1);
    transform: translateY(-4rem);
  }
  
  &__icon {
    font-size: 48rem;
    margin-bottom: 16rem;
  }
  
  &__title {
    font-size: 24rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rem;
  }
  
  &__description {
    color: #666;
    line-height: 1.5;
    margin-bottom: 24rem;
    flex: 1;
  }
  
  &__link {
    color: #333;
    font-weight: 600;
    text-decoration: underline;
  }
}

.investment-info {
  background: #f9f9f9;
  border-radius: 8rem;
  padding: 48rem 32rem;
  margin-bottom: 48rem;
  
  &__title {
    text-align: center;
    font-size: 32rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 32rem;
  }
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250rem, 1fr));
    gap: 32rem;
  }
}

.info-item {
  &__title {
    font-size: 20rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rem;
  }
  
  &__text {
    color: #666;
    line-height: 1.6;
  }
}

.investment-cta {
  text-align: center;
  padding: 48rem 0;
  
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
  
  &__button {
    display: inline-block;
    padding: 16rem 40rem;
    background: #333;
    color: #fff;
    text-decoration: none;
    border-radius: 4rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background: #000;
      transform: translateY(-2rem);
      box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.2);
    }
  }
}

@media (max-width: 768rem) {
  .investment-page {
    padding: 32rem 0;
  }
  
  .investment-header {
    margin-bottom: 32rem;
    
    &__title {
      font-size: 28rem;
    }
    
    &__description {
      font-size: 16rem;
    }
  }
  
  .investment-categories {
    grid-template-columns: 1fr;
    gap: 24rem;
  }
  
  .investment-info {
    padding: 32rem 24rem;
    
    &__title {
      font-size: 24rem;
    }
    
    &__grid {
      grid-template-columns: 1fr;
      gap: 24rem;
    }
  }
  
  .investment-cta {
    h2 {
      font-size: 24rem;
    }
    
    p {
      font-size: 16rem;
    }
  }
}
</style>
