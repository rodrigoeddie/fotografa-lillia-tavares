<script lang="ts" setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface BlogImage {
  imageId: string;
  width: number;
  height: number;
  format: string;
  customClass?: string;
  alt?: string;
  nome?: string;
  ratio?: string;
  instagram?: string;
  showAtEnd?: boolean;
  mobileImageId?: string;
}

interface BlogData {
  colorHighlight: string;
  showSchedule?: boolean;
  title: string;
  date: string;
  description: string;
  category: { slug: string; title: string };
  image: {
    imageId: string;
    width: number;
    height: number;
    format: string;
    customClass: string;
    alt: string;
  };
  works?: string;
  page?: string;
  content?: string[];
  contentImages?: BlogImage[];
  album?: BlogImage[];
}

interface CfImage {
  id: string;
  filename: string;
  uploaded: string;
}

const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';

const currentPath = ref('');
const data = ref<BlogData | null>(null);
const loading = ref(false);
const saving = ref(false);

// Category management
const blogCategories = ref<{ slug: string; title: string; path: string }[]>([]);
const newCatName = ref('');
const showNewCat = ref(false);

// CF Image browser
const cfImages = ref<CfImage[]>([]);
const cfImagesLoading = ref(false);
const cfImagesPage = ref(1);
const cfImagesTotalCount = ref(0);
const cfBrowserOpen = ref(false);
const cfBrowserTarget = ref<{ type: 'main' | 'contentImage' | 'album'; index: number }>({ type: 'main', index: -1 });
const cfImagesError = ref('');

// Drag
const imgDragIdx = ref<number | null>(null);
const imgDragOverIdx = ref<number | null>(null);
const albumDragIdx = ref<number | null>(null);
const albumDragOverIdx = ref<number | null>(null);

// Tab
const activeTab = ref<'meta' | 'content' | 'images' | 'album'>('meta');

// TipTap editor
const editor = useEditor({
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
  ],
  content: '',
  editorProps: {
    attributes: { class: 'tiptap-editor' },
  },
});

function contentToHtml(contentArr: string[]): string {
  return contentArr.join('\n');
}

function htmlToContent(): string[] {
  if (!editor.value) return [];
  const html = editor.value.getHTML();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const paragraphs: string[] = [];
  for (const child of wrapper.children) {
    const el = child as HTMLElement;
    if (!el.classList.contains('description')) {
      el.classList.add('description');
    }
    paragraphs.push(el.outerHTML);
  }
  return paragraphs.length ? paragraphs : [];
}

async function loadCategories() {
  try {
    const tree = await $fetch<{ name: string; isDirectory: boolean }[]>('/api/files', {
      params: { path: 'blog' },
    });
    blogCategories.value = tree
      .filter(f => f.isDirectory)
      .map(f => ({
        slug: f.name,
        title: f.name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        path: `blog/${f.name}`,
      }));
  } catch { /* silent */ }
}

async function openFile(filePath: string) {
  currentPath.value = filePath;
  loading.value = true;
  activeTab.value = 'meta';
  try {
    const res = await $fetch<{ content: string }>(`/api/fs/raw?path=${encodeURIComponent(filePath)}`);
    data.value = JSON.parse(res.content);

    if (data.value?.content?.length && editor.value) {
      editor.value.commands.setContent(contentToHtml(data.value.content));
    } else {
      editor.value?.commands.setContent('');
    }

    await loadCategories();
  } catch (e: any) {
    props.showMessage('Erro ao carregar post: ' + e.message, 'error');
  } finally {
    loading.value = false;
  }
}

async function save() {
  if (!data.value || !currentPath.value) return;
  saving.value = true;
  try {
    data.value.content = htmlToContent();
    const cleanData = JSON.parse(JSON.stringify(data.value));
    await $fetch('/api/fs/raw', {
      method: 'POST',
      body: { path: currentPath.value, content: JSON.stringify(cleanData, null, 2) },
    });
    props.showMessage('Post salvo!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao salvar: ' + e.message, 'error');
  } finally {
    saving.value = false;
  }
}

