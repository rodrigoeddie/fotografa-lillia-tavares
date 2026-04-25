<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const cfUrl = 'https://imagedelivery.net/O6nFDZdJNNmAV7RmVd-_zw/';
const { isEdit, loading, saving, form, init, save } = useBlogPostForm(idParam);

const categoriasOptions = [
  'fotografia-corporativa',
  'cenarios-tematicos',
  'presentes',
  'dicas',
];

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/blog" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar post' : 'Novo post' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Slug</label>
          <input v-model="form.slug" type="text" placeholder="meu-post-sobre-ensaio" />
        </div>
        <div class="form-field">
          <label>Categoria</label>
          <select v-model="form.categoria">
            <option value="">Selecione...</option>
            <option v-for="c in categoriasOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
        <div class="form-field form-field--full">
          <label>Título</label>
          <input v-model="form.titulo" type="text" />
        </div>
        <div class="form-field form-field--full">
          <label>Descrição (meta)</label>
          <textarea v-model="form.descricao" rows="3" />
        </div>
        <div class="form-field">
          <label>Data</label>
          <input v-model="form.data" type="date" />
        </div>
        <div class="form-field">
          <label>ID imagem capa (CF Images)</label>
          <input v-model="form.imagem_cf_id" type="text" />
          <img v-if="form.imagem_cf_id" :src="`${cfUrl}${form.imagem_cf_id}/public`" class="cover-preview" alt="" />
        </div>
        <div class="form-field form-field--full">
          <label>Conteúdo (HTML)</label>
          <textarea v-model="form.conteudo" rows="15" class="code-textarea" />
        </div>
        <div class="form-field form-field--full">
          <label>Keywords SEO (uma por linha)</label>
          <div v-for="(_, i) in form.seo_keywords" :key="i" class="includes-row">
            <input v-model="form.seo_keywords[i]" type="text" />
            <button class="btn-icon btn-danger" @click="form.seo_keywords.splice(i, 1)">✕</button>
          </div>
          <button class="btn-secondary btn-sm" @click="form.seo_keywords.push('')">+ Keyword</button>
        </div>
        <div class="form-field">
          <label>Ativo?</label>
          <label class="checkbox-label"><input v-model="form.ativo" type="checkbox" /> Publicado</label>
        </div>
      </div>
      <div class="form-actions">
        <NuxtLink to="/admin/blog" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/blog'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Publicar') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.cover-preview { width: 100%; max-width: 300px; border-radius: 8px; margin-top: 0.5rem; }
.code-textarea { font-family: monospace; font-size: 0.85rem; }
.includes-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; input { flex: 1; } }
.checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-weight: normal; }
</style>
