<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const linktreeEditorRef = ref<any>(null);

onMounted(async () => {
  await nextTick();
  await linktreeEditorRef.value?.load();
});
</script>

<template>
  <AdminLinktreeEditor ref="linktreeEditorRef" />
</template>
