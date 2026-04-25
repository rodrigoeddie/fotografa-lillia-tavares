<script lang="ts" setup>
definePageMeta({ layout: 'admin' });
const route = useRoute();
const router = useRouter();

const idParam = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : undefined;
});

const {
  isEdit, loading, saving, form, clientes, produtos, produtoSelecionado,
  clienteNome, init, save,
} = useSessaoForm(idParam);

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/sessoes" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? `Editar sessão${clienteNome ? ` — ${clienteNome}` : ''}` : 'Nova sessão' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">
      <div class="form-grid">

        <!-- Cliente: select em criação, texto informativo em edição -->
        <div v-if="!isEdit" class="form-field">
          <label>Cliente</label>
          <select v-model="form.cliente_id">
            <option value="">Selecione um cliente</option>
            <option v-for="c in clientes" :key="c.id" :value="c.id">{{ c.nome }} ({{ c.email }})</option>
          </select>
        </div>
        <div v-else class="form-field">
          <label>Cliente</label>
          <input :value="clienteNome" type="text" disabled />
        </div>

        <div class="form-field">
          <label>Nome da sessão <small>(ex: Ensaio Mês Maio 2026)</small></label>
          <input v-model="form.nome_sessao" type="text" placeholder="Nome descritivo" />
        </div>
        <div class="form-field">
          <label>Tipo do produto</label>
          <select v-model="form.produto_tipo">
            <option value="">Selecione o produto</option>
            <option v-for="p in produtos" :key="p.title" :value="p.title">{{ p.title }}</option>
          </select>
        </div>
        <div v-if="produtoSelecionado" class="form-field">
          <label>Pacote</label>
          <select v-model.number="form.pacote_index">
            <option v-for="(pkg, i) in produtoSelecionado.packages" :key="i" :value="i">{{ pkg.title }}</option>
          </select>
        </div>
        <div class="form-field">
          <label>Fotos incluídas no pacote</label>
          <input v-model.number="form.fotos_incluidas" type="number" min="0" />
          <small v-if="form.fotos_incluidas === 0 && produtoSelecionado" class="field-hint warn">⚠️ Defina no editor de Investimento</small>
        </div>
        <div class="form-field">
          <label>Preço foto extra (R$)</label>
          <input v-model.number="form.preco_foto_extra" type="number" min="0" step="1" />
          <small v-if="form.preco_foto_extra === 0 && produtoSelecionado" class="field-hint warn">⚠️ Defina no editor de Investimento</small>
        </div>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/sessoes" class="btn-secondary">Cancelar</NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save((newId) => newId ? router.push(`/admin/sessoes/${newId}/fotos`) : router.push('/admin/sessoes'))">
          {{ saving ? 'Salvando...' : (isEdit ? '💾 Salvar alterações' : '✓ Criar sessão') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
.field-hint { font-size: 11px; color: #6b7280; &.warn { color: #b45309; } }
</style>
