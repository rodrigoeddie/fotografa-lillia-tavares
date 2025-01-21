<script lang="ts" setup>
import { ref } from 'vue';

interface FormData {
  contact: string;
  date: string;
  sessionType: string;
}

const formData = ref<FormData>({
  contact: '',
  date: '',
  sessionType: '',
});

const errors = ref<Partial<FormData>>({});

const validateForm = (data: FormData): Partial<FormData> => {
  const errors: Partial<FormData> = {};

  if (!data.contact) {
    errors.contact = 'Telefone ou Email é obrigatório';
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[1-9]\d{1,14}$/;

    if (!emailPattern.test(data.contact) && !phonePattern.test(data.contact)) {
      errors.contact = 'Telefone ou Email inválido';
    }
  }

  if (!data.date) {
    errors.date = 'Data é obrigatória';
  }

  if (!data.sessionType) {
    errors.sessionType = 'Tipo de ensaio é obrigatório';
  }

  return errors;
};

const onSubmit = async () => {
  errors.value = validateForm(formData.value);

  if (Object.keys(errors.value).length === 0) {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData.value),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o formulário');
      }

      alert('Formulário enviado com sucesso!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Ocorreu um erro desconhecido');
      }
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="wrap-schedule row">
      <div class="col">
        <div class="about-text">
          <h1 class="title">Agende seu ensaio</h1>
          <div class="description">
            Se você gostou do meu trabalho e pretende fazer um ensaio fotográfico, <strong>agende</strong> seu horário. <b>Entre em contato</b> comigo e <b>escolha</b> o melhor dia e horário para você:
          </div>

          <form @submit.prevent="onSubmit">
            <div>
              <label for="contact">Telefone ou Email:</label>
              <input id="contact" v-model="formData.contact" type="text" />
              <span>{{ errors.contact }}</span>
            </div>
            <div>
              <label for="date">Data que pretende fazer o ensaio:</label>
              <input id="date" v-model="formData.date" type="date" />
              <span>{{ errors.date }}</span>
            </div>
            <div>
              <label for="sessionType">Tipo de ensaio:</label>
              <input id="sessionType" v-model="formData.sessionType" type="text" />
              <span>{{ errors.sessionType }}</span>
            </div>

            <button type="submit">
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>

      <div class="col about-img">
        <nuxt-img
          src="assets/images/fundo-fotografico-com-equipamentos.png"
          alt="Um fundo fotográfico com equipamentos fotográficos"
          width="1021"
          height="680"
          format="webp"
          quality="85"
          fit="fill"
          class="img cover"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrap-schedule {
    form {
      flex-direction: column;
      padding-top: 40rem;
      margin: 0 auto;
      display: flex;
      gap: 10rem;

      label {
        margin-bottom: 5rem;
        font-weight: bold;
        font-size: 19rem;
      }

      input,
      textarea {
        border: 1px solid v.$red;
        border-radius: 4px;
        font-size: 19rem;
        padding: 15rem;
        height: 50rem;
        width: 100%;
      }

      input:focus,
      textarea:focus {
        outline: dotted 1px v.$red;
      }

      textarea {
        resize: vertical;
        min-height: 200rem;
      }

      span {
        font-size: 13rem;
        margin-top: 3rem;
        color: red;
      }

      button[type="submit"] {
        transition: background-color 0.3s ease;
        padding: 15rem;
        border: none;
        border-radius: 4px;
        background-color: v.$green;
        display: inline-flex;
        color: #fff;
        flex-shrink: 0;
        font-size: 20rem;

        &:hover {
          background-color: v.$dark-green;
        }
      }
    }
  }

  .wrap-schedule {
    background: white;

    @include m.max(md) {
      flex-wrap: wrap;
    }

    .about-text {
      padding: 180rem v.$space v.$space;

      .description {
        padding-top: 0;
      }
    }

    .about-img {
      flex-shrink: 0;
      width: 55%;

      @include m.max(md) {
        width: 100%;
      }
    }
  }

</style>
