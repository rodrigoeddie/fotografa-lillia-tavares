<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
</script>

<template>
  <AdminEntregasEditor :show-message="showMessage" />
</template>
