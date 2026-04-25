import type { Ref } from 'vue';

export function useBlogPostForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive({
    slug: '',
    categoria: '',
    titulo: '',
    descricao: '',
    data: '',
    imagem_cf_id: '',
    conteudo: '',
    ativo: true,
    seo_keywords: [] as string[],
  });

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const p = await adminFetch<any>(`/api/admin/blog/${idParam.value}`);
      form.slug = p.slug;
      form.categoria = p.categoria;
      form.titulo = p.titulo;
      form.descricao = p.descricao ?? '';
      form.data = p.data ?? '';
      form.imagem_cf_id = p.imagem_cf_id ?? '';
      form.conteudo = p.conteudo ?? '';
      form.ativo = p.ativo === 1;
      form.seo_keywords = p.seo_keywords
        ? (typeof p.seo_keywords === 'string' ? JSON.parse(p.seo_keywords) : p.seo_keywords)
        : [];
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/blog');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: () => void) {
    if (!form.slug || !form.titulo || !form.categoria) {
      showMessage('Slug, título e categoria são obrigatórios', 'error');
      return;
    }
    saving.value = true;
    try {
      const body = { ...form };
      if (isEdit.value) {
        await adminFetch(`/api/admin/blog/${idParam.value}`, { method: 'PUT', body });
        showMessage('Post atualizado!', 'success');
      } else {
        await adminFetch('/api/admin/blog', { method: 'POST', body });
        showMessage('Post criado!', 'success');
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
