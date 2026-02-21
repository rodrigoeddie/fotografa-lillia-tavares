<script setup>
const props = defineProps({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const isExpanded = ref(props.isOpen);

const toggle = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="faq-item" :class="{ 'faq-item--open': isExpanded }">
    <button 
      class="faq-item__question" 
      @click="toggle"
      :aria-expanded="isExpanded"
    >
      <span class="faq-item__question-text">{{ question }}</span>
      <span class="faq-item__icon" :class="{ 'faq-item__icon--open': isExpanded }">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>
    
    <Transition name="faq-content">
      <div v-show="isExpanded" class="faq-item__answer">
        <div class="faq-item__answer-inner">
          {{ answer }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.faq-item {
  background: #fff;
  border: 1rem solid #e5e5e5;
  border-radius: 8rem;
  margin-bottom: 16rem;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ccc;
  }
  
  &--open {
    border-color: #333;
  }
}

.faq-item__question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rem 24rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #f9f9f9;
  }
}

.faq-item__question-text {
  font-size: 18rem;
  font-weight: 600;
  color: #333;
  padding-right: 16rem;
  line-height: 1.4;
}

.faq-item__icon {
  flex-shrink: 0;
  color: #666;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  
  &--open {
    transform: rotate(180deg);
  }
  
  svg {
    width: 24rem;
    height: 24rem;
  }
}

.faq-item__answer {
  overflow: hidden;
}

.faq-item__answer-inner {
  padding: 0 24rem 24rem 24rem;
  color: #666;
  font-size: 16rem;
  line-height: 1.6;
}

// Transição do conteúdo
.faq-content-enter-active,
.faq-content-leave-active {
  transition: all 0.3s ease;
}

.faq-content-enter-from,
.faq-content-leave-to {
  opacity: 0;
  max-height: 0;
}

.faq-content-enter-to,
.faq-content-leave-from {
  opacity: 1;
  max-height: 500rem;
}

@media (max-width: 768rem) {
  .faq-item__question-text {
    font-size: 16rem;
  }
  
  .faq-item__answer-inner {
    font-size: 14rem;
  }
  
  .faq-item__question {
    padding: 16rem 20rem;
  }
}
</style>
