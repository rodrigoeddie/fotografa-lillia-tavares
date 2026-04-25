import type { Ref } from 'vue';

export interface FaqPerguntaForm {
  id?: number;
  pergunta: string;
  resposta: string;
}

export function useFaqForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive({
    titulo: '',
    slug: '',
    ordem: 0,
  });

  const perguntas = ref<FaqPerguntaForm[]>([]);

  function addPergunta() {
    perguntas.value.push({ pergunta: '', resposta: '' });
  }

  function removePergunta(idx: number) {
    perguntas.value.splice(idx, 1);
  }

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const c = await adminFetch<any>(`/api/admin/faq/${idParam.value}`);
      form.titulo = c.titulo;
      form.slug = c.slug;
      form.ordem = c.ordem;
      perguntas.value = (c.perguntas ?? []).map((p: any) => ({
        id: p.id, pergunta: p.pergunta, resposta: p.resposta,
      }));
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/faq');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: () => void) {
    if (!form.titulo || !form.slug) {
      showMessage('Título e slug são obrigatórios', 'error');
      return;
    }
    saving.value = true;
    try {
      const body = { ...form, perguntas: perguntas.value.filter((p) => p.pergunta && p.resposta) };
      if (isEdit.value) {
        await adminFetch(`/api/admin/faq/${idParam.value}`, { method: 'PUT', body });
        showMessage('Categoria atualizada!', 'success');
      } else {
        await adminFetch('/api/admin/faq', { method: 'POST', body });
        showMessage('Categoria criada!', 'success');
      }
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, perguntas, addPergunta, removePergunta, init, save };
}