// CF Image Browser
async function openCfBrowser(target: { type: 'main' | 'contentImage' | 'album'; index: number }) {
  cfBrowserTarget.value = target;
  cfBrowserOpen.value = true;
  if (cfImages.value.length === 0) await loadCfImages(1);
}

async function loadCfImages(page: number) {
  cfImagesLoading.value = true;
  cfImagesError.value = '';
  try {
    const res = await $fetch<{ images: CfImage[]; total_count: number }>('/api/cf-images', {
      params: { page, per_page: 50 },
    });
    cfImages.value = res.images ?? [];
    cfImagesTotalCount.value = res.total_count;
    cfImagesPage.value = page;
    if ((res.images ?? []).length === 0) cfImagesError.value = 'Nenhuma imagem encontrada.';
  } catch (e: any) {
    cfImages.value = [];
    cfImagesError.value = 'Erro ao carregar imagens: ' + (e.statusMessage || e.message);
  } finally {
    cfImagesLoading.value = false;
  }
}

function selectCfImage(imageId: string) {
  if (!data.value) return;
  const t = cfBrowserTarget.value;
  if (t.type === 'main') {
    data.value.image.imageId = imageId;
  } else if (t.type === 'contentImage') {
    const img = data.value.contentImages?.[t.index];
    if (img) img.imageId = imageId;
  } else if (t.type === 'album') {
    const img = data.value.album?.[t.index];
    if (img) img.imageId = imageId;
  }
  cfBrowserOpen.value = false;
  props.showMessage('Imagem selecionada!', 'success');
}

// Content images
function addContentImage() {
  if (!data.value) return;
  if (!data.value.contentImages) data.value.contentImages = [];
  data.value.contentImages.push({
    imageId: '', width: 468, height: 703, format: 'retrato', customClass: '', alt: '',
  });
}

function removeContentImage(idx: number) {
  data.value?.contentImages?.splice(idx, 1);
}

function imgDragStart(idx: number) { imgDragIdx.value = idx; }
function imgDragOver(idx: number) { imgDragOverIdx.value = idx; }
function imgDragEnd() {
  if (!data.value?.contentImages || imgDragIdx.value === null || imgDragOverIdx.value === null || imgDragIdx.value === imgDragOverIdx.value) {
    imgDragIdx.value = null; imgDragOverIdx.value = null; return;
  }
  const arr = data.value.contentImages;
  const [item] = arr.splice(imgDragIdx.value, 1);
  if (item) arr.splice(imgDragOverIdx.value, 0, item);
  imgDragIdx.value = null; imgDragOverIdx.value = null;
}

// Album
function addAlbumImage() {
  if (!data.value) return;
  if (!data.value.album) data.value.album = [];
  data.value.album.push({
    imageId: '', width: 468, height: 703, format: 'retrato', customClass: '', alt: '',
  });
}

function removeAlbumImage(idx: number) {
  data.value?.album?.splice(idx, 1);
}

function albumDragStart(idx: number) { albumDragIdx.value = idx; }
function albumDragOver(idx: number) { albumDragOverIdx.value = idx; }
function albumDragEnd() {
  if (!data.value?.album || albumDragIdx.value === null || albumDragOverIdx.value === null || albumDragIdx.value === albumDragOverIdx.value) {
    albumDragIdx.value = null; albumDragOverIdx.value = null; return;
  }
  const arr = data.value.album;
  const [item] = arr.splice(albumDragIdx.value, 1);
  if (item) arr.splice(albumDragOverIdx.value, 0, item);
  albumDragIdx.value = null; albumDragOverIdx.value = null;
}

// Link picker
const linkPickerOpen = ref(false);
const linkPickerCustom = ref('');
const linkPickerSearch = ref('');

