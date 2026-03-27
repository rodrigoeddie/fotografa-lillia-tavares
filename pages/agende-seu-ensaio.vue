<script lang="ts" setup>
const title = 'Agende seu Ensaio Fotográfico em Mogi das Cruzes | Lillia Tavares';
const description = 'Agende seu ensaio fotográfico profissional em Mogi das Cruzes. Entre em contato, escolha o melhor dia e tenha fotos incríveis. Atendemos toda a região do Alto Tietê.';
const link = 'https://fotografalilliatavares.com.br/agende-seu-ensaio';
const ogImage = 'https://images.fotografalilliatavares.com.br/images/a0839ccd-c1b8-4142-e44f-77c07c62c800/public';

useSchemaOrg([
  defineWebPage({
    '@type': 'ContactPage',
    name: title,
    url: link,
    sameAs: [
      'https://www.facebook.com/fotografalilliatavares',
      'https://www.instagram.com/fotografalilliatavares',
      'https://www.tiktok.com/@fotografalilliatavares',
      'https://wa.me/5511911159795'
    ]
  })
]);

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: link,
  ogImage,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
});

useHead({
  link: [
    {
      rel: 'canonical',
      href: link
    }
  ]
});
</script>

<template>
    <div class="container">
      <BlocksBreadcrumb :items="[
        { label: 'Home', to: '/' },
        { label: 'Agendar Ensaio' },
      ]" />
    </div>
    <SectionsScheduleForm />
    <SectionsStudioTiny :showMap="true" />
</template>
