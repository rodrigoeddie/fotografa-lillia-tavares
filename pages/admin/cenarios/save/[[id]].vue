<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const cfUrl = 'https://imagedelivery.net/O6nFDZdJNNmAV7RmVd-_zw/';
const { isEdit, loading, saving, form, cenarios, addCenario, removeCenario, init, save } = useCenarioForm(idParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/cenarios" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar página de cenários' : 'Nova página de cenários' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>
      <div class="form-card">
        <h3 class="form-section-title">Página</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Slug</label>
            <input v-model="form.slug" type="text" placeholder="estudio" />
          </div>
          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>
          <div class="form-field">
            <label>Título pré</label>
            <input v-model="form.titulo_pre" type="text" placeholder="Nossos" />
          </div>
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.titulo" type="text" placeholder="Cenários" />
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="form-card-header">
          <h3 class="form-section-title">Cenários ({{ cenarios.length }})</h3>
          <button class="btn-secondary btn-sm" @click="addCenario">+ Adicionar cenário</button>
        </div>

        <div v-for="(c, i) in cenarios" :key="i" class="cenario-block">
          <div class="cenario-block-header">
            <strong>{{ i + 1 }}. {{ c.titulo || '(sem título)' }}</strong>
            <button class="btn-icon btn-danger" @click="removeCenario(i)">🗑</button>
          </div>
          <div class="form-grid">
            <div class="form-field">
              <label>Título</label>
              <input v-model="c.titulo" type="text" />
            </div>
            <div class="form-field">
              <label>Ordem</label>
              <input v-model.number="c.ordem" type="number" />
            </div>
            <div class="form-field form-field--full">
              <label>Descrição</label>
              <textarea v-model="c.descricao" rows="3" />
            </div>
            <div class="form-field">
              <label>Imagem BG (CF ID)</label>
              <input v-model="c.imagem_bg_cf_id" type="text" />
              <img v-if="c.imagem_bg_cf_id" :src="`${cfUrl}${c.imagem_bg_cf_id}/public`" class="preview-img" alt="" />
            </div>
            <div class="form-field">
              <label>Alt imagem BG</label>
              <input v-model="c.imagem_bg_alt" type="text" />
            </div>
            <div class="form-field">
              <label>Imagem Exemplo (CF ID)</label>
              <input v-model="c.imagem_exemplo_cf_id" type="text" />
              <img v-if="c.imagem_exemplo_cf_id" :src="`${cfUrl}${c.imagem_exemplo_cf_id}/public`" class="preview-img" alt="" />
            </div>
            <div class="form-field">
              <label>Alt imagem exemplo</label>
              <input v-model="c.imagem_exemplo_alt" type="text" />
            </div>
            <div class="form-field">
              <label>Título imagem exemplo</label>
              <input v-model="c.imagem_exemplo_titulo" type="text" />
            </div>
            <div class="form-field">
              <label>Link imagem exemplo</label>
              <input v-model="c.imagem_exemplo_link" type="url" />
            </div>
            <div class="form-field">
              <label>Orientação</label>
              <select v-model="c.imagem_exemplo_orientacao">
                <option value="">—</option>
                <option value="landscape">Paisagem</option>
                <option value="portrait">Retrato</option>
              </select>
            </div>
          </div>
        </div>
        <p v-if="cenarios.length === 0" class="empty-hint">Nenhum cenário adicionado.</p>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/cenarios" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/cenarios'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Criar') }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.cenario-block-header {
  padding-bottom: 15rem;
}

.form-card-header {
  display: flex;
  padding-top: 45px;
  justify-content: space-between;
  align-items: center;
}

.cenario-block {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
}

.preview-img {
  width: 100%;
  max-width: 200px;
  border-radius: 6px;
  margin-top: 0.5rem;
}
</style>
