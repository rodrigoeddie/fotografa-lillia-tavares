<script setup lang="ts">
defineProps<{
  data: {
    title: string;
    description: string;
    items: { icon: string; title: string; description: string }[];
  };
}>();
</script>

<template>
  <section class="deliverables lp-presentes container" data-ani-type="fade-up">
    <h2 class="title-lp">{{ data.title }}</h2>
    <p class="description-lp">{{ data.description }}</p>
    <div class="deliverables__grid">
      <div
        v-for="(item, index) in data.items"
        :key="index"
        class="deliverables__card"
        :data-ani-type="'fade-up'"
        :data-ani-delay="`${0.1 * (index + 1)}s`"
      >
        <span class="deliverables__icon">{{ item.icon }}</span>
        <h3 class="card-title">{{ item.title }}</h3>
        <p class="card-description">{{ item.description }}</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.deliverables {
  margin-bottom: 30rem;

  .title-lp { text-align: center; margin-bottom: 15rem; }
  .description-lp { text-align: center; margin: 0 auto 50rem; }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 25rem;
    max-width: 1200rem;
    margin: 0 auto;
    @include m.max(sm) { grid-template-columns: repeat(2, 1fr); gap: 15rem; }
  }

  &__card {
    background: white;
    border-radius: 8rem;
    padding: 20rem 10rem;
    text-align: center;
    border: 2rem solid v.$lp-presentes-light;
    .card-description { margin-bottom: 0; }
  }

  &__icon { font-size: 45rem; display: block; margin-bottom: 15rem; }
}

.lp-presentes {
  &.deliverables {
    .title-lp, .description-lp, .card-title, .card-description {
      color: v.$lp-presentes;
    }
  }
}
</style>