const STATIC_PAGES: { label: string; url: string; group: string }[] = [
  { label: 'Home', url: '/', group: 'Páginas' },
  { label: 'Sobre', url: '/sobre-fotografa-lillia-tavares', group: 'Páginas' },
  { label: 'Agendar Ensaio', url: '/agende-seu-ensaio', group: 'Páginas' },
  { label: 'Preços', url: '/precos-ensaios-fotograficos', group: 'Páginas' },
  { label: 'Perguntas Frequentes', url: '/perguntas-frequentes', group: 'Páginas' },
  { label: 'Depoimentos', url: '/depoimentos', group: 'Páginas' },
  { label: 'Ensaio Profissional em Mogi', url: '/ensaio-profissional-em-mogi', group: 'Páginas' },
  { label: 'Coloração Pessoal em Mogi', url: '/analise-coloracao-pessoal-em-mogi', group: 'Páginas' },
  { label: 'Presente: Ensaio Fotográfico', url: '/presente-ensaio-fotografico-mogi', group: 'Páginas' },
  { label: 'Estúdio', url: '/estudio', group: 'Páginas' },
  { label: 'Blog', url: '/blog', group: 'Páginas' },
  { label: 'Privacidade e Termos', url: '/privacidade-e-termos', group: 'Páginas' },
];

const dynamicPages = ref<{ label: string; url: string; group: string }[]>([]);

const filteredPages = computed(() => {
  const all = [...STATIC_PAGES, ...dynamicPages.value];
  if (!linkPickerSearch.value.trim()) return all;
  const q = linkPickerSearch.value.toLowerCase();
  return all.filter(p => p.label.toLowerCase().includes(q) || p.url.toLowerCase().includes(q));
});

async function loadDynamicPages() {
  if (dynamicPages.value.length > 0) return;
  try {
    const blogTree = await $fetch<{ name: string; isDirectory: boolean; children?: any[] }[]>('/api/files', {
      params: { path: 'blog' },
    });
    for (const cat of blogTree.filter(f => f.isDirectory)) {
      for (const file of (cat.children || [])) {
        if (!file.isDirectory && file.name.endsWith('.json') && file.name !== 'index.json') {
          const slug = file.name.replace('.json', '').replace(/^\d+\./, '');
          dynamicPages.value.push({
            label: slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
            url: `/blog/${cat.name}/${slug}`,
            group: 'Blog',
          });
        }
      }
    }
  } catch { /* silent */ }
}

function openLinkPicker() {
  linkPickerCustom.value = editor.value?.getAttributes('link').href || '';
  linkPickerSearch.value = '';
  linkPickerOpen.value = true;
  loadDynamicPages();
}

function applyLink(url: string) {
  if (!url.trim()) return;
  editor.value?.chain().focus().setLink({ href: url.trim() }).run();
  linkPickerOpen.value = false;
  linkPickerCustom.value = '';
}

