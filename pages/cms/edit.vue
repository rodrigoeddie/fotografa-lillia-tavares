<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, navigateTo, useAsyncData, createError as nuxtCreateError } from '#app';
import JsonEditor from './JsonEditor.vue';

definePageMeta({
  middleware: 'auth',
  layout: false,
});

const route = useRoute();
const filePath = computed(() => route.query.path || '');

const {
  data: fileContent,
  pending: isLoading,
  error: fetchErrorObject,
  refresh
} = await useAsyncData(
  `file-editor-content-${filePath.value}`,
  async () => {
    if (!filePath.value) {
      console.warn('[EDIT.VUE] useAsyncData handler: filePath is empty. Not fetching.');
      return null;
    }
    console.log(`[EDIT.VUE] useAsyncData handler executing for path: "${filePath.value}"`);
    const encodedFilePath = encodeURIComponent(filePath.value);
    const url = `/api/files/${encodedFilePath}`;
    try {
      const response = await $fetch(url);
      console.log(`[EDIT.VUE] $fetch response for ${filePath.value}: Type: ${typeof response}, IsNull: ${response === null}`);
      return response;
    } catch (err) {
      console.error(`[EDIT.VUE] $fetch error inside useAsyncData handler for ${filePath.value}:`, err.data || err);
      throw nuxtCreateError({
        statusCode: err.response?._data?.statusCode || err.statusCode || 500,
        statusMessage: err.response?._data?.statusMessage || err.message || 'Failed to fetch file content.',
        data: err.response?._data || err.data,
        fatal: false
      });
    }
  },
  {
    watch: [filePath],
  }
);

const uiError = computed(() => {
  if (fetchErrorObject.value) {
    console.error('[EDIT.VUE] Detailed fetchErrorObject.value:', JSON.stringify(fetchErrorObject.value, null, 2));
    return fetchErrorObject.value.data?.message ||
           fetchErrorObject.value.data?.statusMessage ||
           fetchErrorObject.value.statusMessage ||
           fetchErrorObject.value.message ||
           'Failed to load file.';
  }
  if (filePath.value && (fileContent.value === null || fileContent.value === undefined) && !isLoading.value) {
    console.warn(`[EDIT.VUE] uiError: fileContent is null/undefined for path: "${filePath.value}" after fetch, and not loading.`);
    return 'File content is empty or not found.';
  }
  if (!filePath.value && !isLoading.value) {
    return 'File path not provided in URL query.';
  }
  return null;
});

const saveFile = async () => {
  if (fileContent.value === null || fileContent.value === undefined) {
    alert('No content to save or content is invalid.');
    return;
  }
  if (!filePath.value) {
    alert('File path is missing. Cannot save.');
    return;
  }
  console.log(`[EDIT.VUE] Attempting to save file: "${filePath.value}"`);
  try {
    const encodedFilePath = encodeURIComponent(filePath.value);
    await $fetch(`/api/files/${encodedFilePath}`, {
      method: 'POST',
      body: fileContent.value,
    });
    alert('File saved!');
    const pathParts = filePath.value.split('/');
    pathParts.pop();
    navigateTo(`/cms?path=${pathParts.join('/')}`);
  } catch (saveFetchError) {
    console.error('[EDIT.VUE] Error saving file ($fetch):', JSON.stringify(saveFetchError.data || saveFetchError, null, 2));
    const errorMessage = saveFetchError.data?.message || saveFetchError.data?.statusMessage || saveFetchError.message || 'Failed to save file.';
    alert(`Failed to save file: ${errorMessage}`);
  }
};

onMounted(() => {
  console.log(`[EDIT.VUE] Component mounted. Initial filePath: "${filePath.value}". isLoading: ${isLoading.value}. Has error: ${!!fetchErrorObject.value}`);
});

watch(() => route.query.path, (newPath, oldPath) => {
  console.log(`[EDIT.VUE] route.query.path changed from "${oldPath}" to "${newPath}". Computed filePath is now "${filePath.value}".`);
});

</script>

<template>
  <div class="wrap-cms">
    <div class="inner">
      <button
        class="back-btn"
        @click="navigateTo(`/cms?path=${filePath.split('/').slice(0, -1).join('/')}`)"
        :disabled="!filePath"
      >
        ← Back to List
      </button>

      <h1>Edit File: {{ filePath || 'No file path provided' }}</h1>

      <div v-if="isLoading" class="loading-message">Loading file content...</div>
      <div v-else-if="uiError" class="error-message">
        Error: {{ uiError }}
      </div>
      <form v-else-if="fileContent !== null && typeof fileContent === 'object'" @submit.prevent="saveFile">
        <JsonEditor v-model="fileContent" />
        <div class="form-actions">
          <button type="submit" class="save-btn">Save</button>
          <button
            type="button"
            class="cancel-btn"
            @click="navigateTo(`/cms?path=${filePath.split('/').slice(0, -1).join('/')}`)"
            :disabled="!filePath"
          >
            Cancel
          </button>
        </div>
      </form>
      <div v-else-if="!isLoading && !uiError" class="info-message">
        No content to display or edit. Ensure a file path is provided and the file exists.
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrap-cms {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  font-family: sans-serif;
}

.inner {
  width: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 1.8em;
  margin-bottom: 20px;
  color: #333;
  word-break: break-all;
}

.back-btn {
  align-self: flex-start;
  margin-bottom: 20px;
  background-color: transparent;
  border: 1px solid #007bff;
  color: #007bff;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.2s, color 0.2s;
}

.back-btn:hover {
  background-color: #007bff;
  color: white;
}

.back-btn:disabled {
  border-color: #ccc;
  color: #ccc;
  cursor: not-allowed;
}
.back-btn:disabled:hover {
  background-color: transparent;
  color: #ccc;
}

.loading-message,
.error-message,
.info-message {
  margin: 20px 0;
  padding: 15px;
  border-radius: 4px;
  font-size: 1em;
}

.loading-message {
  background-color: #e0e0e0;
  color: #333;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #c62828;
}

.info-message {
  background-color: #e3f2fd;
  color: #0d47a1;
  border: 1px solid #0d47a1;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  gap: 10px;
}

.save-btn,
.cancel-btn {
  border: none;
  padding: 12px 25px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s;
}

.save-btn {
  background-color: #4caf50;
  color: white;
}

.save-btn:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
}
.cancel-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.cancel-btn:disabled:hover {
  background-color: #ccc;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

</style>