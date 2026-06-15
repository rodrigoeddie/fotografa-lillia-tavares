<script setup lang="ts">
usePageSeo('static', '/precos-ensaios-fotograficos');

const { data: produtos } = await useFetch('/api/public/investimento');

useSchemaOrg([
  {
    '@type': 'ItemList',
    '@id': 'https://fotografalilliatavares.com.br/precos-ensaios-fotograficos#list',
    name: 'Pacotes de Ensaios Fotográficos - Lillia Tavares',
    description: 'Pacotes de ensaios fotográficos para diferentes ocasiões em Mogi das Cruzes e Alto Tietê.',
    url: 'https://fotografalilliatavares.com.br/precos-ensaios-fotograficos',
    itemListElement: computed(() =>
      ((produtos.value as any[]) ?? []).map((item: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `https://fotografalilliatavares.com.br/precos-ensaios-fotograficos/${item.slug}`,
      }))
    ),
  },
]);
</script>

<template>
  <div class="container">
    <BlocksBreadcrumb :items="[
      { label: 'Home', to: '/' },
      { label: 'Preços de Ensaios Fotográficos' },
    ]" />
  </div>
  <SectionsPrecosList />
</template>

<style scoped lang="scss">
</style>
