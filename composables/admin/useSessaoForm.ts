import type { Ref } from 'vue';

interface Cliente { id: number; nome: string; email: string; }
interface Produto { title: string; packages: { title: string; fotos_incluidas?: number; preco_foto_extra?: number; }[]; }

export function useSessaoForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const router = useRouter();

  const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving = ref(false);
  const clientes = ref<Cliente[]>([]);
  const produtos = ref<Produto[]>([]);
  const sessaoStatus = ref('aguardando_fotos');
  const clienteNome = ref('');

  const form = reactive({
    cliente_id: '',
    nome_sessao: '',
    produto_tipo: '',
    pacote_index: 0,
    fotos_incluidas: 0,
    preco_foto_extra: 0,
  });

  const produtoSelecionado = computed(() =>
    produtos.value.find((p) => p.title === form.produto_tipo) ?? null,
  );

  let initializingEdit = false;

  watch(() => form.produto_tipo, () => {
    if (initializingEdit) return;
    form.pacote_index = 0;
    autoFillPacote();
  });

  watch(() => form.pacote_index, () => {
    if (initializingEdit) return;
    autoFillPacote();
  });

  function autoFillPacote() {
    const pkg = produtoSelecionado.value?.packages[form.pacote_index];
    if (pkg) {
      form.fotos_incluidas = pkg.fotos_incluidas ?? 0;
      form.preco_foto_extra = pkg.preco_foto_extra ?? 0;
    }
  }

  async function loadProdutos() {
    try {
      const tree = await $fetch<any[]>('/api/fs/tree');
      const investNode = tree.find((n: any) => n.name === 'investimento' && n.isDirectory);
      if (!investNode?.children) return;
      const prods: Produto[] = [];
      for (const subdir of investNode.children) {
        if (!subdir.isDirectory) continue;
        const indexFile = subdir.children?.find((c: any) => c.name === 'index.json');
        if (!indexFile) continue;
        try {
          const raw = await $fetch<{ content: string }>('/api/fs/raw', { params: { path: indexFile.path } });
          const data = JSON.parse(raw.content);
          if (data.title && data.packages) prods.push(data);
        } catch {}
      }
      produtos.value = prods;
    } catch {}
  }

  async function loadSessao() {
    const sessoes = await adminFetch<any[]>('/api/admin/sessoes');
    const s = sessoes.find((x: any) => x.id === idParam.value);
    if (!s) throw new Error('Sessão não encontrada');
    initializingEdit = true;
    form.nome_sessao = s.nome_sessao;
    form.produto_tipo = s.produto_tipo;
    form.pacote_index = Number(s.pacote_index);
    form.fotos_incluidas = Number(s.fotos_incluidas);
    form.preco_foto_extra = Number(s.preco_foto_extra);
    sessaoStatus.value = s.status;
    clienteNome.value = s.cliente_nome ?? '';
    setTimeout(() => { initializingEdit = false; }, 50);
  }

  async function init() {
    loading.value = true;
    try {
      const tasks: Promise<any>[] = [loadProdutos()];
      if (isEdit.value) {
        tasks.push(loadSessao());
      } else {
        tasks.push(adminFetch<Cliente[]>('/api/admin/clientes').then((c) => { clientes.value = c; }));
      }
      await Promise.all(tasks);
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
      router.push('/admin/sessoes');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: (newId?: number) => void) {
    if (!form.nome_sessao || !form.produto_tipo) {
      showMessage('Preencha nome da sessão e tipo do produto', 'error');
      return;
    }
    if (!isEdit.value && !form.cliente_id) {
      showMessage('Selecione um cliente', 'error');
      return;
    }
    saving.value = true;
    try {
      if (isEdit.value) {
        await adminFetch(`/api/admin/sessoes/${idParam.value}`, {
          method: 'PUT',
          body: {
            nome_sessao: form.nome_sessao,
            produto_tipo: form.produto_tipo,
            pacote_index: form.pacote_index,
            fotos_incluidas: form.fotos_incluidas,
            preco_foto_extra: form.preco_foto_extra,
            status: sessaoStatus.value,
          },
        });
        showMessage('Sessão atualizada!', 'success');
        onSuccess();
      } else {
        const res = await adminFetch<{ id: number }>('/api/admin/sessoes', {
          method: 'POST',
          body: {
            cliente_id: Number(form.cliente_id),
            nome_sessao: form.nome_sessao,
            produto_tipo: form.produto_tipo,
            pacote_index: form.pacote_index,
            fotos_incluidas: form.fotos_incluidas,
            preco_foto_extra: form.preco_foto_extra,
          },
        });
        showMessage('Sessão criada!', 'success');
        onSuccess(res.id);
      }
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return {
    isEdit, loading, saving, form, clientes, produtos, produtoSelecionado,
    sessaoStatus, clienteNome, init, save,
  };
}
