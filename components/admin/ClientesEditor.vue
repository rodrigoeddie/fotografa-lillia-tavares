<script lang="ts" setup>
const props = defineProps<{
  showMessage: (msg: string, type: 'success' | 'error') => void;
}>();

const { adminFetch } = useAdminFetch();

interface Cliente {
  id: number;
  nome: string;
  email: string;
  criado_em: string;
}

const clientes = ref<Cliente[]>([]);
const loading = ref(false);
const saving = ref(false);

// ─── Form ────────────────────────────────────────────────────────────────────
const editingId = ref<number | null>(null);
const form = reactive({ nome: '', email: '', senha: '' });
const showForm = ref(false);

async function loadClientes() {
  loading.value = true;
  try {
    clientes.value = await adminFetch<Cliente[]>('/api/admin/clientes');
  } catch (e: any) {
    props.showMessage('Erro ao carregar clientes: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.nome = '';
  form.email = '';
  form.senha = '';
  showForm.value = true;
}

function openEdit(c: Cliente) {
  editingId.value = c.id;
  form.nome = c.nome;
  form.email = c.email;
  form.senha = '';
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
  editingId.value = null;
}

async function saveCliente() {
  if (!form.nome || !form.email) {
    props.showMessage('Nome e e-mail são obrigatórios', 'error');
    return;
  }
  if (!editingId.value && !form.senha) {
    props.showMessage('Senha é obrigatória para novo cliente', 'error');
    return;
  }
  saving.value = true;
  try {
    if (editingId.value) {
      await adminFetch(`/api/admin/clientes/${editingId.value}`, {
        method: 'PUT',
        body: { nome: form.nome, email: form.email, senha: form.senha || undefined },
      });
    } else {
      await adminFetch('/api/admin/clientes', {
        method: 'POST',
        body: { nome: form.nome, email: form.email, senha: form.senha },
      });
    }
    props.showMessage('Cliente salvo!', 'success');
    showForm.value = false;
    await loadClientes();
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

async function deleteCliente(id: number, nome: string) {
  if (!confirm(`Excluir "${nome}"? Todas as sessões vinculadas serão removidas.`)) return;
  try {
    await adminFetch(`/api/admin/clientes/${id}`, { method: 'DELETE' });
    props.showMessage('Cliente removido', 'success');
    clientes.value = clientes.value.filter((c) => c.id !== id);
  } catch (e: any) {
    props.showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  }
}

onMounted(loadClientes);
</script>

<template>
  <div class="clientes-editor">
    <div class="editor-header">
      <h2>Clientes <span class="count-badge">{{ clientes.length }}</span></h2>
      <button class="btn-primary" @click="openCreate">+ Novo cliente</button>
    </div>

    <!-- Form -->
    <div v-if="showForm" class="editor-form-card">
      <h3>{{ editingId ? 'Editar cliente' : 'Novo cliente' }}</h3>
      <div class="form-grid">
        <div class="form-field">
          <label>Nome completo</label>
          <input v-model="form.nome" type="text" placeholder="Maria Silva" autofocus />
        </div>
        <div class="form-field">
          <label>E-mail</label>
          <input v-model="form.email" type="email" placeholder="maria@exemplo.com" />
        </div>
        <div class="form-field">
          <label>{{ editingId ? 'Nova senha (deixe em branco para manter)' : 'Senha' }}</label>
          <input v-model="form.senha" type="password" placeholder="••••••••" autocomplete="new-password" />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-secondary" @click="cancelForm">Cancelar</button>
        <button class="btn-primary" @click="saveCliente" :disabled="saving">
          {{ saving ? 'Salvando...' : '💾 Salvar' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <div v-else-if="clientes.length === 0 && !showForm" class="empty-hint">
      Nenhum cliente cadastrado. Clique em "+ Novo cliente" para começar.
    </div>

    <table v-else class="data-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Desde</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clientes" :key="c.id">
          <td>{{ c.nome }}</td>
          <td class="text-muted">{{ c.email }}</td>
          <td class="text-muted text-sm">{{ new Date(c.criado_em).toLocaleDateString('pt-BR') }}</td>
          <td class="actions-cell">
            <button class="btn-icon" title="Editar" @click="openEdit(c)">✏️</button>
            <button class="btn-icon btn-danger" title="Excluir" @click="deleteCliente(c.id, c.nome)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.clientes-editor {
  padding: 24px;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  h2 {
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.editor-form-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
  }
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;

    &:focus {
      outline: none;
      border-color: #6b7280;
    }
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 8px 12px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    color: #374151;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }

  tr:hover td {
    background: #f9fafb;
  }
}

.actions-cell {
  display: flex;
  gap: 4px;
  justify-content: flex-end;
}

.count-badge {
  background: #e5e7eb;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  padding: 0.1em 0.5em;
  border-radius: 999px;
}

.text-muted { color: #6b7280; }
.text-sm { font-size: 13px; }
.loading-hint, .empty-hint { color: #9ca3af; font-size: 14px; padding: 32px 0; text-align: center; }

.btn-primary {
  background: #1f2937;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #111827; }
}

.btn-secondary {
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;

  &:hover { background: #f9fafb; }
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1;

  &:hover { background: #f3f4f6; }
  &.btn-danger:hover { background: #fef2f2; }
}
</style>
