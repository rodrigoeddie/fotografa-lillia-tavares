<script setup lang="ts">
import type { z } from 'zod';
import type { FaqDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof FaqDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

const { adminFetch } = useAdminFetch();
const categorias = ref<{ slug: string; titulo: string }[]>([]);

onMounted(async () => {
  try {
    const raw = await adminFetch<any[]>('/api/public/faq');
    categorias.value = (raw ?? []).map((c: any) => ({ slug: c.slug, titulo: c.titulo ?? c.name ?? c.slug }));
  } catch { /* silent */ }
});

function update(slug: string) {
  emit('update:modelValue', { ...props.modelValue, slug });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Categoria do FAQ</label>
      <select :value="modelValue.slug" @change="(e) => update((e.target as HTMLSelectElement).value)">
        <option value="" disabled>Selecione uma categoria...</option>
        <option v-for="cat in categorias" :key="cat.slug" :value="cat.slug">
          {{ cat.titulo }} ({{ cat.slug }})
        </option>
      </select>
      <small>Apenas as perguntas desta categoria serão exibidas no bloco.</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
