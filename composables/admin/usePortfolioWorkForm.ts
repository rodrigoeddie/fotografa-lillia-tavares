import type { Ref } from 'vue';

export function usePortfolioWorkForm(idParam: Ref<number | undefined>) {
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
    artigo: 'a' as 'a' | 'o',
    data: '',
    local: '',
    depoimento_texto: '',
    depoimento_avatar: '',
    depoimento_link: '',
    cor_destaque: '#000000',
    home: false,
    home_order: 0,
    video: '',
    instagram_uri: '',
    instagram_title: '',
    site: '',
    ativo: true,
    ordem: 0,
    seo_keywords: [] as string[],
  });

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const w = await adminFetch<any>(`/api/admin/portfolio/${idParam.value}`);
      form.slug = w.slug;
      form.categoria = w.categoria;
      form.titulo = w.titulo ?? '';
      form.descricao = w.descricao ?? '';
      form.artigo = (w.artigo === 'o' ? 'o' : 'a') as 'a' | 'o';
      form.data = w.data ?? '';
      form.local = w.local ?? '';
      form.depoimento_texto = w.depoimento_texto ?? '';
      form.depoimento_avatar = w.depoimento_avatar ?? '';
      form.depoimento_link = w.depoimento_link ?? '';
      form.cor_destaque = w.cor_destaque ?? '#000000';
      form.home = w.home === 1;
      form.home_order = w.home_order ?? 0;
      form.video = w.video ?? '';
      form.instagram_uri = w.instagram_uri ?? '';
      form.instagram_title = w.instagram_title ?? '';
      form.site = w.site ?? '';
      form.ativo = w.ativo === 1;
      form.ordem = w.ordem ?? 0;
      form.seo_keywords = w.seo_keywords
        ? (typeof w.seo_keywords === 'string' ? JSON.parse(w.seo_keywords) : w.seo_keywords)
        : [];
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/portfolio');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: (workId: number) => void) {
    if (!form.slug || !form.categoria) {
      showMessage('Slug e categoria são obrigatórios', 'error');
      return;
    }
    saving.value = true;
    try {
      const body = { ...form };
      let workId: number;
      if (isEdit.value) {
        await adminFetch(`/api/admin/portfolio/${idParam.value}`, { method: 'PUT', body });
        workId = idParam.value as number;
        showMessage('Portfolio atualizado!', 'success');
      } else {
        const res = await adminFetch<{ id: number }>('/api/admin/portfolio', { method: 'POST', body });
        workId = res.id;
        showMessage('Portfolio criado!', 'success');
      }
      onSuccess(workId);
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, init, save };
}
