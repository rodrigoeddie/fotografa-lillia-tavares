<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const categoriasOptions = ['corporativo', 'dia-das-maes', 'sensual-intimista', 'aniversario', 'gestante', 'casal'];
const { isEdit, loading, saving, form, init, save } = usePortfolioWorkForm(idParam);
const { adminFetch } = useAdminFetch();

// ─── Rich editor – Local ─────────────────────────────────────────────────────
const localEditorRef = ref<HTMLDivElement | null>(null);
const ESTUDIO_LINK = `<a href="https://fotografalilliatavares.com.br/estudio" target="_blank">Estúdio Lillia Tavares</a>`;

function syncLocal() {
  if (localEditorRef.value) form.local = localEditorRef.value.innerHTML;
}
function insertEstudioLink() {
  if (localEditorRef.value) {
    localEditorRef.value.innerHTML = ESTUDIO_LINK;
    syncLocal();
  }
}
function execCmd(cmd: string) {
  document.execCommand(cmd, false, undefined);
}
function insertLocalLink() {
  const url = prompt('URL do link:');
  if (url && localEditorRef.value) {
    localEditorRef.value.focus();
    document.execCommand('createLink', false, url);
  }
}

// ─── Testimonial selector ────────────────────────────────────────────────────
const depoimentos = ref<any[]>([]);
const selectedDepId = ref<number | null>(null);

async function loadDepoimentos() {
  try {
    depoimentos.value = await adminFetch<any[]>('/api/admin/depoimentos');
  } catch { /* silent */ }
}

function onDepSelect(val: string) {
  const id = val ? Number(val) : null;
  selectedDepId.value = id;
  if (!id) {
    form.depoimento_texto = '';
    form.depoimento_avatar = '';
    form.depoimento_link = '';
    return;
  }
  const dep = depoimentos.value.find(d => d.id === id);
  if (!dep) return;
  form.depoimento_texto = dep.texto ?? '';
  form.depoimento_avatar = dep.foto_cf_id ?? '';
  form.depoimento_link = dep.link ?? '';
}

const selectedDep = computed(() => depoimentos.value.find(d => d.id === selectedDepId.value) ?? null);

// ─── Page URL ────────────────────────────────────────────────────────────────
const pageUrl = computed(() => {
  if (!isEdit.value || !form.categoria || !form.slug) return null;
  const slug = form.slug.includes('/') ? form.slug.split('/').pop() : form.slug;
  return `/ensaio-fotografico/${form.categoria}/${slug}`;
});

// ─── Slug auto-generate ──────────────────────────────────────────────────────
function generateSlug() {
  if (!form.titulo) return;
  const base = form.titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  form.slug = form.categoria ? `${form.categoria}/${base}` : base;
}

