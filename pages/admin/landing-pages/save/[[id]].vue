<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();
const idParam = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, init, save } = useLandingPageForm(idParam);

onMounted(init);

function onSaved() {
  router.push('/admin/landing-pages');
}
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/landing-pages" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar Landing Page' : 'Nova Landing Page' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <form v-else @submit.prevent="save(onSaved)" class="form-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Slug *</label>
          <input v-model="form.slug" required pattern="[a-z0-9\-]+" placeholder="ex: corporativo" />
          <small>Identificador URL-friendly (apenas letras minúsculas, números e hífens)</small>
        </div>

        <div class="form-field">
          <label>Rota no site *</label>
          <input v-model="form.rota" required placeholder="/ensaio-profissional-em-mogi" />
          <small>Caminho que renderiza esta LP (deve começar com /)</small>
        </div>

        <div class="form-field">
          <label>Título interno *</label>
          <input v-model="form.titulo" required placeholder="ex: Ensaio Corporativo Mogi" />
          <small>Nome usado apenas no admin para identificar a LP</small>
        </div>

        <div class="form-field">
          <label>Classe SCSS (opcional)</label>
          <input v-model="form.lp_class" placeholder="ex: lp-corporativo" />
          <small>Classe CSS aplicada ao wrapper da página</small>
        </div>

        <div class="form-field">
          <label>Descrição interna</label>
          <input v-model="form.descricao" placeholder="Notas administrativas (opcional)" />
        </div>

        <div class="form-field">
          <label class="row">
            <input type="checkbox" v-model="form.ativo" />
            <span>Ativa (publicada)</span>
          </label>
        </div>
      </div>

      <AdminLandingPagesBlockManager v-model="form.blocks" />

      <div class="form-actions">
        <NuxtLink to="/admin/landing-pages" class="btn-secondary">Cancelar</NuxtLink>
        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar LP') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
