<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>

<template>
    <section v-if="props.data" class="pricing-cta">
        <h2 class="title">{{ props.data.title }}</h2>
        <p class="description">{{ props.data.description }}</p>
        <a 
          :href="`https://wa.me/5511911159795?text=${encodeURIComponent(props.data.whatsappMessage)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="btn"
        >
          {{ props.data.buttonText ? props.data.buttonText : 'Agendar Ensaio pelo WhatsApp' }}
        </a>
    </section>
</template>

<style scoped lang="scss">
.pricing-cta {
  text-align: center;
  padding: calc(v.$bigSpace * 2) 0;
  color: v.$green;
  
  @include m.max(xs) {
    padding: v.$bigSpace;
  }

  .description {
    margin-bottom: 20px;
  }
}

.lp-corporativo {
  background: v.$lp-corporativo;
  
  .title,
  .description,
  & {
    color: white;
  }

  .btn {
    border-radius: 8rem;
    box-shadow: 5rem 5rem 0 rgba(255, 255, 255, 0.35);
    background-color: white;
    color: v.$lp-corporativo;
    
    &:hover {
      border-color: white;
      box-shadow: 8rem 8rem 0 rgba(255, 255, 255, 0.6);
    }
  }
}
</style>