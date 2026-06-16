<script setup lang="ts">
import { buildPreviews, type PreviewInput } from '~/composables/admin/seo/analyzers/preview';

const props = defineProps<{ input: PreviewInput }>();

const previews = computed(() => buildPreviews(props.input));
</script>

<template>
  <div class="seo-preview">
    <div class="preview-tabs">
      <div class="preview-item">
        <span class="preview-label">Google</span>
        <AdminSeoPreviewGooglePreview :data="previews.google" />
      </div>
      <div class="preview-item">
        <span class="preview-label">Facebook</span>
        <AdminSeoPreviewFacebookPreview :data="previews.facebook" />
      </div>
      <div class="preview-item">
        <span class="preview-label">Twitter</span>
        <AdminSeoPreviewTwitterPreview :data="previews.twitter" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.seo-preview {
  display: flex;
  flex-direction: column;
}

.preview-tabs {
  display: flex;
  flex-direction: column;
  gap: 24rem;
}

.preview-item {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.preview-label {
  font-size: 11rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
}
</style>
