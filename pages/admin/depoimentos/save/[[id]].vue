<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const cfUrl = 'https://imagedelivery.net/O6nFDZdJNNmAV7RmVd-_zw/';
const { isEdit, loading, saving, form, init, save } = useDepoimentoForm(idParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/depoimentos" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar depoimento' : 'Novo depoimento' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Nome</label>
          <input v-model="form.nome" type="text" />
        </div>
        <div class="form-field">
          <label>Rating (1-5)</label>
          <input v-model.number="form.rating" type="number" min="1" max="5" />
        </div>
        <div class="form-field">
          <label>Data</label>
          <input v-model="form.data" type="text" placeholder="Há 8 meses atrás" />
        </div>
        <div class="form-field">
          <label>Link (Google Maps)</label>
          <input v-model="form.link" type="url" />
        </div>
        <div class="form-field">
          <label>Portfolio link</label>
          <input v-model="form.portfolio_link" type="text" placeholder="corporativo/nome-cliente" />
        </div>
        <div class="form-field">
          <label>Ordem</label>
          <input v-model.number="form.ordem" type="number" />
        </div>
        <div class="form-field">
          <label>ID da foto (CF Images)</label>
          <input v-model="form.foto_cf_id" type="text" />
          <img v-if="form.foto_cf_id" :src="`${cfUrl}${form.foto_cf_id}/public`" class="avatar-preview" alt="" />
        </div>
        <div class="form-field">
          <label>Featured?</label>
          <label class="checkbox-label">
            <input v-model="form.featured" type="checkbox" /> Destacar na home
          </label>
        </div>
        <div class="form-field form-field--full">
          <label>Texto</label>
          <textarea v-model="form.texto" rows="5" />
        </div>
      </div>
      <div class="form-actions">
        <NuxtLink to="/admin/depoimentos" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/depoimentos'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Criar') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 0.5rem;
}
.checkbox-label { display: flex; align-items: center; gap: 0.5rem; font-weight: normal; }
</style>
