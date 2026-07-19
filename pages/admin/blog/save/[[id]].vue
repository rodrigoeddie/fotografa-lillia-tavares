<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const cfImg = useCfImg();
const { isEdit, loading, saving, form, init, save } = useBlogPostForm(idParam);
const { adminFetch } = useAdminFetch();
const { resizeImage } = useImageResize();

const seoEditorRef = ref<{ save: () => Promise<number | null> } | null>(null);

async function onSaved() {
  await seoEditorRef.value?.save();
  router.push('/admin/blog');
}

const categoriasOptions = ref<{ slug: string; titulo: string }[]>([]);
const portfolioCategoriasOptions = ref<{ slug: string; titulo: string }[]>([]);

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
  const resized = await resizeImage(file);
  const fd = new FormData();
  fd.append('file', resized, resized.name);
  try {
    const result = await adminFetch<{ id: string }>('/api/admin/upload', { method: 'POST', body: fd });
    if (result.id) form.imagem_cf_id = result.id;
  } catch { /* silent */ } finally {
    coverUploading.value = false;
  }
}

// ─── TipTap editor – conteudo ─────────────────────────────────────────────────
const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
  ],
  content: '',
  editorProps: {
    attributes: { class: 'tiptap-editor' },
  },
  onUpdate: ({ editor: e }) => {
    form.conteudo = e.getHTML();
  },
});

function syncConteudo() {
  if (editor.value) form.conteudo = editor.value.getHTML();
}

function insertLink() {
  const url = prompt('URL do link:');
  if (url) editor.value?.chain().focus().setLink({ href: url }).run();
}

onMounted(async () => {
  const [cats, portfolioCats] = await Promise.all([
    adminFetch<{ slug: string; titulo: string }[]>('/api/admin/blog/categorias'),
    adminFetch<{ slug: string; titulo: string }[]>('/api/admin/portfolio/categorias').catch(() => []),
    init(),
  ]);
  categoriasOptions.value = cats ?? [];
  portfolioCategoriasOptions.value = portfolioCats ?? [];
  nextTick(() => {
    if (editor.value && form.conteudo) {
      editor.value.commands.setContent(form.conteudo);
    }
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
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
              <option v-for="c in categoriasOptions" :key="c.slug" :value="c.slug">{{ c.titulo }}</option>
            </select>
          </div>

          <div class="form-field form-field--full">
            <label>Descrição</label>
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

          <div class="form-field">
            <label>Ensaios com esse tema</label>
            <select v-model="form.works">
              <option value="">— não exibir —</option>
              <option v-for="c in portfolioCategoriasOptions" :key="c.slug" :value="c.slug">{{ c.titulo }}</option>
            </select>
            <p class="field-hint">Exibe até 3 trabalhos dessa categoria de portfolio no fim do post.</p>
          </div>

          <div class="form-field">
            <label>Agendamento no fim do post?</label>
            <div class="switch-row">
              <span>Exibir formulário (Tinyform)</span>
              <label class="switch">
                <input type="checkbox" v-model="form.show_schedule" />
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
              :src="cfImg(form.imagem_cf_id)"
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
          <button type="button" @click="editor?.chain().focus().toggleBold().run()" :class="{ 'is-active': editor?.isActive('bold') }"><b>B</b></button>
          <button type="button" @click="editor?.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor?.isActive('italic') }"><i>I</i></button>
          <button type="button" @click="insertLink" :class="{ 'is-active': editor?.isActive('link') }">🔗</button>
          <button type="button" v-if="editor?.isActive('link')" @click="editor?.chain().focus().unsetLink().run()">Remover link</button>
          <span class="tb-sep">|</span>
          <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }">H2</button>
          <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }">H3</button>
          <button type="button" @click="editor?.chain().focus().setParagraph().run()" :class="{ 'is-active': editor?.isActive('paragraph') }">¶</button>
          <span class="tb-sep">|</span>
          <button type="button" @click="editor?.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor?.isActive('bulletList') }">• Lista</button>
        </div>
        <EditorContent :editor="editor" class="tiptap-content" />
      </div>

      <!-- ── SEO unificado (page_seo) ─────────────────────────────────── -->
      <div v-if="isEdit" class="form-card">
        <h3 class="form-section-title">SEO desta página</h3>
        <AdminSeoEditor
          ref="seoEditorRef"
          entity-type="blog"
          :entity-id="idParam"
          :page-url="`https://fotografalilliatavares.com.br/blog/${form.categoria}/${form.slug}`"
          mode="inline"
        />
      </div>
      <p v-else class="seo-hint">
        Salve o post primeiro para poder editar o SEO.
      </p>

      <div class="form-actions">
        <NuxtLink to="/admin/blog" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="() => { syncConteudo(); save(onSaved); }">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Publicar') }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.form-section-title {
  font-size: 13px; font-weight: 600; color: t.$text-2;
  text-transform: uppercase; letter-spacing: 0.05em; margin: 0;
}

.page-link {
  font-size: 13px; font-weight: normal; color: t.$accent;
  text-decoration: none; margin-left: 10px;
  &:hover { text-decoration: underline; }
}

// Slug row
.input-with-btn { display: flex; gap: 6px; align-items: stretch; input { flex: 1; } }
.btn-ghost-sm {
  background: t.$surface-2; border: 1px solid t.$border-strong; color: t.$text-2;
  border-radius: 6px; padding: 0 10px; cursor: pointer; font-size: 18px; line-height: 1;
  &:hover { background: t.$surface-3; color: t.$text; }
}

// Switch
.switch-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; color: t.$text; font-size: 14px; }
.switch {
  position: relative; display: inline-block; width: 40px; height: 22px;
  input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute; inset: 0; background: t.$border-strong; border-radius: 22px; transition: 0.3s; cursor: pointer;
    &::before { content: ''; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
  }
  input:checked + .slider { background: t.$accent; }
  input:checked + .slider::before { transform: translateX(18px); }
}

