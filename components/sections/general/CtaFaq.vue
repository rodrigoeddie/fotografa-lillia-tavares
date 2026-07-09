<script setup lang="ts">
const { whatsappUrl } = useRuntimeConfig().public;

const props = defineProps({
  title: {
    type: String,
    default: 'Ainda tem dúvidas?',
  },
  description: {
    type: String,
    default: 'Reunimos as respostas para as perguntas mais comuns sobre os ensaios.',
  },
  whatsappMessage: {
    type: String,
    default: 'Olá! Tenho uma dúvida sobre os ensaios fotográficos',
  },
});
</script>

<template>
  <section class="cta-faq" data-ani-type="fade-up" data-ani-delay="0.4">
    <h2 class="title">{{ props.title }}</h2>
    <p class="description">{{ props.description }}</p>

    <NuxtLink
      to="/perguntas-frequentes"
      class="btn-faq"
      data-track-event="cta-faq">
      Ver perguntas frequentes
    </NuxtLink>

    <a
      :href="`${whatsappUrl}?text=${encodeURIComponent(props.whatsappMessage)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="whats-link"
      data-track-event="cta-whatsapp-faq">
      ou fale direto com a fotógrafa no WhatsApp
    </a>
  </section>
</template>

<style scoped lang="scss">
.cta-faq {
  text-align: center;
  padding: 48rem 20rem;

  .title {
    margin-bottom: 16rem;
    color: v.$green;
    font-weight: 600;
    font-size: 32rem;
  }

  .description {
    margin-bottom: 32rem;
    color: v.$green;
    font-size: 18rem;
  }

  .btn-faq {
    transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 4rem;
    background: v.$green;
    display: inline-block;
    font-weight: 600;
    padding: 16rem 40rem;
    color: white;

    &:hover {
      box-shadow: 0 4rem 12rem rgba(0, 0, 0, 0.2);
      transform: translateY(-2rem);
      background: #000;
    }
  }

  .whats-link {
    text-decoration: underline;
    margin-top: 18rem;
    color: v.$green;
    font-size: 15rem;
    display: block;

    &:hover {
      color: v.$dark-green;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta-faq .btn-faq {
    transition: none;
  }
}
</style>
