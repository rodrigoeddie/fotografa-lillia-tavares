<script setup lang="ts">
interface InfoItem {
  title: string;
  text: string;
}

const props = defineProps({
  items: {
    type: Array as PropType<InfoItem[]>,
    default: () => [
      { title: 'Memórias Eternas', text: 'Momentos especiais merecem ser eternizados com qualidade e profissionalismo.' },
      { title: 'Experiência Completa', text: 'Do planejamento à entrega, cuidamos de cada detalhe para sua satisfação.' },
      { title: 'Qualidade Garantida', text: 'Equipamentos profissionais e anos de experiência para resultados impecáveis.' },
    ],
  },
});
</script>

<template>
  <section class="why-invest" data-ani-type="fade-up" data-ani-delay="0.2">
    <div class="container">
      <h2 class="subtitle">Por que investir em fotografia profissional?</h2>

      <div class="grid">
        <div v-for="item in props.items" :key="item.title" class="item">
          <h3 class="item-title">{{ item.title }}</h3>
          <p class="item-text">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.why-invest {
  background: #f7f4e8;
  padding: 48rem 32rem;
  margin-bottom: 48rem;

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(250rem, 1fr));
    display: grid;
    gap: 32rem;
  }

  .item-title {
    margin-bottom: 12rem;
    color: v.$green;
    font-weight: 600;
    font-size: 20rem;
  }

  .item-text {
    color: v.$green;
    line-height: 1.6;
  }
}
</style>
