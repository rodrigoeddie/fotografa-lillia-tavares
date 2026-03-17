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
  numParcelas: {
    type: Number,
    required: true
  },
  priceParcelas: {
    type: Number,
    required: true
  },
  features: {
    type: Array,
    required: true
  },
  type: {
    type: String,
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

const formattedXPrice = computed(() => {
  return props.priceParcelas.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
});

function splitFeature(feature) {
  const match = String(feature).match(/^(\d+)\s*(.*)$/);
  if (match) return { number: match[1], text: match[2] };
  return { number: null, text: feature };
}
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
    
    <div class="pricing-card__price wrap-pix">
      <span class="pricing-card__currency">R$</span>
      <span class="pricing-card__amount">{{ formattedPrice }}</span>
      <span class="pricing-card__pix">no PIX</span>
    </div>
    <div class="pricing-card__price wrap-credit">
      <span class="or">ou</span>
      <span class="pricing-card__amountCredit">{{ numParcelas }}x <span>de</span> <span class="pricing-card__currency">R$</span>{{ formattedXPrice }}</span>
      <span class="pricing-card__creditLabel">no Cartão de crédito</span>
    </div>
    
    <ul class="pricing-card__features">
      <li 
        v-for="(feature, index) in features" 
        :key="index"
        class="pricing-card__feature"
      >
        <span class="pricing-card__feature-icon">✓</span>
        <span v-if="splitFeature(feature).number" class="pricing-card__feature-number">{{ splitFeature(feature).number }}</span>
        <span>{{ splitFeature(feature).text }}</span>
      </li>
    </ul>
    
    <div class="pricing-card__cta">
      <a 
        :href="`https://wa.me/5511911159795?text=Olá! Gostaria de saber mais sobre o pacote ${type} - ${title}.`"
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
  box-shadow: 0 0 10rem rgba(44, 42, 21, 0.35);
  border: 1px solid #ccc;
  transition: all 0.3s ease;
  flex-direction: column;
  background: linear-gradient(#2c2a15 25%, white 68%);
  border-radius: 8px;
  padding: v.$space 0 0 0;
  margin-top: 15rem;
  color: white;
  display: flex;
  height: 100%;
  width: 100%;

  @include m.max(md) {
    margin-left: auto;
    margin-right: auto;
  }
  
  // &:hover {
  //   border-color: #ccc;
  //   box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.1);
  // }
  
  &--recommended {
    border-color: #731;
    border-width: 3px;
    z-index: 1;
    box-shadow: 0 4rem 16rem rgba(52, 75, 66, 0.12);
    
    // &:hover {
    //   border-color: v.$red;
    //   box-shadow: 0 8rem 24rem rgba(0, 0, 0, 0.15);
    // }
  }
}

.pricing-card__badge {
  box-shadow: 0 0 10rem rgba(44, 42, 21, 0.35);
  position: absolute;
  top: -18rem;
  left: 50%;
  transform: translateX(-50%);
  background: #731;
  color: white;
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
  font-size: 26rem;
  font-weight: 600;
  padding-top: 15rem;
  margin-bottom: 8rem;
}

.pricing-card__subtitle {
  font-size: 14rem;
  margin: 0;
}

.pricing-card__price {
  text-align: center;
  margin-bottom: v.$space;
  padding-bottom: v.$space;
  border-bottom: 1rem solid #e5e5e5;

  &.wrap-credit {
    margin-bottom: 0;
    border-bottom: 0;
  }
}

.or {
  transform: translateX(-50%);
  padding: 4rem 12rem;
  position: absolute;
  background: #fff;
  font-size: 14rem;
  font-weight: 600;
  color: #333;
  top: -33rem;
  left: 50%;
}

.pricing-card__currency {
  font-size: 20rem;
  font-weight: 500;
  vertical-align: top;
}

.pricing-card__amountCredit,
.pricing-card__amount {
  font-size: 40rem;
  font-weight: 700;
  line-height: 1;

  span {
    font-weight: normal;
    font-size: 20rem;
  }
}

.pricing-card__amountCredit {
  font-size: 25rem;
}

.pricing-card__creditLabel,
.pricing-card__pix {
  font-size: 25rem;
  font-weight: normal;
  padding-left: 5rem;
  line-height: 1;
}

.pricing-card__creditLabel {
  font-size: 20rem;
}

.pricing-card__features {
  list-style: none;
  background: #eaeaea;
  box-shadow: 0 -15rem 15rem -10rem rgba(44, 42, 21, 0.5) inset;
  color: v.$dark-green;
  padding: 15rem 15rem 0 15rem;
  flex: 1;
}

.pricing-card__feature {
  display: flex;
  align-items: flex-start;
  // gap: 12rem;
  padding: 8rem 0;
  font-size: 18rem;
  line-height: 1.5;

  .pricing-card__feature-number {
    margin-right: 1.3%;
  }
  
  &:first-child {
    font-size: 22rem;
    
    .pricing-card__feature-number {
      font-weight: bold;
    }
  }
}

.pricing-card__feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20rem;
  height: 20rem;
  background: #f0f0f0;
  margin-right: 12rem;
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
  padding: 25rem 16rem;
  font-size: 26rem;
  text-align: center;
  text-decoration: none;
  overflow: hidden;
  background: #fff;
  border-bottom-left-radius: 8rem;
  border-bottom-right-radius: 8rem;
  color: v.$green;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: black;
    color: white;
  }
  
  &--primary {
    background: #731;
    color: white;
  }
}
</style>
