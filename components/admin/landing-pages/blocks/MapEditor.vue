<script setup lang="ts">
import type { z } from 'zod';
import type { MapDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof MapDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Título</label>
      <input :value="modelValue.title" @input="(e) => update('title', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Descrição (HTML permitido — use &lt;p&gt;)</label>
      <textarea :value="modelValue.description" rows="4" @input="(e) => update('description', (e.target as HTMLTextAreaElement).value)"></textarea>
    </div>
    <div class="form-field">
      <label>Descrição final (HTML permitido, opcional)</label>
      <textarea :value="modelValue.finalDescription ?? ''" rows="2" @input="(e) => update('finalDescription', (e.target as HTMLTextAreaElement).value || undefined)"></textarea>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
