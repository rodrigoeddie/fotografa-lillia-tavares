<script setup lang="ts">
import type { NuxtError } from '#app'

const cfImg = useCfImg()
const { whatsappUrl } = useRuntimeConfig().public

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

const is404 = computed(() => props.error?.statusCode === 404)

const title = computed(() => is404.value ? 'Página não encontrada' : 'Algo deu errado')
const message = computed(() => is404.value
  ? 'A página que você procura não existe ou foi movida.'
  : 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.'
)
</script>

<template>
  <div class="error-page">
    <header class="error-header">
      <NuxtLink to="/" class="error-logo-link" @click="handleError">
        <NuxtImg
          provider="cloudflare"
          :src="cfImg('19bd6c18-a153-4e79-c6bd-4293145da400')"
          alt="Lillia Tavares Fotografia"
          width="280"
          height="77"
          format="avif"
        />
      </NuxtLink>
    </header>

    <div class="error-inner">
      <span class="error-accent">oops...</span>
      <p class="error-code">{{ error?.statusCode }}</p>
      <h1 class="error-title">{{ title }}</h1>
      <p class="error-message">{{ message }}</p>

      <nav class="error-links" aria-label="Links de navegação">
        <button class="error-btn error-btn-primary" @click="handleError">
          Voltar para o início
        </button>
        <NuxtLink to="/ensaio-fotografico" class="error-btn error-btn-outline">
          Ver ensaios
        </NuxtLink>
        <NuxtLink to="/blog" class="error-btn error-btn-outline">
          Blog
        </NuxtLink>
      </nav>

      <p class="error-contact">
        Precisa de ajuda?
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer">
          Fale conosco pelo WhatsApp
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100dvh;
  padding-bottom: 60rem;
  background: #faf9f4;
}

.error-header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 32rem v.$space 28rem;
  border-bottom: 1px solid v.$light-beige;
  margin-bottom: 56rem;
}

.error-logo-link {
  display: block;
  opacity: 0.9;
  transition: opacity 0.2s;

  img {
    height: 48rem;
    width: auto;
  }

  &:hover {
    opacity: 1;
  }
}

.error-inner {
  text-align: center;
  max-width: 560rem;
  padding: 0 v.$space;
  position: relative;
}

.error-accent {
  display: block;
  font-family: 'The Girl Next Door', cursive;
  font-size: 36rem;
  color: v.$beige;
  line-height: 1;
  margin-bottom: -16rem;
}

.error-code {
  font-family: v.$openExtra;
  font-size: 160rem;
  font-weight: 900;
  line-height: 1;
  color: v.$light-beige;
  margin-bottom: 0;
}

.error-title {
  font-size: 28rem;
  font-weight: 900;
  color: v.$dark-green;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-top: 4rem;
  margin-bottom: 16rem;
}

.error-message {
  font-size: 17rem;
  color: v.$green;
  line-height: 1.6;
  margin-bottom: 40rem;
}

.error-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12rem;
  justify-content: center;
  margin-bottom: 36rem;
}

.error-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13rem 28rem;
  border-radius: 999px;
  font-size: 15rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2rem);
  }

  &-primary {
    background-color: v.$dark-green;
    border: 2px solid v.$dark-green;
    color: #fff;

    &:hover {
      background-color: v.$green;
      border-color: v.$green;
      color: #fff;
    }
  }

  &-outline {
    background-color: transparent;
    border: 2px solid v.$green;
    color: v.$green;

    &:hover {
      background-color: v.$green;
      border-color: v.$green;
      color: #fff;
    }
  }
}

.error-contact {
  font-size: 15rem;
  color: v.$green;

  a {
    color: v.$green;
    font-weight: 700;
    text-decoration: underline;
    transition: color 0.2s;

    &:hover {
      color: v.$dark-green;
    }
  }
}

@include m.max(sm) {
  .error-code {
    font-size: 110rem;
  }

  .error-accent {
    font-size: 28rem;
  }

  .error-title {
    font-size: 22rem;
  }
}
</style>
