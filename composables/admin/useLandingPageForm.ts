import type { Ref } from 'vue';
import type { LpBlock } from '~/shared/schemas/landing-page';

export function useLandingPageForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value as number));
  const loading = ref(false);
  const saving = ref(false);

  const form = reactive({
    slug:      '',
    rota:      '',
    titulo:    '',
    descricao: '',
    lp_class:  '',
    ativo:     true,
    ordem:     0,
    blocks:    [] as LpBlock[],
  });

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const lp = await adminFetch<any>(`/api/admin/landing-pages/${idParam.value}`);
      form.slug      = lp.slug;
      form.rota      = lp.rota;
      form.titulo    = lp.titulo;
      form.descricao = lp.descricao ?? '';
      form.lp_class  = lp.lp_class ?? '';
      form.ativo     = lp.ativo === 1;
      form.ordem     = lp.ordem;
      form.blocks    = (lp.blocks ?? []).map((b: any) => ({
        tipo:  b.tipo,
        ordem: b.ordem,
        dados: typeof b.dados === 'string' ? JSON.parse(b.dados) : b.dados,
      }));
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/landing-pages');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: () => void) {
    if (!form.slug || !form.titulo || !form.rota) {
      showMessage('Slug, título e rota são obrigatórios', 'error');
      return;
    }
    saving.value = true;
    try {
      const lpBody = {
        slug:      form.slug,
        rota:      form.rota,
        titulo:    form.titulo,
        descricao: form.descricao || null,
        lp_class:  form.lp_class || null,
        ativo:     form.ativo,
        ordem:     form.ordem,
      };

      let lpId: number;
      if (isEdit.value) {
        await adminFetch(`/api/admin/landing-pages/${idParam.value}`, { method: 'PUT', body: lpBody });
        lpId = idParam.value as number;
      } else {
        const res = await adminFetch<{ id: number }>('/api/admin/landing-pages', { method: 'POST', body: lpBody });
        lpId = res.id;
      }

      // Reordena os blocks pelo índice da lista no form (índice = ordem)
      const orderedBlocks = form.blocks.map((b, i) => ({ ...b, ordem: i }));
      await adminFetch(`/api/admin/landing-pages/${lpId}/blocks`, {
        method: 'PUT',
        body: { blocks: orderedBlocks },
      });

      // Purga cache da rota da LP
      try {
        await adminFetch('/api/admin/cache/purge', {
          method: 'POST',
          body: {
            urls: [
              `https://fotografalilliatavares.com.br${form.rota}`,
              `https://fotografalilliatavares.com.br/api/public/landing-pages/${form.slug}`,
            ],
          },
        });
      } catch { /* purge falhou silenciosamente */ }

      showMessage(isEdit.value ? 'LP atualizada!' : 'LP criada!', 'success');
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return { isEdit, loading, saving, form, init, save };
}
