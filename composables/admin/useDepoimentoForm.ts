import type { Ref } from 'vue';

export function useDepoimentoForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive({
    nome: '',
    foto_cf_id: '',
    rating: 5,
    data: '',
    texto: '',
    link: '',
    featured: false,
    portfolio_link: '',
    ordem: 0,
  });

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const d = await adminFetch<any>(`/api/admin/depoimentos/${idParam.value}`);
      form.nome = d.nome;
      form.foto_cf_id = d.foto_cf_id ?? '';
      form.rating = d.rating;
      form.data = d.data ?? '';
      form.texto = d.texto;
      form.link = d.link ?? '';
      form.featured = d.featured === 1;
      form.portfolio_link = d.portfolio_link ?? '';
      form.ordem = d.ordem;
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/depoimentos');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: () => void) {
    if (!form.nome || !form.texto) {
      showMessage('Nome e texto são obrigatórios', 'error');
      return;
    }
    saving.value = true;
    try {
      const body = { ...form };
      if (isEdit.value) {
        await adminFetch(`/api/admin/depoimentos/${idParam.value}`, { method: 'PUT', body });
        showMessage('Depoimento atualizado!', 'success');
      } else {
        await adminFetch('/api/admin/depoimentos', { method: 'POST', body });
        showMessage('Depoimento criado!', 'success');
      }
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, init, save };
}
