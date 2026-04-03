
<script lang="ts" setup>
const props = defineProps({
  formType: {
    type: String,
    required: false,
    default: false
  }
});

const { trackEvent } = useTracking();

const formData = ref({
  date: '',
  sessionType: props.formType,
});

const errors = ref<Record<string, string>>({});

const validateField = (field: string) => {
  if (field === 'date') {
    if (!formData.value.date) {
      errors.value.date = 'Por favor, selecione uma data.';
    } else {
      const selected = new Date(formData.value.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        errors.value.date = 'A data deve ser posterior à data atual.';
      } else {
        delete errors.value.date;
      }
    }
  }
  if (field === 'sessionType') {
    if (!formData.value.sessionType) {
      errors.value.sessionType = 'Por favor, selecione um tipo de ensaio.';
    } else {
      delete errors.value.sessionType;
    }
  }
};

const enviar = async () => {
  validateField('date');
  validateField('sessionType');

  if (Object.keys(errors.value).length === 0) {
    const [year, month, day] = formData.value.date.split('-');
    const whatsappNumber = '5511911159795';
    const message = formData.value.sessionType === 'noType'
      ? `Olá, gostaria de ver a disponibilidade de um ensaio para a data ${day}/${month}/${year}. (mensagem do site)`
      : `Olá, gostaria de ver a disponibilidade de um ensaio para a data ${day}/${month}/${year} com o tipo de ensaio ${formData.value.sessionType}. (mensagem do site)`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    trackEvent('envio-form', { screen_name: 'Agende seu ensaio' });
  }
};
</script>

<template>
  <div class="wrap-schedule">
    <form
    class="form"
    @submit.prevent="enviar">
      <div class="field-text">
        <h1 class="big-title green">
          <span class="box"><span>Gostou?</span></span>
          <span class="big">Agende o seu:</span>
        </h1>
        <p class="description">
          Preencha no calendário a data que pretende fazer o ensaio e clique no botão <b>"Enviar usando o Whatsapp"</b>, você será redirecionado para seu aplicativo do Whatsapp com a mensagem já configurada, prontinha pra ser enviada ☺️:
        </p>
      </div>

      <div class="field-calendar">
        <BlocksSimpleCalendar v-model="formData.date" />
        <span class="error-msg" :class="{ show: errors.date }">{{ errors.date }}</span>

        <input
          type="hidden"
          name="type"
          v-model="formData.sessionType">
      </div>

      <button class="btn-send">
        <Icon name="icons:whatsapp" class="icon"/>
        <span>Clique aqui para enviar<br>usando o <b>Whatsapp</b></span>
      </button>
    </form>
  </div>
</template>

<style lang="scss">
</style>

<style scoped lang="scss">
.field-text {
  width: 550rem;
}

.big-title {
  padding-top: 0;

  // @media (prefers-color-scheme: dark) {
  //   color: white;
  // }

  .box {
    // @media (prefers-color-scheme: dark) {
    //   background: white;
    //   color: v.$dark-green
    // }
  }

  .big {
    padding-right: 0;
    margin-top: 0;
  }
}

.wrap-schedule {
  margin-bottom: 40rem;
  background: white;
  padding: 40rem;

  // @media (prefers-color-scheme: dark) {
  //   background: v.$dark-green;
  // }

  .form {
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    display: flex;
    gap: 30rem;

    @include m.max(sm) {
      flex-direction: column;
    }

    .title-label {
      color: v.$red;
      font-weight: bold;
      font-size: 25rem;
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
      align-items: flex-start;
      flex-direction: column;
      display: flex;
      gap: 10rem;

      div {
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
      font-size: 18rem;
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
      padding: 15rem 25rem;
      align-items: center;
      border-radius: 4px;
      text-align: left;
      color: white;
      flex-shrink: 0;
      border: none;
      gap: 10rem;

      span {
        font-size: 30rem;
        color: white;
      }

      .icon {
        font-size: 52rem;
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
</style>
