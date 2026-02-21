<template>
  <div v-if="data && data.packages" class="pricing-page">
    <div class="container">
      <header class="pricing-header">
        <NuxtLink to="/investimento" class="pricing-header__back">← Voltar</NuxtLink>
        <h1 class="pricing-header__title">{{ data.title }}</h1>
        <p class="pricing-header__description">{{ data.description }}</p>
      </header>

      <div class="pricing-grid">
        <ClientOnly>
          <swiper-container
            class="pricing-swiper"
            :slides-per-view="1"
            :space-between="24"
            :breakpoints="{
              640: {
                slidesPerView: 2,
                spaceBetween: 24
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 32
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 32
              }
            }"
            :pagination="{
              clickable: true,
            }"
            :navigation="true">
            <swiper-slide
              v-for="(pkg, index) in data.packages"
              :key="index">
              <BlocksPricingCard
                :title="pkg.title"
                :subtitle="pkg.subtitle"
                :price="pkg.price"
                :features="pkg.features"
                :is-recommended="pkg.isRecommended"
              />
            </swiper-slide>
          </swiper-container>
        </ClientOnly>
      </div>

      <section v-if="data.includes" class="pricing-details">
        <h2 class="pricing-details__title">O que está incluso em todos os pacotes</h2>
        <ul class="pricing-details__list">
          <li v-for="(item, index) in data.includes" :key="index">{{ item }}</li>
        </ul>
      </section>

      <section v-if="data.cta" class="pricing-cta">
        <h2>{{ data.cta.title }}</h2>
        <p>{{ data.cta.description }}</p>
        <a 
          :href="`https://wa.me/5511999999999?text=${encodeURIComponent(data.cta.whatsappMessage)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="pricing-cta__button"
        >
          Solicitar Orçamento
        </a>
      </section>
    </div>
  </div>
  <div v-else class="pricing-page">
    <div class="container">
      <p>Carregando dados...</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<style scoped lang="scss">
.pricing-page {
  padding: 64rem 0;
  min-height: 100vh;
  background: #fafafa;
}

.container {
  max-width: 1400rem;
  margin: 0 auto;
  padding: 0 24rem;
}

.pricing-header {
  text-align: center;
  margin-bottom: 48rem;
  max-width: 800rem;
  margin-left: auto;
  margin-right: auto;
  
  &__back {
    display: inline-block;
    color: #666;
    text-decoration: none;
    margin-bottom: 24rem;
    font-weight: 500;
    transition: color 0.3s ease;
    
    &:hover {
      color: #333;
    }
  }
  
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

.pricing-grid {
  margin-bottom: 64rem;
  position: relative;
  
  .pricing-swiper {
    width: 100%;
    padding: 16rem 0 48rem 0;
    overflow: visible;
    
    swiper-slide {
      height: auto;
      display: flex;
    }
  }

  // Estilos para os botões de navegação
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    color: #333;
    width: 40rem;
    height: 40rem;
    
    &::after {
      font-size: 20rem;
    }
  }
  
  :deep(.swiper-pagination-bullet) {
    background: #333;
    opacity: 0.3;
    
    &.swiper-pagination-bullet-active {
      opacity: 1;
    }
  }
}

.pricing-details {
  background: #fff;
  border-radius: 8rem;
  padding: 32rem;
  margin-bottom: 48rem;
  border: 2rem solid #e5e5e5;
  
  &__title {
    font-size: 24rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rem;
    text-align: center;
  }
  
  &__list {
    max-width: 600rem;
    margin: 0 auto;
    list-style: none;
    padding: 0;
    
    li {
      padding: 12rem 0;
      color: #666;
      position: relative;
      padding-left: 32rem;
      
      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #333;
        font-weight: 600;
      }
    }
  }
}

.pricing-cta {
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
  .pricing-page {
    padding: 32rem 0;
  }
  
  .pricing-header {
    margin-bottom: 32rem;
    
    &__title {
      font-size: 28rem;
    }
    
    &__description {
      font-size: 16rem;
    }
  }
  
  .pricing-cta {
    h2 {
      font-size: 24rem;
    }
    
    p {
      font-size: 16rem;
    }
  }
}

</style>
