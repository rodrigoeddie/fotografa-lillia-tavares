<script setup lang="ts">
const { data: produtos } = await useFetch('/api/public/investimento');

const categories = computed(() => {
  if (!produtos.value?.length) return [];
  return (produtos.value as any[]).map((item) => ({
    slug: item.slug,
    name: item.title,
    icon: item.icon,
    description: item.description,
  }));
})
</script>

<template>
  <div class="investment-page">
    <div class="container">
      <header
        class="investment-header"
        data-ani-type="fade-up">
        <h1 class="big-title">
          Pacotes dos Ensaios Fotográficos
        </h1>
        <p class="description">
          Escolha o tipo de ensaio que melhor se encaixa no seu momento especial.
          Cada categoria foi cuidadosamente elaborada para atender suas necessidades.
        </p>
      </header>

      <div class="investment-categories">
        <NuxtLink
          v-for="category in categories"
          :key="category.slug"
          :to="`/precos-ensaios-fotograficos/${category.slug}`"
          class="category-card"
          data-ani-type="polaroid"
          data-ani-batch="investment-categories"
          data-ani-stagger="0.07"
          data-track-event="cta-ver-categoria-precos"
          :data-track-params="JSON.stringify({ categoria: category.slug })">
            <div class="category-card__icon" v-html="category.icon"></div>
            <h2 class="category-card__title">{{ category.name }}</h2>
            <p class="category-card__description">{{ category.description }}</p>
            <span class="btn">Ver Pacotes</span>
        </NuxtLink>
      </div>
    </div>

    <SectionsGeneralWhyInvest />

    <SectionsGeneralCtaFaq
      description="Reunimos as respostas para as dúvidas mais comuns sobre pacotes, valores e como funciona o ensaio."
      whatsapp-message="Olá! Gostaria de saber mais sobre os pacotes fotográficos" />
  </div>
</template>

<style scoped lang="scss">
.category-card__icon {
  margin-bottom: 16rem;
  width: 48rem;
  height: 48rem;
  color: v.$green;

  :deep(svg:not([fill='none'])) {
    width: 100%;
    height: 100%;
    fill: v.$green;
  }
}

.investment-header {
  text-align: center;
  margin-bottom: calc(v.$space * 2);
  max-width: 1200rem;
  margin-left: auto;
  margin-right: auto;
  color: v.$green;
}

.investment-categories {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32rem;
  margin-bottom: 64rem;

  @include m.max(md) {
    grid-template-columns: 1fr;
  }
}

.category-card {
  transition: transform .15s cubic-bezier(.2,.7,.2,1), box-shadow .3s ease;
  padding: calc(v.$space * 2);
  flex-direction: column;
  text-decoration: none;
  align-items: center;
  text-align: center;
  background: #fff;
  display: flex;
  @include m.card-shadow;

  &:hover {
    @include m.card-shadow-hover;
  }

  &__icon {
    font-size: 48rem;
    margin-bottom: 16rem;
  }

  &__title {
    font-size: 24rem;
    font-weight: 600;
    color: v.$green;
    margin-bottom: 12rem;
  }

  &__description {
    color: v.$green;
    line-height: 1.5;
    margin-bottom: 24rem;
    flex: 1;
  }

  &__link {
    color: v.$green;
    font-weight: 600;
    text-decoration: underline;
  }
}

</style>
