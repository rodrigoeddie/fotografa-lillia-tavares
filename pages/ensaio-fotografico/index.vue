<script lang="ts" setup>
const title = 'Ensaios fotográficos profissionais conheça o trabalho de Lillia Tavares';
const description = 'Ao unir o espaço amplo e acolhedor do nosso estúdio, a sensibilidade artística da fotógrafa Lillia Tavares e a beleza única de cada cliente, transformamos cada ensaio em uma experiência verdadeiramente singular.';

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: title,
    url: 'https://fotografalilliatavares.com.br/ensaio-fotografico',
  })
]);

useSeoMeta({
  title: title,
  description: description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://fotografalilliatavares.com.br/ensaio-fotografico',
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://fotografalilliatavares.com.br/ensaio-fotografico'
    }
  ]
});
</script>

<template>
  <SectionsPortfolioHero />
  <SectionsPortfolio class="no-padding" />
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
