<script setup>
const props = defineProps({
  categories: {
    type: Array,
    required: true
  },
  showAllOpen: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="faq-section">
    <div 
      v-for="(category, catIndex) in categories" 
      :key="category.slug"
      class="faq-category"
    >
      <h2 class="faq-category__title">{{ category.name }}</h2>
      
      <div class="faq-category__items">
        <BlocksFaqItem
          v-for="(item, index) in category.questions"
          :key="`${category.slug}-${index}`"
          :question="item.question"
          :answer="item.answer"
          :is-open="showAllOpen"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.faq-section {
  max-width: 900rem;
  margin: 0 auto;
}

.faq-category {
  margin-bottom: 48rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.faq-category__title {
  font-size: 28rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 24rem;
  padding-bottom: 12rem;
  border-bottom: 2rem solid #e5e5e5;
}

@media (max-width: 768rem) {
  .faq-category__title {
    font-size: 24rem;
    margin-bottom: 20rem;
  }
  
  .faq-category {
    margin-bottom: 40rem;
  }
}
</style>
