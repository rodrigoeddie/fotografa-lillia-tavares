<script setup lang="ts">
defineProps<{
  data: {
    text: string;
    linkLabel: string;
    linkTo: string;
  };
}>();
</script>

<template>
  <section class="hub-backlink lp-dia-das-maes container" data-ani-type="fade-up">
    <p>{{ data.text }}</p>
    <NuxtLink :to="data.linkTo" class="link">
      {{ data.linkLabel }}
    </NuxtLink>
  </section>
</template>

<style lang="scss" scoped>
.hub-backlink {
  text-align: center;
  padding: 50rem 20rem;
  margin-bottom: 40rem;
  background: v.$lp-dia-das-maes-ultralight;
  border-radius: 8rem;

  p {
    font-size: 22rem;
    color: v.$lp-dia-das-maes-dark;
    margin-bottom: 15rem;
    font-weight: 600;
  }

  .link {
    font-size: 20rem;
    font-weight: 700;
    color: v.$lp-dia-das-maes;
    text-decoration: underline;
    transition: color 0.3s ease;
    &:hover { color: v.$lp-dia-das-maes-dark; }
  }
}
</style>
