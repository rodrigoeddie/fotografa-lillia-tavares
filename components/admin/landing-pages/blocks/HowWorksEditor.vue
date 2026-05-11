<script setup lang="ts">
import type { z } from 'zod';
import type { HowWorksDataSchema } from '~/shared/schemas/landing-page';

type Data = z.infer<typeof HowWorksDataSchema>;
type Step = Data['list'][number];

const props = defineProps<{ modelValue: Data }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: Data): void }>();

function update<K extends keyof Data>(key: K, value: Data[K]) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}

function updateStep(i: number, partial: Partial<Step>) {
  const list = [...props.modelValue.list];
  list[i] = { ...list[i]!, ...partial };
  update('list', list);
}

function addStep() {
  update('list', [...props.modelValue.list, { title: '', description: '', icon: '' }]);
}

function removeStep(i: number) {
  update('list', props.modelValue.list.filter((_, idx) => idx !== i));
}
</script>

<template>
  <div class="block-editor-fields">
    <div class="form-field">
      <label>Título da seção</label>
      <input :value="modelValue.title" @input="(e) => update('title', (e.target as HTMLInputElement).value)" />
    </div>

    <div class="form-field">
      <label>Passos ({{ modelValue.list.length }})</label>
      <div v-for="(step, i) in modelValue.list" :key="i" class="nested-card">
        <div class="nested-header">
          <strong>Passo {{ i + 1 }}</strong>
          <button type="button" class="btn-sm btn-danger" @click="removeStep(i)">✕</button>
        </div>
        <div class="form-grid-2">
          <div class="form-field">
            <label>Título</label>
            <input :value="step.title" @input="(e) => updateStep(i, { title: (e.target as HTMLInputElement).value })" />
          </div>
          <div class="form-field">
            <label>Ícone (slug)</label>
            <input :value="step.icon" placeholder="ex: chedule, camera, choose, envelope" @input="(e) => updateStep(i, { icon: (e.target as HTMLInputElement).value })" />
          </div>
        </div>
        <div class="form-field">
          <label>Descrição</label>
          <textarea :value="step.description" rows="2" @input="(e) => updateStep(i, { description: (e.target as HTMLTextAreaElement).value })"></textarea>
        </div>
      </div>
      <button type="button" class="btn-secondary btn-sm" @click="addStep">+ Adicionar passo</button>
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
  strong { font-size: 13rem; color: #aaa; }
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8rem;
}

.btn-sm {
  background: #2a2a2a; color: #aaa; border: 1rem solid #444; border-radius: 4rem;
  padding: 3rem 8rem; cursor: pointer; font-size: 11rem;
  &:hover { background: #3a3a3a; }
  &.btn-danger:hover { background: #450a0a; color: #f87171; border-color: #7f1d1d; }
}
</style>
