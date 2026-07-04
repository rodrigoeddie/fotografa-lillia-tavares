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

const selectedLabel = computed(() => {
  if (!formData.value.date) return 'Nenhuma data selecionada ainda';
  const [year, month, day] = formData.value.date.split('-');
  return `Data escolhida: ${day}/${month}/${year}`;
});

const showEyebrow = computed(() => !!props.formType && props.formType !== 'noType');

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
    <form class="split" @submit.prevent="enviar">
      <div class="left">
        <p v-if="showEyebrow" class="eyebrow">{{ formType }}</p>
        <h2 class="title">Gostou? Agende o seu ensaio</h2>
        <p class="lead">
          Escolha a melhor data no calendário e envie direto pelo WhatsApp — a mensagem já vai pronta. Respondo rápido para confirmar sua agenda.
        </p>
        <p class="guarantee">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Sem compromisso — só uma conversa
        </p>
      </div>

      <div class="right">
        <div class="cal">
          <BlocksSimpleCalendar v-model="formData.date" />
          <input type="hidden" name="type" v-model="formData.sessionType">
        </div>

        <div class="confirm">
          <p class="selected" :class="{ empty: !formData.date }">{{ selectedLabel }}</p>

          <button class="btn-send" type="submit" aria-label="Enviar agendamento pelo WhatsApp">
            <Icon name="icons:whatsapp" class="icon" />
            <span>Enviar pelo WhatsApp</span>
          </button>

          <span class="error-msg" :class="{ show: errors.date }">{{ errors.date }}</span>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
.wrap-schedule {
  @include m.card-shadow;
  margin-bottom: 40rem;
  border-radius: 8rem;
  background: white;
  overflow: hidden;
}

.split {
  grid-template-columns: 1fr 1fr;
  min-height: 300rem;
  display: grid;

  @include m.max(sm) {
    grid-template-columns: 1fr;
  }
}

.left {
  background: var(--color-highlight, v.$dark-green);
  flex-direction: column;
  justify-content: center;
  padding: 44rem 40rem;
  display: flex;

  @include m.max(xs) {
    padding: 28rem 22rem;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: .14em;
    color: rgba(255, 255, 255, .65);
    margin-bottom: 14rem;
    font-weight: 900;
    font-size: 13rem;
  }

  .title {
    text-transform: uppercase;
    letter-spacing: .02em;
    margin-bottom: 14rem;
    font-weight: 900;
    line-height: 1.15;
    color: white;
    font-size: clamp(24rem, 2.6vw, 32rem);
  }

  .lead {
    color: rgba(255, 255, 255, .82);
    margin-bottom: 20rem;
    max-width: 380rem;
    line-height: 1.65;
    font-size: 16rem;
  }

  .guarantee {
    color: rgba(255, 255, 255, .7);
    align-items: center;
    font-size: 14rem;
    display: flex;
    gap: 8rem;

    svg {
      flex-shrink: 0;
    }
  }
}

.right {
  background: v.$light-beige;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32rem;
  display: flex;
  gap: 18rem;

  @include m.max(xs) {
    padding: 22rem 18rem;
  }

  .cal,
  .confirm {
    max-width: 340rem;
    width: 100%;
  }

  .selected {
    border-left: 4rem solid var(--color-highlight, v.$dark-green);
    color: v.$dark-green;
    background: white;
    padding: 12rem 14rem;
    margin-bottom: 12rem;
    border-radius: 4rem;
    font-weight: 700;
    font-size: 15rem;

    &.empty {
      font-style: italic;
      font-weight: 400;
      color: #8d8a75;
    }
  }

  .btn-send {
    transition: filter .2s, transform .15s;
    background: var(--color-highlight, v.$dark-green);
    box-shadow: 0 4rem 14rem rgba(0, 0, 0, .18);
    justify-content: center;
    border-radius: 6rem;
    padding: 14rem 20rem;
    align-items: center;
    font-weight: 900;
    font-size: 17rem;
    cursor: pointer;
    color: white;
    display: flex;
    border: none;
    width: 100%;
    gap: 10rem;

    .icon {
      font-size: 26rem;
    }

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.12);
    }

    &:focus-visible {
      outline: 2px solid v.$dark-green;
      outline-offset: 3px;
    }
  }

  .error-msg {
    background: v.$red;
    border-radius: 4rem;
    padding: 6rem 12rem;
    margin-top: 4rem;
    font-size: 14rem;
    color: white;
    display: none;

    &.show {
      display: inline-block;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn-send {
    transition: none;
  }
}
</style>
