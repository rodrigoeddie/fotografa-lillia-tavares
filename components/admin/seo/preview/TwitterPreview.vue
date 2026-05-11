<script setup lang="ts">
import type { TwitterPreview } from '~/composables/admin/seo/analyzers/preview';
const props = defineProps<{ data: TwitterPreview }>();

const host = computed(() => {
  try { return new URL(props.data.url).host.replace(/^www\./, ''); } catch { return ''; }
});
</script>

<template>
  <div class="tw-preview" :class="{ 'tw-summary': data.cardType === 'summary' }">
    <div v-if="data.imageUrl" class="tw-image">
      <img :src="data.imageUrl" alt="Twitter preview" />
    </div>
    <div v-else class="tw-image tw-image-placeholder">
      <span>Sem imagem</span>
    </div>
    <div class="tw-body">
      <p class="tw-host">{{ host }}</p>
      <h3 class="tw-title">{{ data.title || '(sem título)' }}</h3>
      <p v-if="data.description" class="tw-description">{{ data.description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tw-preview {
  background: #fff;
  border: 1rem solid #cfd9de;
  border-radius: 16rem;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
}

.tw-image {
  background: #f7f9f9;
  aspect-ratio: 1.91 / 1;
  display: grid;
  place-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

.tw-summary .tw-image {
  aspect-ratio: 1 / 1;
  max-width: 130rem;
  float: left;
}

.tw-image-placeholder {
  color: #536471;
  font-size: 13rem;
}

.tw-body {
  padding: 12rem 16rem;
  overflow: hidden;
}

.tw-host {
  color: #536471;
  font-size: 13rem;
  margin: 0 0 2rem;
}

.tw-title {
  color: #0f1419;
  font-size: 15rem;
  font-weight: 700;
  margin: 0 0 2rem;
  line-height: 1.3;
}

.tw-description {
  color: #536471;
  font-size: 14rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
