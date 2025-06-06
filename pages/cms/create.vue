<script setup>
definePageMeta({
  middleware: 'auth',
  layout: false,
});

const newFileName = ref('');
const currentPath = useRoute().query.path || ''; // Obtém o caminho atual da query string

const createFile = async () => {
  if (!newFileName.value) {
    alert('Please provide a file name.');
    return;
  }

  await useFetch(`/api/files/${currentPath}/${newFileName.value}`, {
    method: 'POST',
    body: {},
  });

  alert('File created!');
  navigateTo(`/cms?path=${currentPath}`);
};
</script>

<template>
  <div class="wrap-cms">
    <div class="inner">
      <h1>Create New File</h1>
      <!-- Botão corrigido para voltar à listagem -->
      <button
        class="back-btn"
        @click="navigateTo(`/cms?path=${currentPath}`)"
      >
        ← Back to List
      </button>
      <input v-model="newFileName" placeholder="New file name" />
      <button @click="createFile">Create</button>
      <button @click="navigateTo(`/cms?path=${currentPath}`)">Cancel</button>
    </div>
  </div>
</template>

<style scoped>
.wrap-cms {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.back-btn {
  align-self: flex-start;
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.back-btn:hover {
  text-decoration: underline;
}
</style>