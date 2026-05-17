<script setup lang="ts">
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

const customInput = ref('');

const selected = computed(() => props.modelValue);

function isSelected(route: string) {
  return selected.value.includes(route);
}

function toggle(route: string) {
  const next = isSelected(route)
    ? selected.value.filter((r) => r !== route)
    : [...selected.value, route];
  emit('update:modelValue', next);
}

function removeTag(route: string) {
  emit('update:modelValue', selected.value.filter((r) => r !== route));
}

function addCustom() {
  const r = customInput.value.trim();
  if (!r) return;
  const route = r.startsWith('/') ? r : `/${r}`;
  if (!selected.value.includes(route)) {
    emit('update:modelValue', [...selected.value, route]);
  }
  customInput.value = '';
}

function labelFor(route: string) {
  return KNOWN_ROUTES.find((r) => r.route === route)?.label ?? route;
}
</script>

<template>
  <div class="route-multi-select">
    <!-- Tags selecionadas -->
    <div v-if="selected.length > 0" class="rms-tags">
      <span v-for="r in selected" :key="r" class="rms-tag">
        {{ labelFor(r) }}
        <button type="button" class="rms-tag-remove" @click="removeTag(r)">×</button>
      </span>
    </div>
    <p v-else class="rms-empty">Nenhuma página selecionada.</p>

    <!-- Lista de páginas conhecidas -->
    <div class="rms-options">
      <button
        v-for="p in KNOWN_ROUTES"
        :key="p.route"
        type="button"
        class="rms-option"
        :class="{ selected: isSelected(p.route) }"
        @click="toggle(p.route)"
      >
        <span class="rms-check">{{ isSelected(p.route) ? '✓' : '+' }}</span>
        <span class="rms-label">{{ p.label }}</span>
        <span class="rms-route">{{ p.route }}</span>
      </button>
    </div>

    <!-- Rota customizada -->
    <div class="rms-custom">
      <input
        v-model="customInput"
        placeholder="/outra-pagina-customizada"
        @keydown.enter.prevent="addCustom"
      />
      <button type="button" class="btn-ghost-sm" @click="addCustom">Adicionar</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.route-multi-select {
  display: flex;
  flex-direction: column;
  gap: 10rem;
}

.rms-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6rem;
}

.rms-tag {
  display: inline-flex;
  align-items: center;
  gap: 5rem;
  background: #2a4a2a;
  color: #7ecf7e;
  border: 1rem solid #3d6e3d;
  border-radius: 4rem;
  padding: 3rem 8rem;
  font-size: 12rem;
}

.rms-tag-remove {
  background: none;
  border: none;
  color: #7ecf7e;
  cursor: pointer;
  font-size: 14rem;
  line-height: 1;
  padding: 0 0 0 2rem;
  opacity: 0.7;

  &:hover { opacity: 1; }
}

.rms-empty {
  color: #555;
  font-size: 12rem;
}

.rms-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240rem, 1fr));
  gap: 4rem;
}

.rms-option {
  display: flex;
  align-items: center;
  gap: 8rem;
  padding: 6rem 10rem;
  border-radius: 4rem;
  border: 1rem solid #333;
  background: #1a1a1a;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s;

  &:hover { border-color: #555; }

  &.selected {
    border-color: #3d6e3d;
    background: #1a2e1a;
  }
}

.rms-check {
  font-size: 12rem;
  width: 14rem;
  text-align: center;
  color: #7ecf7e;
  flex-shrink: 0;
}

.rms-label {
  font-size: 13rem;
  color: #ccc;
  flex: 1;
}

.rms-route {
  font-size: 11rem;
  color: #555;
  font-family: monospace;
}

.rms-custom {
  display: flex;
  gap: 8rem;

  input {
    flex: 1;
  }
}
</style>
