<script lang="ts" setup>
const $route = useRoute();

const props = defineProps({
  fromHome: {
    type: Boolean,
    required: false,
    default: false
  },
  category: {
    type: String,
    required: false,
    default: undefined
  }
});

const routeCategory = computed(() => ($route.params.category as string) || '');

const apiUrl = computed(() => {
  const cat = props.category ?? routeCategory.value;
  const params = new URLSearchParams();
  if (props.fromHome) params.set('home', '1');
  else if (cat) params.set('categoria', cat);
  const qs = params.toString();
  return `/api/public/portfolio${qs ? '?' + qs : ''}`;
});

const { data: rawWorks, refresh: refreshEnsaios } = await useFetch(apiUrl);

const ensaiosData = computed(() => {
  const works = (rawWorks.value as any[] | null) ?? [];
  const adapted = works.map(adaptPortfolioWork);
  if (props.fromHome) {
    return [...adapted].sort((a, b) => (a.homeOrder ?? 0) - (b.homeOrder ?? 0));
  }
  return props.category ? adapted.slice(0, 3) : adapted;
});

const CATEGORY_ORDER = ['corporativo', 'sensual-intimista', 'dia-das-maes', 'gestante', 'aniversario', 'casal'];
const workPage = '/ensaio-fotografico';

const currentCategory = computed(() => {
  const cat = routeCategory.value;
  return cat ? { slug: cat, title: PORTFOLIO_CATEGORIAS[cat] ?? cat } : null;
});

const ensaiosByCategory = computed(() => {
  if (props.fromHome || props.category || routeCategory.value) return null;
  return CATEGORY_ORDER
    .map((slug) => {
      const items = ensaiosData.value.filter((item: any) => item.categoria === slug).slice(0, 4);
      return { title: PORTFOLIO_CATEGORIAS[slug] ?? slug, path: `/ensaio-fotografico/${slug}`, items };
    })
    .filter((g) => g.items.length > 0);
});

watch(() => $route.fullPath, () => refreshEnsaios(), { immediate: false });
</script>

<template>
    <div class="container" v-if="ensaiosData.length > 0">
        <h1 class="big-title green centered" data-ani-type="fade">
          <span v-if="props.category">Trabalhos com esse tema</span>
          <span v-else-if="currentCategory">Ensaios fotográficos da categoria {{ currentCategory.title }}</span>
          <span v-else>Explore meus Últimos trabalhos</span>
        </h1>

        <SectionsPortfolioMenuCategories data-ani-type="fade" />

        <template v-if="ensaiosByCategory">
            <div
              v-for="group in ensaiosByCategory"
              :key="group.path"
              class="portfolio-category-group">
                <h2 class="title" data-ani-type="fade">{{ group.title }}</h2>
                <div class="wrap-portfolio">
                    <BlocksCardSimplePortfolio
                      v-for="item in group.items"
                      :key="item.path"
                      :item="item"
                      class="lenght-items-4"
                      data-ani-type="polaroid"
                      data-ani-batch="wrap-portfolio"
                      data-ani-stagger="0.07" />
                </div>
                <div class="ac">
                    <NuxtLink :to="group.path" class="btn btn-white" data-ani-type="fade" data-ani-delay="0.5">
                        <span>Ver todos</span>
                    </NuxtLink>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="wrap-portfolio">
                <template
                  v-for="(item, index) in ensaiosData"
                  :key="item.path">
                    <BlocksCardSimplePortfolio
                      :item="item"
                      class="lenght-items-4"
                      data-ani-type="polaroid"
                      data-ani-batch="wrap-portfolio"
                      data-ani-stagger="0.07" />
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
  .big-title-home {
    justify-content: center;
    margin-bottom: -8rem;
    padding-top: 0;
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
    flex-wrap: wrap;
    display: flex;
    gap: 20rem;

    @include m.max(xs) {
      gap: 10rem;
    }
  }

  .title {
    color: v.$green;
  }

  .portfolio-category-group {
    margin-bottom: 0;
    margin-top: 30rem;

    .title {
      text-align: center;
      padding-bottom: 15rem;
    }

    .btn {
      margin-bottom: 35rem;
      margin-top: 15rem;
    }
  }
</style>
