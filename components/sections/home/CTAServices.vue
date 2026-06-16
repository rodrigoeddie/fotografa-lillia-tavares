<script lang="ts" setup>
const cfImg = useCfImg()

const services = [
  {
    title: 'Ensaios fotográficos',
    image: cfImg('2214a3b9-fa58-43d3-95d7-e9e981cfef00'),
    to: '/ensaio-fotografico',
  },
  {
    title: 'Aluguel do estúdio',
    image: cfImg('b6dc36df-86b3-4485-52de-8b91ba144f00'),
    to: '/estudio-fotografico-em-mogi-das-cruzes/aluguel',
  },
  {
    title: 'Análise de coloração pessoal',
    image: cfImg('5aaf1433-aaa7-42ed-7198-15626f964000'),
    to: '/analise-coloracao-pessoal-em-mogi',
  },
];
</script>

<template>
  <div class="wrap-services">
    <BlocksCardService
      v-for="(service, index) in services"
      :key="service.title"
      :service="service"
      :eager="true"
      data-ani-type="fade-up"
    />
  </div>
</template>

<style scoped lang="scss">
.wrap-services {
  justify-content: space-between;
  flex-wrap: wrap;
  display: flex;
  width: 59%;
  
  @include m.max(md) {
    padding: 8rem 0;
    width: 100%;
    gap: 8rem;
  }
}
</style>