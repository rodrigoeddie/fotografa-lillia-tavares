<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  features: {
    type: Array,
    required: true
  },
  isRecommended: {
    type: Boolean,
    default: false
  }
});

const formattedPrice = computed(() => {
  return props.price.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
});
</script>

<template>
  <div class="pricing-card" :class="{ 'pricing-card--recommended': isRecommended }">
    <div v-if="isRecommended" class="pricing-card__badge">
      Mais Popular
    </div>
    
    <div class="pricing-card__header">
      <h3 class="pricing-card__title">{{ title }}</h3>
      <p v-if="subtitle" class="pricing-card__subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="pricing-card__price">
      <span class="pricing-card__currency">R$</span>
      <span class="pricing-card__amount">{{ formattedPrice }}</span>
    </div>
    
    <ul class="pricing-card__features">
      <li 
        v-for="(feature, index) in features" 
        :key="index"
        class="pricing-card__feature"
      >
        <span class="pricing-card__feature-icon">✓</span>
        <span>{{ feature }}</span>
      </li>
    </ul>
    
    <div class="pricing-card__cta">
      <a 
        href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o pacote {{ title }}"
        target="_blank"
        rel="noopener noreferrer"
        class="pricing-card__button"
        :class="{ 'pricing-card__button--primary': isRecommended }"
      >
        Solicitar Orçamento
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pricing-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 32rem;
  transition: all 0.3s ease;
  height: 100%;
  
  &:hover {
    border-color: #ccc;
    box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.1);
  }
  
  &--recommended {
    border-color: #333;
    border-width: 3px;
    z-index: 1;
    box-shadow: 0 4rem 16rem rgba(0, 0, 0, 0.12);
    
    &:hover {
      border-color: #000;
      box-shadow: 0 8rem 24rem rgba(0, 0, 0, 0.15);
    }
  }
}

.pricing-card__badge {
  position: absolute;
  top: -12rem;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 8rem 24rem;
  border-radius: 20rem;
  font-size: 14rem;
  font-weight: 600;
  letter-spacing: 0.5rem;
}

.pricing-card__header {
  margin-bottom: 24rem;
  text-align: center;
}

.pricing-card__title {
  font-size: 24rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rem;
}

.pricing-card__subtitle {
  font-size: 14rem;
  color: #666;
  margin: 0;
}

.pricing-card__price {
  text-align: center;
  margin-bottom: 32rem;
  padding-bottom: 32rem;
  border-bottom: 1rem solid #e5e5e5;
}

.pricing-card__currency {
  font-size: 20rem;
  font-weight: 500;
  color: #666;
  vertical-align: top;
}

.pricing-card__amount {
  font-size: 40rem;
  font-weight: 700;
  color: #333;
  line-height: 1;
}

.pricing-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 32rem 0;
  flex: 1;
}

.pricing-card__feature {
  display: flex;
  align-items: flex-start;
  gap: 12rem;
  padding: 12rem 0;
  font-size: 15rem;
  color: #555;
  line-height: 1.5;
}

.pricing-card__feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20rem;
  height: 20rem;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 12rem;
  color: #333;
  flex-shrink: 0;
  margin-top: 2rem;
}

.pricing-card__cta {
  margin-top: auto;
}

.pricing-card__button {
  display: block;
  width: 100%;
  padding: 16rem;
  text-align: center;
  text-decoration: none;
  background: #fff;
  color: #333;
  border: 2rem solid #333;
  border-radius: 4rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #333;
    color: #fff;
  }
  
  &--primary {
    background: #333;
    color: #fff;
    
    &:hover {
      background: #000;
      border-color: #000;
    }
  }
}

@media (max-width: 768rem) {
  .pricing-card {
    padding: 24rem;
    
    &--recommended {
      transform: scale(1);
      margin: 16rem 0;
    }
  }
  
  .pricing-card__title {
    font-size: 20rem;
  }
  
  .pricing-card__amount {
    font-size: 32rem;
  }
}
</style>
