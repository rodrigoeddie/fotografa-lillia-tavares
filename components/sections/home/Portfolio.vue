<script lang="ts" setup>
const $route       = useRoute();
const configPublic = useRuntimeConfig().public;

const filteredSlides = (item) => {
  if (!item || !Array.isArray(item.album)) {
    return {
      retrato: []
    };
  }

  const retratoSlides = item.album
    .filter(slide => slide.format === 'retrato' && slide.canBeThumb === true)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  return {
    retrato: retratoSlides
  };
}

const { data: navigation } = await useAsyncData('home-portfolio-navigation', () => {
  return queryCollectionNavigation('works');
});

const categories = navigation.value?.[0]?.children ?? [];
const workPage   = navigation.value?.[0]?.path ?? '/ensaio-fotografico';
const category   = $route.params.category || '';

const currentCategory = categories.find(cat => cat.path === `/ensaio-fotografico/${category}`);

const {
  data: ensaiosList
} = await useAsyncData(() => {
  const query = queryCollection('works')

    query.limit(4);
    query.where('home', '=', true);

  if (category) {
    query.where('path', 'LIKE', `%/${category}%`);
  }

  query.where('id', 'NOT LIKE', `%/index.json%`);

  return query.all();
});

const ensaiosData = Array.isArray(ensaiosList.value) ? ensaiosList.value
  .map(item => {
    return {
      ...item,
      photos: filteredSlides(item),
      path: item.path
    };
  }) : [];

</script>

<template>
  <div class="container no-padding">
    <NuxtLink
      :to="workPage"
      :aria-label="'Ver ' + (currentCategory ? 'categoria ' + currentCategory.title : 'últimos trabalhos')"
      data-ani-type="fade">
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
          :class="'lenght-items-' + ensaiosData.length"
          data-ani-type="polaroid"
          data-ani-batch="wrap-portfolio"
          data-ani-stagger="0.07" />
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