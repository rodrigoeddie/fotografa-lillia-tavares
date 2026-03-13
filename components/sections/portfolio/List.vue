<script lang="ts" setup>
const $route       = useRoute();
const configPublic = useRuntimeConfig().public;

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

interface SlideFormat {
  retrato: any[];
  paisagem: any[];
}

const filteredSlides = (item: any): SlideFormat => {
  if (!item.album) {
    return {
      retrato: [],
      paisagem: []
    };
  }

  const retratoSlides = item.album
    .filter((slide: any) => slide.format === 'retrato' && slide.canBeThumb === true)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  const paisagemSlides = item.album
    .filter((slide: any) => slide.format === 'paisagem' && slide.canBeThumb === true)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  return {
    retrato: retratoSlides,
    paisagem: paisagemSlides
  };
}

const { data: navigation } = await useAsyncData('portfolio-navigation', () => {
  return queryCollectionNavigation('works');
});

const workPage        = ref('');
const currentCategory = ref<any>(null);

// Computed para gerar a key do useAsyncData baseada nos parâmetros atuais
const asyncDataKey = computed(() => {
  const category = $route.params.category || '';
  return `ensaios-${category}-${props.fromHome}`;
});

// Computed para gerar a query baseada nos parâmetros atuais
const queryConfig = computed(() => {
  const category = $route.params.category || '';
  return {
    category,
    fromHome: props.fromHome
  };
});

const { data: ensaiosList, refresh: refreshEnsaios } = await useAsyncData(
  asyncDataKey,
  () => {
    const query = queryCollection('works');
    const { category, fromHome } = queryConfig.value;

    if (fromHome) {
      query.limit(3);
      query.where('home', '=', true);
    }

    if (category && !props.category) {
      query.where('path', 'LIKE', `%/${category}%`);
    }

    if (props.category) {
      query.where('path', 'LIKE', `%/${props.category}%`);
    }

    query.where('id', 'NOT LIKE', `%/index.json%`);

    return query.all();
  }
);

const ensaiosData = computed(() => {
  if (!ensaiosList.value || !Array.isArray(ensaiosList.value)) {
    return [];
  }

  const items = ensaiosList.value
    .map((item: any) => {
      return {
        ...item,
        photos: filteredSlides(item),
        path: item.path
      };
    })
    .sort((a: any, b: any) => {
      if (props.fromHome) {
        if (a.homeOrder && b.homeOrder) {
          return a.homeOrder - b.homeOrder;
        }
        return 0;
      }
      return 0;
    });

  return props.category ? items.slice(0, 3) : items;
});

function atualizarConteudoComBaseNaRota(newRoute: any) {
  if (!navigation.value || !navigation.value[0]) return;

  const categories = navigation.value[0].children;
  workPage.value = navigation.value[0].path;
  const category = newRoute.params.category || '';

  currentCategory.value = categories?.find(cat => cat.path === `/ensaio-fotografico/${category}`) || null;
}

atualizarConteudoComBaseNaRota($route);

watch(
  () => $route.fullPath,
  (novoFullPath, antigoFullPath) => {
    if (novoFullPath !== antigoFullPath) {
      atualizarConteudoComBaseNaRota($route);
      // Refresh dos dados quando a rota mudar
      refreshEnsaios();
    }
  },
  { immediate: false }
);

const ensaiosByCategory = computed(() => {
  if (props.fromHome || props.category) return null;

  const categories = navigation.value?.[0]?.children ?? [];

  return (categories as any[])
    .map((cat) => {
      const items = ensaiosData.value
        .filter((item: any) => item.path.startsWith(cat.path + '/'))
        .slice(0, 4);
      return { title: cat.title, path: cat.path, items };
    })
    .filter((group) => group.items.length > 0);
});
</script>

<template>
    <div class="container" v-if="ensaiosData.length > 0">
        <h1 class="big-title green centered" data-ani-type="fade">
            <span class="box">
                <span v-if="props.category">Trabalhos</span>
                <span v-else-if="currentCategory">Ensaios fotográficos da categoria</span>
                <span v-else>Explore meus</span>
            </span>
            <span class="big" v-if="props.category">com esse tema</span>
            <span class="big" v-else-if="currentCategory">{{ currentCategory.title }}</span>
            <span class="big" v-else>Últimos trabalhos</span>
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
                    <NuxtLink :to="group.path" class="btn btn-green">
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
    gap: 18rem;

    @include m.max(xs) {
      gap: 10rem;
    }
  }

  .title {
    color: v.$green;
  }

  .portfolio-category-group {
    margin-bottom: 0;

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
