<script setup lang="ts">
const { whatsappUrl } = useRuntimeConfig().public

defineProps<{
  data: {
    title: string;
    subtitle: string;
    features: string[];
    whatsappMessage: string;
    buttonText: string;
  };
}>();
</script>

<template>
  <section class="hero-presentes lp-presentes container" data-ani-type="fade-up">
    <div class="container">
      <div class="hero-presentes__content">
        <h1 class="hero-presentes__title" v-html="data.title"></h1>
        <p class="hero-presentes__subtitle">{{ data.subtitle }}</p>
        <ul class="hero-presentes__features">
          <li v-for="feature in data.features" :key="feature">{{ feature }}</li>
        </ul>
        <a
          class="hero-presentes__btn"
          :href="`${whatsappUrl}?text=${encodeURIComponent(data.whatsappMessage)}`"
        >
          <Icon name="icons:whatsapp" class="icon" />
          <span>{{ data.buttonText }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero-presentes {
  background: v.$lp-presentes;
  color: white;
  padding: 80rem 0;
  text-align: center;

  @include m.max(sm) { padding: 40rem 0; }

  &__content { max-width: 1100rem; margin: 0 auto; }
  &__title {
    font-size: 40rem; font-weight: 700; margin-bottom: 20rem; text-transform: uppercase; color: #EAEAEA;
    @include m.max(sm) { font-size: 28rem; }
  }
  &__subtitle {
    font-size: 20rem; line-height: 1.5; margin-bottom: 30rem; opacity: 0.95;
    @include m.max(sm) { font-size: 18rem; }
  }
  &__features {
    justify-content: center; margin-bottom: 40rem; font-size: 18rem;
    list-style: none; display: flex; gap: 30rem;
    @include m.max(sm) { font-size: 16rem; flex-wrap: wrap; gap: 10rem; }
    li {
      background-color: rgba(0, 0, 0, 0.2);
      padding: 10rem; border-radius: 8rem;
      &::before { content: '✓ '; font-weight: bold; }
    }
  }
  &__btn {
    transition: box-shadow .3s ease, background .3s ease;
    box-shadow: 5rem 5rem 0 white; border-radius: 8rem; font-size: 25rem;
    border: 3rem solid white; padding: 20rem 30rem; align-items: center;
    font-weight: bold; display: inline-flex; color: white; gap: 15rem;
    text-decoration: none;
    @include m.max(sm) { font-size: 20rem; padding: 15rem 25rem; }
    .icon { font-size: 40rem; }
    &:hover { box-shadow: 10rem 10rem 0 white; background: rgba(0, 0, 0, 0.2); }
  }
}
</style>
