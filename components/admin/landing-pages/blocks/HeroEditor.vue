<script setup lang="ts">
import type { z } from 'zod';
import type { HeroDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof HeroDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Variante</label>
      <select :value="modelValue.variant" @change="(e) => update('variant', (e.target as HTMLSelectElement).value as Data['variant'])">
        <option value="corporativo">corporativo</option>
        <option value="dia-das-maes">dia-das-maes</option>
      </select>
      <small>Define o estilo visual e o conteúdo padrão do hero (controlado em components/landings/Hero.vue)</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
