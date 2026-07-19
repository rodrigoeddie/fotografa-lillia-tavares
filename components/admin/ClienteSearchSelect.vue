<script setup lang="ts">
interface Option { id: number; nome: string; email: string; }

const props = defineProps<{
  modelValue: string | number;
  options: Option[];
}>();
const emit = defineEmits<{ (e: 'update:modelValue', v: number): void }>();

const open = ref(false);
const query = ref('');
const inputRef = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const selected = computed(() =>
  props.modelValue ? props.options.find(c => c.id === Number(props.modelValue)) ?? null : null
);

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return props.options;
  return props.options.filter(c =>
    c.nome.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
  );
});

function select(id: number) {
  emit('update:modelValue', id);
  open.value = false;
  query.value = '';
}

function openDropdown() {
  open.value = true;
  nextTick(() => inputRef.value?.focus());
}

function closeDropdown() {
  open.value = false;
  query.value = '';
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<template>
  <div ref="containerRef" class="css-wrapper">
    <div class="css-box" :class="{ open }" @click="openDropdown">
      <span v-if="selected" class="css-selected">
        {{ selected.nome }}
        <span class="css-email">{{ selected.email }}</span>
      </span>
      <span v-else class="css-placeholder">Selecione um cliente</span>
      <span class="css-arrow">{{ open ? '▲' : '▼' }}</span>
    </div>

    <div v-show="open" class="css-dropdown">
      <div class="css-search-wrap">
        <input
          ref="inputRef"
          v-model="query"
          class="css-search"
          placeholder="Buscar por nome ou e-mail..."
          @keydown.escape.prevent="closeDropdown"
        />
      </div>
      <div class="css-list">
        <button
          v-for="c in filtered"
          :key="c.id"
          type="button"
          class="css-option"
          :class="{ active: c.id === Number(modelValue) }"
          @mousedown.prevent="select(c.id)"
        >
          <span class="css-nome">{{ c.nome }}</span>
          <span class="css-opt-email">{{ c.email }}</span>
        </button>
        <p v-if="filtered.length === 0" class="css-empty">Nenhum cliente encontrado</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.css-wrapper {
  position: relative;
  width: 100%;
}

.css-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 10px 13px;
  background: t.$surface-2;
  border: 1px solid t.$border-strong;
  border-radius: 6px;
  cursor: pointer;
  gap: 8px;

  &.open {
    border-color: t.$accent-line;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.css-selected {
  flex: 1;
  font-size: 15px;
  color: t.$text;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.css-email {
  font-size: 12px;
  color: t.$text-2;
}

.css-placeholder {
  flex: 1;
  font-size: 15px;
  color: t.$text-3;
}

.css-arrow {
  color: t.$text-2;
  font-size: 10px;
  flex-shrink: 0;
  user-select: none;
}

.css-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 200;
  background: t.$surface;
  border: 1px solid t.$accent-line;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  max-height: 280px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,.7);
}

.css-search-wrap {
  padding: 8px;
  border-bottom: 1px solid t.$border;
  position: sticky;
  top: 0;
  background: t.$surface;
}

.css-search {
  width: 100%;
  padding: 8px 10px;
  background: t.$bg;
  border: 1px solid t.$border-strong;
  border-radius: 5px;
  color: t.$text;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;

  &::placeholder { color: t.$text-3; }
  &:focus { border-color: t.$accent-line; }
}

.css-list {
  display: flex;
  flex-direction: column;
}

.css-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 13px;
  background: none;
  border: none;
  color: t.$text;
  font-size: 14px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background .12s;

  &:hover { background: t.$surface-2; }
  &.active { background: t.$accent-dim; color: t.$accent; }
}

.css-nome {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.css-opt-email {
  font-size: 11px;
  color: t.$text-3;
  flex-shrink: 0;
}

.css-empty {
  padding: 12px 13px;
  color: t.$text-3;
  font-size: 13px;
  font-style: italic;
  margin: 0;
}
</style>
