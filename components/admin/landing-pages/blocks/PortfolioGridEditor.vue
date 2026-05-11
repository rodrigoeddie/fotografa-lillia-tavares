<script setup lang="ts">
import type { z } from 'zod';
import type { PortfolioGridDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof PortfolioGridDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Categoria do portfolio</label>
      <input :value="modelValue.categoria" placeholder="ex: corporativo, dia-das-maes" @input="(e) => update('categoria', (e.target as HTMLInputElement).value)" />
      <small>Filtra portfolio_works pela categoria informada.</small>
    </div>
    <div class="form-field">
      <label>Título</label>
      <input :value="modelValue.title" @input="(e) => update('title', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Descrição</label>
      <textarea :value="modelValue.description" rows="2" @input="(e) => update('description', (e.target as HTMLTextAreaElement).value)"></textarea>
    </div>
    <div class="form-grid-2">
      <div class="form-field">
        <label>Texto do botão</label>
        <input :value="modelValue.buttonText ?? ''" @input="(e) => update('buttonText', (e.target as HTMLInputElement).value || undefined)" />
      </div>
      <div class="form-field">
        <label>Link do botão</label>
        <input :value="modelValue.buttonLink ?? ''" placeholder="/ensaio-fotografico/corporativo" @input="(e) => update('buttonLink', (e.target as HTMLInputElement).value || undefined)" />
      </div>
    </div>
    <div class="form-field">
      <label>Aria-label do botão</label>
      <input :value="modelValue.buttonLabel ?? ''" @input="(e) => update('buttonLabel', (e.target as HTMLInputElement).value || undefined)" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8rem;
}
</style>
