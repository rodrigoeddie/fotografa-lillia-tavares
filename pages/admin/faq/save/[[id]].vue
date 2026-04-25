<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, perguntas, addPergunta, removePergunta, init, save } = useFaqForm(idParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/faq" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar categoria FAQ' : 'Nova categoria FAQ' }}</h2>
    </div>
    <div v-if="loading" class="loading-hint">Carregando...</div>
    <template v-else>
      <div class="form-card">
        <h3 class="form-section-title">Categoria</h3>
        <div class="form-grid">
          <div class="form-field">
            <label>Título</label>
            <input v-model="form.titulo" type="text" />
          </div>
          <div class="form-field">
            <label>Slug</label>
            <input v-model="form.slug" type="text" placeholder="sobre-ensaios" />
          </div>
          <div class="form-field">
            <label>Ordem</label>
            <input v-model.number="form.ordem" type="number" />
          </div>
        </div>
      </div>

      <div class="form-card">
        <div class="form-card-header">
          <h3 class="form-section-title">Perguntas</h3>
          <button class="btn-secondary btn-sm" @click="addPergunta">+ Adicionar pergunta</button>
        </div>
        <div v-for="(p, i) in perguntas" :key="i" class="pergunta-block">
          <div class="pergunta-block-header">
            <strong>{{ i + 1 }}.</strong>
            <button class="btn-icon btn-danger" @click="removePergunta(i)">🗑</button>
          </div>
          <div class="form-field">
            <label>Pergunta</label>
            <input v-model="p.pergunta" type="text" />
          </div>
          <div class="form-field">
            <label>Resposta</label>
            <textarea v-model="p.resposta" rows="4" />
          </div>
        </div>
        <p v-if="perguntas.length === 0" class="empty-hint">Nenhuma pergunta adicionada.</p>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/faq" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save(() => router.push('/admin/faq'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar' : '💾 Criar') }}
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

.pergunta-block {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
}
</style>
