<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

const menuEditorRef = ref<any>(null);

onMounted(async () => {
  await nextTick();
  await menuEditorRef.value?.load();
});
</script>

<template>
  <AdminMenuEditor
    ref="menuEditorRef"
    class="menu-editor"
    :show-message="showMessage"
  />
</template>
