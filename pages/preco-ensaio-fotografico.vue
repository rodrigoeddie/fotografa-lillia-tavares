<script lang="ts" setup>
const title = 'Solicite o orçamento para saber o preço do seu ensaio fotográfico';
const description = 'Se você gostou do meu trabalho e pretende fazer um ensaio fotográfico, agende seu horário. Entre em contato comigo e escolha o melhor dia';

useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: title,
    url: 'https://fotografalilliatavares.com.br/preco-ensaio-fotografico',
    sameAs: [
      'https://www.facebook.com/fotografalilliatavares',
      'https://www.instagram.com/fotografalilliatavares',
      'https://www.tiktok.com/@fotografalilliatavares',
      'https://wa.me/5511911159795'
    ]
  })
]);

useSeoMeta({
  title: title,
  description: description,
  keywords: 'Preço Ensaio Fotográfico'
});
</script>

<template>
    <SectionsSchedule />
    <SectionsStudiocontact />
</template>
