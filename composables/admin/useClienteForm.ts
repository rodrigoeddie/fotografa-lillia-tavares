import type { Ref } from 'vue';

export function useClienteForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving = ref(false);
  const form = reactive({ nome: '', email: '', celular: '', senha: '', bg_image: '' });

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const c = await adminFetch<any>(`/api/admin/clientes/${idParam.value}`);
      form.nome = c.nome;
      form.email = c.email;
      form.celular = c.celular ?? '';
      form.senha = '';
      form.bg_image = c.bg_image ?? '';
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/clientes');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: (id?: number) => void) {
    if (!form.nome || !form.email) {
      showMessage('Nome e e-mail são obrigatórios', 'error');
      return;
    }
    if (!form.celular) {
      showMessage('Celular é obrigatório', 'error');
      return;
    }
    if ((form.celular.replace(/\D/g, '')).length < 10) {
      showMessage('Celular deve incluir DDD (mínimo 10 dígitos)', 'error');
      return;
    }
    if (!isEdit.value && !form.senha) {
      showMessage('Senha é obrigatória para novo cliente', 'error');
      return;
    }
    saving.value = true;
    try {
      if (isEdit.value) {
        await adminFetch(`/api/admin/clientes/${idParam.value}`, {
          method: 'PUT',
          body: { nome: form.nome, email: form.email, celular: form.celular || null, bg_image: form.bg_image || null, ...(form.senha ? { senha: form.senha } : {}) },
        });
        showMessage('Cliente atualizado!', 'success');
        onSuccess();
      } else {
        const res = await adminFetch<{ success: true; id: number }>('/api/admin/clientes', {
          method: 'POST',
          body: { nome: form.nome, email: form.email, celular: form.celular || null, senha: form.senha, bg_image: form.bg_image || null },
        });
        showMessage('Cliente criado!', 'success');
        onSuccess(res.id);
      }
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, init, save };
}
