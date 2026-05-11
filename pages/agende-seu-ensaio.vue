<script lang="ts" setup>
usePageSeo('static', '/agende-seu-ensaio');
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
