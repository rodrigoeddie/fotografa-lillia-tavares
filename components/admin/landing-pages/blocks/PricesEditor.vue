<script setup lang="ts">
import type { z } from 'zod';
import type { PricesDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof PricesDataSchema>;

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

const { adminFetch } = useAdminFetch();
const produtos = ref<{ slug: string; title: string; lp_slug: string | null }[]>([]);

onMounted(async () => {
  try {
    produtos.value = await adminFetch('/api/admin/produtos');
  } catch { /* silent */ }
});

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Produto (slug)</label>
      <input
        list="produtos-list"
        :value="modelValue.produtoSlug"
        placeholder="ex: corporativo"
        @input="(e) => update('produtoSlug', (e.target as HTMLInputElement).value)"
      />
      <datalist id="produtos-list">
        <option v-for="p in produtos" :key="p.slug" :value="p.slug">{{ p.title }}</option>
      </datalist>
      <small>O componente Prices filtra produtos pelo slug ou lp_slug correspondente.</small>
    </div>
    <div class="form-field">
      <label>Título (opcional)</label>
      <input :value="modelValue.title ?? ''" @input="(e) => update('title', (e.target as HTMLInputElement).value || undefined)" />
    </div>
    <div class="form-field">
      <label>Descrição (opcional)</label>
      <textarea :value="modelValue.description ?? ''" rows="2" @input="(e) => update('description', (e.target as HTMLTextAreaElement).value || undefined)"></textarea>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
