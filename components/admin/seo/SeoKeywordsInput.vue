<script setup lang="ts">
const props = defineProps<{
  modelValue: string[];
  max?: number;
}>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>();

const max = computed(() => props.max ?? 15);
const input = ref('');

function addKeyword(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return;
  if (props.modelValue.includes(trimmed)) return;
  if (props.modelValue.length >= max.value) return;
  emit('update:modelValue', [...props.modelValue, trimmed]);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addKeyword(input.value);
    input.value = '';
  } else if (e.key === 'Backspace' && input.value === '' && props.modelValue.length) {
    removeAt(props.modelValue.length - 1);
  }
}

function onBlur() {
  if (input.value) {
    addKeyword(input.value);
    input.value = '';
  }
}

function removeAt(i: number) {
  emit('update:modelValue', props.modelValue.filter((_, idx) => idx !== i));
}
</script>

<template>
  <div class="kw-input">
    <div class="kw-tags">
      <span v-for="(kw, i) in modelValue" :key="i" class="kw-tag">
        {{ kw }}
        <button type="button" class="kw-remove" @click="removeAt(i)" title="Remover">×</button>
      </span>
      <input
        v-model="input"
        type="text"
        :placeholder="modelValue.length ? '' : 'Digite e pressione Enter ou vírgula'"
        :disabled="modelValue.length >= max"
        @keydown="onKeydown"
        @blur="onBlur"
      />
    </div>
    <small class="kw-meta">{{ modelValue.length }} / {{ max }} keywords</small>
  </div>
</template>

<style lang="scss" scoped>
.kw-input {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.kw-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6rem;
  align-items: center;
  background: #222;
  border: 1rem solid #444;
  border-radius: 4rem;
  padding: 6rem;
  min-height: 36rem;

  &:focus-within {
    border-color: #60a5fa;
  }
}

.kw-tag {
  background: #1e3a5f;
  color: #93c5fd;
  font-size: 12rem;
  padding: 3rem 8rem;
  border-radius: 4rem;
  display: inline-flex;
  align-items: center;
  gap: 4rem;
}

.kw-remove {
  background: none;
  border: none;
  color: #93c5fd;
  cursor: pointer;
  font-size: 14rem;
  line-height: 1;
  padding: 0 2rem;

  &:hover { color: #fff; }
}

input {
  background: transparent;
  border: none;
  color: #eee;
  outline: none;
  flex: 1;
  min-width: 100rem;
  font-size: 13rem;

  &:disabled { opacity: 0.4; }
}

.kw-meta {
  color: #666;
  font-size: 11rem;
}
</style>
