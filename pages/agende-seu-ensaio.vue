<script lang="ts" setup>
const title = 'Agende seu Ensaio | Fotógrafa Lillia Tavares';
const description = 'Se você gostou do meu trabalho e pretende fazer um ensaio fotográfico, agende seu horário. Entre em contato comigo e escolha o melhor dia';

useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: title,
    url: 'https://fotografalilliatavares.com.br/agende-seu-ensaio',
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
  description: description
});
</script>

<template>
    <SectionsSchedule />
    <SectionsStudiocontact />
</template>
