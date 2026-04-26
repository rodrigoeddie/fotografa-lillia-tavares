<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, pacotes, addPacote, removePacote, init, save } = useProdutoForm(idParam);

// ─── Collapse state ──────────────────────────────────────────────────────────
const collapsed = ref<Set<number>>(new Set());
function toggleCollapse(i: number) {
  const s = new Set(collapsed.value);
  s.has(i) ? s.delete(i) : s.add(i);
  collapsed.value = s;
}

// ─── Drag to reorder pacotes ─────────────────────────────────────────────────
const dragIdx = ref<number | null>(null);
const dragOverIdx = ref<number | null>(null);
function onDragStart(i: number) { dragIdx.value = i; }
function onDragOver(e: DragEvent, i: number) { e.preventDefault(); dragOverIdx.value = i; }
function onDragEnd() {
  if (dragIdx.value !== null && dragOverIdx.value !== null && dragIdx.value !== dragOverIdx.value) {
    const [moved] = pacotes.value.splice(dragIdx.value, 1);
    if (moved) pacotes.value.splice(dragOverIdx.value, 0, moved);
  }
  dragIdx.value = null; dragOverIdx.value = null;
}

function addAndExpand() {
  const prevLen = pacotes.value.length;
  addPacote();
  nextTick(() => {
    collapsed.value = new Set(Array.from({ length: prevLen }, (_, i) => i));
  });
}

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/investimento" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar produto' : 'Novo produto' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>

      <!-- ── Dados gerais ─────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Dados gerais</h3>
        <div class="form-grid">

          <div class="form-field">
            <label>Slug (URL)</label>
            <input v-model="form.slug" type="text" placeholder="corporativo" />
          </div>
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.title" type="text" placeholder="Ensaio Corporativo" />
          </div>
          <div class="form-field">
            <label>Slug LP (landing page)</label>
            <input v-model="form.lp_slug" type="text" placeholder="corporativo" />
          </div>
          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>
          <div class="form-field form-field--full">
            <label>Descrição</label>
            <textarea v-model="form.description" rows="3" />
          </div>
          <div class="form-field form-field--full">
            <label>Ícone <small>(SVG ou emoji)</small></label>
            <textarea v-model="form.icon" rows="3" placeholder="<svg ...> ou 🎉" />
            <div v-if="form.icon" class="icon-preview" v-html="form.icon" />
          </div>
          <div class="form-field">
            <label>Ativo</label>
            <div class="switch-row">
              <span>Produto ativo</span>
              <label class="switch">
                <input type="checkbox" v-model="form.active" />
                <span class="slider" />
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- ── CTA ─────────────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">CTA (chamada para ação)</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Título CTA</label>
            <input v-model="form.cta_title" type="text" />
          </div>
          <div class="form-field">
            <label>Descrição CTA</label>
            <input v-model="form.cta_description" type="text" />
          </div>
          <div class="form-field form-field--full">
            <label>Mensagem WhatsApp</label>
            <input v-model="form.cta_whatsapp_msg" type="text" />
          </div>
        </div>
      </div>

      <!-- ── O que está incluso ──────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">O que está incluso</h3>
        <div class="features-list">
          <div v-for="(_, i) in form.includes" :key="i" class="feature-row">
            <span class="bullet">•</span>
            <input v-model="form.includes[i]" type="text" placeholder="Ex: 5 fotos editadas" />
            <button class="btn-remove-sm" @click="form.includes.splice(i, 1)" title="Remover">✕</button>
          </div>
          <p v-if="form.includes.length === 0" class="empty-hint">Nenhum item.</p>
        </div>
        <button class="btn-add-dashed" @click="form.includes.push('')">+ Adicionar item</button>
      </div>

      <!-- ── Pacotes ─────────────────────────────────────────────────────── -->
      <div class="form-card">
        <div class="section-header">
          <h3 class="form-section-title">
            Pacotes
            <span class="count-badge">{{ pacotes.length }}</span>
          </h3>
          <button class="btn-secondary btn-sm" @click="addAndExpand">+ Adicionar pacote</button>
        </div>

        <div class="pacotes-list" @dragover.prevent @drop.prevent="onDragEnd">
          <div
            v-for="(pacote, pi) in pacotes" :key="pi"
            class="pacote-card"
            :class="{ 'drag-over': dragOverIdx === pi, 'is-recommended': pacote.is_recommended }"
            draggable="true"
            @dragstart="onDragStart(pi)"
            @dragover="(e) => onDragOver(e, pi)"
          >
            <!-- Header -->
            <div class="pacote-card-header" @click="toggleCollapse(pi)">
              <span class="drag-handle">⠿</span>
              <span class="pkg-collapse">{{ collapsed.has(pi) ? '▸' : '▾' }}</span>
              <span class="pkg-title">{{ pacote.title || 'Sem título' }}</span>
              <span class="pkg-price">R$ {{ pacote.preco }}</span>
              <span v-if="pacote.is_recommended" class="pkg-badge">★ Recomendado</span>
              <button class="btn-remove-sm" type="button" @click.stop="removePacote(pi)" title="Remover">✕</button>
            </div>

            <!-- Body -->
            <div v-show="!collapsed.has(pi)" class="pacote-card-body">
              <div class="form-grid">
                <div class="form-field">
                  <label>Título</label>
                  <input v-model="pacote.title" type="text" />
                </div>
                <div class="form-field">
                  <label>Subtítulo</label>
                  <input v-model="pacote.subtitle" type="text" />
                </div>
                <div class="form-field">
                  <label>Preço (R$)</label>
                  <input v-model.number="pacote.preco" type="number" step="0.01" />
                </div>
                <div class="form-field">
                  <label>Nº parcelas</label>
                  <input v-model.number="pacote.num_parcelas" type="number" />
                </div>
                <div class="form-field">
                  <label>Preço por parcela</label>
                  <input v-model.number="pacote.preco_parcelas" type="number" step="0.01" />
                </div>
                <div class="form-field">
                  <label>Fotos incluídas</label>
                  <input v-model.number="pacote.fotos_incluidas" type="number" />
                </div>
                <div class="form-field">
                  <label>Preço foto extra (R$)</label>
                  <input v-model.number="pacote.preco_foto_extra" type="number" step="0.01" />
                </div>
                <div class="form-field">
                  <label>Recomendado?</label>
                  <div class="switch-row">
                    <span>Destacar como recomendado</span>
                    <label class="switch">
                      <input type="checkbox" v-model="pacote.is_recommended" />
                      <span class="slider" />
                    </label>
                  </div>
                </div>
              </div>

              <div class="pkg-features">
                <div class="pkg-features-header">
                  <label>Itens incluídos</label>
                  <button class="btn-add-small" @click="pacote.features.push('')">+ item</button>
                </div>
                <div class="features-list">
                  <div v-for="(_, fi) in pacote.features" :key="fi" class="feature-row">
                    <span class="bullet">•</span>
                    <input v-model="pacote.features[fi]" type="text" placeholder="Ex: 5 fotos editadas" />
                    <button class="btn-remove-sm" @click="pacote.features.splice(fi, 1)" title="Remover">✕</button>
                  </div>
                  <p v-if="pacote.features.length === 0" class="empty-hint">Nenhum item.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p v-if="pacotes.length === 0" class="empty-hint">Nenhum pacote adicionado.</p>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/investimento" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/investimento'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '💾 Criar produto') }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-section-title {
  font-size: 13px; font-weight: 600; color: #9ca3af;
  text-transform: uppercase; letter-spacing: 0.05em; margin: 0;
  display: flex; align-items: center; gap: 8px;
}

