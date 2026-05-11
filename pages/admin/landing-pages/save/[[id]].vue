<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();
const idParam = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return id ? Number(id) : undefined;
});

const { isEdit, loading, saving, form, init, save } = useLandingPageForm(idParam);

const seoEditorRef = ref<{ save: () => Promise<number | null> } | null>(null);

onMounted(init);

async function onSaved(_lpId: number) {
  // Após salvar a LP (com ID conhecido), persiste o SEO via SeoEditor.
  await seoEditorRef.value?.save();
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

      <div v-if="isEdit" class="seo-section">
        <h3 class="section-title">SEO desta landing page</h3>
        <AdminSeoEditor
          ref="seoEditorRef"
          entity-type="lp"
          :entity-id="idParam"
          :page-url="`https://fotografalilliatavares.com.br${form.rota}`"
          mode="inline"
        />
      </div>
      <p v-else class="seo-hint">
        Salve a landing page primeiro para poder editar o SEO desta página.
      </p>

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

.seo-section {
  margin-top: 32rem;

  .section-title {
    font-size: 16rem;
    margin: 0 0 12rem;
    color: #ddd;
  }
}

.seo-hint {
  margin-top: 24rem;
  padding: 16rem;
  background: #1a1a1a;
  border: 1rem dashed #444;
  border-radius: 8rem;
  color: #888;
  font-size: 13rem;
  text-align: center;
}
</style>
