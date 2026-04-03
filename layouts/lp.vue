<script lang="ts" setup>
const route = useRoute();
const lpType = computed(() => route.meta.lpType as string || 'corporativo');
const showHeader = computed(() => route.meta.showHeader as boolean || false);

const logo = computed(() => {
    if (lpType.value === 'corporativo') {
        return "de7d6be6-8fed-43b0-e2ca-7b5643bd9d00";
    } else if (lpType.value === 'dia-das-maes') {
        return "4cb733c9-64af-48fd-2578-c43f3a26d800";
    } else if (lpType.value === 'presentes') {
        return "4cb733c9-64af-48fd-2578-c43f3a26d800";
    }

    return '19bd6c18-a153-4e79-c6bd-4293145da400';
});

useHead({
  bodyAttrs: {
    class: computed(() => `lp-${lpType.value}`)
  }
});

useSchemaOrg([
  defineWebSite({
    name: 'Fotógrafa Lillia Tavares',
    url: 'https://fotografalilliatavares.com.br/ensaio-profissional-em-mogi'
  })
]);
</script>

<template>
  <div :class="showHeader ? `wrapper-main` : ''">
    <TemplatesHeader v-if="showHeader" :class="`lp-${lpType}`" :lp="lpType" :logo="logo" />
    <slot />
    <TemplatesFooter :class="`lp-${lpType}`" :lp="lpType" :logo="logo" />
  </div>
</template>

<style lang="scss">
body.lp-corporativo {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #939DAB;
    font-family: 'Lato', sans-serif;
    background: white;
}

body.lp-dia-das-maes {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #aba093;
    font-family: 'Lato', sans-serif;
    background: white;
}

body.lp-presentes {
    --swiper-pagination-color: black;
    --swiper-pagination-bullet-inactive-color: #b8909a;
    font-family: 'Lato', sans-serif;
    background: white;
}

.wrapper-main {
  padding-top: 20px;
}
</style>

