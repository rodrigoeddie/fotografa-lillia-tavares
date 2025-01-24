
<script lang="ts" setup>
import { ref } from 'vue';

interface FormData {
  date: string;
  sessionType: string;
}

const formData = ref<FormData>({
  date: '',
  sessionType: '',
});

const errors = ref<{ [key: string]: string }>({});

const validateField = (field: keyof FormData) => {
  if (field === 'date' && !formData.value.date) {
    const currentDate = new Date();
    const selectedDate = new Date(formData.value.date);

    if (!formData.value.date) {
      errors.value.date = 'Por favor, selecione uma data.';
    } else if (selectedDate <= currentDate) {
      errors.value.date = 'A data deve ser posterior à data atual.';
    } else {
      delete errors.value.date;
    }
  }

  if (field === 'sessionType' && !formData.value.sessionType) {
    errors.value.sessionType = 'Por favor, selecione um tipo de ensaio.';
  } else {
    delete errors.value.sessionType;
  }
};

const enviar = async () => {
  console.log('teste');

  validateField('date');
  validateField('sessionType');

  if (Object.keys(errors.value).length === 0) {
    // Lógica para enviar o formulário
    console.log('Formulário enviado com sucesso!', formData.value);
  } else {
    alert('Erro no formulário');
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

          <form
            class="form"
            @submit.prevent="enviar">
            <div class="field-group">
              <label class="title-label" for="date">
                Data que pretende fazer o ensaio:
              </label>
              <input
                id="date"
                required
                v-model="formData.date"
                type="date"
                @change="validateField('date')">
              <span class="error-msg">{{ errors.date }}</span>
            </div>

            <div class="field-group">
              <label class="title-label">Tipo de ensaio:</label>

              <div class="wrap-radio">
                <input
                  type="radio"
                  id="corporativo"
                  value="Corporativo"
                  v-model="formData.sessionType"
                  @change="validateField('sessionType')">

                <label for="corporativo" class="label-radio">
                  Corporativo
                </label>
              </div>

              <div class="wrap-radio">
                <input
                  type="radio"
                  id="intimista"
                  required
                  value="Intimista"
                  v-model="formData.sessionType"
                  @change="validateField('sessionType')">

                <label for="intimista" class="label-radio">
                  Intimista
                </label>
              </div>

              <div class="wrap-radio">
                <input
                  type="radio"
                  id="outros"
                  required
                  value="Outros"
                  v-model="formData.sessionType"
                  @change="validateField('sessionType')">

                <label for="outros" class="label-radio">
                  Outros
                </label>
              </div>

              <span class="error-msg">{{ errors.sessionType }}</span>
            </div>

            <button class="btn-send">
              <nuxt-icon name="whatsapp" class="icon"/>
              <span>Enviar usando o whatsapp</span>
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
    .form {
      align-items: flex-start;
      flex-direction: column;
      padding-top: 40rem;
      margin: 0 auto;
      display: flex;
      gap: 20rem;

      .title-label {
        font-weight: bold;
        font-size: 20rem;
      }

      input,
      select,
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

      .field-group {
        flex-direction: column;
        display: flex;
        gap: 10rem;

        div {
          display: flex;
          align-items: center;
          gap: 5rem;

          input[type="radio"] {
            -webkit-appearance: auto;
            width: 20rem;
            height: 20rem;

            &:checked {
              accent-color: v.$dark-green; // Cor do botão de rádio quando selecionado
            }
          }

          .label-radio {
            font-weight: normal;
            font-size: 18rem;
            margin-bottom: 0;
            line-height: 1em;
            padding: 5rem 0;
          }
        }
      }

      .error-msg {
        font-size: 13rem;
        margin-top: 3rem;
        color: red;
      }

      .btn-send {
        transition: background-color 0.3s ease;
        background-color: v.$green;
        display: inline-flex;
        align-items: center;
        border-radius: 4px;
        color: white;
        padding: 15rem;
        border: none;
        gap: 10rem;

        span {
          font-size: 17rem;
          color: white;
        }

        .nuxt-icon {
          font-size: 24rem;
          line-height: 1em;
          margin-top: 0;
        }

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
