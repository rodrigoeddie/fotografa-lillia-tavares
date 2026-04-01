<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const fm = inject<ReturnType<typeof useAdminFileManager>>('fileManager')!;

const depEditorRef = ref<any>(null);

onMounted(async () => {
  await nextTick();
  await depEditorRef.value?.load();
});
</script>

<template>
  <AdminDepoimentosEditor
    ref="depEditorRef"
    class="dep-editor"
    :show-message="showMessage"
    :portfolio-works="fm.portfolioWorks.value"
  />
</template>
