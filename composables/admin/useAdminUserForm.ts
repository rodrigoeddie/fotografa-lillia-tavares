export interface AdminUserItem {
  id: number;
  username: string;
  email: string | null;
  role: string;
  created_at: string;
}

export function useAdminUserForm() {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();

  const users    = ref<AdminUserItem[]>([]);
  const loading  = ref(false);
  const saving   = ref(false);
  const modalOpen    = ref(false);
  const passwdOpen   = ref(false);
  const editingId    = ref<number | null>(null);

  const form = reactive({
    username: '',
    email:    '',
    role:     'editor',
    password: '',
  });

  const passwdForm = reactive({
    userId:   0,
    username: '',
    password: '',
  });

  async function load() {
    loading.value = true;
    try {
      users.value = await adminFetch<AdminUserItem[]>('/api/admin/usuarios');
    } catch (e: any) {
      showMessage('Erro ao carregar usuários: ' + (e.statusMessage || e.message), 'error');
    } finally {
      loading.value = false;
    }
  }

  function openCreate() {
    editingId.value   = null;
    form.username     = '';
    form.email        = '';
    form.role         = 'editor';
    form.password     = '';
    modalOpen.value   = true;
  }

  function openEdit(user: AdminUserItem) {
    editingId.value = user.id;
    form.username   = user.username;
    form.email      = user.email ?? '';
    form.role       = user.role;
    form.password   = '';
    modalOpen.value = true;
  }

  function openPassword(user: AdminUserItem) {
    passwdForm.userId   = user.id;
    passwdForm.username = user.username;
    passwdForm.password = '';
    passwdOpen.value    = true;
  }

  async function save() {
    if (!form.username) {
      showMessage('Username é obrigatório', 'error');
      return;
    }
    if (!editingId.value && !form.password) {
      showMessage('Senha é obrigatória para novo usuário', 'error');
      return;
    }
    saving.value = true;
    try {
      if (editingId.value) {
        await adminFetch(`/api/admin/usuarios/${editingId.value}`, {
          method: 'PUT',
          body: { username: form.username, email: form.email || null, role: form.role },
        });
        showMessage('Usuário atualizado!', 'success');
      } else {
        await adminFetch('/api/admin/usuarios', {
          method: 'POST',
          body: { username: form.username, email: form.email || null, role: form.role, password: form.password },
        });
        showMessage('Usuário criado!', 'success');
      }
      modalOpen.value = false;
      await load();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  async function savePassword() {
    if (!passwdForm.password || passwdForm.password.length < 8) {
      showMessage('Senha deve ter no mínimo 8 caracteres', 'error');
      return;
    }
    saving.value = true;
    try {
      await adminFetch(`/api/admin/usuarios/${passwdForm.userId}/senha`, {
        method: 'PUT',
        body: { password: passwdForm.password },
      });
      showMessage('Senha alterada!', 'success');
      passwdOpen.value = false;
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  async function remove(user: AdminUserItem) {
    if (!confirm(`Excluir usuário "${user.username}"?`)) return;
    try {
      await adminFetch(`/api/admin/usuarios/${user.id}`, { method: 'DELETE' });
      showMessage('Usuário removido', 'success');
      users.value = users.value.filter((u) => u.id !== user.id);
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    }
  }

  return {
    users, loading, saving,
    modalOpen, passwdOpen, editingId,
    form, passwdForm,
    load, openCreate, openEdit, openPassword,
    save, savePassword, remove,
  };
}
