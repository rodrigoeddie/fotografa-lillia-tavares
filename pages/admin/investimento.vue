<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const route = useRoute();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const fm = inject<ReturnType<typeof useAdminFileManager>>('fileManager')!;

const investimentoEditorRef = ref<any>(null);

onMounted(async () => {
  await nextTick();
  const file = route.query.file as string | undefined;
  if (file) {
    fm.selectedWork.value = file;
    await investimentoEditorRef.value?.openFile(file);
  }
});

watch(() => route.query.file, async (newFile) => {
  if (newFile && typeof newFile === 'string') {
    fm.selectedWork.value = newFile;
    await nextTick();
    await investimentoEditorRef.value?.openFile(newFile);
  }
});
</script>

<template>
  <AdminInvestimentoEditor
    ref="investimentoEditorRef"
    class="inv-editor"
    :show-message="showMessage"
  />
</template>
