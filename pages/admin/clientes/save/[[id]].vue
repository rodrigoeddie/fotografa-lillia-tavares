<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, init, save } = useClienteForm(idParam);

const CF_IMG_BASE = 'https://images.fotografalilliatavares.com.br/images/';
const uploading = ref(false);

async function uploadBgImage(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  try {
    const result = await $fetch<any>('/api/upload', { method: 'POST', body: formData });
    if (result.success && result.result?.id) {
      form.bg_image = result.result.id;
    }
  } catch (err: any) {
    console.error('Upload falhou', err);
  } finally {
    uploading.value = false;
  }
}

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/clientes" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar cliente' : 'Novo cliente' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Nome</label>
          <input v-model="form.nome" type="text" placeholder="Nome completo" />
        </div>
        <div class="form-field">
          <label>E-mail</label>
          <input v-model="form.email" type="email" placeholder="email@exemplo.com" />
        </div>
        <div class="form-field">
          <label>{{ isEdit ? 'Nova senha' : 'Senha' }} <small v-if="isEdit">(deixe em branco para manter)</small></label>
          <input v-model="form.senha" type="password" :placeholder="isEdit ? 'Nova senha' : 'Senha de acesso'" autocomplete="new-password" />
        </div>
        <div class="form-field">
          <label>Celular <small>(opcional — sem DDD, ex: 95980-1065)</small></label>
          <input v-model="form.celular" type="tel" placeholder="95980-1065" maxlength="10" />
        </div>
      </div>

      <!-- Background image -->
      <div class="form-section">
        <h3 class="form-section-title">Imagem de fundo da área do cliente</h3>
        <div class="bg-image-editor">
          <div v-if="form.bg_image" class="bg-preview">
            <img :src="`${CF_IMG_BASE}${form.bg_image}/public`" alt="Preview" />
            <button class="btn-remove-bg" @click="form.bg_image = ''" title="Remover imagem">✕</button>
          </div>
          <div v-else class="bg-placeholder">Nenhuma imagem selecionada</div>
          <div class="bg-upload-row">
            <label class="btn-upload" :class="{ loading: uploading }">
              {{ uploading ? 'Enviando...' : '📤 Enviar imagem' }}
              <input type="file" accept="image/*" @change="uploadBgImage" :disabled="uploading" />
            </label>
            <span class="or-sep">ou</span>
            <input
              v-model="form.bg_image"
              type="text"
              class="bg-id-input"
              placeholder="ID da imagem no Cloudflare"
            />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/clientes" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/clientes'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '💾 Criar cliente') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-section {
  margin-top: 28px;
  border-top: 1px solid #222;
  padding-top: 20px;
}

.form-section-title {
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
  margin: 0 0 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.bg-image-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bg-preview {
  position: relative;
  width: 100%;
  max-width: 480px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #333;
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
  }
}

.btn-remove-bg {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(180,0,0,0.8); }
}

.bg-placeholder {
  width: 100%;
  max-width: 480px;
  height: 120px;
  border: 2px dashed #333;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 13px;
}

.bg-upload-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-upload {
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  color: #60a5fa;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  &.loading { opacity: 0.6; cursor: not-allowed; }
  input[type='file'] { display: none; }
  &:hover:not(.loading) { background: #253d55; }
}

.or-sep { font-size: 12px; color: #555; }

.bg-id-input {
  flex: 1;
  min-width: 200px;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 5px;
  color: #7eb6d4;
  font-size: 13px;
  font-family: monospace;
  padding: 7px 10px;
  &:focus { outline: none; border-color: #444; }
}
</style>
