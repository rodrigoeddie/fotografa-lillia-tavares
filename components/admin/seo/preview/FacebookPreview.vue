<script setup lang="ts">
import type { FacebookPreview } from '~/composables/admin/seo/analyzers/preview';
const props = defineProps<{ data: FacebookPreview }>();

const host = computed(() => {
  try { return new URL(props.data.url).host.replace(/^www\./, ''); } catch { return ''; }
});
</script>

<template>
  <div class="fb-preview">
    <div v-if="data.imageUrl" class="fb-image">
      <img :src="data.imageUrl" alt="OG preview" />
    </div>
    <div v-else class="fb-image fb-image-placeholder">
      <span>Sem imagem OG</span>
    </div>
    <div class="fb-body">
      <p class="fb-host">{{ host || data.url }}</p>
      <h3 class="fb-title">{{ data.title || '(sem título)' }}</h3>
      <p v-if="data.description" class="fb-description">{{ data.description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fb-preview {
  background: #fff;
  border: 1rem solid #dddfe2;
  border-radius: 8rem;
  overflow: hidden;
  font-family: Helvetica, Arial, sans-serif;
}

.fb-image {
  background: #f0f2f5;
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

.fb-image-placeholder {
  color: #65676b;
  font-size: 13rem;
}

.fb-body {
  padding: 12rem 16rem;
}

.fb-host {
  color: #65676b;
  font-size: 12rem;
  text-transform: uppercase;
  margin: 0 0 4rem;
}

.fb-title {
  color: #050505;
  font-size: 16rem;
  font-weight: 600;
  margin: 0 0 4rem;
  line-height: 1.3;
}

.fb-description {
  color: #65676b;
  font-size: 14rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
