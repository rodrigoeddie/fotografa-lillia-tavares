<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
  label?: string;
  placeholder?: string;
}>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>();

function update(i: number, value: string) {
  const next = [...props.modelValue];
  next[i] = value;
  emit('update:modelValue', next);
}
function add() {
  emit('update:modelValue', [...props.modelValue, '']);
}
function remove(i: number) {
  emit('update:modelValue', props.modelValue.filter((_, idx) => idx !== i));
}
function move(i: number, dir: -1 | 1) {
  const next = [...props.modelValue];
  const target = i + dir;
  if (target < 0 || target >= next.length) return;
  [next[i], next[target]] = [next[target]!, next[i]!];
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="str-arr">
    <label v-if="label">{{ label }}</label>
    <div v-for="(item, i) in modelValue" :key="i" class="row">
      <input :value="item" :placeholder="placeholder" @input="(e) => update(i, (e.target as HTMLInputElement).value)" />
      <button type="button" class="btn-sm" :disabled="i === 0" @click="move(i, -1)" title="Mover para cima">↑</button>
      <button type="button" class="btn-sm" :disabled="i === modelValue.length - 1" @click="move(i, 1)" title="Mover para baixo">↓</button>
      <button type="button" class="btn-sm btn-danger" @click="remove(i)" title="Remover">✕</button>
    </div>
    <button type="button" class="btn-secondary btn-sm add-btn" @click="add">+ Adicionar</button>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
.str-arr {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

label {
  font-size: 13rem;
  color: t.$text;
  margin-bottom: 4rem;
}

.row {
  display: flex;
  gap: 6rem;
  align-items: center;

  input {
    flex: 1;
    background: t.$surface-2;
    color: t.$text;
    border: 1rem solid t.$border-strong;
    border-radius: 4rem;
    padding: 6rem 8rem;
    font-size: 13rem;
    &:focus { outline: none; border-color: t.$accent-line; }
  }
}

.btn-sm {
  background: t.$surface-2;
  color: t.$text-2;
  border: 1rem solid t.$border-strong;
  border-radius: 4rem;
  padding: 4rem 8rem;
  cursor: pointer;
  font-size: 12rem;
  &:hover:not(:disabled) { background: t.$surface-3; color: t.$text; }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
  &.btn-danger:hover:not(:disabled) { background: t.$danger-bg; color: t.$danger; border-color: t.$danger; }
}

.add-btn {
  align-self: flex-start;
  margin-top: 4rem;
}
</style>
