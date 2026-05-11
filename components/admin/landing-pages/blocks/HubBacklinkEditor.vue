<script setup lang="ts">
import type { z } from 'zod';
import type { HubBacklinkDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof HubBacklinkDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Texto antes do link</label>
      <input :value="modelValue.text" @input="(e) => update('text', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Texto do link</label>
      <input :value="modelValue.linkLabel" @input="(e) => update('linkLabel', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Destino do link</label>
      <input :value="modelValue.linkTo" placeholder="/presente-ensaio-fotografico-mogi" @input="(e) => update('linkTo', (e.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
