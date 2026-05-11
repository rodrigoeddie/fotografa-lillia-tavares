<script setup lang="ts">
import type { z } from 'zod';
import type { GiftGridDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof GiftGridDataSchema>;
type Item = NonNullable<Data['items']>[number];

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}

const items = computed(() => props.modelValue.items ?? []);

function updateItem(i: number, partial: Partial<Item>) {
  const list = [...items.value];
  list[i] = { ...list[i]!, ...partial };
  update('items', list);
}

function addItem() {
  update('items', [...items.value, { title: '', description: '', icon: '', active: true }]);
}

function removeItem(i: number) {
  update('items', items.value.filter((_, idx) => idx !== i));
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Título da seção (opcional)</label>
      <input :value="modelValue.title ?? ''" @input="(e) => update('title', (e.target as HTMLInputElement).value || undefined)" />
    </div>
    <div class="form-field">
      <label>Descrição (opcional)</label>
      <textarea :value="modelValue.description ?? ''" rows="2" @input="(e) => update('description', (e.target as HTMLTextAreaElement).value || undefined)"></textarea>
    </div>

    <div class="form-field">
      <label>Itens ({{ items.length }})</label>
      <div v-for="(item, i) in items" :key="i" class="nested-card">
        <div class="nested-header">
          <strong>Item {{ i + 1 }}</strong>
          <label class="active-toggle">
            <input type="checkbox" :checked="item.active" @change="(e) => updateItem(i, { active: (e.target as HTMLInputElement).checked })" />
            Ativo
          </label>
          <button type="button" class="btn-sm btn-danger" @click="removeItem(i)">✕</button>
        </div>
        <div class="form-grid-2">
          <div class="form-field">
            <label>Título</label>
            <input :value="item.title" @input="(e) => updateItem(i, { title: (e.target as HTMLInputElement).value })" />
          </div>
          <div class="form-field">
            <label>Ícone</label>
            <input :value="item.icon" placeholder="ex: 🎁 ou slug" @input="(e) => updateItem(i, { icon: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="form-field">
          <label>Descrição</label>
          <textarea :value="item.description" rows="2" @input="(e) => updateItem(i, { description: (e.target as HTMLTextAreaElement).value })"></textarea>
        </div>
        <div class="form-field">
          <label>Link (opcional)</label>
          <input :value="item.link ?? ''" @input="(e) => updateItem(i, { link: (e.target as HTMLInputElement).value || undefined })" />
        </div>
      </div>
      <button type="button" class="btn-secondary btn-sm" @click="addItem">+ Adicionar item</button>
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
  display: flex; justify-content: space-between; align-items: center; gap: 12rem; margin-bottom: 8rem;
  strong { font-size: 13rem; color: #aaa; flex: 1; }
}
.active-toggle { font-size: 12rem; color: #888; display: flex; gap: 4rem; align-items: center; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8rem; }
.btn-sm {
  background: #2a2a2a; color: #aaa; border: 1rem solid #444; border-radius: 4rem;
  padding: 3rem 8rem; cursor: pointer; font-size: 11rem;
  &:hover { background: #3a3a3a; }
  &.btn-danger:hover { background: #450a0a; color: #f87171; border-color: #7f1d1d; }
}
</style>
