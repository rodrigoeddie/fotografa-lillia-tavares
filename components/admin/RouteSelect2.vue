<script setup lang="ts">
/**
 * RouteSelect2 — componente de seleção múltipla de rotas estilo Select2.
 * Suporta pesquisa, seleção por clique, remoção por tag e rota personalizada.
 */
const props = defineProps<{ modelValue: string[] }>();
const emit  = defineEmits<{ (e: 'update:modelValue', v: string[]): void }>();

const KNOWN_ROUTES = [
  { route: '/', label: 'Início' },
  { route: '/sobre-fotografa-lillia-tavares', label: 'Sobre' },
  { route: '/ensaio-fotografico', label: 'Ensaio fotográfico' },
  { route: '/ensaio-profissional-em-mogi', label: 'Ensaio profissional em Mogi' },
  { route: '/analise-coloracao-pessoal-em-mogi', label: 'Análise de coloração pessoal' },
  { route: '/estudio', label: 'Estúdio' },
  { route: '/precos-ensaios-fotograficos', label: 'Preços' },
  { route: '/presente-ensaio-fotografico-mogi', label: 'Presente (ensaio)' },
  { route: '/agende-seu-ensaio', label: 'Agende seu ensaio' },
  { route: '/depoimentos', label: 'Depoimentos' },
  { route: '/perguntas-frequentes', label: 'Perguntas frequentes' },
  { route: '/blog', label: 'Blog' },
  { route: '/privacidade-e-termos', label: 'Privacidade e termos' },
];

const open      = ref(false);
const query     = ref('');
const inputRef  = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

const filtered = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return KNOWN_ROUTES;
  return KNOWN_ROUTES.filter(
    (r) => r.label.toLowerCase().includes(q) || r.route.toLowerCase().includes(q),
  );
});

function isSelected(route: string) {
  return props.modelValue.includes(route);
}

function toggle(route: string) {
  const next = isSelected(route)
    ? props.modelValue.filter((r) => r !== route)
    : [...props.modelValue, route];
  emit('update:modelValue', next);
}

function removeTag(route: string) {
  emit('update:modelValue', props.modelValue.filter((r) => r !== route));
}

function labelFor(route: string) {
  return KNOWN_ROUTES.find((r) => r.route === route)?.label ?? route;
}

function openDropdown() {
  open.value = true;
  nextTick(() => inputRef.value?.focus());
}

function closeDropdown() {
  open.value = false;
  query.value = '';
}

function addCustom() {
  const r = query.value.trim();
  if (!r) return;
  const route = r.startsWith('/') ? r : `/${r}`;
  if (!props.modelValue.includes(route)) {
    emit('update:modelValue', [...props.modelValue, route]);
  }
  query.value = '';
  nextTick(() => inputRef.value?.focus());
}

// Fechar ao clicar fora
function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    closeDropdown();
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<template>
  <div ref="containerRef" class="rs2-wrapper">
    <!-- Caixa de tags + input -->
    <div class="rs2-box" :class="{ open }" @click="openDropdown">
      <div class="rs2-tags">
        <span
          v-for="r in modelValue"
          :key="r"
          class="rs2-tag"
          @click.stop
        >
          {{ labelFor(r) }}
          <button type="button" class="rs2-tag-x" @click.stop="removeTag(r)">×</button>
        </span>
        <input
          ref="inputRef"
          v-model="query"
          class="rs2-search"
          :placeholder="modelValue.length === 0 ? 'Selecionar páginas...' : ''"
          @keydown.enter.prevent="addCustom"
          @keydown.escape.prevent="closeDropdown"
          @focus="open = true"
        />
      </div>
      <span class="rs2-arrow">{{ open ? '▲' : '▼' }}</span>
    </div>

    <!-- Dropdown -->
    <div v-show="open" class="rs2-dropdown">
      <div class="rs2-list">
        <button
          v-for="p in filtered"
          :key="p.route"
          type="button"
          class="rs2-option"
          :class="{ selected: isSelected(p.route) }"
          @mousedown.prevent="toggle(p.route)"
        >
          <span class="rs2-check">{{ isSelected(p.route) ? '✓' : '' }}</span>
          <span class="rs2-opt-label">{{ p.label }}</span>
          <span class="rs2-opt-route">{{ p.route }}</span>
        </button>
        <p v-if="filtered.length === 0" class="rs2-empty">Nenhuma página encontrada</p>
      </div>
      <div v-if="query && !filtered.some((r) => r.route === (query.startsWith('/') ? query : '/' + query))" class="rs2-custom">
        <button type="button" class="rs2-add-custom" @mousedown.prevent="addCustom">
          <span class="rs2-check">+</span>
          <span>Adicionar "{{ query.startsWith('/') ? query : '/' + query }}"</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.rs2-wrapper {
  position: relative;
  width: 100%;
}

.rs2-box {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 6px 10px;
  background: #111;
  border: 1px solid #999;
  border-radius: 6px;
  cursor: text;
  gap: 6px;
  flex-wrap: wrap;

  &.open {
    border-color: #6b7280;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.rs2-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  flex: 1;
  align-items: center;
}

.rs2-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #1e3a5f;
  border: 1px solid #2d5a9e;
  color: #93c5fd;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  white-space: nowrap;
}

.rs2-tag-x {
  background: none;
  border: none;
  color: #60a5fa;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0 0 0 2px;
  &:hover { color: #ef4444; }
}

.rs2-search {
  flex: 1;
  min-width: 120px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  padding: 2px 0;

  &::placeholder { color: #555; }
}

.rs2-arrow {
  color: #6b7280;
  font-size: 10px;
  flex-shrink: 0;
  user-select: none;
}

.rs2-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background: #111;
  border: 1px solid #6b7280;
  border-top: none;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  max-height: 260px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,.6);
}

.rs2-list {
  display: flex;
  flex-direction: column;
}

.rs2-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  background: none;
  border: none;
  color: #ccc;
  font-size: 13px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background .12s;

  &:hover { background: #1a2535; }

  &.selected {
    background: #0f1e35;
    color: #93c5fd;
  }
}

.rs2-check {
  width: 16px;
  flex-shrink: 0;
  color: #60a5fa;
  font-size: 12px;
  text-align: center;
}

.rs2-opt-label {
  flex: 1;
}

.rs2-opt-route {
  font-size: 11px;
  color: #555;
  font-family: monospace;
}

.rs2-empty {
  padding: 10px 12px;
  color: #555;
  font-size: 13px;
  font-style: italic;
}

.rs2-custom {
  border-top: 1px solid #1f2937;
}

.rs2-add-custom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  background: none;
  border: none;
  color: #60a5fa;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  width: 100%;
  text-align: left;
  &:hover { background: #1a2535; }
}
</style>