// Cover
.cover-section { display: flex; gap: 20px; align-items: flex-start; }
.cover-preview-wrap {
  width: 180px; flex-shrink: 0; border-radius: 8px; overflow: hidden;
  background: t.$surface; border: 1px solid t.$border-strong; min-height: 120px;
  display: flex; align-items: center; justify-content: center;
}
.cover-preview { width: 100%; display: block; border-radius: 8px; }
.cover-loading, .cover-empty { font-size: 13px; color: t.$text-3; padding: 16px; text-align: center; }
.cover-actions { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.btn-upload {
  display: inline-flex; align-items: center; gap: 6px;
  background: t.$accent-dim; border: 1px solid t.$accent; color: t.$accent;
  padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; align-self: flex-start;
  &:hover { background: t.$accent-line; }
}

// Rich editor
.rich-toolbar {
  display: flex; gap: 4px; margin-bottom: 4px; flex-wrap: wrap; align-items: center;
  button {
    padding: 3px 10px; background: t.$surface-2; border: 1px solid t.$border-strong;
    color: t.$text; border-radius: 4px; font-size: 13px; cursor: pointer;
    &:hover { background: t.$surface-3; }
    &.is-active { background: t.$accent-dim; border-color: t.$accent; color: t.$accent; }
  }
}
.tb-sep { color: t.$text-3; padding: 0 2px; font-size: 16px; }
.tiptap-content {
  border: 1px solid t.$border-strong; border-radius: 6px; min-height: 320px;
  &:focus-within { border-color: t.$accent-line; }
  :deep(.tiptap-editor) {
    padding: 12px 14px; color: t.$text; background: transparent;
    font-size: 15px; font-family: inherit; outline: none; line-height: 1.7; min-height: 320px;
    h2 { font-size: 1.4em; font-weight: 600; margin: 1em 0 0.4em; }
    h3 { font-size: 1.2em; font-weight: 600; margin: 0.8em 0 0.3em; }
    a { color: t.$accent; }
    ul { padding-left: 1.4em; }
    li { margin-bottom: 4px; }
    p.is-empty::before { content: attr(data-placeholder); color: t.$text-3; pointer-events: none; float: left; height: 0; }
  }
}

.includes-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; input { flex: 1; } }

.field-hint {
  font-size: 12px;
  color: t.$text-3;
  margin: 4px 0 0;
}

.seo-hint {
  margin: 16px 0;
  padding: 16px;
  background: t.$surface;
  border: 1px dashed t.$border-strong;
  border-radius: 8px;
  color: t.$text-3;
  font-size: 13px;
  text-align: center;
}
</style>
