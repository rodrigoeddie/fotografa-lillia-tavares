<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const cfUrl = 'https://imagedelivery.net/oEk64Oj9wn0qdlDuKEONYg/';
const { isEdit, loading, saving, form, init, save } = useBlogPostForm(idParam);
const { adminFetch } = useAdminFetch();

const categoriasOptions = [
  'fotografia-corporativa',
  'cenarios-tematicos',
  'presentes',
  'dicas',
];

// ─── Page URL ────────────────────────────────────────────────────────────────
const pageUrl = computed(() => {
  if (!isEdit.value || !form.categoria || !form.slug) return null;
  return `/blog/${form.categoria}/${form.slug}`;
});

// ─── Slug auto-generate ──────────────────────────────────────────────────────
function generateSlug() {
  if (!form.titulo) return;
  form.slug = form.titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ─── Cover image upload ──────────────────────────────────────────────────────
const coverUploading = ref(false);
async function uploadCover(file: File) {
  coverUploading.value = true;
  const fd = new FormData();
  fd.append('file', file);
  try {
    const result = await adminFetch<{ id: string }>('/api/admin/upload', { method: 'POST', body: fd });
    if (result.id) form.imagem_cf_id = result.id;
  } catch { /* silent */ } finally {
    coverUploading.value = false;
  }
}

// ─── Rich editor – conteudo ───────────────────────────────────────────────────
const conteudoEditorRef = ref<HTMLDivElement | null>(null);
function syncConteudo() {
  if (conteudoEditorRef.value) form.conteudo = conteudoEditorRef.value.innerHTML;
}
function execCmd(cmd: string) { document.execCommand(cmd, false, undefined); }
function execCmdValue(cmd: string, value: string) { document.execCommand(cmd, false, value); }
function insertLink() {
  const url = prompt('URL do link:');
  if (url && conteudoEditorRef.value) {
    conteudoEditorRef.value.focus();
    document.execCommand('createLink', false, url);
  }
}

onMounted(async () => {
  await init();
  nextTick(() => {
    if (conteudoEditorRef.value && form.conteudo) {
      conteudoEditorRef.value.innerHTML = form.conteudo;
    }
  });
});
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/blog" class="page-back">← Voltar</NuxtLink>
      <h2>
        {{ isEdit ? 'Editar post' : 'Novo post' }}
        <a v-if="pageUrl" :href="pageUrl" target="_blank" class="page-link">🔗 Ver página</a>
      </h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>

      <!-- ── Meta ──────────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Meta</h3>
        <div class="form-grid">

          <div class="form-field form-field--full">
            <label>Título</label>
            <input v-model="form.titulo" type="text" @input="!form.slug && generateSlug()" />
          </div>

          <div class="form-field">
            <label>Slug</label>
            <div class="input-with-btn">
              <input v-model="form.slug" type="text" placeholder="meu-post-sobre-ensaio" />
              <button class="btn-ghost-sm" type="button" title="Gerar slug" @click="generateSlug">↻</button>
            </div>
          </div>

          <div class="form-field">
            <label>Categoria</label>
            <select v-model="form.categoria">
              <option value="">Selecione...</option>
              <option v-for="c in categoriasOptions" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>

          <div class="form-field form-field--full">
            <label>Descrição (meta SEO)</label>
            <textarea v-model="form.descricao" rows="3" />
          </div>

          <div class="form-field">
            <label>Data</label>
            <input v-model="form.data" type="date" />
          </div>

          <div class="form-field">
            <label>Ativo?</label>
            <div class="switch-row">
              <span>Publicado</span>
              <label class="switch">
                <input type="checkbox" v-model="form.ativo" />
                <span class="slider" />
              </label>
            </div>
          </div>

        </div>
      </div>

      <!-- ── Imagem capa ────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Imagem de capa</h3>
        <div class="cover-section">
          <div class="cover-preview-wrap">
            <img
              v-if="form.imagem_cf_id && !coverUploading"
              :src="`${cfUrl}${form.imagem_cf_id}/public`"
              class="cover-preview"
              alt=""
            />
            <div v-else-if="coverUploading" class="cover-loading">⏳ Enviando...</div>
            <div v-else class="cover-empty">Sem imagem</div>
          </div>
          <div class="cover-actions">
            <label class="btn-upload">
              {{ coverUploading ? 'Enviando...' : '↑ Upload imagem' }}
              <input
                type="file" accept="image/*" hidden :disabled="coverUploading"
                @change="(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadCover(f); }"
              />
            </label>
            <input v-model="form.imagem_cf_id" type="text" placeholder="ou cole o CF ID..." />
          </div>
        </div>
      </div>

      <!-- ── Conteúdo ────────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">Conteúdo</h3>
        <div class="rich-toolbar">
          <button type="button" @click="execCmd('bold')"><b>B</b></button>
          <button type="button" @click="execCmd('italic')"><i>I</i></button>
          <button type="button" @click="execCmd('underline')"><u>U</u></button>
          <span class="tb-sep">|</span>
          <button type="button" @click="execCmdValue('formatBlock', 'h2')">H2</button>
          <button type="button" @click="execCmdValue('formatBlock', 'h3')">H3</button>
          <button type="button" @click="execCmdValue('formatBlock', 'p')">¶</button>
          <span class="tb-sep">|</span>
          <button type="button" @click="execCmd('insertUnorderedList')">• Lista</button>
          <button type="button" @click="insertLink()">🔗</button>
        </div>
        <div
          ref="conteudoEditorRef"
          class="rich-editor"
          contenteditable="true"
          @input="syncConteudo"
        />
      </div>

      <!-- ── SEO ────────────────────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">SEO</h3>
        <div class="form-field">
          <label>Keywords SEO</label>
          <div v-for="(_, i) in form.seo_keywords" :key="i" class="includes-row">
            <input v-model="form.seo_keywords[i]" type="text" />
            <button class="btn-icon btn-danger" @click="form.seo_keywords.splice(i, 1)">✕</button>
          </div>
          <button class="btn-secondary btn-sm" @click="form.seo_keywords.push('')">+ Keyword</button>
        </div>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/blog" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/blog'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Publicar') }}
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
}

