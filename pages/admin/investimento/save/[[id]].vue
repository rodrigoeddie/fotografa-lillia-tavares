<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, pacotes, addPacote, removePacote, init, save } = useProdutoForm(idParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/investimento" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar produto' : 'Novo produto' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>
      <div class="form-card">
        <h3 class="form-section-title">Dados gerais</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Slug (URL)</label>
            <input v-model="form.slug" type="text" placeholder="corporativo" />
          </div>
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.title" type="text" placeholder="Ensaio Corporativo" />
          </div>
          <div class="form-field">
            <label>Slug LP (landing page)</label>
            <input v-model="form.lp_slug" type="text" placeholder="corporativo" />
          </div>
          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>
          <div class="form-field form-field--full">
            <label>Descrição</label>
            <textarea v-model="form.description" rows="3" />
          </div>
          <div class="form-field form-field--full">
            <label>Ícone SVG</label>
            <textarea v-model="form.icon" rows="3" placeholder="<svg ...>" />
          </div>
          <div class="form-field">
            <label>Ativo</label>
            <label class="checkbox-label">
              <input v-model="form.active" type="checkbox" /> Produto ativo
            </label>
          </div>
        </div>
      </div>

      <div class="form-card">
        <h3 class="form-section-title">CTA (chamada para ação)</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Título CTA</label>
            <input v-model="form.cta_title" type="text" />
          </div>
          <div class="form-field">
            <label>Descrição CTA</label>
            <input v-model="form.cta_description" type="text" />
          </div>
          <div class="form-field form-field--full">
            <label>Mensagem WhatsApp</label>
            <input v-model="form.cta_whatsapp_msg" type="text" />
          </div>
        </div>
      </div>

      <div class="form-card">
        <h3 class="form-section-title">O que está incluso</h3>
        <p class="form-hint">Um item por linha</p>
        <div v-for="(_, i) in form.includes" :key="i" class="includes-row">
          <input v-model="form.includes[i]" type="text" />
          <button class="btn-icon btn-danger" @click="form.includes.splice(i, 1)">✕</button>
        </div>
        <button class="btn-secondary btn-sm" @click="form.includes.push('')">+ Adicionar item</button>
      </div>

      <div class="form-card">
        <div class="form-card-header">
          <h3 class="form-section-title">Pacotes</h3>
          <button class="btn-secondary btn-sm" @click="addPacote">+ Adicionar pacote</button>
        </div>
        <div v-for="(pacote, pi) in pacotes" :key="pi" class="pacote-block">
          <div class="pacote-block-header">
            <strong>Pacote {{ pi + 1 }}: {{ pacote.title || 'Sem título' }}</strong>
            <button class="btn-icon btn-danger" @click="removePacote(pi)">🗑</button>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label>Título</label>
              <input v-model="pacote.title" type="text" />
            </div>
            <div class="form-field">
              <label>Subtítulo</label>
              <input v-model="pacote.subtitle" type="text" />
            </div>
            <div class="form-field">
              <label>Preço (R$)</label>
              <input v-model.number="pacote.preco" type="number" step="0.01" />
            </div>
            <div class="form-field">
              <label>Nº parcelas</label>
              <input v-model.number="pacote.num_parcelas" type="number" />
            </div>
            <div class="form-field">
              <label>Preço por parcela</label>
              <input v-model.number="pacote.preco_parcelas" type="number" step="0.01" />
            </div>
            <div class="form-field">
              <label>Fotos incluídas</label>
              <input v-model.number="pacote.fotos_incluidas" type="number" />
            </div>
            <div class="form-field">
              <label>Preço foto extra</label>
              <input v-model.number="pacote.preco_foto_extra" type="number" step="0.01" />
            </div>
            <div class="form-field">
              <label>Recomendado?</label>
              <label class="checkbox-label">
                <input v-model="pacote.is_recommended" type="checkbox" /> Destacar como recomendado
              </label>
            </div>
          </div>
          <div class="form-field">
            <label>Features (uma por linha)</label>
            <div v-for="(_, fi) in pacote.features" :key="fi" class="includes-row">
              <input v-model="pacote.features[fi]" type="text" />
              <button class="btn-icon btn-danger" @click="pacote.features.splice(fi, 1)">✕</button>
            </div>
            <button class="btn-secondary btn-sm" @click="pacote.features.push('')">+ Feature</button>
          </div>
        </div>
        <p v-if="pacotes.length === 0" class="empty-hint">Nenhum pacote adicionado.</p>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/investimento" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/investimento'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '💾 Criar produto') }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.includes-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  input { flex: 1; }
}

.pacote-block {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
}
</style>
