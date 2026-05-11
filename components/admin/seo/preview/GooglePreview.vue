<script setup lang="ts">
import type { GooglePreview } from '~/composables/admin/seo/analyzers/preview';
defineProps<{ data: GooglePreview }>();
</script>

<template>
  <div class="google-preview">
    <p class="g-url">{{ data.url }}</p>
    <h3 class="g-title">{{ data.displayTitle || '(sem título)' }}</h3>
    <p class="g-description">{{ data.displayDescription || '(sem descrição)' }}</p>
    <p v-if="data.truncatedTitle || data.truncatedDescription" class="g-warn">
      {{ data.truncatedTitle ? '⚠ Título truncado' : '' }}
      {{ data.truncatedTitle && data.truncatedDescription ? ' · ' : '' }}
      {{ data.truncatedDescription ? '⚠ Descrição truncada' : '' }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.google-preview {
  background: #fff;
  border: 1rem solid #dadce0;
  border-radius: 8rem;
  padding: 16rem;
  font-family: arial, sans-serif;
}

.g-url {
  color: #202124;
  font-size: 14rem;
  margin: 0 0 4rem;
}

.g-title {
  color: #1a0dab;
  font-size: 20rem;
  font-weight: normal;
  margin: 0 0 4rem;
  line-height: 1.3;
}

.g-description {
  color: #4d5156;
  font-size: 14rem;
  line-height: 1.58;
  margin: 0;
}

.g-warn {
  color: #d97706;
  font-size: 12rem;
  margin: 8rem 0 0;
}
</style>
