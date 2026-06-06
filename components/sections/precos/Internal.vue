<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});

const slug = (useRoute().params.slug as string) ?? '';

const titleParts = computed(() => {
  if (!props.data?.title) return { box: '', big: '' };
  const words = props.data.title.split(' ');
  const big = words.pop();
  const box = words.join(' ');
  return { box, big };
});

const { data: rawPortfolio } = useFetch(`/api/public/portfolio?categoria=${slug}`);
const portfolioItems = computed(() => {
  const works = (rawPortfolio.value as any[] | null) ?? [];
  return works.map(adaptPortfolioWork).slice(0, 4);
});
</script>

<template>
  <div v-if="data && data.packages" class="pricing-page">
    <div class="container">
      <header class="pricing-header">
        <h1 class="big-title green centered">
          Pacote do {{ titleParts.box }} {{ titleParts.big }}
        </h1>

        <p class="description">{{ data.description }}</p>
      </header>

      <SectionsGeneralPricingGrid :data="data" :class="`lp-${data.lp}`" />

      <section v-if="data.includes" class="pricing-details">
        <h2 class="title">O que está incluso em todos os pacotes</h2>
        <ul class="pricing-details__list">
          <li v-for="(item, index) in data.includes" :key="index" v-html="item"></li>
        </ul>
      </section>

      <div v-if="portfolioItems.length > 0" class="portfolio-section">
        <div class="container">
          <h2 class="big-title centered" data-ani-type="fade">Conheça meus trabalhos</h2>
          <div class="wrap-portfolio">
            <BlocksCardSimplePortfolio
              v-for="(item, index) in portfolioItems"
              :key="item.path"
              :item="item"
              :eager="index === 0"
              class="lenght-items-4"
              data-ani-type="polaroid"
              data-ani-batch="wrap-portfolio"
              data-ani-stagger="0.07"
            />
          </div>
          <div class="ac">
            <NuxtLink :to="`/ensaio-fotografico/${slug}`" class="btn" data-ani-type="fade">
              <span>Ver todos os trabalhos</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <SectionsGeneralCtaContact :data="data.cta" :class="`lp-${data.lp}`" />
    </div>
  </div>
  <div v-else class="pricing-page">
    <div class="container">
      <p>Carregando dados...</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pricing-header {
  text-align: center;
}

.pricing-details {
  box-shadow: 0 0 10rem rgba(0, 0, 0, 0.1);
  border: 1px solid v.$green;
  padding: 32rem;
  border-radius: 8rem;
  background: #fff;
  color: v.$green;
  
  .title {
    padding-bottom: 20rem;
    text-align: center;
  }
  
  &__list {
    grid-template-columns: 1fr 1fr;
    list-style: none;
    display: grid;
    padding: 0;
    
    li {
      padding: 12rem 0;
      position: relative;
      padding-left: 32rem;
      font-size: 18rem;

      :deep(.highlight) {
        font-weight: 600;
        color: black;
      }
      
      &:before {
        content: '✓';
        position: absolute;
        left: 0;
        font-weight: 600;
      }
    }
  }
}

.wrap-portfolio {
  flex-wrap: wrap;
  display: flex;
  gap: 20rem;

  @include m.max(xs) {
    gap: 10rem;
  }
}

.ac {
  padding-bottom: 50rem;
  text-align: center;
  margin-top: 30rem;
}
</style>
