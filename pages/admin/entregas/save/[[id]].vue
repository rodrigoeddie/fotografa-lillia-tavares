<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const entregaIdParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const {
  isEdit, loading, saving, form, sessoes, sessoNome,
  uploadProgress, isUploading, uploadDone, zipFileRef, selectedZipFile, replacingZip,
  bgFileRef, isBgUploading, replacingBg,
  cfUrl, init, onZipSelected, startReplaceZip, removeZip, startReplaceBg, uploadBgImage, save,
} = useEntregaForm(entregaIdParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/entregas" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? `Editar entrega${sessoNome ? ` — ${sessoNome}` : ''}` : 'Nova entrega' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">

      <!-- Sessão (só em criação) -->
      <div v-if="!isEdit" class="form-field">
        <label>Sessão do ensaio</label>
        <select v-model.number="form.sessao_id">
          <option :value="0">Selecione a sessão</option>
          <option v-for="s in sessoes" :key="s.id" :value="s.id">{{ s.nome_sessao }} — {{ s.cliente_nome }}</option>
        </select>
      </div>

      <!-- ZIP -->
      <div class="upload-section">
        <h3>📦 Arquivo ZIP do ensaio</h3>
        <div v-if="form.r2_key && !replacingZip" class="file-card">
          <div class="file-card-icon">📦</div>
          <div class="file-card-info">
            <strong>{{ form.nome_arquivo || form.r2_key.split('/').pop() }}</strong>
            <span class="text-muted text-sm">Arquivo salvo no R2</span>
          </div>
          <div class="file-card-actions">
            <button class="btn-sm" @click="startReplaceZip">🔄 Substituir</button>
            <button class="btn-sm btn-danger-sm" @click="removeZip">🗑 Remover</button>
          </div>
        </div>
        <template v-else>
          <div v-if="isUploading" class="upload-progress-card">
            <span>⬆ Enviando {{ selectedZipFile?.name }}…</span>
            <div class="progress-bar"><div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div></div>
            <span class="progress-pct">{{ uploadProgress }}%</span>
          </div>
          <div v-else class="upload-drop" @click="zipFileRef?.click()">📁 Clique para selecionar o arquivo ZIP</div>
          <input ref="zipFileRef" type="file" accept=".zip,.rar,.7z" style="display:none" @change="onZipSelected" />
        </template>
        <p v-if="uploadDone" class="upload-success">✅ Upload concluído!</p>
      </div>

      <!-- Nome do arquivo -->
      <div class="form-field">
        <label>Nome do arquivo <small>(exibido ao cliente)</small></label>
        <input v-model="form.nome_arquivo" type="text" placeholder="Ensaio_Lillia_2026.zip" />
      </div>

      <!-- Mensagem -->
      <div class="form-field">
        <label>Mensagem para o cliente</label>
        <textarea v-model="form.mensagem" rows="4" placeholder="Olá! Seu ensaio está pronto com muito amor e cuidado..."></textarea>
      </div>

      <!-- Imagem de fundo -->
      <div class="form-field">
        <label>Imagem de fundo da página</label>
        <div class="bg-picker">
          <div v-if="form.bg_image_id && !replacingBg" class="bg-card">
            <img :src="cfUrl(form.bg_image_id)" alt="Fundo atual" class="bg-thumb" />
            <div class="bg-card-actions">
              <button class="btn-sm" @click="startReplaceBg">🔄 Substituir</button>
              <button class="btn-sm btn-danger-sm" @click="form.bg_image_id = ''; replacingBg = false">🗑 Remover</button>
            </div>
          </div>
          <template v-else>
            <div class="upload-drop" style="padding: 16px;" @click="bgFileRef?.click()">
              <span v-if="isBgUploading">⏳ Enviando imagem...</span>
              <span v-else>🖼 Clique para escolher uma imagem de fundo</span>
            </div>
          </template>
          <input ref="bgFileRef" type="file" accept="image/*" style="display:none" :disabled="isBgUploading" @change="uploadBgImage" />
        </div>
      </div>

      <!-- Ativo -->
      <div class="form-field">
        <label>Link de entrega</label>
        <label class="toggle-wrap">
          <input type="checkbox" v-model="form.ativo" />
          <span class="toggle-track" :style="form.ativo ? 'background:#1f2937' : ''">
            <span class="toggle-thumb" :style="form.ativo ? 'transform:translateX(16px)' : ''"></span>
          </span>
          <span>{{ form.ativo ? '🟢 Ativo — cliente pode acessar' : '🔴 Inativo — link desabilitado' }}</span>
        </label>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/entregas" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving || isUploading || isBgUploading" @click="save(() => router.push('/admin/entregas'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '💾 Criar entrega') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
