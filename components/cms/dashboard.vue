<script lang="ts" setup>
let modalOpened = false;

const closeModal = () => {
  modalOpened = false;
}

const openModal = () => {
  modalOpened = true;

  console.log(modalOpened);
}
</script>

<template>
  <h1>Sobre</h1>

  <div class="form">
    <label>
      <span>Imagem</span>
      <input type="file">
    </label>

    <label>
      <span>Descrição</span>
      <textarea></textarea>
    </label>
  </div>


  <h1>Ensaios</h1>
  <button class="btn-new btn" @click="openModal">
    <i>+</i>
    <span>Novo</span>
  </button>

  <div class="list">
  </div>

  <div class="wrap-modal" :class="[{ active: modalOpened }]">
    <button class="close-modal btn" @click="closeModal">X Fechar</button>

    <div class="modal">
      <div class="form">
        <label>
          <span>Título</span>
          <input type="text">
        </label>

        <label>
          <span>Capa</span>
          <input type="file" accept="image/png, image/jpeg">
        </label>

        <label>
          <span>Descrição</span>
          <textarea></textarea>
        </label>

        <label>
          <span>Fotos</span>
          <input type="file" accept="image/png, image/jpeg" multiple>
        </label>

        <button class="btn-save btn">Cadastrar</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  h1 {
    text-transform: uppercase;
    padding-top: 30rem;
    font-weight: bold;
    text-align: right;
    font-size: 45rem;
    display: block;
    color: v.$red;
    width: 22%;
  }

  .form {
    padding-left: 27%;

    label {
      font-size: 27rem;
      margin: 30rem 0;
      font-weight: 500;
      display: block;

      span {
        padding-bottom: 7rem;
        display: block;
      }
    }

    input,
    textarea,
    select {
      transition: border .2s, box-shadow .2s;
      border: 2px solid #ccc;
      border-radius: 10rem;
      background: white;
      font-size: 27rem;
      display: block;
      padding: 10px;
      width: 80%;

      &:focus {
        box-shadow: 0 0 30rem v.$green;
        border: 2px solid v.$green;
      }
    }

    textarea {
      height: 300rem;
    }
  }

  .btn {
    box-shadow: 0 0 5rem v.$green;
    transition: box-shadow .2s;
    border: 2px solid v.$green;
    background: v.$light-beige;
    padding: 10rem 20rem;
    border-radius: 10rem;
    align-items: center;
    font-weight: bold;
    margin-top: 10rem;
    font-size: 25rem;
    display: flex;
    color: v.$green;
    left: 14.7%;

    &:hover {
      box-shadow: 0 0 30rem v.$green;
    }

    i {
      padding-right: 5rem;
      font-style: normal;
      font-size: 40rem;
      line-height: 1em;
    }

    span {
      line-height: 1em;
    }
  }

  .wrap-modal {
    backdrop-filter: blur(10px);
    background-color: rgba(v.$green, .3);
    position: fixed;
    display: none;
    bottom: 0;
    right: 0;
    left: 0;

    &.active {
      display: block;
    }

    .close-modal {
      position: absolute;
      right: 60rem;
      top: 50rem;
      left: auto;
    }

    .btn-save {
      text-transform: uppercase;
      padding: 15rem 30rem;
      background: v.$green;
      font-size: 32rem;
      color: white;
      left: 0;
    }

    .modal {
      margin-top: 120rem;
    }
  }
</style>