function slugify(text: string): string {
  return text
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createNewCategory() {
  if (!newCatName.value.trim()) return;
  const slug = slugify(newCatName.value);
  try {
    await $fetch('/api/fs/action', { method: 'POST', body: { action: 'create', path: 'blog', name: slug, type: 'dir' } });
    // Create index.md for the category
    await $fetch('/api/fs/raw', { method: 'POST', body: { path: `blog/${slug}/index.md`, content: `---\ntitle: "${newCatName.value.trim()}"\n---\n` } });
    await loadCategories();
    if (data.value) {
      data.value.category = { slug, title: newCatName.value.trim() };
    }
    showNewCat.value = false;
    newCatName.value = '';
    props.showMessage('Categoria criada!', 'success');
  } catch (e: any) {
    props.showMessage('Erro ao criar categoria: ' + e.message, 'error');
  }
}

onMounted(() => {
  loadCategories();
});

defineExpose({ openFile });
</script>

<template>
  <div class="blog-editor">
    <div v-if="loading" class="loading">Carregando post...</div>

    <div v-else-if="!data && !currentPath" class="empty-state">
      <h2>📝 Editor de Blog</h2>
      <p>Selecione um post na barra lateral ou crie um novo.</p>
    </div>

    <template v-else-if="data">
      <div class="editor-header">
        <h2>{{ data.title || 'Novo Post' }}</h2>
        <div class="editor-header-actions">
          <span v-if="currentPath" class="editor-path">{{ currentPath }}</span>
          <button class="btn-save" @click="save" :disabled="saving">
            {{ saving ? 'Salvando...' : '💾 Salvar' }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="editor-tabs">
        <button :class="{ active: activeTab === 'meta' }" @click="activeTab = 'meta'">Metadados</button>
        <button :class="{ active: activeTab === 'content' }" @click="activeTab = 'content'">Conteúdo</button>
        <button :class="{ active: activeTab === 'images' }" @click="activeTab = 'images'">Imagens</button>
        <button :class="{ active: activeTab === 'album' }" @click="activeTab = 'album'">Álbum</button>
      </div>

      <!-- Meta Tab -->
      <div v-show="activeTab === 'meta'" class="tab-content">
        <div class="field-row">
          <label>Título</label>
          <input v-model="data.title" type="text" placeholder="Título do post" />
        </div>

        <div class="field-row">
          <label>Data</label>
          <input v-model="data.date" type="date" />
        </div>

        <div class="field-row">
          <label>Descrição (SEO)</label>
          <textarea v-model="data.description" rows="3" placeholder="Descrição do post para SEO"></textarea>
        </div>

        <div class="field-row">
          <label>Cor destaque</label>
          <div class="color-row">
            <input v-model="data.colorHighlight" type="color" class="color-picker" />
            <input v-model="data.colorHighlight" type="text" class="color-text" placeholder="#000000" />
          </div>
        </div>

        <div class="field-row">
          <label>Categoria</label>
          <div class="cat-selector">
            <select v-model="data.category.slug" @change="() => {
              const cat = blogCategories.find(c => c.slug === data!.category.slug);
              if (cat) data!.category.title = cat.title;
            }">
              <option value="">Selecione...</option>
              <option v-for="cat in blogCategories" :key="cat.slug" :value="cat.slug">{{ cat.title }}</option>
            </select>
            <button class="btn-small" @click="showNewCat = !showNewCat">+ Nova</button>
          </div>
          <div v-if="showNewCat" class="new-cat-row">
            <label>
                <span>Nome da categoria</span>
                <input v-model="newCatName" @keydown.enter="createNewCategory" />
            </label>
            <button class="btn-small ok" @click="createNewCategory">✓</button>
            <button class="btn-small cancel" @click="showNewCat = false; newCatName = ''">✕</button>
          </div>
        </div>

        <div class="field-row">
          <label>
            <input type="checkbox" v-model="data.showSchedule" />
            Mostrar botão de agendamento
          </label>
        </div>

        <div class="field-row">
          <label>Imagem principal</label>
          <div class="main-image-row">
            <div v-if="data.image.imageId" class="img-preview">
              <nuxt-img
                provider="cloudflare"
                :src="CF_IMG_BASE + data.image.imageId + '/public'"
                :width="200"
                :alt="data.image.alt" />
            </div>
            <button class="btn-small" @click="openCfBrowser({ type: 'main', index: 0 })">Selecionar imagem</button>
          </div>
          <div class="image-fields" v-if="data.image.imageId">
            <label>
                <span>Width</span>
                <input v-model.number="data.image.width" type="number" />
            </label>
            <label>
                <span>Height</span>
                <input v-model.number="data.image.height" type="number" />
            </label>
            <label>
                <span>Orientação</span>
                <select v-model="data.image.format">
                  <option value="paisagem">Paisagem</option>
                  <option value="retrato">Retrato</option>
                  <option value="square">Quadrado</option>
                </select>
            </label>
            <label>
                <span>Alt text</span>
                <input v-model="data.image.alt" type="text" placeholder="" />
            </label>
          </div>
        </div>

        <div class="field-row">
          <label>Works (slug do ensaio relacionado)</label>
          <input v-model="data.works" type="text" placeholder="ex: natal-2025" />
        </div>

        <div class="field-row">
          <label>Página vinculada</label>
          <input v-model="data.page" type="text" placeholder="ex: /ensaio-fotografico/dia-das-maes" />
        </div>
      </div>

      <!-- Content Tab (WYSIWYG) -->
      <div v-show="activeTab === 'content'" class="tab-content">
        <div class="tiptap-toolbar">
          <button @click="editor?.chain().focus().toggleBold().run()" :class="{ 'is-active': editor?.isActive('bold') }">B</button>
          <button @click="editor?.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor?.isActive('italic') }">I</button>
          <button @click="openLinkPicker" :class="{ 'is-active': editor?.isActive('link') }">🔗</button>
          <button v-if="editor?.isActive('link')" @click="editor?.chain().focus().unsetLink().run()">Remover link</button>
          <span class="toolbar-sep"></span>
          <button @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }">H2</button>
          <button @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }">H3</button>
          <button @click="editor?.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor?.isActive('bulletList') }">• lista</button>
        </div>
        <EditorContent :editor="editor" class="tiptap-content" />
      </div>

      <!-- Content Images Tab -->
      <div v-show="activeTab === 'images'" class="tab-content">
        <div class="tab-header">
          <h3>Imagens do conteúdo ({{ data.contentImages?.length || 0 }})</h3>
          <button class="btn-small" @click="addContentImage">+ Adicionar</button>
        </div>
        <div v-if="!data.contentImages?.length" class="empty-list">Nenhuma imagem adicionada.</div>
        <div
          v-for="(img, idx) in data.contentImages"
          :key="idx"
          class="image-card"
          :class="{ 'drag-over': imgDragOverIdx === idx }"
          draggable="true"
          @dragstart="imgDragStart(idx)"
          @dragover.prevent="imgDragOver(idx)"
          @dragend="imgDragEnd()"
        >
          <div class="image-card-header">
            <span class="drag-handle">⠿</span>
            <span class="image-idx">#{{ idx + 1 }}</span>
            <div v-if="img.imageId" class="img-thumb">
              <nuxt-img
                provider="cloudflare"
                :src="CF_IMG_BASE + img.imageId + '/public'"
                :width="80" />
            </div>
            <button class="btn-small" @click="openCfBrowser({ type: 'contentImage', index: idx })">{{ img.imageId ? 'Trocar' : 'Selecionar' }}</button>
            <button class="btn-small danger" @click="removeContentImage(idx)">✕</button>
          </div>
          <div class="image-card-fields">
            <label class="field-label">Width<input v-model.number="img.width" type="number" placeholder="468" /></label>
            <label class="field-label">Height<input v-model.number="img.height" type="number" placeholder="703" /></label>
            <label class="field-label">Formato
              <select v-model="img.format">
                <option value="retrato">Retrato</option>
                <option value="paisagem">Paisagem</option>
                <option value="square">Square</option>
              </select>
            </label>
            <label class="field-label">Classe<input v-model="img.customClass" type="text" placeholder="w50, sbs..." /></label>
            <label class="field-label">Alt<input v-model="img.alt" type="text" placeholder="Descrição" /></label>
            <label class="field-label">Nome<input v-model="img.nome" type="text" placeholder="Nome" /></label>
            <label class="field-label">Instagram<input v-model="img.instagram" type="text" placeholder="URL" /></label>
            <label class="cb-label"><input type="checkbox" v-model="img.showAtEnd" /> No final</label>
          </div>
        </div>
      </div>

      <!-- Album Tab -->
      <div v-show="activeTab === 'album'" class="tab-content">
        <div class="tab-header">
          <h3>Álbum ({{ data.album?.length || 0 }})</h3>
          <button class="btn-small" @click="addAlbumImage">+ Adicionar</button>
        </div>
        <div v-if="!data.album?.length" class="empty-list">Nenhuma imagem no álbum.</div>
        <div
          v-for="(img, idx) in data.album"
          :key="idx"
          class="image-card"
          :class="{ 'drag-over': albumDragOverIdx === idx }"
          draggable="true"
          @dragstart="albumDragStart(idx)"
          @dragover.prevent="albumDragOver(idx)"
          @dragend="albumDragEnd()"
        >
          <div class="image-card-header">
            <span class="drag-handle">⠿</span>
            <span class="image-idx">#{{ idx + 1 }}</span>
            <div v-if="img.imageId" class="img-thumb">
              <nuxt-img
                provider="cloudflare"
                :src="CF_IMG_BASE + img.imageId + '/public'"
                :width="80"
              />
            </div>
            <button class="btn-small" @click="openCfBrowser({ type: 'album', index: idx })">{{ img.imageId ? 'Trocar' : 'Selecionar' }}</button>
            <button class="btn-small danger" @click="removeAlbumImage(idx)">✕</button>
          </div>
          <div class="image-card-fields">
            <label class="field-label">Width<input v-model.number="img.width" type="number" placeholder="468" /></label>
            <label class="field-label">Height<input v-model.number="img.height" type="number" placeholder="703" /></label>
            <label class="field-label">Formato
              <select v-model="img.format">
                <option value="retrato">Retrato</option>
                <option value="paisagem">Paisagem</option>
                <option value="square">Square</option>
              </select>
            </label>
            <label class="field-label">Classe<input v-model="img.customClass" type="text" placeholder="Classe" /></label>
            <label class="field-label">Alt<input v-model="img.alt" type="text" placeholder="Descrição" /></label>
            <label class="field-label">Nome<input v-model="img.nome" type="text" placeholder="Nome" /></label>
            <label class="field-label">Instagram<input v-model="img.instagram" type="text" placeholder="URL" /></label>
          </div>
        </div>
      </div>
    </template>

    <!-- CF Image Browser Modal -->
    <Teleport to="body">
      <div v-if="cfBrowserOpen" class="modal-overlay" @click.self="cfBrowserOpen = false">
        <div class="modal-content cf-browser">
          <div class="modal-header">
            <h3>Selecionar imagem do Cloudflare</h3>
            <button class="modal-close" @click="cfBrowserOpen = false">✕</button>
          </div>
          <div v-if="cfImagesLoading" class="loading">Carregando imagens...</div>
          <div v-else-if="cfImagesError" class="cf-error">{{ cfImagesError }}</div>
          <div v-else class="cf-grid">
            <div
              v-for="img in cfImages"
              :key="img.id"
              class="cf-thumb"
              @click="selectCfImage(img.id)"
            >
              <img :src="CF_IMG_BASE + img.id + '/w=120'" loading="lazy" />
              <span class="cf-filename">{{ img.filename }}</span>
            </div>
          </div>
          <div class="cf-pagination" v-if="cfImagesTotalCount > 50">
            <button :disabled="cfImagesPage <= 1" @click="loadCfImages(cfImagesPage - 1)">← Anterior</button>
            <span>Página {{ cfImagesPage }} ({{ cfImagesTotalCount }} total)</span>
            <button :disabled="cfImages.length < 50" @click="loadCfImages(cfImagesPage + 1)">Próxima →</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Link Picker Modal -->
    <Teleport to="body">
      <div v-if="linkPickerOpen" class="modal-overlay" @click.self="linkPickerOpen = false">
        <div class="modal-content link-picker">
          <div class="modal-header">
            <h3>🔗 Inserir Link</h3>
            <button class="modal-close" @click="linkPickerOpen = false">✕</button>
          </div>

          <div class="link-custom">
            <label>URL personalizada ou externa</label>
            <div class="link-custom-row">
              <input
                v-model="linkPickerCustom"
                type="text"
                placeholder="https://... ou /caminho"
                @keydown.enter="applyLink(linkPickerCustom)"
              />
              <button class="btn-save sm" @click="applyLink(linkPickerCustom)" :disabled="!linkPickerCustom.trim()">Inserir</button>
            </div>
          </div>

          <div class="link-divider"><span>ou selecione uma página do site</span></div>

          <input v-model="linkPickerSearch" type="text" placeholder="🔍 Buscar página..." class="link-search" />

          <div class="link-pages">
            <div v-if="filteredPages.length === 0" class="empty-list">Nenhuma página encontrada.</div>
            <button
              v-for="page in filteredPages"
              :key="page.url"
              class="link-page-item"
              @click="applyLink(page.url)"
            >
              <span class="link-page-label">{{ page.label }}</span>
              <span class="link-page-url">{{ page.url }}</span>
              <span class="link-page-group">{{ page.group }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style lang="scss" scoped>
.blog-editor {
  color: #eee;
}

.loading { text-align: center; padding: 40px; color: #888; }
.empty-state {
  text-align: center; padding: 60px 20px; color: #888;
  h2 { font-size: 24px; margin-bottom: 8px; color: #ccc; }
}

.editor-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #333;
  h2 { font-size: 20px; }
}

.editor-header-actions {
  display: flex; align-items: center; gap: 12px;
}

.editor-path { font-size: 12px; color: #666; font-family: monospace; }

.btn-save {
  background: #2563eb; border: none; color: #fff; padding: 8px 20px;
  border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;
  &:hover:not(:disabled) { background: #1d4ed8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
}

// Tabs
.editor-tabs {
  display: flex; gap: 0; margin-bottom: 20px; border-bottom: 1px solid #333;
  button {
    background: none; border: none; border-bottom: 2px solid transparent;
    color: #888; padding: 10px 20px; font-size: 13px; cursor: pointer;
    &:hover { color: #ccc; }
    &.active { color: #60a5fa; border-bottom-color: #3b82f6; }
  }
}

.tab-content { min-height: 300px; }

// Fields
.field-row {
  margin-bottom: 16px;
  label { display: block; font-size: 12px; color: #999; margin-bottom: 6px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
  input[type="text"], input[type="date"], input[type="number"], textarea, select {
    width: 100%; background: #1a1a1a; border: 1px solid #333; color: #eee;
    padding: 8px 12px; border-radius: 6px; font-size: 14px;
    &:focus { outline: none; border-color: #3b82f6; }
  }
  textarea { resize: vertical; font-family: inherit; }
}

.color-row {
  display: flex; gap: 8px; align-items: center;
  .color-picker { width: 48px; height: 36px; border: 1px solid #333; border-radius: 6px; background: none; cursor: pointer; padding: 2px; }
  .color-text { flex: 1; }
}

.cat-selector {
  display: flex; gap: 8px;
  select { flex: 1; }
}

.new-cat-row {
  display: flex; gap: 6px; margin-top: 8px;
  input { flex: 1; background: #1a1a1a; border: 1px solid #333; color: #eee; padding: 6px 10px; border-radius: 6px; font-size: 13px;
    &:focus { outline: none; border-color: #3b82f6; }
  }
}

.btn-small {
  background: #1e2d3d; border: 1px solid #2d4a6a; color: #60a5fa; padding: 6px 12px;
  border-radius: 6px; font-size: 12px; cursor: pointer; white-space: nowrap;
  &:hover { background: #253d55; }
  &.ok { color: #4ade80; border-color: #166534; }
  &.cancel { color: #f87171; border-color: #7f1d1d; }
  &.danger { color: #f87171; border-color: #7f1d1d; &:hover { background: #450a0a; } }
}

// Main image
.main-image-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.img-preview {
  width: 100px; height: 70px; border-radius: 6px; overflow: hidden; border: 1px solid #333;
  img { width: 100%; height: 100%; object-fit: cover; }
}
.image-fields {
  display: flex; gap: 8px; flex-wrap: wrap;
  input, select { flex: 1; min-width: 80px; background: #1a1a1a; border: 1px solid #333; color: #eee; padding: 6px 8px; border-radius: 4px; font-size: 12px;
    &:focus { outline: none; border-color: #3b82f6; }
  }
}

// TipTap
.tiptap-toolbar {
  display: flex; gap: 4px; padding: 8px; background: #1a1a1a; border: 1px solid #333;
  border-bottom: none; border-radius: 8px 8px 0 0; flex-wrap: wrap;
  button {
    background: #222; border: 1px solid #444; color: #ccc; padding: 6px 12px;
    border-radius: 4px; font-size: 12px; cursor: pointer;
    &:hover { background: #333; color: #fff; }
    &.is-active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
  }
  .toolbar-sep { width: 1px; background: #444; margin: 0 4px; }
}

.tiptap-content {
  background: #0d0d0d; border: 1px solid #333; border-radius: 0 0 8px 8px;
  min-height: 300px; padding: 0;

  :deep(.tiptap-editor) {
    padding: 16px 20px;
    min-height: 300px;
    color: #d4d4d4;
    font-size: 14px;
    line-height: 1.7;
    outline: none;

    p { margin-bottom: 12px; }
    a { color: #60a5fa; text-decoration: underline; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    h2 { font-size: 20px; margin: 16px 0 8px; color: #eee; }
    h3 { font-size: 17px; margin: 14px 0 6px; color: #eee; }
    ul { padding-left: 20px; margin-bottom: 12px; }
    li { margin-bottom: 4px; }
  }
}

.cb-label {
  display: inline-flex !important; align-items: center; gap: 6px; font-size: 12px; color: #ccc;
  text-transform: none !important; letter-spacing: 0 !important; cursor: pointer;
}

// Image cards
.tab-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 16px; }
}

.empty-list { text-align: center; padding: 30px; color: #666; font-size: 13px; }

.image-card {
  background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px;
  padding: 12px; margin-bottom: 8px;
  transition: border-color 0.15s;
  &.drag-over { border-color: #3b82f6; }
}

.image-card-header {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}

.drag-handle { cursor: grab; font-size: 16px; color: #555; &:active { cursor: grabbing; } }
.image-idx { font-size: 11px; color: #666; font-weight: 600; min-width: 24px; }

.img-thumb {
  width: 50px; height: 50px; border-radius: 4px; overflow: hidden; border: 1px solid #333; flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
}

.image-card-fields {
  display: flex; gap: 6px; flex-wrap: wrap;
  input, select { width: 100%; background: #111; border: 1px solid #333; color: #eee;
    padding: 5px 8px; border-radius: 4px; font-size: 11px; margin-top: 3px;
    &:focus { outline: none; border-color: #3b82f6; }
  }
}

.field-label {
  display: flex; flex-direction: column; flex: 1; min-width: 70px;
  font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 0.4px;
}

// CF Browser modal
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex;
  align-items: center; justify-content: center; z-index: 9999;
}

.modal-content {
  background: #1a1a1a; border: 1px solid #333; border-radius: 12px;
  width: 90vw; max-width: 1000px; max-height: 80vh; overflow-y: auto; padding: 24px;
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
  h3 { font-size: 18px; color: #eee; }
}

.modal-close {
  background: #333; border: none; color: #eee; width: 32px; height: 32px;
  border-radius: 6px; cursor: pointer; font-size: 16px;
  &:hover { background: #444; }
}

.cf-browser { max-width: 1100px; }
.cf-error { text-align: center; padding: 20px; color: #f87171; }

.cf-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px; margin-bottom: 16px;
}

.cf-thumb {
  cursor: pointer; border: 2px solid transparent; border-radius: 6px;
  overflow: hidden; background: #111; transition: border-color 0.15s;
  &:hover { border-color: #3b82f6; }
  img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
  .cf-filename { display: block; font-size: 9px; color: #888; padding: 3px 4px;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}

.cf-pagination {
  display: flex; justify-content: center; align-items: center; gap: 16px;
  button {
    background: #222; border: 1px solid #444; color: #ccc; padding: 6px 14px;
    border-radius: 6px; font-size: 12px; cursor: pointer;
    &:hover:not(:disabled) { background: #333; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
  }
  span { font-size: 12px; color: #888; }
}

// Link picker modal
.link-picker { max-width: 560px; }

.link-custom {
  margin-bottom: 16px;
  label { display: block; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 8px; }
}

.link-custom-row {
  display: flex; gap: 8px;
  input {
    flex: 1; background: #111; border: 1px solid #444; color: #eee;
    padding: 8px 12px; border-radius: 6px; font-size: 13px;
    &:focus { outline: none; border-color: #3b82f6; }
  }
}

.btn-save.sm { padding: 8px 16px; font-size: 13px; white-space: nowrap; }

.link-divider {
  display: flex; align-items: center; gap: 10px; margin: 16px 0;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: #333; }
  span { font-size: 11px; color: #666; white-space: nowrap; }
}

.link-search {
  width: 100%; background: #111; border: 1px solid #333; color: #eee;
  padding: 8px 12px; border-radius: 6px; font-size: 13px; margin-bottom: 10px;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #3b82f6; }
}

.link-pages {
  max-height: 300px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 2px;
}

.link-page-item {
  display: flex; align-items: center; gap: 10px; width: 100%;
  background: none; border: 1px solid transparent; border-radius: 6px;
  padding: 8px 10px; cursor: pointer; text-align: left;
  transition: background 0.12s, border-color 0.12s;
  &:hover { background: #1e2d3d; border-color: #2d4a6a; }
}

.link-page-label { font-size: 13px; color: #ddd; font-weight: 500; flex: 1; }
.link-page-url { font-size: 11px; color: #60a5fa; font-family: monospace; }
.link-page-group { font-size: 10px; color: #555; background: #222; padding: 2px 6px; border-radius: 4px; flex-shrink: 0; }
</style>
