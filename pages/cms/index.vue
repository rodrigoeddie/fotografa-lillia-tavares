<script setup>
definePageMeta({
  middleware: 'auth',
  layout: false,
});

const files = ref([]);
const currentPath = ref('ensaio-fotografico'); // Caminho inicial definido como "ensaio-fotografico"
const collapsedFolders = ref([]); // Lista de pastas colapsadas

const fetchFiles = async (path = '') => {
  const { data } = await useFetch(`/api/files?path=${path}`);
  files.value = data.value;
  currentPath.value = path; // Atualiza o caminho atual
};

const toggleFolder = (folderName) => {
  if (collapsedFolders.value.includes(folderName)) {
    collapsedFolders.value = collapsedFolders.value.filter((name) => name !== folderName);
  } else {
    collapsedFolders.value.push(folderName);
  }
};

const goBack = () => {
  const parts = currentPath.value.split('/').filter(Boolean); // Divide o caminho atual em partes
  parts.pop(); // Remove a última parte do caminho (diretório atual)
  fetchFiles(parts.join('/')); // Navega para o diretório pai
};

const logout = () => {
  useCookie('auth_token').value = null;
  navigateTo('/login');
};

// Inicializa a listagem no diretório "ensaio-fotografico"
fetchFiles(currentPath.value);
</script>

<template>
  <div class="wrap-cms">
    <div class="inner">
      <h1 class="title">CMS</h1>
      <button @click="logout" class="logout-btn">Logout</button>
      <button @click="navigateTo('/cms/create')" class="create-btn">Create New File</button>

      <!-- Botão para voltar para a pasta anterior -->
      <h2>Files</h2>
      <button v-if="currentPath" @click="goBack">← Back</button>

      <ul>
        <li
          v-for="file in files"
          :key="file.name"
        >
          <template v-if="file.isDirectory">
            <div @click="fetchFiles(`${currentPath}/${file.name}`)" class="folder">
              📁 {{ file.name }}
            </div>
          </template>
          <template v-else>
            <div @click="navigateTo(`/cms/edit?path=${currentPath}/${file.name}`)" class="file">
              📄 {{ file.name }}
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap-cms {
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-size: 30rem;
}

.logout-btn,
.create-btn,
.back-btn {
  margin: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #ff4d4d;
}

.create-btn:hover,
.back-btn:hover {
  background-color: #45a049;
}

.folder {
  cursor: pointer;
  font-weight: bold;
}

.file {
  cursor: pointer;
}
</style>