<script setup lang="ts">
import type { NuxtError } from '#app'

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
    <div class="error-inner">
      <p class="error-code">{{ error?.statusCode }}</p>
      <h1 class="error-title">{{ title }}</h1>
      <p class="error-message">{{ message }}</p>

      <nav class="error-links" aria-label="Links de navegação">
        <button class="btn btn-primary" @click="handleError">
          Voltar para o início
        </button>
        <NuxtLink to="/ensaio-fotografico" class="btn btn-outline">
          Ver ensaios
        </NuxtLink>
        <NuxtLink to="/blog" class="btn btn-outline">
          Blog
        </NuxtLink>
      </nav>

      <p class="error-contact">
        Precisa de ajuda?
        <a
          href="https://wa.me/5511911159795"
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
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 40rem v.$space;
  background: #faf9f4;
}

.error-inner {
  text-align: center;
  max-width: 560rem;
}

.error-code {
  font-family: v.$openExtra;
  font-size: 120rem;
  font-weight: 900;
  line-height: 1;
  color: v.$light-beige;
  margin-bottom: 8rem;
}

.error-title {
  font-size: 32rem;
  font-weight: 700;
  color: v.$dark-green;
  margin-bottom: 16rem;
}

.error-message {
  font-size: 18rem;
  color: v.$green;
  line-height: 1.5;
  margin-bottom: 40rem;
}

.error-links {
  display: flex;
  flex-wrap: wrap;
  gap: 12rem;
  justify-content: center;
  margin-bottom: 32rem;
}

.btn {
  display: inline-block;
  padding: 14rem 28rem;
  border-radius: 4rem;
  font-size: 17rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.2s, color 0.2s, transform 0.2s;

  &:hover {
    transform: translateY(-2rem);
  }

  &-primary {
    background: v.$green;
    color: #fff;

    &:hover {
      background: v.$dark-green;
    }
  }

  &-outline {
    background: transparent;
    border: 1px solid v.$green;
    color: v.$green;

    &:hover {
      background: v.$green;
      color: #fff;
    }
  }
}

.error-contact {
  font-size: 16rem;
  color: v.$green;

  a {
    color: #128c7e;
    text-decoration: underline;
  }
}
</style>
