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
  transition: transform .15s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease;
  margin-bottom: 16rem;
  background: #fff;
  overflow: hidden;
  box-shadow:
    0 1px 0 #ECE4D2,
    0 14px 30px -12px rgba(42, 37, 32, 0.25),
    0 4px 10px -4px rgba(42, 37, 32, 0.10);
  
  &:hover {
    box-shadow:
        0 1px 0 #ECE4D2,
        0 28px 50px -16px rgba(42, 37, 32, 0.35),
        0 8px 18px -6px rgba(42, 37, 32, 0.15);
  }
  
  &--open {
    border-color: #333;
  }
}

.faq-item__question {
  transition: background-color 0.3s ease;
  justify-content: space-between;
  background: transparent;
  padding: 20rem 24rem;
  align-items: center;
  text-align: left;
  cursor: pointer;
  display: flex;
  border: none;
  width: 100%;
  
  &:hover {
    background: #f4f2e9;
  }
}

.faq-item__question-text {
  font-size: 21rem;
  font-weight: 600;
  padding-right: 16rem;
  line-height: 1.4;
  color: v.$green;
}

.faq-item__icon {
  transition: transform 0.3s ease;
  align-items: center;
  color: v.$green;
  flex-shrink: 0;
  display: flex;
  
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
  padding: 10rem 24rem 24rem 24rem;
  color: v.$green;
  font-size: 20rem;
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
</style>
