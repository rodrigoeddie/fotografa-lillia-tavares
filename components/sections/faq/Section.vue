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
      <h2 class="title">{{ category.name }}</h2>
      
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
  max-width: 1200rem;
  padding: 15rem v.$space;
  margin: 0 auto;
}

.title {
  padding-bottom: 15rem;
  color: v.$green;
}

.faq-category {
  margin-bottom: 48rem;
  
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
