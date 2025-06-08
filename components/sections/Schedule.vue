
<script lang="ts" setup>
const { gtag } = useGtag();

const configPublic = useRuntimeConfig().public;

interface FormData {
  date: string;
  sessionType: string;
}

const formData = ref<FormData>({
  date: '',
  sessionType: '',
});

const errors = ref<{ [key: string]: string }>({});

const formatDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatDateToBR = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const formattedMonth     = String(month).padStart(2, '0');
  const formattedDay       = String(day).padStart(2, '0');

  return `${formattedDay}/${formattedMonth}/${year}`;
};

const validateField = (field: keyof FormData) => {
  if (field === 'date') {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalizar para meia-noite

    const selectedDate = formatDate(formData.value.date);
    selectedDate.setHours(0, 0, 0, 0); // Normalizar para meia-noite

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
  validateField('date');
  validateField('sessionType');

  if (Object.keys(errors.value).length === 0) {
    const whatsappNumber = '5511911159795';
    const message        = `Olá, gostaria de ver a disponibilidade de um ensaio para a data ${ formatDateToBR(formData.value.date) } com o tipo de ensaio ${ formData.value.sessionType }. (mensagem do site)`;
    const whatsappUrl    = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    gtag('event', 'envio-form', {
      app_name: 'Site',
      screen_name: 'Agende seu ensaio'
    });
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
            Se você gostou do meu trabalho e pretende fazer um ensaio fotográfico, <strong>agende</strong> seu horário. <b>Entre em contato</b> comigo e <b>escolha</b> o melhor dia:
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
                type="date">
                <span class="error-msg" :class="{ show: errors.date }">{{ errors.date }}</span>
            </div>

            <div class="field-group">
              <label class="title-label">Tipo de ensaio:</label>

              <div class="wrap-radio">
                <input
                  type="radio"
                  id="dia-das-maes"
                  required
                  value="Dia das Mães"
                  name="type"
                  v-model="formData.sessionType">

                <label for="dia-das-maes" class="label-radio">
                  Dia das Mães
                </label>
              </div>

              <div class="wrap-radio">
                <input
                  type="radio"
                  id="corporativo"
                  required
                  value="Corporativo"
                  name="type"
                  v-model="formData.sessionType">

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
                  name="type"
                  v-model="formData.sessionType">

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
                  name="type"
                  v-model="formData.sessionType">

                <label for="outros" class="label-radio">
                  Outros
                </label>
              </div>

              <span class="error-msg" :class="{ show: errors.sessionType }">{{ errors.sessionType }}</span>
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
          :src='configPublic.cloudflareURI + "0e29fb7d-191c-4447-7a71-95448ed4fd00/public"'
          alt="Um fundo fotográfico com equipamentos fotográficos"
          width="1021"
          height="680"
          fetchpriority="high"
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

        // @media (prefers-color-scheme: dark) {
        //   border-color: white;
        //   color-scheme: dark;
        // }
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
        align-items: flex-start;
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
        color: white;
        background: red;
        padding: 5px 15px;
        display: none;

        &.show {
          display: inline-block;
        }
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

          // @media (prefers-color-scheme: dark) {
          //   background: v.$light-green;

          //   span {
          //     color: black
          //   }
          // }
        }
      }
    }
  }

  .wrap-schedule {
    background: white;

    // @media (prefers-color-scheme: dark) {
    //   background: v.$dark-green;
    // }

    @include m.max(md) {
      flex-wrap: wrap;
    }

    .about-text {
      padding: 35rem;

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
