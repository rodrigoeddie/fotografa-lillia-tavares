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

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/portfolio" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar portfolio work' : 'Novo portfolio work' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>
      <div class="form-card">
        <h3 class="form-section-title">Dados do work</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Slug</label>
            <input v-model="form.slug" type="text" placeholder="corporativo/nome-cliente" />
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
            <input v-model="form.local" type="text" placeholder="Estúdio Lillia Tavares" />
          </div>
          <div class="form-field">
            <label>Cor destaque</label>
            <input v-model="form.cor_destaque" type="color" />
          </div>
          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>
          <div class="form-field">
            <label>Mostrar na home?</label>
            <label class="checkbox-label"><input v-model="form.home" type="checkbox" /> Exibir na home</label>
          </div>
          <div class="form-field" v-if="form.home">
            <label>Ordem na home</label>
            <input v-model.number="form.home_order" type="number" />
          </div>
          <div class="form-field">
            <label>Ativo?</label>
            <label class="checkbox-label"><input v-model="form.ativo" type="checkbox" /> Visível no site</label>
          </div>
        </div>
      </div>

      <div class="form-card">
        <h3 class="form-section-title">Depoimento inline</h3>
        <div class="form-grid">
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

.code-textarea { font-family: monospace; font-size: 0.85rem; }
.includes-row { display: flex; gap: 0.5rem; margin-bottom: 0.4rem; input { flex: 1; } }
.checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-weight: normal; }
</style>
