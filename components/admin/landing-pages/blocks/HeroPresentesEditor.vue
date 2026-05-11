<script setup lang="ts">
import type { z } from 'zod';
import type { HeroPresentesDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof HeroPresentesDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Título (HTML permitido)</label>
      <input :value="modelValue.title" @input="(e) => update('title', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Subtítulo</label>
      <textarea :value="modelValue.subtitle" rows="2" @input="(e) => update('subtitle', (e.target as HTMLTextAreaElement).value)"></textarea>
    </div>
    <div class="form-field">
      <AdminLandingPagesStringArrayInput
        :model-value="modelValue.features"
        @update:model-value="(v) => update('features', v)"
        label="Lista de features"
        placeholder="ex: Memórias que duram para sempre"
      />
    </div>
    <div class="form-field">
      <label>Mensagem WhatsApp</label>
      <input :value="modelValue.whatsappMessage" @input="(e) => update('whatsappMessage', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Texto do botão</label>
      <input :value="modelValue.buttonText" @input="(e) => update('buttonText', (e.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
