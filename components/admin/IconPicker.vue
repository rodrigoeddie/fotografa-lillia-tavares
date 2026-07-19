<script setup lang="ts">
/**
 * IconPicker — campo de ícone (SVG ou emoji) com biblioteca da marca.
 * Permite digitar SVG/emoji manualmente OU escolher de uma grade de ícones
 * (docs/icones via useBrandIconLibrary). O valor gravado é o markup SVG cru.
 */
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>();

const { groups } = useBrandIconLibrary();

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const open = ref(false);
const containerRef = ref<HTMLDivElement | null>(null);

function pick(svg: string) {
  emit('update:modelValue', svg);
  open.value = false;
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false;
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));
</script>

<template>
  <div ref="containerRef" class="icon-picker">
    <textarea v-model="value" rows="3" placeholder="<svg ...> ou 🎉" />

    <div class="icon-picker-bar">
      <button type="button" class="icon-lib-btn" @click="open = !open">
        <span class="material-symbols-outlined">grid_view</span>
        Escolher da biblioteca
      </button>
      <button v-if="value" type="button" class="icon-clear-btn" @click="value = ''">Limpar</button>
    </div>

    <div v-if="value" class="icon-preview" v-html="value" />

    <div v-show="open" class="icon-lib">
      <div v-for="g in groups" :key="g.name" class="icon-lib-group">
        <p class="icon-lib-group-title">{{ g.name }}</p>
        <div class="icon-lib-grid">
          <button
            v-for="ic in g.icons"
            :key="ic.id"
            type="button"
            class="icon-lib-item"
            :class="{ active: value.trim() === ic.svg }"
            :title="ic.label"
            @click="pick(ic.svg)"
          >
            <span class="icon-lib-svg" v-html="ic.svg" />
            <span class="icon-lib-label">{{ ic.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.icon-picker { position: relative; }

.icon-picker-bar { display: flex; gap: 8px; margin-top: 8px; }

.icon-lib-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: t.$surface; border: 1px solid t.$border; color: t.$text-2;
  font-size: 13px; font-family: inherit; padding: 6px 12px; border-radius: 6px; cursor: pointer;
  .material-symbols-outlined { font-size: 18px; }
  &:hover { color: t.$accent; border-color: t.$accent; }
}
.icon-clear-btn {
  background: none; border: 1px solid t.$border; color: t.$text-3;
  font-size: 13px; font-family: inherit; padding: 6px 12px; border-radius: 6px; cursor: pointer;
  &:hover { color: t.$danger; border-color: t.$danger; }
}

.icon-preview {
  margin-top: 8px; padding: 12px; background: t.$bg; border-radius: 6px;
  display: flex; align-items: center; gap: 8px; font-size: 32px;
  :deep(svg) { width: 40px; height: 40px; }
}

.icon-lib {
  margin-top: 8px; padding: 12px; background: t.$bg;
  border: 1px solid t.$border-strong; border-radius: 8px;
  max-height: 360px; overflow-y: auto;
}
.icon-lib-group + .icon-lib-group { margin-top: 14px; }
.icon-lib-group-title {
  font-size: 11px; font-weight: 600; color: t.$text-3;
  text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px;
}
.icon-lib-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 8px;
}
.icon-lib-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: t.$surface; border: 1px solid t.$border; border-radius: 8px;
  padding: 10px 6px; cursor: pointer; transition: border-color .12s, background .12s;
  font-family: inherit;
  &:hover { border-color: t.$accent; background: t.$surface-2; }
  &.active { border-color: t.$accent; background: t.$accent-dim; }
  :deep(svg) { width: 40px; height: 40px; }
}
.icon-lib-svg { display: block; }
.icon-lib-label {
  font-size: 11px; color: t.$text-3; text-align: center; line-height: 1.2;
}
</style>
