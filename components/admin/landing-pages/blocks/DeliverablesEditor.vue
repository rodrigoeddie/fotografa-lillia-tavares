<script setup lang="ts">
import type { z } from 'zod';
import type { DeliverablesDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof DeliverablesDataSchema>;
type Item = Data['items'][number];

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}

function updateItem(i: number, partial: Partial<Item>) {
  const items = [...props.modelValue.items];
  items[i] = { ...items[i]!, ...partial };
  update('items', items);
}

function addItem() {
  update('items', [...props.modelValue.items, { icon: '', title: '', description: '' }]);
}

function removeItem(i: number) {
  update('items', props.modelValue.items.filter((_, idx) => idx !== i));
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
      <label>Cards ({{ modelValue.items.length }})</label>
      <div v-for="(item, i) in modelValue.items" :key="i" class="nested-card">
        <div class="nested-header">
          <strong>Card {{ i + 1 }}</strong>
          <button type="button" class="btn-sm btn-danger" @click="removeItem(i)">✕</button>
        </div>
        <div class="form-grid-2">
          <div class="form-field">
            <label>Ícone</label>
            <input :value="item.icon" placeholder="🎁 ou slug" @input="(e) => updateItem(i, { icon: (e.target as HTMLInputElement).value })" />
          </div>
          <div class="form-field">
            <label>Título</label>
            <input :value="item.title" @input="(e) => updateItem(i, { title: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="form-field">
          <label>Descrição</label>
          <textarea :value="item.description" rows="2" @input="(e) => updateItem(i, { description: (e.target as HTMLTextAreaElement).value })"></textarea>
        </div>
      </div>
      <button type="button" class="btn-secondary btn-sm" @click="addItem">+ Adicionar card</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.nested-card {
  background: #161616; border: 1rem solid #2a2a2a; border-radius: 6rem;
  padding: 12rem; margin-bottom: 8rem;
}
.nested-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 8rem;
  strong { font-size: 13rem; color: #aaa; }
}
.form-grid-2 { display: grid; grid-template-columns: 1fr 2fr; gap: 8rem; }
.btn-sm {
  background: #2a2a2a; color: #aaa; border: 1rem solid #444; border-radius: 4rem;
  padding: 3rem 8rem; cursor: pointer; font-size: 11rem;
  &:hover { background: #3a3a3a; }
  &.btn-danger:hover { background: #450a0a; color: #f87171; border-color: #7f1d1d; }
}
</style>
