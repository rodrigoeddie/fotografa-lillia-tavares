<script setup>
definePageMeta({
  middleware: 'auth',
  layout: false,
});

const files = ref([]);
const currentPath = ref(''); // Caminho atual dentro de "content"
const selectedFile = ref(null);
const fileContent = ref({});
const newFileName = ref('');
const imageFile = ref(null);

const fetchFiles = async (path = '') => {
  const { data } = await useFetch(`/api/files?path=${path}`);
  files.value = data.value;
  currentPath.value = path; // Atualiza o caminho atual
};

const loadFile = async (filename) => {
  const { data } = await useFetch(`/api/files/${currentPath.value}/${filename}`);
  selectedFile.value = filename;
  fileContent.value = data.value;
};

const saveFile = async () => {
  await useFetch(`/api/files/${currentPath.value}/${selectedFile.value}`, {
    method: 'POST',
    body: fileContent.value,
  });
  alert('File saved!');
  selectedFile.value = null; // Fecha o editor após salvar
};

const navigateToFolder = (folderName) => {
  fetchFiles(`${currentPath.value}/${folderName}`); // Navega para a pasta
};

const goBack = () => {
  const parts = currentPath.value.split('/').filter(Boolean);
  parts.pop(); // Remove a última parte do caminho
  fetchFiles(parts.join('/')); // Volta para o diretório anterior
};

const createFile = async () => {
  if (!newFileName.value) {
    alert('Please provide a file name.');
    return;
  }

  await useFetch(`/api/files/${currentPath.value}/${newFileName.value}`, {
    method: 'POST',
    body: {}, // Cria um arquivo vazio
  });

  alert('File created!');
  newFileName.value = '';
  fetchFiles(currentPath.value); // Atualiza a lista de arquivos
};

const uploadImage = async () => {
  const formData = new FormData();
  formData.append('file', imageFile.value);

  const { data } = await useFetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  alert('Image uploaded!');
  console.log(data.value);
};

const logout = () => {
  useCookie('auth_token').value = null; // Remove o token do cookie
  navigateTo('/login'); // Redireciona para a página de login
};

fetchFiles(); // Carrega os arquivos na inicialização
</script>

<template>
  <div class="wrap-cms">
    <div class="inner">
      <h1 class="title">CMS</h1>
      <button @click="logout" class="logout-btn">Logout</button>

      <!-- Lista de Arquivos -->
      <div v-if="!selectedFile">
        <h2>Files</h2>
        <button v-if="currentPath" @click="goBack">Go Back</button>
        <ul>
          <li
            v-for="file in files"
            :key="file.name"
            @click="file.isDirectory ? navigateToFolder(file.name) : loadFile(file.name)"
          >
            <span v-if="file.isDirectory">📁 {{ file.name }}</span>
            <span v-else>📄 {{ file.name }}</span>
          </li>
        </ul>
      </div>

      <!-- Editor de Arquivo -->
      <div v-if="selectedFile">
        <h2>Edit File: {{ selectedFile }}</h2>
        <textarea v-model="fileContent" rows="20" cols="80"></textarea>
        <button @click="saveFile">Save</button>
        <button @click="selectedFile = null">Cancel</button>
      </div>

      <!-- Formulário de Cadastro de Arquivo -->
      <div v-if="!selectedFile">
        <h2>Create New File</h2>
        <input v-model="newFileName" placeholder="New file name" />
        <button @click="createFile">Create</button>
      </div>

      <!-- Upload de Imagem -->
      <div v-if="!selectedFile">
        <h2>Upload Image</h2>
        <input type="file" @change="e => (imageFile.value = e.target.files[0])" />
        <button @click="uploadImage">Upload</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap-cms {
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100vh;
}

.logout-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #ff1a1a;
}
</style>