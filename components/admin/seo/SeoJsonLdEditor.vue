<script setup lang="ts">
import type { JsonLdType } from '~/shared/schemas/seo';

const props = defineProps<{
  type: JsonLdType | null;
  data: string;
}>();
const emit = defineEmits<{
  (e: 'update:type', v: JsonLdType | null): void;
  (e: 'update:data', v: string): void;
}>();

const JSONLD_TYPES: JsonLdType[] = [
  'WebPage', 'Article', 'BlogPosting', 'Service', 'LocalBusiness',
  'FAQPage', 'BreadcrumbList', 'ImageGallery', 'CollectionPage',
  'Person', 'Organization', 'custom',
];

const localData = ref(props.data ?? '');
const jsonError = ref('');

watch(() => props.data, (v) => { localData.value = v ?? ''; });

function onTypeChange(e: Event) {
  const value = (e.target as HTMLSelectElement).value;
  emit('update:type', value ? (value as JsonLdType) : null);
}

function onDataBlur() {
  jsonError.value = '';
  if (localData.value.trim()) {
    try {
      JSON.parse(localData.value);
    } catch (e: any) {
      jsonError.value = `JSON inválido: ${e.message}`;
      return;
    }
  }
  emit('update:data', localData.value);
}

function format() {
  if (!localData.value.trim()) return;
  try {
    localData.value = JSON.stringify(JSON.parse(localData.value), null, 2);
    jsonError.value = '';
    emit('update:data', localData.value);
  } catch (e: any) {
    jsonError.value = `JSON inválido: ${e.message}`;
  }
}
</script>

<template>
  <div class="jsonld-editor">
    <div class="row">
      <label>Tipo</label>
      <select :value="type ?? ''" @change="onTypeChange">
        <option value="">— Nenhum —</option>
        <option v-for="t in JSONLD_TYPES" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <div class="row">
      <label>
        Dados JSON
        <button type="button" class="btn-format" @click="format" title="Formatar">⊞</button>
      </label>
      <textarea
        v-model="localData"
        rows="6"
        placeholder='{"name":"...","description":"..."}'
        @blur="onDataBlur"
      ></textarea>
      <small v-if="jsonError" class="err">{{ jsonError }}</small>
      <small v-else class="hint">Será mesclado com {{ '{ "@context": "https://schema.org", "@type": "...", ...dados }' }}</small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.jsonld-editor {
  display: flex;
  flex-direction: column;
  gap: 12rem;
}

.row {
  display: flex;
  flex-direction: column;
  gap: 4rem;

  label {
    font-size: 13rem;
    color: #ccc;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

select, textarea {
  background: #222;
  color: #eee;
  border: 1rem solid #444;
  border-radius: 4rem;
  padding: 8rem;
  font-size: 13rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #60a5fa;
  }
}

textarea {
  font-family: 'Fira Code', monospace;
  font-size: 12rem;
  resize: vertical;
}

.btn-format {
  background: #333;
  color: #aaa;
  border: 1rem solid #444;
  border-radius: 4rem;
  padding: 2rem 6rem;
  cursor: pointer;
  font-size: 12rem;
  &:hover { background: #444; color: #fff; }
}

.err {
  color: #f87171;
  font-size: 12rem;
}

.hint {
  color: #666;
  font-size: 11rem;
}
</style>
