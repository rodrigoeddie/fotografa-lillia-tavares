<script lang="ts" setup>
const $route = useRoute();
const category = $route.params.category || '';

const { data: rawWorks } = await useFetch('/api/public/portfolio?home=1');

const ensaiosData = computed(() => {
  const works = (rawWorks.value as any[] | null) ?? [];
  return works
    .map(adaptPortfolioWork)
    .sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0));
});

const workPage = '/ensaio-fotografico';
const currentCategory = computed(() =>
  category ? { slug: category, title: PORTFOLIO_CATEGORIAS[category as string] ?? category } : null
);
</script>

<template>
  <div class="container no-padding">
    <NuxtLink
      :to="workPage"
      :aria-label="'Ver ' + (currentCategory ? 'categoria ' + currentCategory.title : 'últimos trabalhos')"
      >
      <h1 class="big-title green centered">
        <span class="box">
          <span v-if="!currentCategory">Explore meus</span>
          <span v-if="currentCategory">Ensaios fotográficos da categoria</span>
        </span>
        <span class="big" v-if="!currentCategory">Últimos trabalhos</span>
        <span class="big" v-if="currentCategory">{{ currentCategory.title }}</span>
      </h1>
    </NuxtLink>

    <div class="wrap-portfolio">
      <template v-for="(item, index) in ensaiosData">
        <BlocksCardSimplePortfolio
          :item="item"
          :class="'lenght-items-' + ensaiosData.length" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .big-title-home {
    justify-content: center;
    margin-bottom: -8rem;
    padding-top: 0 !important;
    width: 100%;

    @include m.max(sm) {
      margin-bottom: 0;
    }
  }

  .big-title {
    @include m.max(sm) {
      padding-top: 35rem;
    }
  }

  .wrap-portfolio {
    justify-content: space-between;
    margin-bottom: calc(v.$space * 2);
    flex-wrap: wrap;
    display: flex;

    @include m.max(sm) {
      gap: 10rem 0;
    }
  }
</style>