// ─── Init ────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await init();
  await loadDepoimentos();
  nextTick(() => {
    if (localEditorRef.value && form.local) {
      localEditorRef.value.innerHTML = form.local;
    }
    if (form.depoimento_texto) {
      const match = depoimentos.value.find(d => d.texto === form.depoimento_texto);
      if (match) selectedDepId.value = match.id;
    }
  });
});
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/portfolio" class="page-back">← Voltar</NuxtLink>
      <h2>
        {{ isEdit ? 'Editar portfolio work' : 'Novo portfolio work' }}
        <a v-if="pageUrl" :href="pageUrl" target="_blank" class="page-link">🔗 Ver página</a>
      </h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>

      <!-- ── Dados do work ───────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Dados do work</h3>
        <div class="form-grid">

          <div class="form-field">
            <label>Slug</label>
            <div class="input-with-btn">
              <input v-model="form.slug" type="text" placeholder="corporativo/nome-cliente" />
              <button class="btn-ghost-sm" type="button" title="Gerar slug a partir do título" @click="generateSlug">↻</button>
            </div>
          </div>

          <div class="form-field">
            <label>Categoria</label>
            <select v-model="form.categoria">
              <option value="">Selecione...</option>
              <option v-for="c in categoriasOptions" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="form-field">
            <label>Título (nome do cliente)</label>
            <input v-model="form.titulo" type="text" />
          </div>

          <div class="form-field">
            <label>Data</label>
            <input v-model="form.data" type="text" placeholder="Maio 2025" />
          </div>

          <div class="form-field form-field--full">
            <label>Local</label>
            <div class="rich-toolbar">
              <button type="button" @click="execCmd('bold')"><b>B</b></button>
              <button type="button" @click="insertLocalLink()">🔗</button>
              <button type="button" class="btn-estudio" @click="insertEstudioLink()">📍 Estúdio</button>
            </div>
            <div
              ref="localEditorRef"
              class="rich-editor rich-editor-single"
              contenteditable="true"
              @input="syncLocal"
            />
          </div>

          <div class="form-field">
            <label>Cor destaque</label>
            <div class="color-field">
              <input v-model="form.cor_destaque" type="color" />
              <input v-model="form.cor_destaque" type="text" class="color-text" maxlength="7" placeholder="#000000" />
            </div>
          </div>

          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>

          <div class="form-field">
            <label>Mostrar na home?</label>
            <div class="switch-row">
              <span>Exibir na home</span>
              <label class="switch">
                <input type="checkbox" v-model="form.home" />
                <span class="slider" />
              </label>
            </div>
          </div>

          <div v-if="form.home" class="form-field">
            <label>Ordem na home</label>
            <input v-model.number="form.home_order" type="number" />
          </div>

          <div class="form-field">
            <label>Ativo?</label>
            <div class="switch-row">
              <span>Visível no site</span>
              <label class="switch">
                <input type="checkbox" v-model="form.ativo" />
                <span class="slider" />
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Depoimento inline ──────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Depoimento inline</h3>
        <div class="form-grid">

          <div class="form-field form-field--full">
            <label>Selecionar depoimento existente</label>
            <select
              :value="selectedDepId ?? ''"
              @change="onDepSelect(($event.target as HTMLSelectElement).value)"
            >
              <option value="">— nenhum / preencher manualmente —</option>
              <option v-for="d in depoimentos" :key="d.id" :value="d.id">{{ d.nome }}</option>
            </select>
            <div v-if="selectedDep" class="dep-preview">
              <img
                v-if="selectedDep.foto_cf_id"
                :src="`https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/${selectedDep.foto_cf_id}/public`"
                class="dep-avatar"
                alt=""
              />
              <div class="dep-info">
                <strong>{{ selectedDep.nome }}</strong>
                <span>{{ '★'.repeat(selectedDep.rating ?? 5) }}</span>
                <p>{{ (selectedDep.texto ?? '').slice(0, 140) }}{{ (selectedDep.texto ?? '').length > 140 ? '…' : '' }}</p>
              </div>
            </div>
          </div>

          <div class="form-field form-field--full">
            <label>Texto do depoimento</label>
            <textarea v-model="form.depoimento_texto" rows="4" />
          </div>

          <div class="form-field">
            <label>Avatar CF ID</label>
            <input v-model="form.depoimento_avatar" type="text" />
          </div>

          <div class="form-field">
            <label>Link (Google Maps)</label>
            <input v-model="form.depoimento_link" type="url" />
          </div>

        </div>
      </div>

      <!-- ── Links e vídeo ──────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Links e vídeo</h3>
        <div class="form-grid">

          <div class="form-field">
            <label>Instagram URI</label>
            <input v-model="form.instagram_uri" type="url" />
          </div>

          <div class="form-field">
            <label>Instagram @label</label>
            <input v-model="form.instagram_title" type="text" />
          </div>

          <div class="form-field form-field--full">
            <label>Site</label>
            <input v-model="form.site" type="url" />
          </div>

          <div class="form-field form-field--full">
            <label>Vídeo (iframe HTML)</label>
            <textarea v-model="form.video" rows="4" class="code-textarea" />
          </div>

        </div>
      </div>

      <!-- ── SEO ────────────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">SEO</h3>
        <div class="form-field">
          <label>Keywords SEO (uma por linha)</label>
          <div v-for="(_, i) in form.seo_keywords" :key="i" class="includes-row">
            <input v-model="form.seo_keywords[i]" type="text" />
            <button class="btn-icon btn-danger" @click="form.seo_keywords.splice(i, 1)">✕</button>
          </div>
          <button class="btn-secondary btn-sm" @click="form.seo_keywords.push('')">+ Keyword</button>
        </div>
      </div>

      <!-- ── Ações ──────────────────────────────────────────────────────── -->
      <div class="form-actions">
        <NuxtLink to="/admin/portfolio" class="btn-secondary">Cancelar</NuxtLink>
        <button
          v-if="isEdit"
          class="btn-secondary"
          @click="router.push(`/admin/portfolio/${idParam}/fotos`)"
        >🖼 Gerenciar fotos</button>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/portfolio'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Criar') }}
        </button>
      </div>

    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.code-textarea { font-family: monospace; font-size: 0.85rem; }
.includes-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; input { flex: 1; } }

// ── Page link (Ver página)
.page-link {
  font-size: 13px;
  font-weight: normal;
  color: #60a5fa;
  text-decoration: none;
  margin-left: 10px;
  &:hover { text-decoration: underline; }
}

// ── Slug + generate button
.input-with-btn { display: flex; gap: 6px; align-items: stretch; input { flex: 1; } }
.btn-ghost-sm {
  background: #2a2a2a;
  border: 1px solid #555;
  color: #aaa;
  border-radius: 6px;
  padding: 0 10px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  &:hover { background: #3a3a3a; color: #eee; }
}

// ── Color field (color picker + hex text)
.color-field {
  display: flex;
  gap: 8px;
  align-items: center;
  input[type="color"] {
    width: 44px;
    height: 44px;
    border: none;
    padding: 2px;
    border-radius: 6px;
    cursor: pointer;
    background: none;
    flex-shrink: 0;
  }
  .color-text { flex: 1; }
}

// ── Switch toggle (from Legacy.vue)
.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  color: #ddd;
  font-size: 14px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 22px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute;
    inset: 0;
    background: #444;
    border-radius: 22px;
    transition: 0.3s;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      height: 16px;
      width: 16px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }
  }
  input:checked + .slider { background: #4ade80; }
  input:checked + .slider::before { transform: translateX(18px); }
}

// ── Rich editor
.rich-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
  button {
    padding: 3px 10px;
    background: #2a2a2a;
    border: 1px solid #444;
    color: #eee;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    &:hover { background: #3a3a3a; }
  }
  .btn-estudio { background: #1e3a5f; border-color: #2563eb; color: #93c5fd; &:hover { background: #1e40af; } }
}
.rich-editor {
  padding: 10px 13px;
  border: 1px solid #999;
  border-radius: 6px;
  min-height: 80px;
  color: white;
  background: transparent;
  font-size: 15px;
  font-family: inherit;
  outline: none;
  &:focus { border-color: #6b7280; }
  a { color: #60a5fa; }
}
.rich-editor-single { min-height: 46px; }

// ── Testimonial preview
.dep-preview {
  display: flex;
  gap: 10px;
  margin-top: 8px;
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 10px 12px;
  align-items: flex-start;
}
.dep-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.dep-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  strong { color: #eee; font-size: 14px; }
  span { color: #f59e0b; font-size: 12px; }
  p { color: #9ca3af; margin: 0; line-height: 1.4; }
}
</style>
