<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="wrapper">
    <div class="wrap-inner">
        <h2 class="title">{{ error.statusCode }}</h2>
        <p class="description">{{ error }}</p>
        <button
        @click="handleError"
        class="btn btn-red">
            <span>Clear errors</span>
        </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wrapper {
    color: v.$red;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    .wrap-inner {
      width: 1280rem;
    }

    .title {
      font-size: 45rem;
    }

    .description {
      font-size: 22rem;
      line-height: 1.3em;
    }

    .description {
        padding-bottom: 20rem;
    }
  }
</style>
