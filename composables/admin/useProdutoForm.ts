import type { Ref } from 'vue';

export interface PacoteForm {
  id?: number;
  title: string;
  subtitle: string;
  preco: number;
  num_parcelas: number;
  preco_parcelas: number | null;
  fotos_incluidas: number;
  preco_foto_extra: number;
  features: string[]; // one per line
  is_recommended: boolean;
}

export function useProdutoForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive({
    slug: '',
    title: '',
    description: '',
    lp_slug: '',
    icon: '',
    includes: [] as string[],
    cta_title: '',
    cta_description: '',
    cta_whatsapp_msg: '',
    active: true,
    ordem: 0,
  });

  const pacotes = ref<PacoteForm[]>([]);

  function newPacote(): PacoteForm {
    return {
      title: '', subtitle: '', preco: 0, num_parcelas: 1,
      preco_parcelas: null, fotos_incluidas: 0, preco_foto_extra: 0,
      features: [], is_recommended: false,
    };
  }

  function addPacote() {
    pacotes.value.push(newPacote());
  }

  function removePacote(idx: number) {
    pacotes.value.splice(idx, 1);
  }

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const p = await adminFetch<any>(`/api/admin/produtos/${idParam.value}`);
      form.slug = p.slug;
      form.title = p.title;
      form.description = p.description ?? '';
      form.lp_slug = p.lp_slug ?? '';
      form.icon = p.icon ?? '';
      form.includes = p.includes ? (typeof p.includes === 'string' ? JSON.parse(p.includes) : p.includes) : [];
      form.cta_title = p.cta_title ?? '';
      form.cta_description = p.cta_description ?? '';
      form.cta_whatsapp_msg = p.cta_whatsapp_msg ?? '';
      form.active = p.active === 1;
      form.ordem = p.ordem ?? 0;
      pacotes.value = (p.pacotes ?? []).map((pk: any) => ({
        id: pk.id,
        title: pk.title,
        subtitle: pk.subtitle ?? '',
        preco: pk.preco,
        num_parcelas: pk.num_parcelas,
        preco_parcelas: pk.preco_parcelas ?? null,
        fotos_incluidas: pk.fotos_incluidas,
        preco_foto_extra: pk.preco_foto_extra,
        features: pk.features ? (typeof pk.features === 'string' ? JSON.parse(pk.features) : pk.features) : [],
        is_recommended: pk.is_recommended === 1,
      }));
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/investimento');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: () => void) {
    if (!form.slug || !form.title) {
      showMessage('Slug e título são obrigatórios', 'error');
      return;
    }
    saving.value = true;
    try {
      const body = {
        ...form,
        includes: form.includes.filter(Boolean),
        pacotes: pacotes.value.map((p) => ({
          ...p,
          features: (Array.isArray(p.features) ? p.features : []).filter(Boolean),
        })),
      };
      if (isEdit.value) {
        await adminFetch(`/api/admin/produtos/${idParam.value}`, { method: 'PUT', body });
        showMessage('Produto atualizado!', 'success');
      } else {
        await adminFetch('/api/admin/produtos', { method: 'POST', body });
        showMessage('Produto criado!', 'success');
      }
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, pacotes, addPacote, removePacote, init, save };
}
