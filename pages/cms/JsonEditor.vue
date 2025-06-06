<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import { useRuntimeConfig } from '#app';

const props = defineProps({
  modelValue: {
    type: [Object, Array],
    required: true,
  },
  parentKeyPath: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const config = useRuntimeConfig();

const localData = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

function getType(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function useTextarea(key) {
  const textareaKeys = ['description', 'alt', 'local'];
  return textareaKeys.includes(key.toLowerCase());
}

function useColorPicker(key) {
  const colorPickerKeys = ['color', 'backgroundcolor', 'bordercolor', 'highlightcolor', 'primarycolor', 'secondarycolor'];
  return colorPickerKeys.includes(key.toLowerCase().replace(/\s+/g, ''));
}

const sectionComputedProperties = computed(() => {
  const styles = {};
  let customClassValue = '';

  if (getType(props.modelValue) === 'object') {
    // Background Image
    if (props.modelValue.imageId && typeof props.modelValue.imageId === 'string') {
      const cloudflareBaseUri = config.public.cloudflareURI || 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/';
      const imageVariant = 'public';
      const imageUrl = `${cloudflareBaseUri.replace(/\/$/, '')}/${props.modelValue.imageId}/${imageVariant}`;
      styles.backgroundImage = `url('${imageUrl}')`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center center';
      styles.backgroundRepeat = 'no-repeat';
      styles.padding = '15px';
      styles.borderRadius = '6px';
    }

    // Custom Class
    if (props.modelValue.customClass && typeof props.modelValue.customClass === 'string') {
      customClassValue = props.modelValue.customClass.trim();
    }
  }
  return { styles, customClass: customClassValue };
});

</script>

<template>
  <div
    class="json-editor-level"
    :style="sectionComputedProperties.styles"
  >
    <div v-if="getType(localData) === 'object'">
      <div v-for="(value, key) in localData" :key="key" class="form-group">
        <label :for="`${parentKeyPath}${key}`" class="form-label">{{ key }}:</label>

        <input
          v-if="getType(value) === 'string' && useColorPicker(key)"
          :id="`${parentKeyPath}${key}`"
          v-model="localData[key]"
          type="color"
          class="form-control form-control-color"
        />
        <input
          v-else-if="getType(value) === 'string' && !useTextarea(key) && !useColorPicker(key)"
          :id="`${parentKeyPath}${key}`"
          v-model="localData[key]"
          type="text"
          class="form-control"
        />
        <textarea
          v-else-if="getType(value) === 'string' && useTextarea(key)"
          :id="`${parentKeyPath}${key}`"
          v-model="localData[key]"
          class="form-control textarea"
          rows="5"
        ></textarea>
        <input
          v-else-if="getType(value) === 'number'"
          :id="`${parentKeyPath}${key}`"
          v-model.number="localData[key]"
          type="number"
          class="form-control"
        />
        <div v-else-if="getType(value) === 'boolean'" class="form-check">
          <input
            :id="`${parentKeyPath}${key}`"
            v-model="localData[key]"
            type="checkbox"
            class="form-check-input"
          />
          <label :for="`${parentKeyPath}${key}`" class="form-check-label">{{ localData[key] ? 'True' : 'False' }}</label>
        </div>
        <div v-else-if="getType(value) === 'object'" class="nested-editor">
          <JsonEditor v-model="localData[key]" :parentKeyPath="`${parentKeyPath}${key}.`" />
        </div>
        <div v-else-if="getType(value) === 'array'" class="array-editor">
          <div v-for="(item, index) in localData[key]" :key="index" :class="'array-item '+localData[key][index].customClass">
            <h4 class="array-item-title">Item {{ index + 1 }}</h4>
            <JsonEditor v-if="getType(item) === 'object'" v-model="localData[key][index]" :parentKeyPath="`${parentKeyPath}${key}[${index}].`" />
            <input v-else v-model="localData[key][index]" class="form-control" placeholder="Array item value" />
          </div>
        </div>
        <span v-else class="unsupported-type">Unsupported type for key: {{ key }} ({{ getType(value) }})</span>
      </div>
    </div>
    <div v-else-if="getType(localData) === 'array'">
      <div v-for="(item, index) in localData" :key="index" class="array-item">
         <h4 class="array-item-title">Item {{ index + 1 }}</h4>
         <JsonEditor v-if="getType(item) === 'object'" v-model="localData[index]" :parentKeyPath="`${parentKeyPath}[${index}].`" />
         <input v-else v-model="localData[index]" class="form-control" placeholder="Array item value" />
      </div>
    </div>
     <div v-else class="unsupported-root">
      JsonEditor expects an Object or Array as root. Received: {{ getType(localData) }}
    </div>
  </div>
</template>

<style scoped>
.json-editor-level {
  padding-left: 0;
  color: #333;
  font-size: 20rem; /* Kept as per request */
}

.form-group {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0;
  margin-right: 15px;
  color: #555;
  font-size: 0.95em;
  text-transform: capitalize;
  width: 180px;
  flex-shrink: 0;
}

.form-control {
  flex-grow: 1;
  min-width: 200px;
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-control-color {
  padding: 2px;
  height: 40px;
  min-width: 100px;
  flex-grow: 0;
  width: auto;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.textarea {
  min-height: 100px;
  resize: vertical;
}

.form-check {
  display: flex;
  align-items: center;
  flex-grow: 1;
  padding-top: 5px;
  padding-bottom: 5px;
}

.form-check-input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  margin-right: 10px;
  transition: background-color 0.2s, border-color 0.2s;
}

.form-check-input:checked {
  background-color: #007bff;
  border-color: #007bff;
}

.form-check-input:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.form-check-input:focus {
  outline: none;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-check-label {
  font-weight: normal;
  color: #333;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0;
}

.nested-editor,
.array-editor {
  margin-top: 15px;
  width: 100%;
  flex-basis: 100%;
  padding: 15px;
  border: 1px dashed #b0bec5;
  border-radius: 4px;
  background-color: rgba(252, 252, 252, 0.9); /* Slightly transparent */
}

.array-item {
  padding: 15px;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  margin-bottom: 15px;
  background-color: rgba(248, 249, 250, 0.9); /* Slightly transparent */
}
.array-item-title {
    font-size: 1.1em;
    color: #37474f;
    margin-bottom: 10px;
    border-bottom: 1px solid #eceff1;
    padding-bottom: 5px;
}

.unsupported-type, .unsupported-root {
  color: #e53935;
  font-style: italic;
  margin-top: 5px;
  display: block;
  flex-basis: 100%;
  background-color: rgba(255,255,255,0.7); /* Make text more readable on a BG image */
  padding: 5px;
  border-radius: 3px;
}

.array-editor {
  display: flex;
  flex-wrap: wrap;
}
.array-item {
  width: 100%;
}
.w25 {
  width: 25%;
}
.w33 {
  width: 33%;
}
.w50 {
  width: 50%;
}
</style>