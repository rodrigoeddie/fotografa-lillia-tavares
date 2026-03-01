
<script lang="ts" setup>
import { CalendarDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date'

const props = defineProps({
  formType: {
      type: String,
      required: false,
      default: false
    }
  });

const { gtag } = useGtag();

const configPublic = useRuntimeConfig().public;

interface FormData {
  date: CalendarDate;
  sessionType: string;
}

const formData = ref<FormData>({
  date: new CalendarDate('gregory', new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()),
  sessionType: props.formType,
});

const isDateUnavailable = (date: DateValue) => {
  let isUnavailable: boolean = false;

  if(date.year < new Date().getFullYear()) {
    isUnavailable = true;
  }

  if(date.month < new Date().getMonth() + 1) {
    isUnavailable = true;
  }

  if(date.day < new Date().getDate() && date.month == new Date().getMonth() + 1) {
    isUnavailable = true;
  }

  return isUnavailable;
}

const errors = ref<{ [key: string]: string }>({});

const formatDate = (date: DateValue) => {
  return new Date(date.year, date.month - 1, date.day);
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
    const message = formData.value.sessionType === 'noType'
      ? `Olá, gostaria de ver a disponibilidade de um ensaio para a data ${formData.value.date.day}/${formData.value.date.month}/${formData.value.date.year}. (mensagem do site)`
      : `Olá, gostaria de ver a disponibilidade de um ensaio para a data ${formData.value.date.day}/${formData.value.date.month}/${formData.value.date.year} com o tipo de ensaio ${formData.value.sessionType}. (mensagem do site)`;
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
  <div class="wrap-schedule">
    <form
    class="form"
    @submit.prevent="enviar">
      <div class="field-text">
        <h1 class="big-title red">
          <span class="box"><span>Gostou?</span></span>
          <span class="big">Agende o seu:</span>
        </h1>
        <p class="description">
          Preencha no calendário a data que pretende fazer o ensaio e clique no botão <b>"Enviar usando o Whatsapp"</b>, você será redirecionado para seu aplicativo do Whatsapp com a mensagem já configurada, prontinha pra ser enviada ☺️:
        </p>
      </div>

      <div class="field-calendar">
        <UCalendar
          class="calendar"
          v-model="formData.date"
          :is-date-unavailable="isDateUnavailable"
          locale="pt-BR" />
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
.calendar {
  margin: 20rem auto;
  color: black;
  flex-shrink: 0;

  --ui-text-muted: #c7c7c7;
  --font-weight-medium: 500;
  --spacing: 7rem;
  --text-sm: 27rem;
  --text-xs: 23rem;
  --tw-space-y-reverse {
      syntax: "*";
      inherits: false;
      initial-value: 0;
  }

  .mx-auto {
    text-transform: uppercase;
  }

  .truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }
  .text-center {
      text-align: center;
  }
  .grid {
      display: grid;
  }
  .grid-cols-7 {
      grid-template-columns: repeat(7, minmax(0, 1fr));
  }
  .w-full {
      width: 100%;
  }
  .flex-col {
      flex-direction: column;
  }
  .pt-4 {
      padding-top: calc(var(--spacing) * 4);
  }
  .m-0\.5 {
    margin: calc(var(--spacing) * .5);
    cursor: default;
  }
  .disabled {
    opacity: .75;
  }
  .transition-colors {
    transition: color .2s;
  }
  .text-sm {
    font-size: 20rem;
  }
  .gap {
    gap: 20rem;
  }

  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-center {
    justify-content: center;
  }

  .inline-flex {
    display: inline-flex;
  }
  .size-8 {
    height: calc(var(--spacing) * 8);
    width: calc(var(--spacing) * 8);
  }
  .rounded-full {
    border-radius: 3.40282e+38px;
  }
  [aria-selected] {
      background-color: v.$dark-red;
      color: white;
  }
  .text-\(--ui-primary\),
  .text-\(--ui-primary\)\/75 {
      color: red;
  }
  .text-sm, .text-sm\/6 {
    font-size: var(--text-sm);
  }
  .text-xs, .text-xs\/5 {
    font-size: var(--text-xs);
  }
  :where(.space-y-12>:not(:last-child)) {
    --tw-space-y-reverse: 0;
    margin-block-end: calc(var(--spacing) * 12 * (1 - var(--tw-space-y-reverse)));
    margin-block-start: calc(var(--spacing) * 12 * var(--tw-space-y-reverse));
  }
  .font-medium {
    font-weight: var(--font-weight-medium);
  }
  .data-unavailable\:line-through[data-unavailable] {
    text-decoration-line: line-through;
  }
  .data-unavailable\:pointer-events-none[data-unavailable] {
    pointer-events: none;
  }
  .data-\[outside-view\]\:text-\(--ui-text-muted\)[data-outside-view] {
    color: var(--ui-text-muted);
  }
  .data-unavailable\:text-\(--ui-text-muted\)[data-unavailable] {
    color: var(--ui-text-muted);

    // @media (prefers-color-scheme: dark) {
    //   color: #666;
    // }
  }
  @media (hover: hover) {
    @supports (color:color-mix(in lab,red,red)) {
        .hover\:not-data-\[selected\]\:bg-\(--ui-primary\)\/20:hover:not([data-selected]) {
            background-color: color-mix(in oklab, red 20%, transparent);
        }
    }
  }
}
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
