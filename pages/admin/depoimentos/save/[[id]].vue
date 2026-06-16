<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const cfImg = useCfImg();
const { isEdit, loading, saving, form, init, save } = useDepoimentoForm(idParam);
const { adminFetch } = useAdminFetch();

// ─── Avatar upload ───────────────────────────────────────────────────────────
const avatarUploading = ref(false);
async function uploadAvatar(file: File) {
  avatarUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await adminFetch<{ id: string }>('/api/admin/upload', { method: 'POST', body: formData });
    if (result.id) form.foto_cf_id = result.id;
  } catch (e: any) {
    // silent
  } finally {
    avatarUploading.value = false;
  }
}

// ─── Rich editor – texto ─────────────────────────────────────────────────────
const textoEditorRef = ref<HTMLDivElement | null>(null);
function syncTexto() {
  if (textoEditorRef.value) form.texto = textoEditorRef.value.innerHTML;
}
function execCmd(cmd: string) { document.execCommand(cmd, false, undefined); }
function insertLink() {
  const url = prompt('URL do link:');
  if (url && textoEditorRef.value) {
    textoEditorRef.value.focus();
    document.execCommand('createLink', false, url);
  }
}

// ─── Portfolio link select ───────────────────────────────────────────────────
const portfolioWorks = ref<{ id: number; titulo: string; categoria: string; slug: string }[]>([]);
async function loadPortfolio() {
  try {
    portfolioWorks.value = await adminFetch<any[]>('/api/admin/portfolio');
  } catch { /* silent */ }
}

onMounted(async () => {
  await init();
  await loadPortfolio();
  nextTick(() => {
    if (textoEditorRef.value && form.texto) textoEditorRef.value.innerHTML = form.texto;
  });
});
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/depoimentos" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar depoimento' : 'Novo depoimento' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>
      <div class="form-card">
        <h3 class="form-section-title">Dados pessoais</h3>
        <div class="form-grid">

          <div class="form-field">
            <label>Nome</label>
            <input v-model="form.nome" type="text" placeholder="Nome da cliente" />
          </div>

          <div class="form-field">
            <label>Data</label>
            <input v-model="form.data" type="text" placeholder="Há 8 meses atrás" />
          </div>

          <div class="form-field">
            <label>Avaliação</label>
            <div class="star-row">
              <button
                v-for="s in 5" :key="s" type="button"
                class="star-btn" :class="{ active: s <= form.rating }"
                @click="form.rating = s"
              >★</button>
              <span class="star-count">{{ form.rating }}/5</span>
            </div>
          </div>

          <div class="form-field">
            <label>Link Google Maps</label>
            <input v-model="form.link" type="url" placeholder="https://maps.app.goo.gl/..." />
          </div>

          <div class="form-field">
            <label>Avatar (foto)</label>
            <div class="avatar-upload-row">
              <div class="avatar-thumb">
                <img
                  v-if="form.foto_cf_id && !avatarUploading"
                  :src="cfImg(form.foto_cf_id)"
                  alt=""
                />
                <div v-else-if="avatarUploading" class="avatar-loading">⏳</div>
                <div v-else class="avatar-empty">?</div>
              </div>
              <div class="avatar-actions">
                <label class="btn-upload">
                  {{ avatarUploading ? 'Enviando...' : '↑ Upload foto' }}
                  <input
                    type="file" accept="image/*" hidden
                    :disabled="avatarUploading"
                    @change="(e) => { const f = (e.target as HTMLInputElement).files?.[0]; if (f) uploadAvatar(f); }"
                  />
                </label>
                <input v-model="form.foto_cf_id" type="text" placeholder="ou cole o CF ID..." class="cf-id-input" />
              </div>
            </div>
          </div>

          <div class="form-field">
            <label>Portfolio vinculado</label>
            <select v-model="form.portfolio_link">
              <option value="">— nenhum —</option>
              <option
                v-for="w in portfolioWorks" :key="w.id"
                :value="`${w.categoria}/${w.slug}`"
              >{{ w.titulo || w.slug }} ({{ w.categoria }})</option>
            </select>
          </div>

          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>

          <div class="form-field">
            <label>Featured?</label>
            <div class="switch-row">
              <span>Destacar na home</span>
              <label class="switch">
                <input type="checkbox" v-model="form.featured" />
                <span class="slider" />
              </label>
            </div>
          </div>

        </div>
      </div>

      <div class="form-card">
        <h3 class="form-section-title">Texto do depoimento</h3>
        <div class="rich-toolbar">
          <button type="button" @click="execCmd('bold')"><b>B</b></button>
          <button type="button" @click="execCmd('italic')"><i>I</i></button>
          <button type="button" @click="insertLink()">🔗</button>
        </div>
        <div
          ref="textoEditorRef"
          class="rich-editor"
          contenteditable="true"
          @input="syncTexto"
        />
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/depoimentos" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/depoimentos'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Criar') }}
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

// Stars
.star-row { display: flex; align-items: center; gap: 4px; padding: 8px 0; }
.star-btn {
  background: none; border: none; font-size: 24px; cursor: pointer;
  color: #444; padding: 0 1px; transition: color 0.15s; line-height: 1;
  &.active { color: #facc15; }
  &:hover { color: #fbbf24; }
}
.star-count { font-size: 13px; color: #888; margin-left: 6px; }

// Avatar upload
.avatar-upload-row { display: flex; gap: 12px; align-items: center; }
.avatar-thumb {
  width: 52px; height: 52px; border-radius: 50%;
  background: #1e2d3d; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #333;
  img { width: 100%; height: 100%; object-fit: cover; }
  .avatar-loading, .avatar-empty { font-size: 20px; color: #555; }
}
.avatar-actions { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.btn-upload {
  display: inline-flex; align-items: center; gap: 6px;
  background: #1e3a5f; border: 1px solid #2563eb; color: #93c5fd;
  padding: 6px 12px; border-radius: 6px; font-size: 13px; cursor: pointer;
  &:hover { background: #1e40af; }
}
.cf-id-input { font-size: 13px; }

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

// Rich editor
.rich-toolbar {
  display: flex; gap: 4px; margin-bottom: 4px;
  button {
    padding: 3px 10px; background: #2a2a2a; border: 1px solid #444;
    color: #eee; border-radius: 4px; font-size: 13px; cursor: pointer;
    &:hover { background: #3a3a3a; }
  }
}
.rich-editor {
  padding: 10px 13px; border: 1px solid #999; border-radius: 6px;
  min-height: 120px; color: white; background: transparent;
  font-size: 15px; font-family: inherit; outline: none;
  &:focus { border-color: #6b7280; }
  a { color: #60a5fa; }
}
</style>
