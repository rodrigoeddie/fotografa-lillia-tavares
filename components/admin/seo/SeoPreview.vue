<script setup lang="ts">
import { buildPreviews, type PreviewInput } from '~/composables/admin/seo/analyzers/preview';

const props = defineProps<{ input: PreviewInput }>();

const previews = computed(() => buildPreviews(props.input));

const active = ref<'google' | 'facebook' | 'twitter'>('google');
</script>

<template>
  <div class="seo-preview">
    <div class="preview-tabs">
      <button
        type="button"
        :class="{ active: active === 'google' }"
        @click="active = 'google'"
      >Google</button>
      <button
        type="button"
        :class="{ active: active === 'facebook' }"
        @click="active = 'facebook'"
      >Facebook</button>
      <button
        type="button"
        :class="{ active: active === 'twitter' }"
        @click="active = 'twitter'"
      >Twitter</button>
    </div>
    <div class="preview-content">
      <AdminSeoPreviewGooglePreview v-if="active === 'google'" :data="previews.google" />
      <AdminSeoPreviewFacebookPreview v-else-if="active === 'facebook'" :data="previews.facebook" />
      <AdminSeoPreviewTwitterPreview v-else :data="previews.twitter" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.seo-preview {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.preview-tabs {
  display: flex;
  gap: 4rem;
  border-bottom: 1rem solid #333;

  button {
    background: none;
    border: none;
    color: #888;
    padding: 8rem 16rem;
    cursor: pointer;
    font-size: 13rem;
    border-bottom: 2rem solid transparent;
    margin-bottom: -1rem;

    &.active {
      color: #fff;
      border-bottom-color: #60a5fa;
    }

    &:hover:not(.active) {
      color: #ccc;
    }
  }
}

.preview-content {
  padding-top: 8rem;
}
</style>
