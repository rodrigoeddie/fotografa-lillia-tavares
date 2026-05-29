<script lang="ts" setup>
import { ROLE_LABELS } from '~/composables/admin/useAdminAuth';

definePageMeta({ layout: 'admin' });

const {
  users, loading, saving,
  modalOpen, passwdOpen, editingId,
  form, passwdForm,
  load, openCreate, openEdit, openPassword,
  save, savePassword, remove,
} = useAdminUserForm();

const roleOptions = [
  { value: 'super_admin', label: 'Super Admin — acesso total' },
  { value: 'editor',      label: 'Editor — conteúdo do site' },
  { value: 'sessions',    label: 'Atendimento — clientes e ensaios' },
];

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div class="row aic">
        <span class="material-symbols-outlined">manage_accounts</span>
        <h2>Usuários Admin</h2>
        <p class="dep-meta"> - {{ users.length }} usuários</p>
      </div>
      <button class="btn-add-item" @click="openCreate">
        <span class="material-symbols-outlined">person_add</span>
        <span>Novo usuário</span>
      </button>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>
    <p v-else-if="users.length === 0" class="list-empty">Nenhum usuário cadastrado.</p>

    <div v-else class="item-list wrap">
      <div v-for="u in users" :key="u.id" class="item-row item-300">
        <div class="user-info">
          <span class="material-symbols-outlined user-icon">account_circle</span>
          <div class="item-info">
            <span class="item-title">{{ u.username }}</span>
            <span v-if="u.email" class="item-sub">{{ u.email }}</span>
            <span class="role-badge" :class="`role-${u.role}`">{{ ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] ?? u.role }}</span>
          </div>
        </div>
        <div class="item-actions">
          <button class="btn-icon" title="Editar" @click="openEdit(u)">
            <span class="material-symbols-outlined">edit</span>
            <span>Editar</span>
          </button>
          <button class="btn-icon btn-warning" title="Trocar senha" @click="openPassword(u)">
            <span class="material-symbols-outlined">lock_reset</span>
            <span>Senha</span>
          </button>
          <button class="btn-icon btn-danger" title="Excluir" @click="remove(u)">
            <span class="material-symbols-outlined">delete</span>
            <span>Deletar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal criar/editar -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
      <div class="modal-box">
        <div class="modal-head">
          <h3>{{ editingId ? 'Editar usuário' : 'Novo usuário' }}</h3>
          <button class="modal-close" @click="modalOpen = false">✕</button>
        </div>

        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" type="text" placeholder="nome_usuario" autocomplete="off" />
        </div>
        <div class="form-group">
          <label>E-mail</label>
          <input v-model="form.email" type="email" placeholder="email@exemplo.com" autocomplete="off" />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="form.role">
            <option v-for="r in roleOptions" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
        </div>
        <div v-if="!editingId" class="form-group">
          <label>Senha <span class="hint">(mín. 8 caracteres)</span></label>
          <input v-model="form.password" type="password" placeholder="Senha" autocomplete="new-password" />
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" @click="modalOpen = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="save">
            {{ saving ? 'Salvando...' : editingId ? 'Salvar' : 'Criar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal trocar senha -->
    <div v-if="passwdOpen" class="modal-overlay" @click.self="passwdOpen = false">
      <div class="modal-box">
        <div class="modal-head">
          <h3>Trocar senha — {{ passwdForm.username }}</h3>
          <button class="modal-close" @click="passwdOpen = false">✕</button>
        </div>
        <div class="form-group">
          <label>Nova senha <span class="hint">(mín. 8 caracteres)</span></label>
          <input v-model="passwdForm.password" type="password" placeholder="Nova senha" autocomplete="new-password" />
        </div>
        <div class="modal-actions">
          <button class="btn-cancel" @click="passwdOpen = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="savePassword">
            {{ saving ? 'Salvando...' : 'Alterar senha' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.user-icon {
  font-size: 32px;
  color: #555;
  flex-shrink: 0;
}

.role-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.role-super_admin { background: #1e3a5f; color: #60a5fa; }
  &.role-editor      { background: #1a3a1a; color: #4ade80; }
  &.role-sessions    { background: #3a2a0a; color: #fbbf24; }
}

.btn-warning {
  color: #f59e0b;
  border-color: #78350f;
  &:hover { background: #451a03; color: #fcd34d; border-color: #f59e0b; }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-box {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 28px;
  width: 440px;
  max-width: 95vw;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h3 { font-size: 16px; color: #eee; }
}

.modal-close {
  background: #333;
  border: none;
  color: #eee;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  &:hover { background: #444; }
}

.form-group {
  margin-bottom: 16px;

  label {
    display: block;
    font-size: 12px;
    color: #888;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input, select {
    width: 100%;
    padding: 10px 12px;
    background: #222;
    border: 1px solid #444;
    color: #eee;
    border-radius: 6px;
    font-size: 14px;
    &:focus { outline: none; border-color: #2563eb; }
  }

  select option { background: #222; }
}

.hint {
  color: #555;
  font-size: 11px;
  text-transform: none;
  letter-spacing: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid #444;
  color: #888;
  padding: 8px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  &:hover { border-color: #666; color: #ccc; }
}

.btn-save {
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover:not(:disabled) { background: #1d4ed8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}
</style>
