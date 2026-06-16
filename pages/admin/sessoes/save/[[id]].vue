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

const modalClienteOpen = ref(false);

function onClienteCriado(cliente: { id: number; nome: string; email: string }) {
  clientes.value.push(cliente);
  form.cliente_id = cliente.id as any;
}
</script>

<template>
  <div class="page">
    <NuxtLink to="/admin/sessoes" class="page-back">← Voltar</NuxtLink>
    <div class="page-header">
      <h2>{{ isEdit ? `Editar sessão${clienteNome ? ` — ${clienteNome}` : ''}` : 'Nova sessão' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <div v-else class="form-card">
      <div class="form-grid">

        <!-- Cliente: searchable select em criação, texto informativo em edição -->
        <div v-if="!isEdit" class="form-field">
          <label>Cliente</label>
          <div class="cliente-row">
            <AdminClienteSearchSelect
              v-model="form.cliente_id"
              :options="clientes"
              class="cliente-select"
            />
            <button
              type="button"
              class="btn-add-cliente"
              title="Adicionar novo cliente"
              @click="modalClienteOpen = true"
            >
              <span class="material-symbols-outlined">person_add</span>
            </button>
          </div>
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
        <div class="form-field">
          <label>Pacote</label>
          <select v-model.number="form.pacote_index" :disabled="!produtoSelecionado">
            <option v-if="!produtoSelecionado" value="">Selecione o tipo de produto primeiro</option>
            <template v-else>
              <option v-for="(pkg, i) in produtoSelecionado.packages" :key="i" :value="i">{{ pkg.title }}</option>
            </template>
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
        <div class="form-field">
          <label>Prazo para seleção <small>(data limite)</small></label>
          <input v-model="form.prazo_selecao" type="date" />
          <small class="field-hint">Deixe em branco para sem prazo</small>
        </div>
        <div v-if="isEdit" class="form-field">
          <label>Saldo do pacote a pagar (R$) <small>(valor restante após entrada)</small></label>
          <input v-model.number="form.valor_restante_pacote" type="number" min="0" step="0.01" placeholder="0,00" />
          <small class="field-hint">Incluído no checkout do lote 1. Deixe 0 se não houver saldo pendente.</small>
        </div>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/sessoes" class="btn-secondary">
          <span class="material-symbols-outlined"> cancel </span>
          <span>Cancelar</span>
        </NuxtLink>
        <button class="btn-primary" :disabled="saving" @click="save((newId) => newId ? router.push(`/admin/sessoes/${newId}/fotos`) : router.push('/admin/sessoes'))">
          <span class="material-symbols-outlined"> save </span>
          <span>{{ saving ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar sessão') }}</span>
        </button>
      </div>
    </div>
  </div>

  <AdminClienteModal
    :open="modalClienteOpen"
    @close="modalClienteOpen = false"
    @created="onClienteCriado"
  />
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
.field-hint { font-size: 11px; color: #6b7280; &.warn { color: #b45309; } }

.cliente-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.cliente-select {
  flex: 1;
  min-width: 0;
}

.btn-add-cliente {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 48px;
  background: #1e2d3d;
  border: 1px solid #2d4a6a;
  border-radius: 6px;
  color: #60a5fa;
  cursor: pointer;

  .material-symbols-outlined { font-size: 20px; }

  &:hover { background: #253d55; }
}
</style>
