<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

const faqEditorRef = ref<any>(null);

onMounted(async () => {
  await nextTick();
  await faqEditorRef.value?.load();
});
</script>

<template>
  <AdminFaqEditor
    ref="faqEditorRef"
    :show-message="showMessage"
  />
</template>
