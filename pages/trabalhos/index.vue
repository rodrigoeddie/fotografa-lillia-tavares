<script lang="ts" setup>
const $route   = useRoute();
const category = $route.params.category;

const QUERY = `
{
  allCategories {
    id
    title
    slug
  }
  allEnsaios {
    id
    slug
    title
    description
    local
    instagram {
      value
    }
    quote
    color {
      hex
    }
    category {
      id
      title
      slug
    }
    hero {
      id
      alt
      blurUpThumb
      format
      height
      width
      url
    }
    photos {
      id
      alt
      url
      title
      format
      blurUpThumb
      customData
    }
    seo {
      description
      image {
        url
      }
      title
    }
    _status
    _updatedAt
    _firstPublishedAt
  }
  _allEnsaiosMeta {
    count
  }
}
`;

const { data, error } = await useGraphqlQuery({ query: QUERY });

const filteredSlides = (item) => {
  const hasPaisagem = item.photos.some(slide => slide.customData.orientation === 'paisagem');
  let slides = item.photos.filter(slide => slide.customData.orientation === (hasPaisagem ? 'paisagem' : 'retrato'));

  slides = slides.slice(0, 5);

  return slides;
}
</script>

<template>
  <h1>Trabalhos</h1>

  <nav>
    <template v-for="category in data.allCategories">
      <NuxtLink
        :to="'/trabalhos/' + category.slug">
        <span>{{ category.title }}</span>
      </NuxtLink>
    </template>
  </nav>

  <SectionsPortfolio />
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
