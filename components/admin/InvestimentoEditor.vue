<script lang="ts" setup>
interface Package {
  title: string;
  subtitle?: string;
  price: number;
  numParcelas: number;
  priceParcelas: number;
  features: string[];
  isRecommended: boolean;
}

interface Cta {
  title: string;
  description: string;
  whatsappMessage: string;
}

interface InvestimentoData {
  active: boolean;
  icon: string;
  title: string;
  description: string;
  packages: Package[];
  includes: string[];
  cta: Cta;
  lp?: string;
}

const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const currentPath = ref('');
const data = ref<InvestimentoData | null>(null);
const loading = ref(false);
const saving = ref(false);
const collapsedPackages = ref(new Set<number>());
const pkgDragIdx = ref<number | null>(null);
const pkgDragOverIdx = ref<number | null>(null);

async function openFile(path: string) {
  currentPath.value = path;
  loading.value = true;
  data.value = null;
  collapsedPackages.value = new Set();
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw`, { params: { path, _t: Date.now() } });
    data.value = JSON.parse(res.content);
  } catch (e: any) {
    props.showMessage('Erro ao carregar arquivo: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!data.value) return;
  saving.value = true;
  try {
    await $fetch('/api/fs/raw', {
      method: 'POST',
      body: { path: currentPath.value, content: JSON.stringify(data.value, null, 2) },
    });
    props.showMessage('Salvo com sucesso!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

// ─── Package management ───────────────────────────────────────────────────────

function togglePackage(i: number) {
  if (collapsedPackages.value.has(i)) collapsedPackages.value.delete(i);
  else collapsedPackages.value.add(i);
}

async function addPackage() {
  if (!data.value) return;
  data.value.packages.push({
    title: 'Novo Pacote',
    subtitle: '',
    price: 0,
    numParcelas: 3,
    priceParcelas: 0,
    features: [],
    isRecommended: false,
  });
  await nextTick();
  const cards = document.querySelectorAll('.pkg-card');
  cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removePackage(i: number) {
  data.value?.packages.splice(i, 1);
}

function addFeature(pkgIdx: number) {
  data.value?.packages[pkgIdx]?.features.push('');
}

function removeFeature(pkgIdx: number, fIdx: number) {
  data.value?.packages[pkgIdx]?.features.splice(fIdx, 1);
}

function onPkgDragStart(i: number) { pkgDragIdx.value = i; }
function onPkgDragOver(e: DragEvent, i: number) { e.preventDefault(); pkgDragOverIdx.value = i; }
function onPkgDrop() {
  if (pkgDragIdx.value !== null && pkgDragOverIdx.value !== null && data.value) {
    const [moved] = data.value.packages.splice(pkgDragIdx.value, 1);
    if (moved) data.value.packages.splice(pkgDragOverIdx.value, 0, moved);
  }
  pkgDragIdx.value = null;
  pkgDragOverIdx.value = null;
}

// ─── Includes management ─────────────────────────────────────────────────────

function addInclude() { data.value?.includes.push(''); }
function removeInclude(i: number) { data.value?.includes.splice(i, 1); }

defineExpose({ openFile });
</script>

<template>
  <div class="inv-editor">
    <div v-if="loading" class="inv-loading">Carregando...</div>

    <template v-else-if="data">
      <!-- Header -->
      <div class="inv-header">
        <div class="inv-header-info">
          <div class="inv-title-row">
            <h2>{{ data.title }}</h2>
            <label class="inv-active-toggle" :class="{ active: data.active }">
              <input type="checkbox" v-model="data.active" />
              {{ data.active ? 'Ativo' : 'Inativo' }}
            </label>
          </div>
          <p class="inv-path">{{ currentPath }}</p>
        </div>
        <button class="btn-save" @click="save" :disabled="saving">
          {{ saving ? 'Salvando...' : '💾 Salvar' }}
        </button>
      </div>

      <!-- Info Section -->
      <section class="inv-section">
        <h3 class="inv-section-title">Informações</h3>
        <div class="inv-fields">
          <div class="inv-field">
            <label>Título</label>
            <input v-model="data.title" type="text" placeholder="Título da categoria" />
          </div>
          <div class="inv-field">
            <label>Descrição</label>
            <textarea v-model="data.description" rows="3" placeholder="Descrição da categoria"></textarea>
          </div>
          <div class="inv-field">
            <label>Slug LP <small>(ex: corporativo)</small></label>
            <input v-model="data.lp" type="text" placeholder="slug-da-lp" />
          </div>
          <div class="inv-field">
            <label>Ícone <small>(SVG ou emoji)</small></label>
            <textarea v-model="data.icon" rows="4" class="icon-textarea" placeholder="<svg>...</svg> ou 🎉"></textarea>
            <div v-if="data.icon" class="icon-preview" v-html="data.icon"></div>
          </div>
        </div>
      </section>

      <!-- Packages Section -->
      <section class="inv-section">
        <div class="inv-section-header">
          <h3 class="inv-section-title">Pacotes <span class="count-badge">{{ data.packages.length }}</span></h3>
          <button class="btn-add" @click="addPackage">+ Adicionar pacote</button>
        </div>

        <div class="pkg-list" @dragover.prevent @drop.prevent="onPkgDrop">
          <div
            v-for="(pkg, pi) in data.packages"
            :key="pi"
            class="pkg-card"
            :class="{ 'pkg-drag-over': pkgDragOverIdx === pi, 'pkg-recommended': pkg.isRecommended }"
            draggable="true"
            @dragstart="onPkgDragStart(pi)"
            @dragover.prevent="(e) => onPkgDragOver(e, pi)"
          >
            <!-- Package header -->
            <div class="pkg-card-header" @click="togglePackage(pi)">
              <span class="drag-handle">⠿</span>
              <span class="pkg-collapse-icon">{{ collapsedPackages.has(pi) ? '▸' : '▾' }}</span>
              <span class="pkg-name">{{ pkg.title || 'Sem título' }}</span>
              <span class="pkg-price">R$ {{ pkg.price }}</span>
              <span v-if="pkg.isRecommended" class="pkg-badge">★ Recomendado</span>
              <button class="btn-remove-pkg" @click.stop="removePackage(pi)" title="Remover pacote">✕</button>
            </div>

            <!-- Package body -->
            <div v-if="!collapsedPackages.has(pi)" class="pkg-card-body">
              <div class="pkg-fields-grid">
                <div class="inv-field">
                  <label>Título</label>
                  <input v-model="pkg.title" type="text" placeholder="Nome do pacote" />
                </div>
                <div class="inv-field">
                  <label>Subtítulo</label>
                  <input v-model="pkg.subtitle" type="text" placeholder="Subtítulo" />
                </div>
                <div class="inv-field">
                  <label>Preço (R$)</label>
                  <input v-model.number="pkg.price" type="number" min="0" step="1" />
                </div>
                <div class="inv-field">
                  <label>Nº Parcelas</label>
                  <input v-model.number="pkg.numParcelas" type="number" min="1" max="24" />
                </div>
                <div class="inv-field">
                  <label>Valor da Parcela (R$)</label>
                  <input v-model.number="pkg.priceParcelas" type="number" min="0" step="1" />
                </div>
                <div class="inv-field">
                  <label>Pacote recomendado</label>
                  <label class="switch">
                    <input type="checkbox" v-model="pkg.isRecommended" />
                    <span class="switch-track"><span class="switch-thumb"></span></span>
                    <span class="switch-label">{{ pkg.isRecommended ? 'Sim' : 'Não' }}</span>
                  </label>
                </div>
              </div>

              <!-- Features -->
              <div class="pkg-features">
                <div class="pkg-features-header">
                  <label>Itens incluídos</label>
                  <button class="btn-add-small" @click="addFeature(pi)">+ item</button>
                </div>
                <div class="feature-list">
                  <div v-for="(feat, fi) in pkg.features" :key="fi" class="feature-row">
                    <span class="feature-bullet">•</span>
                    <input
                      v-model="pkg.features[fi]"
                      type="text"
                      class="feature-input"
                      placeholder="Ex: 5 fotos editadas"
                    />
                    <button class="btn-remove-item" @click="removeFeature(pi, fi)" title="Remover">✕</button>
                  </div>
                  <p v-if="pkg.features.length === 0" class="empty-hint">Nenhum item. Clique em "+ item" para adicionar.</p>
                </div>
              </div>
            </div>
          </div>

          <p v-if="data.packages.length === 0" class="empty-hint">Nenhum pacote. Clique em "+ Adicionar pacote".</p>
        </div>
      </section>

      <!-- Includes Section -->
      <section class="inv-section">
        <div class="inv-section-header">
          <h3 class="inv-section-title">O que está incluso <span class="count-badge">{{ data.includes.length }}</span></h3>
          <button class="btn-add" @click="addInclude">+ Adicionar item</button>
        </div>
        <div class="includes-list">
          <div v-for="(item, ii) in data.includes" :key="ii" class="include-row">
            <span class="feature-bullet">•</span>
            <input
              v-model="data.includes[ii]"
              type="text"
              class="feature-input"
              placeholder="Ex: Fotos digitais em alta resolução"
            />
            <button class="btn-remove-item" @click="removeInclude(ii)" title="Remover">✕</button>
          </div>
          <p v-if="data.includes.length === 0" class="empty-hint">Nenhum item.</p>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="inv-section">
        <h3 class="inv-section-title">CTA (Chamada para ação)</h3>
        <div class="inv-fields">
          <div class="inv-field">
            <label>Título</label>
            <input v-model="data.cta.title" type="text" placeholder="Título do CTA" />
          </div>
          <div class="inv-field">
            <label>Descrição</label>
            <textarea v-model="data.cta.description" rows="2" placeholder="Descrição do CTA"></textarea>
          </div>
          <div class="inv-field">
            <label>Mensagem WhatsApp</label>
            <input v-model="data.cta.whatsappMessage" type="text" placeholder="Olá! Gostaria de agendar..." />
          </div>
        </div>
      </section>

      <!-- Footer save -->
      <div class="inv-footer">
        <button class="btn-save btn-save--lg" @click="save" :disabled="saving">
          {{ saving ? 'Salvando...' : '💾 Salvar alterações' }}
        </button>
      </div>
    </template>

    <div v-else class="inv-empty">Selecione um arquivo de investimento na barra lateral.</div>
  </div>
</template>

<style lang="scss" scoped>
.icon-preview {
    width: 100rem;
}

.inv-editor {
  max-width: 900px;
}

.inv-loading,
.inv-empty {
  text-align: center;
  color: #888;
  padding: 60px 20px;
  font-size: 15px;
}

/* Header */
.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #2a2a2a;
}

.inv-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;

  h2 { font-size: 22px; color: #eee; }
}

.inv-path { font-size: 12px; color: #555; }

.inv-active-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: #2a1a1a;
  color: #f87171;
  border: 1px solid #5a2a2a;

  &.active {
    background: #1a3a1a;
    color: #4ade80;
    border-color: #2a5a2a;
  }

  input { display: none; }
}

/* Sections */
.inv-section {
  margin-bottom: 32px;
  background: #161616;
  border: 1px solid #222;
  border-radius: 10px;
  padding: 20px;
}

.inv-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.inv-section-title {
  font-size: 15px;
  font-weight: 600;
  color: #ccc;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  background: #1e3a5a;
  color: #60a5fa;
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 10px;
  font-weight: 700;
}

/* Fields */
.inv-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.inv-field {
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: 12px;
    color: #888;
    font-weight: 500;
    small { color: #555; margin-left: 4px; }
  }

  input, textarea {
    background: #1a1a1a;
    border: 1px solid #333;
    color: #eee;
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 13px;
    font-family: inherit;
    resize: vertical;
    &:focus { outline: none; border-color: #3b82f6; }
  }

  // (checkbox variant removed — using .switch instead)
}

.icon-textarea { font-family: 'Fira Code', monospace; font-size: 12px; }

/* Packages */
.pkg-list { display: flex; flex-direction: column; gap: 10px; }

.pkg-card {
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  overflow: hidden;
  background: #111;

  &.pkg-drag-over { border-color: #3b82f6; }
  &.pkg-recommended { border-color: #d97706; }
}

.pkg-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  background: #1a1a1a;
  user-select: none;
  &:hover { background: #202020; }
}

.drag-handle { color: #555; cursor: grab; font-size: 16px; flex-shrink: 0; }
.pkg-collapse-icon { font-size: 10px; color: #666; width: 12px; flex-shrink: 0; }
.pkg-name { flex: 1; font-size: 13px; font-weight: 600; color: #eee; }
.pkg-price { font-size: 13px; color: #4ade80; margin-right: 4px; }
.pkg-badge {
  font-size: 11px; background: #78350f; color: #fcd34d; padding: 2px 8px; border-radius: 10px;
}

.btn-remove-pkg {
  background: none; border: none; color: #555; cursor: pointer; font-size: 13px; padding: 2px 4px;
  &:hover { color: #f87171; }
}

.pkg-card-body {
  padding: 16px;
  border-top: 1px solid #222;
}

.pkg-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
}

/* Features / Includes */
.pkg-features { margin-top: 8px; }

.pkg-features-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  label { font-size: 12px; color: #888; font-weight: 500; }
}

.feature-list,
.includes-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-row,
.include-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.feature-bullet { color: #555; font-size: 14px; flex-shrink: 0; }

.feature-input {
  flex: 1;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 6px 8px;
  border-radius: 5px;
  font-size: 12px;
  &:focus { outline: none; border-color: #3b82f6; }
}

.btn-remove-item {
  background: none; border: none; color: #444; cursor: pointer; font-size: 12px; padding: 2px 4px; border-radius: 3px; flex-shrink: 0;
  &:hover { color: #f87171; background: #2a1a1a; }
}

.empty-hint { font-size: 12px; color: #555; padding: 8px 0; font-style: italic; }

/* Save buttons */
.btn-save {
  background: #1e40af;
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  &:hover:not(:disabled) { background: #2563eb; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &--lg { padding: 11px 32px; font-size: 14px; }
}

.btn-add {
  background: #1a2a1a;
  border: 1px solid #2a4a2a;
  color: #4ade80;
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  &:hover { background: #1f331f; }
}

.btn-add-small {
  background: #1a2a1a;
  border: 1px solid #2a4a2a;
  color: #4ade80;
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 11px;
  cursor: pointer;
  &:hover { background: #1f331f; }
}

.inv-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 8px;
  border-top: 1px solid #222;
  margin-top: 8px;
}

/* Switch toggle */
.switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  input { display: none; }
}

.switch-track {
  position: relative;
  width: 40px;
  height: 22px;
  background: #333;
  border-radius: 11px;
  transition: background 0.2s;
  flex-shrink: 0;

  .switch input:checked ~ & { background: #2563eb; }
}

.switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;

  .switch input:checked ~ .switch-track & { transform: translateX(18px); }
}

.switch-label {
  font-size: 13px;
  color: #888;
  min-width: 24px;

  .switch input:checked ~ & { color: #60a5fa; }
}
</style>
