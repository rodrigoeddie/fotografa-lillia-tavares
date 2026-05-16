<script lang="ts" setup>
const route = useRoute()
const category = route.params.category as string;

const categoryTitle = PORTFOLIO_CATEGORIAS[category] ?? category;
const fallbackTitle = (categoryTitle ? categoryTitle + ' | ' : '') + 'Ensaios fotográficos profissionais';

// SEO via DB — já aplica todos os meta tags reativamente (useSeoMeta + useHead)
// Deve ser chamado ANTES de qualquer await
usePageSeo('static', `/ensaio-fotografico/${category}`);

// Schema.org estruturado para a página de listagem da categoria
useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: fallbackTitle,
    url: 'https://fotografalilliatavares.com.br/ensaio-fotografico/' + category,
  })
]);
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Ensaios Fotográficos', to: '/ensaio-fotografico' },
      { label: categoryTitle },
    ]" />
  </div>
  <SectionsPortfolioCategoryList class="no-padding" />
</template>

<style scoped lang="scss">
@use 'sass:color';

.btn-title {
  padding: 40px 10px 20px;
  cursor: pointer;
  z-index: 3;
  width: 100%;

  @include m.min(md) {
    background: color.scale(v.$light-beige, $lightness: 10%);
    transition: .2s background;

    &:hover {
      background: color.scale(v.$light-beige, $lightness: 5%);
    }

    &:focus {
      background: color.scale(v.$light-beige, $lightness: 7%);
    }
  }

  .inner-btn {
    display: block;
  }

  .title-btn {
    color: color.scale(v.$beige, $lightness: -20%);
    text-transform: uppercase;
    font-weight: bold;
    line-height: 31px;
    font-size: 17px;
    flex-shrink: 0;
  }

  .description-btn {
    color: color.scale(v.$beige, $lightness: -20%);
    line-height: 15px;
    font-size: 12px;
    flex-shrink: 0;
  }
}

.container {

  @include m.min(md) {
    padding: 0 50rem;
  }

  @include m.max(md) {
    padding: 0 10px;
  }

  .wrap {
    flex-wrap: wrap;
    display: flex;
    gap: 25rem;
    width: 100%;
  }
}
</style>