.page-link {
  font-size: 13px; font-weight: normal; color: #60a5fa;
  text-decoration: none; margin-left: 10px;
  &:hover { text-decoration: underline; }
}

// Slug row
.input-with-btn { display: flex; gap: 6px; align-items: stretch; input { flex: 1; } }
.btn-ghost-sm {
  background: #2a2a2a; border: 1px solid #555; color: #aaa;
  border-radius: 6px; padding: 0 10px; cursor: pointer; font-size: 18px; line-height: 1;
  &:hover { background: #3a3a3a; color: #eee; }
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

// Cover
.cover-section { display: flex; gap: 20px; align-items: flex-start; }
.cover-preview-wrap {
  width: 180px; flex-shrink: 0; border-radius: 8px; overflow: hidden;
  background: #1a1a1a; border: 1px solid #333; min-height: 120px;
  display: flex; align-items: center; justify-content: center;
}
.cover-preview { width: 100%; display: block; border-radius: 8px; }
.cover-loading, .cover-empty { font-size: 13px; color: #666; padding: 16px; text-align: center; }
.cover-actions { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.btn-upload {
  display: inline-flex; align-items: center; gap: 6px;
  background: #1e3a5f; border: 1px solid #2563eb; color: #93c5fd;
  padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; align-self: flex-start;
  &:hover { background: #1e40af; }
}

// Rich editor
.rich-toolbar {
  display: flex; gap: 4px; margin-bottom: 4px; flex-wrap: wrap; align-items: center;
  button {
    padding: 3px 10px; background: #2a2a2a; border: 1px solid #444;
    color: #eee; border-radius: 4px; font-size: 13px; cursor: pointer;
    &:hover { background: #3a3a3a; }
  }
}
.tb-sep { color: #444; padding: 0 2px; font-size: 16px; }
.rich-editor {
  padding: 12px 14px; border: 1px solid #999; border-radius: 6px;
  min-height: 320px; color: white; background: transparent;
  font-size: 15px; font-family: inherit; outline: none; line-height: 1.7;
  &:focus { border-color: #6b7280; }
  h2 { font-size: 1.4em; font-weight: 600; margin: 1em 0 0.4em; }
  h3 { font-size: 1.2em; font-weight: 600; margin: 0.8em 0 0.3em; }
  a { color: #60a5fa; }
  ul { padding-left: 1.4em; }
  li { margin-bottom: 4px; }
}

.includes-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; input { flex: 1; } }
</style>
