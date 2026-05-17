<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route  = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const {
  isEdit,
  loading,
  saving,
  uploading,
  form,
  selectedPages,
  uploadBgImage,
  uploadBgImageMobile,
  bgImageUrl,
  init,
  save,
} = useHeroBannerForm(idParam);

const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';

onMounted(init);
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin/hero-banners" class="page-back">← Voltar</NuxtLink>
    <div class="page-header">
      <h2>{{ isEdit ? 'Editar banner hero' : 'Novo banner hero' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <template v-else>
      <!-- ── Imagem de fundo ──────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="material-symbols-outlined">image</span>
          Imagem de fundo <span class="required">*</span>
          <small class="aspect-hint">proporção 24:5</small>
        </h3>

        <div class="banner-image-editor">
          <div v-if="form.bg_image" class="banner-preview">
            <nuxt-img
              provider="cloudflare"
              :src="`${CF_IMG_BASE}${form.bg_image}/public`"
              width="720"
              height="150"
              fit="cover"
              format="webp"
              placeholder
              loading="lazy"
              class="preview-img"
            />
            <button class="btn-remove-img" title="Remover imagem" @click="form.bg_image = ''">✕</button>
          </div>
          <div v-else class="banner-placeholder">
            <span class="material-symbols-outlined">add_photo_alternate</span>
            <span>Nenhuma imagem — proporção ideal 24:5 (ex: 1200x250 ou 1920x400)</span>
          </div>

          <label class="btn-upload" :class="{ loading: uploading }">
            <span class="material-symbols-outlined">upload</span>
            <span>{{ uploading ? 'Enviando...' : 'Enviar imagem' }}</span>
            <input type="file" accept="image/*" :disabled="uploading" @change="uploadBgImage" />
          </label>
        </div>
      </div>

      <!-- ── Imagem mobile ───────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="material-symbols-outlined">smartphone</span>
          Imagem mobile
          <small class="aspect-hint">opcional — exibida em telas ≤ 768px</small>
        </h3>

        <div class="banner-image-editor">
          <div v-if="form.bg_image_mobile" class="banner-preview mobile-preview">
            <nuxt-img
              provider="cloudflare"
              :src="`${CF_IMG_BASE}${form.bg_image_mobile}/public`"
              width="300"
              height="300"
              fit="cover"
              format="webp"
              placeholder
              loading="lazy"
              class="preview-img"
            />
            <button class="btn-remove-img" title="Remover imagem mobile" @click="form.bg_image_mobile = ''">✕</button>
          </div>
          <div v-else class="banner-placeholder mobile-placeholder">
            <span class="material-symbols-outlined">add_photo_alternate</span>
            <span>Nenhuma imagem mobile — proporção livre (ex: 9:16 ou quadrada)</span>
          </div>

          <label class="btn-upload" :class="{ loading: form.uploading_mobile }">
            <span class="material-symbols-outlined">upload</span>
            <span>{{ form.uploading_mobile ? 'Enviando...' : 'Enviar imagem mobile' }}</span>
            <input type="file" accept="image/*" :disabled="form.uploading_mobile" @change="uploadBgImageMobile" />
          </label>
        </div>
      </div>

      <!-- ── Textos ──────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="material-symbols-outlined">text_fields</span>
          Conteúdo
        </h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.titulo" type="text" placeholder="Título do banner" />
          </div>
          <div class="form-field">
            <label>Subtítulo</label>
            <input v-model="form.subtitulo" type="text" placeholder="Subtítulo (opcional)" />
          </div>
        </div>
        <div class="form-field">
          <label>Descrição</label>
          <textarea v-model="form.descricao" rows="3" placeholder="Texto descritivo do banner (opcional)" />
        </div>
      </div>

      <!-- ── CTA ────────────────────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="material-symbols-outlined">link</span>
          Call to Action (CTA)
        </h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Nome do botão</label>
            <input v-model="form.cta_nome" type="text" placeholder="Ex: Agende seu ensaio" />
          </div>
          <div class="form-field">
            <label>URL</label>
            <input v-model="form.cta_url" type="text" placeholder="https://... ou /pagina-interna" />
          </div>
        </div>

        <!-- Páginas internas como sugestão para o CTA -->
        <div class="cta-url-hint">
          <p class="hint-label">Páginas internas disponíveis:</p>
          <div class="url-chips">
            <button
              v-for="p in [
                { label: 'Início', route: '/' },
                { label: 'Sobre', route: '/sobre-fotografa-lillia-tavares' },
                { label: 'Ensaio fotográfico', route: '/ensaio-fotografico' },
                { label: 'Profissional em Mogi', route: '/ensaio-profissional-em-mogi' },
                { label: 'Coloração pessoal', route: '/analise-coloracao-pessoal-em-mogi' },
                { label: 'Estúdio', route: '/estudio' },
                { label: 'Preços', route: '/precos-ensaios-fotograficos' },
                { label: 'Presente', route: '/presente-ensaio-fotografico-mogi' },
                { label: 'Agende', route: '/agende-seu-ensaio' },
                { label: 'Depoimentos', route: '/depoimentos' },
                { label: 'FAQ', route: '/perguntas-frequentes' },
                { label: 'Blog', route: '/blog' },
              ]"
              :key="p.route"
              type="button"
              class="url-chip"
              :class="{ active: form.cta_url === p.route }"
              @click="form.cta_url = p.route"
            >
              {{ p.label }}
            </button>
          </div>
        </div>

        <div class="form-grid">
          <div class="form-field">
            <label>Abrir link em</label>
            <select v-model="form.cta_target">
              <option value="self">Mesma aba (_self)</option>
              <option value="blank">Nova aba (_blank)</option>
            </select>
          </div>
          <div class="form-field">
            <label>Status</label>
            <select v-model="form.ativo">
              <option :value="true">Ativo</option>
              <option :value="false">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      <!-- ── Páginas onde exibir ─────────────────────────── -->
      <div class="form-card">
        <h3 class="form-section-title">
          <span class="material-symbols-outlined">pages</span>
          Páginas onde exibir este banner <span class="required">*</span>
        </h3>
        <p class="pages-hint">O banner só aparece nas páginas selecionadas. Selecione ao menos uma.</p>
        <AdminRouteSelect2 v-model="selectedPages" />
      </div>

      <!-- ── Ações ───────────────────────────────────────── -->
      <div class="form-actions">
        <NuxtLink to="/admin/hero-banners" class="btn-secondary">
          <span class="material-symbols-outlined">cancel</span>
          <span>Cancelar</span>
        </NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/hero-banners'))">
          <span class="material-symbols-outlined">save</span>
          <span>{{ saving ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar banner') }}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-card {
  margin-bottom: 24px;
  border: 1px solid #21262d;
  border-radius: 10px;
  padding: 20px;
  background: #0d1117;
}

.form-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #8b949e;
  margin: 0 0 16px;
  text-transform: uppercase;
  letter-spacing: .05em;

  .material-symbols-outlined { font-size: 16px; color: #60a5fa; }
}

.aspect-hint {
  font-size: 11px;
  font-weight: 400;
  color: #555;
  text-transform: none;
  letter-spacing: 0;
  margin-left: 4px;
}

/* ── Banner image ────────────────────────────────────────── */
.banner-image-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.banner-preview {
  position: relative;
  width: 100%;
  aspect-ratio: 24 / 5;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #21262d;
  background: #161b22;

  &.mobile-preview {
    width: 160px;
    aspect-ratio: auto;
    height: 220px;
  }
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.btn-remove-img {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, .65);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(180, 0, 0, .8); }
}

.banner-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  aspect-ratio: 24 / 5;
  border: 2px dashed #21262d;
  border-radius: 8px;
  color: #30363d;
  font-size: 13px;

  .material-symbols-outlined { font-size: 32px; }

  &.mobile-placeholder {
    width: 160px;
    aspect-ratio: auto;
    height: 220px;
  }
}

.btn-upload {
  align-self: flex-start;
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  color: #60a5fa;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  white-space: nowrap;

  &.loading { opacity: .6; cursor: not-allowed; }
  input[type='file'] { display: none; }
  &:hover:not(.loading) { background: #253d55; }
}

/* ── CTA url chips ───────────────────────────────────────── */
.cta-url-hint {
  margin: 4px 0 16px;
}

.hint-label {
  font-size: 12px;
  color: #555;
  margin: 0 0 8px;
}

.url-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.url-chip {
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 20px;
  background: #161b22;
  border: 1px solid #21262d;
  color: #8b949e;
  cursor: pointer;
  font-family: inherit;
  transition: all .12s;

  &:hover { background: #1f2937; color: #e6edf3; }

  &.active {
    background: #1e3a5f;
    border-color: #2d5a9e;
    color: #93c5fd;
  }
}

/* ── Pages hint ──────────────────────────────────────────── */
.pages-hint {
  font-size: 13px;
  color: #555;
  margin: -8px 0 12px;
}

/* ── Form overrides ──────────────────────────────────────── */
.form-grid {
  gap: 14px;
}

.required { color: #f87171; }
</style>
