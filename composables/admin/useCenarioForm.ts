interface CenarioPaginaForm {
  slug: string;
  titulo: string;
  titulo_pre: string;
  ordem: number;
}

interface CenarioForm {
  id?: number;
  titulo: string;
  descricao: string;
  imagem_bg_cf_id: string;
  imagem_exemplo_cf_id: string;
  imagem_exemplo_alt: string;
  imagem_exemplo_link: string;
  imagem_exemplo_titulo: string;
  imagem_exemplo_orientacao: string;
  ordem: number;
}

export function useCenarioForm(idParam: Ref<number | undefined>) {
  const { adminFetch } = useAdminFetch();
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

  const isEdit = computed(() => !!idParam.value);
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive<CenarioPaginaForm>({
    slug: '',
    titulo: '',
    titulo_pre: '',
    ordem: 0,
  });

  const cenarios = ref<CenarioForm[]>([]);

  function addCenario() {
    cenarios.value.push({
      titulo: '',
      descricao: '',
      imagem_bg_cf_id: '',
      imagem_exemplo_cf_id: '',
      imagem_exemplo_alt: '',
      imagem_exemplo_link: '',
      imagem_exemplo_titulo: '',
      imagem_exemplo_orientacao: '',
      ordem: cenarios.value.length + 1,
    });
  }

  function removeCenario(idx: number) {
    cenarios.value.splice(idx, 1);
  }

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const data = await adminFetch<any>(`/api/admin/cenarios/${idParam.value}`);
      form.slug = data.slug ?? '';
      form.titulo = data.titulo ?? '';
      form.titulo_pre = data.titulo_pre ?? '';
      form.ordem = data.ordem ?? 0;
      cenarios.value = (data.cenarios ?? []).map((c: any) => ({
        id: c.id,
        titulo: c.titulo ?? '',
        descricao: c.descricao ?? '',
        imagem_bg_cf_id: c.imagem_bg_cf_id ?? '',
        imagem_exemplo_cf_id: c.imagem_exemplo_cf_id ?? '',
        imagem_exemplo_alt: c.imagem_exemplo_alt ?? '',
        imagem_exemplo_link: c.imagem_exemplo_link ?? '',
        imagem_exemplo_titulo: c.imagem_exemplo_titulo ?? '',
        imagem_exemplo_orientacao: c.imagem_exemplo_orientacao ?? '',
        ordem: c.ordem ?? 0,
      }));
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess?: () => void) {
    saving.value = true;
    try {
      const body = { ...form, cenarios: cenarios.value };
      if (isEdit.value) {
        await adminFetch(`/api/admin/cenarios/${idParam.value}`, { method: 'PUT', body });
        showMessage('Cenário atualizado!', 'success');
      } else {
        await adminFetch('/api/admin/cenarios', { method: 'POST', body });
        showMessage('Cenário criado!', 'success');
      }
      onSuccess?.();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, cenarios, addCenario, removeCenario, init, save };
}
