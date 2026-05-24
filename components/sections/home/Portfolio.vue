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

const isMobile = ref(false);
onMounted(() => {
  const check = () => { isMobile.value = window.innerWidth <= 1000; };
  check();
  window.addEventListener('resize', check);
  onUnmounted(() => window.removeEventListener('resize', check));
});
</script>

<template>
  <div class="container no-padding">
    <h1 class="big-title green centered">
      <NuxtLink
        :to="workPage"
        :aria-label="'Ver ' + (currentCategory ? 'categoria ' + currentCategory.title : 'últimos trabalhos')"
        >
          <span v-if="!currentCategory">Explore meus Últimos trabalhos</span>
          <span v-if="currentCategory">Ensaios fotográficos da categoria {{ currentCategory.title }}</span>
      </NuxtLink>
    </h1>

    <ClientOnly>
      <swiper-container
        v-if="isMobile"
        class="wrap-portfolio swiper-portfolio"
        :slides-per-view="1.6"
        :space-between="12"
        :pagination="false"
        :allow-touch-move="true"
        :touch-release-on-edges="true"
        :breakpoints="{
          500: {
              slidesPerGroup: 2,
              slidesPerView: 2.20,
              spaceBetween: 16,
          },
          750: {
            slidesPerGroup: 3,
            slidesPerView: 3.20,
            spaceBetween: 16,
        },
      }">
          <swiper-slide
            v-for="item in ensaiosData"
            :key="item.id">
              <BlocksCardSimplePortfolio :item="item" />
          </swiper-slide>
      </swiper-container>

      <div v-else class="wrap-portfolio">
        <BlocksCardSimplePortfolio
          v-for="item in ensaiosData"
          :key="item.id"
          :item="item"
          :class="'lenght-items-' + ensaiosData.length" />
      </div>

      <template #fallback>
        <div class="wrap-portfolio">
          <BlocksCardSimplePortfolio
            v-for="item in ensaiosData"
            :key="item.id"
            :item="item"
            :class="'lenght-items-' + ensaiosData.length" />
        </div>
      </template>
    </ClientOnly>
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

    &.swiper-portfolio {
      display: block;
      padding-bottom: 40rem;

      @include m.max(sm) {
        padding-bottom: 0;

        .thumb {
          margin-bottom: 30px;
        }
      }
    }
  }
</style>