// Icon preview
.icon-preview {
  margin-top: 8px; padding: 12px; background: #111; border-radius: 6px;
  display: flex; align-items: center; gap: 8px;
  font-size: 32px;
  svg { width: 40px; height: 40px; }
}

// Switch
.switch-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; color: #ddd; font-size: 14px; }
.switch {
  position: relative; display: inline-block; width: 40px; height: 22px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; inset: 0; background: #444; border-radius: 22px; transition: 0.3s; cursor: pointer;
    &::before { content: ''; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
  }
  input:checked + .slider { background: #4ade80; }
  input:checked + .slider::before { transform: translateX(18px); }
}

// Section header
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }

// Features list
.features-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 8px; }
.feature-row { display: flex; align-items: center; gap: 6px; input { flex: 1; } }
.bullet { color: #9ca3af; font-size: 16px; flex-shrink: 0; }
.btn-remove-sm {
  background: none; border: none; color: #555; font-size: 13px; cursor: pointer;
  padding: 2px 6px; border-radius: 4px; flex-shrink: 0;
  &:hover { background: #3a1a1a; color: #f87171; }
}

// Pacote cards
.pacotes-list { display: flex; flex-direction: column; gap: 8px; }
.pacote-card {
  background: #141414; border: 1px solid #2a2a2a; border-radius: 8px;
  overflow: hidden; transition: border-color 0.15s;
  &.drag-over { border-color: #60a5fa; }
  &.is-recommended { border-color: #a16207; }
}
.pacote-card-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 14px;
  cursor: pointer; user-select: none;
  &:hover { background: #1a1a1a; }
}
.drag-handle { font-size: 16px; color: #444; cursor: grab; flex-shrink: 0; &:active { cursor: grabbing; } }
.pkg-collapse { font-size: 12px; color: #666; flex-shrink: 0; }
.pkg-title { flex: 1; font-size: 14px; font-weight: 500; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pkg-price { font-size: 13px; color: #9ca3af; flex-shrink: 0; }
.pkg-badge { background: #78350f; color: #fcd34d; font-size: 11px; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
.pacote-card-body { padding: 14px; border-top: 1px solid #222; }

// Features sub-section
.pkg-features { margin-top: 12px; }
.pkg-features-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; label { font-size: 13px; color: #9ca3af; font-weight: 500; } }
.btn-add-small {
  background: #1a1a1a; border: 1px solid #333; color: #888; font-size: 12px;
  padding: 4px 10px; border-radius: 4px; cursor: pointer;
  &:hover { color: #60a5fa; border-color: #60a5fa; }
}

// Dashed add
.btn-add-dashed {
  background: none; border: 1px dashed #444; color: #888; width: 100%;
  padding: 10px; border-radius: 6px; font-size: 13px; cursor: pointer; margin-top: 8px;
  &:hover { border-color: #60a5fa; color: #60a5fa; }
}
</style>
