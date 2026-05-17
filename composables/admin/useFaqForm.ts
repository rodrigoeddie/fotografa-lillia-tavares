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
  });

  const perguntas = ref<FaqPerguntaForm[]>([]);

  /** Rotas onde esta categoria de FAQ deve aparecer */
  const selectedPages = ref<string[]>([]);

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
      perguntas.value = (c.perguntas ?? []).map((p: any) => ({
        id: p.id, pergunta: p.pergunta, resposta: p.resposta,
      }));
      // Carrega páginas associadas
      const pages = await adminFetch<{ route: string }[]>(`/api/admin/page-faq?faq_slug=${encodeURIComponent(c.slug)}`);
      selectedPages.value = (pages ?? []).map((p) => p.route);
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
      // Salva as páginas associadas (usa slug atual do form)
      await adminFetch('/api/admin/page-faq', {
        method: 'PUT',
        body: { faq_slug: form.slug, routes: selectedPages.value },
      });
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, perguntas, selectedPages, addPergunta, removePergunta, init, save };
}
