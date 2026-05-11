<script setup lang="ts">
import type { z } from 'zod';
import type { TestimonialsDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof TestimonialsDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Descrição customizada (opcional)</label>
      <textarea
        :value="modelValue.description ?? ''"
        rows="2"
        placeholder="Deixe vazio para usar texto padrão do componente"
        @input="(e) => emit('update:modelValue', { description: (e.target as HTMLTextAreaElement).value || undefined })"
      ></textarea>
      <small>Os depoimentos são puxados do banco. Aqui você pode customizar apenas o título/descrição da seção.</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
