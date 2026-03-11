<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const titleParts = computed(() => {
  if (!props.data?.title) return { box: '', big: '' };
  const words = props.data.title.split(' ');
  const big = words.pop();
  const box = words.join(' ');
  return { box, big };
});
</script>

<template>
  <div v-if="data && data.packages" class="pricing-page">
    <div class="container">
      <header class="pricing-header">
        <h1 class="big-title green centered">
          <span class="box">Pacote do {{ titleParts.box }}</span>
          <span class="big">{{ titleParts.big }}</span>
        </h1>

        <p class="description">{{ data.description }}</p>
      </header>

      <div class="pricing-grid">
        <ClientOnly>
          <swiper-container
            class="pricing-swiper"
            :slides-per-view="1.40"
            :space-between="8"
            :breakpoints="{
              500: {
                slidesPerView: 2.40,
                spaceBetween: 16,
                // slidesPerGroup: 2,
              },
              750: {
                slidesPerView: 3.40,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              }
            }"
            :pagination="{
              clickable: true,
            }"
            :navigation="false">
            <swiper-slide
              v-for="(pkg, index) in data.packages"
              :key="index">
              <BlocksPricingCard
                :title="pkg.title"
                :subtitle="pkg.subtitle"
                :price="pkg.price"
                :features="pkg.features"
                :numParcelas="pkg.numParcelas"
                :priceParcelas="pkg.priceParcelas"
                :type="data.title"
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
          :href="`https://wa.me/5511911159795?text=${encodeURIComponent(data.cta.whatsappMessage)}`"
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

<style scoped lang="scss">
:deep(swiper-container) {
  --swiper-pagination-bottom: 0rem;
}

.pricing-header {
  text-align: center;
}

.pricing-grid {
  padding-top: v.$bigSpace;
  margin-bottom: v.$bigSpace;
  position: relative;
  
  .pricing-swiper {
    swiper-slide {
      margin-bottom: 60rem;
      display: flex;
      height: auto;
    }
  }
}

.pricing-details {
  background: #fff;
  border-radius: 8rem;
  box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
  padding: 32rem;
  border: 1px solid v.$green;
  
  &__title {
    font-size: 24rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rem;
    text-align: center;
  }
  
  &__list {
    max-width: 750rem;
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
</style>
