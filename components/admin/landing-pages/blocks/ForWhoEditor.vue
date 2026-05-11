<script setup lang="ts">
import type { z } from 'zod';
import type { ForWhoDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof ForWhoDataSchema>;
type ListItem = Data['lists'][number];

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}

function updateList(i: number, partial: Partial<ListItem>) {
  const lists = [...props.modelValue.lists];
  lists[i] = { ...lists[i]!, ...partial };
  update('lists', lists);
}

function addList() {
  update('lists', [...props.modelValue.lists, { title: '', list: [] }]);
}

function removeList(i: number) {
  update('lists', props.modelValue.lists.filter((_, idx) => idx !== i));
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Título da seção</label>
      <input :value="modelValue.title" @input="(e) => update('title', (e.target as HTMLInputElement).value)" />
    </div>
    <div class="form-field">
      <label>Descrição</label>
      <textarea :value="modelValue.description" rows="2" @input="(e) => update('description', (e.target as HTMLTextAreaElement).value)"></textarea>
    </div>

    <div class="form-field">
      <label>Colunas ({{ modelValue.lists.length }})</label>
      <div v-for="(list, i) in modelValue.lists" :key="i" class="nested-card">
        <div class="nested-header">
          <strong>Coluna {{ i + 1 }}</strong>
          <button type="button" class="btn-sm btn-danger" @click="removeList(i)">✕ Remover coluna</button>
        </div>
        <div class="form-field">
          <label>Título da coluna</label>
          <input :value="list.title" @input="(e) => updateList(i, { title: (e.target as HTMLInputElement).value })" />
        </div>
        <AdminLandingPagesStringArrayInput
          :model-value="list.list"
          @update:model-value="(v) => updateList(i, { list: v })"
          label="Itens (HTML permitido p/ <b>...</b>)"
          placeholder="ex: LinkedIn"
        />
      </div>
      <button type="button" class="btn-secondary btn-sm" @click="addList">+ Adicionar coluna</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.nested-card {
  background: #161616;
  border: 1rem solid #2a2a2a;
  border-radius: 6rem;
  padding: 12rem;
  margin-bottom: 8rem;
}

.nested-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rem;

  strong {
    font-size: 13rem;
    color: #aaa;
  }
}

.btn-sm {
  background: #2a2a2a;
  color: #aaa;
  border: 1rem solid #444;
  border-radius: 4rem;
  padding: 3rem 8rem;
  cursor: pointer;
  font-size: 11rem;
  &:hover { background: #3a3a3a; }
  &.btn-danger:hover { background: #450a0a; color: #f87171; border-color: #7f1d1d; }
}
</style>
