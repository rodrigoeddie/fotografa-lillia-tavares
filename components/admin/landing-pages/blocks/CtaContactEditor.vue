<script setup lang="ts">
import type { z } from 'zod';
import type { CtaContactDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof CtaContactDataSchema>;

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
      <label>Descrição</label>
      <textarea :value="modelValue.description" rows="2" @input="(e) => update('description', (e.target as HTMLTextAreaElement).value)"></textarea>
    </div>
    <div class="form-field">
      <label>Texto do botão</label>
      <input :value="modelValue.buttonText" @input="(e) => update('buttonText', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Mensagem WhatsApp</label>
      <input :value="modelValue.whatsappMessage" @input="(e) => update('whatsappMessage', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-grid-2">
      <div class="form-field">
        <label>Cloudflare Image ID</label>
        <input :value="modelValue.image ?? ''" placeholder="ex: efcab108-..." @input="(e) => update('image', (e.target as HTMLInputElement).value || undefined)" />
      </div>
      <div class="form-field">
        <label>Largura da imagem</label>
        <input :value="modelValue.imageWidth ?? ''" placeholder="ex: 2000" @input="(e) => update('imageWidth', (e.target as HTMLInputElement).value || undefined)" />
      </div>
    </div>
    <div class="form-field">
      <label>Alt da imagem</label>
      <input :value="modelValue.imageAlt ?? ''" @input="(e) => update('imageAlt', (e.target as HTMLInputElement).value || undefined)" />
    </div>
    <div class="form-field">
      <AdminLandingPagesStringArrayInput
        :model-value="modelValue.features ?? []"
        @update:model-value="(v) => update('features', v.length ? v : undefined)"
        label="Lista de features (com ✔)"
        placeholder="ex: ✔ Direção completa durante o ensaio"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-grid-2 {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8rem;
}
</style>
