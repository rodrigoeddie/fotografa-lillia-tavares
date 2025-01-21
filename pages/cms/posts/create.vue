<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'vuestic-ui';

const { init: toastInit }    = useToast();

const title     = ref<string>('');
const content   = ref<string>('');
const image     = ref<File>();
const published = ref<boolean>(false);

const onChange = async (event: Event) => {
  const file = event.target.files[0];

  if (!file || !file.type.match(/^image\/(jpeg|png|gif|webp)$/i)) {
    alert("O arquivo não é uma imagem válida.");

    return;
  }

  image.value = file;
};

const createPost = async () => {
  const formData = new FormData()

  formData.append('file', image.value);
  formData.append('content', content.value);
  formData.append('published', published.value);
  formData.append('title', title.value);

  const { data: res } = await useFetch('/api/posts', {
    method: 'post',
    body: formData,
  });

  if(res.value.id > 0) {
    toastInit({
      message: '✓ Informações salvas com sucesso!',
      color: 'success',
      onClose: function() {
          document.location.reload(true);
      }
    });
  } else {
    toastInit({
        message: 'X Desculpe, houve um erro.',
        color: 'danger'
    })
  }
};
</script>

<template>
  <div class="wrapper">
    <h1>Criar postagem</h1>

    <form @submit.prevent="createPost" >
      <input
        type="text"
        v-model="title"
        placeholder="Título">

      <input
        type="text"
        v-model="content"
        placeholder="Corpo">

      <input
        type="file"
        @change="onChange($event)"
        accept="image/*">

      <label>
        <span>Publicado</span>
        <input
          type="checkbox"
          v-model="published">
      </label>

      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<style lang="scss" scoped>
  .wrapper {
    padding: 30px;
  }

  label {
    display: block;

    input[type="checkbox"] {
      display: inline-block;

      &:before {
        content: '✓';

        opacity: 0;
      }

      &:checked {
        background: black;
        color: white;

        &:before {
          opacity: 1;
        }
      }
    }
  }

  h1 {
    padding: 10px;
  }

  input:not([type="file"]) {
    display: block;
    border: 1px solid black;
    padding: 10px;
    margin: 10px;
  }
</style>
