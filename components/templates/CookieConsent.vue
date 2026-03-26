<script setup lang="ts">
const COOKIE_KEY = 'lgpd_consent'

const visible = ref(false)
const showDetails = ref(false)

const preferences = ref({
  analytics: true,
  marketing: true,
  recording: true,
})

onMounted(() => {
  const stored = localStorage.getItem(COOKIE_KEY)
  if (!stored) {
    // Pequeno delay para não competir com animações da página
    setTimeout(() => { visible.value = true }, 1200)
  }
})

function acceptAll() {
  save({ analytics: true, marketing: true, recording: true })
}

function savePreferences() {
  save(preferences.value)
}

function rejectAll() {
  save({ analytics: false, marketing: false, recording: false })
}

function save(prefs: typeof preferences.value) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...prefs, date: new Date().toISOString() }))
  visible.value = false
}
</script>

<template>
  <Transition name="consent">
    <div v-if="visible" class="cookie-consent" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div class="cookie-consent__inner">

        <div class="cookie-consent__text">
          <p id="cookie-title">
            <strong>Sua privacidade importa.</strong>
            Utilizamos cookies para melhorar sua experiência, analisar o tráfego e personalizar anúncios.
            Ao continuar navegando, você concorda com nossa
            <NuxtLink to="/privacidade-e-termos" class="link">Política de Privacidade</NuxtLink>.
          </p>

          <div v-if="showDetails" class="cookie-consent__details">
            <div class="cookie-option">
              <span class="toggle toggle--disabled">
                <span class="toggle__thumb" />
              </span>
              <span>
                <strong>Essenciais</strong>: necessários para o funcionamento do site. Sempre ativos.
              </span>
            </div>
            <label class="cookie-option">
              <input type="checkbox" class="toggle-input" v-model="preferences.analytics" />
              <span class="toggle" :class="{ 'toggle--on': preferences.analytics }">
                <span class="toggle__thumb" />
              </span>
              <span>
                <strong>Analíticos</strong>: Google Analytics (GA4). Ajudam a entender como o site é usado.
              </span>
            </label>
            <label class="cookie-option">
              <input type="checkbox" class="toggle-input" v-model="preferences.marketing" />
              <span class="toggle" :class="{ 'toggle--on': preferences.marketing }">
                <span class="toggle__thumb" />
              </span>
              <span>
                <strong>Marketing</strong>: Meta Pixel. Usados para mensurar e personalizar anúncios.
              </span>
            </label>
            <label class="cookie-option">
              <input type="checkbox" class="toggle-input" v-model="preferences.recording" />
              <span class="toggle" :class="{ 'toggle--on': preferences.recording }">
                <span class="toggle__thumb" />
              </span>
              <span>
                <strong>Gravação de sessão</strong>: Smartlook. Identificação de problemas de usabilidade.
              </span>
            </label>
          </div>
        </div>

        <div class="cookie-consent__actions">
          <button class="btn btn--accept" @click="acceptAll">Aceitar todos</button>
          <button
            v-if="!showDetails"
            class="btn btn--manage"
            @click="showDetails = true">
            Gerenciar
          </button>
          <button
            v-if="showDetails"
            class="btn btn--save"
            @click="savePreferences">
            Salvar preferências
          </button>
          <button class="btn btn--reject" @click="rejectAll">Rejeitar</button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.cookie-consent {
  position: fixed;
  bottom: 20rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: calc(100% - 40rem);
  max-width: 900rem;
  background: v.$dark-green;
  color: white;
  border-radius: 10rem;
  box-shadow: 0 8rem 32rem rgba(0, 0, 0, 0.35);
  padding: 20rem 24rem;

  @include m.max(sm) {
    bottom: 0;
    left: 0;
    transform: none;
    width: 100%;
    max-width: 100%;
    border-radius: 10rem 10rem 0 0;
  }

  &__inner {
    display: flex;
    gap: 24rem;
    align-items: flex-start;

    @include m.max(md) {
      flex-direction: column;
      gap: 16rem;
    }
  }

  &__text {
    flex: 1;
    font-size: 14rem;
    line-height: 1.6;

    p {
      margin: 0;
    }
  }

  &__details {
    margin-top: 14rem;
    display: flex;
    flex-direction: column;
    gap: 10rem;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 8rem;
    flex-shrink: 0;
    min-width: 160rem;

    @include m.max(md) {
      flex-direction: row;
      flex-wrap: wrap;
      min-width: unset;
    }
  }
}

.cookie-option {
  display: flex;
  align-items: center;
  gap: 10rem;
  font-size: 13rem;
  cursor: pointer;
}

.toggle-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.toggle {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  width: 36rem;
  height: 20rem;
  border-radius: 20rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 2rem;
  transition: background 0.25s ease;
  cursor: pointer;

  &--on {
    background: v.$beige;
  }

  &--disabled {
    background: v.$beige;
    opacity: 0.45;
    cursor: not-allowed;
  }

  &__thumb {
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
    background: white;
    transition: transform 0.25s ease;
    transform: translateX(0);
  }
}

.toggle--on .toggle__thumb,
.toggle--disabled .toggle__thumb {
  transform: translateX(16rem);
}

.link {
  color: v.$beige;
  text-decoration: underline;

  &:hover {
    color: white;
  }
}

.btn {
  padding: 9rem 16rem;
  border-radius: 6rem;
  font-size: 13rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s;
  text-align: center;

  &--accept {
    background: v.$beige;
    color: v.$dark-green;

    &:hover {
      background: white;
    }
  }

  &--manage,
  &--save {
    background: transparent;
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.4);

    &:hover {
      border-color: white;
    }
  }

  &--reject {
    background: transparent;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 400;
    font-size: 12rem;
  }

  &--reject,
  &--manage,
  &--save {
    &:hover {
        color: v.$green
    }
  }
}

.consent-enter-active,
.consent-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20rem);

  @include m.max(sm) {
    transform: translateY(100%);
  }
}
</style>
