import { LINKTREE_DESTINOS, linktreeItemKey, type LinktreeItemType } from '~/shared/schemas/linktree';

/** Item no estado do form (config é objeto; ordem derivada do índice no save). */
export interface LinktreeFormItem {
  tipo: LinktreeItemType;
  ativo: boolean;
  config: Record<string, any>;
}

interface OptionPost { id: number; titulo: string; categoria: string }
interface OptionWork { id: number; titulo: string | null; slug: string }
interface OptionDep  { id: number; nome: string }

function defaultConfig(tipo: LinktreeItemType): Record<string, any> {
  switch (tipo) {
    case 'atalho':     return { destino: 'site', label: '', descricao: '' };
    case 'post':       return { postId: 0, label: '', descricao: '' };
    case 'portfolio':  return { workId: 0, label: '', descricao: '' };
    case 'depoimento': return { depoimentoId: 0 };
    case 'banner':     return { imageCfId: '', label: '', url: '' };
    case 'custom':     return { titulo: '', html: '' };
  }
}

export function useLinktreeForm() {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();

  const loading = ref(false);
  const saving  = ref(false);

  const profile = reactive({
    avatarCfId: '' as string,
    nome:       '',
    headline:   '',
    tema:       'claro' as 'claro' | 'escuro' | 'marrom' | 'azul',
  });

  const items = ref<LinktreeFormItem[]>([]);
  const clicks = ref<Record<string, number>>({});

  function itemClicks(item: LinktreeFormItem): number {
    return clicks.value[linktreeItemKey(item)] ?? 0;
  }

  // Opções para selects (carregadas dos endpoints admin existentes)
  const posts = ref<OptionPost[]>([]);
  const works = ref<OptionWork[]>([]);
  const deps  = ref<OptionDep[]>([]);

  async function load() {
    loading.value = true;
    try {
      const [data, blogList, portfolioList, depList] = await Promise.all([
        adminFetch<{ profile: any; items: any[]; clicks: Record<string, number> }>('/api/admin/linktree'),
        adminFetch<any[]>('/api/admin/blog'),
        adminFetch<any[]>('/api/admin/portfolio'),
        adminFetch<any[]>('/api/admin/depoimentos'),
      ]);

      clicks.value = data.clicks ?? {};
      profile.avatarCfId = data.profile?.avatar_cf_id ?? '';
      profile.nome       = data.profile?.nome ?? '';
      profile.headline   = data.profile?.headline ?? '';
      const temaDb = data.profile?.tema;
      profile.tema = (['claro', 'escuro', 'marrom', 'azul'] as const).includes(temaDb) ? temaDb : 'claro';

      items.value = (data.items ?? []).map((it: any) => ({
        tipo:  it.tipo,
        ativo: it.ativo ?? true,
        config: { ...defaultConfig(it.tipo), ...(it.config ?? {}) },
      }));

      posts.value = (blogList ?? []).map((p: any) => ({ id: p.id, titulo: p.titulo, categoria: p.categoria }));
      works.value = (portfolioList ?? []).map((w: any) => ({ id: w.id, titulo: w.titulo, slug: w.slug }));
      deps.value  = (depList ?? []).map((d: any) => ({ id: Number(d.id), nome: String(d.nome) }));
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    } finally {
      loading.value = false;
    }
  }

  function addItem(tipo: LinktreeItemType) {
    const config = defaultConfig(tipo);
    if (tipo === 'post' && posts.value[0])  config.postId = posts.value[0].id;
    if (tipo === 'portfolio' && works.value[0]) config.workId = works.value[0].id;
    if (tipo === 'depoimento' && deps.value[0]) config.depoimentoId = deps.value[0].id;
    items.value.push({ tipo, ativo: true, config });
  }

  function removeItem(idx: number) {
    items.value.splice(idx, 1);
  }

  // Drag-drop nativo (mesmo padrão do MenuEditor)
  const dragIdx     = ref<number | null>(null);
  const dragOverIdx = ref<number | null>(null);
  function onDragStart(idx: number) { dragIdx.value = idx; }
  function onDragOver(idx: number)  { dragOverIdx.value = idx; }
  function onDrop() {
    if (dragIdx.value !== null && dragOverIdx.value !== null && dragIdx.value !== dragOverIdx.value) {
      const [moved] = items.value.splice(dragIdx.value, 1);
      if (moved) items.value.splice(dragOverIdx.value, 0, moved);
    }
    dragIdx.value = null;
    dragOverIdx.value = null;
  }

  async function uploadImage(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const result = await adminFetch<any>('/api/upload', { method: 'POST', body: formData });
      if (result.success && result.result) return result.result.id as string;
      showMessage('Falha no upload', 'error');
      return null;
    } catch (e: any) {
      showMessage('Erro no upload: ' + (e.statusMessage || e.message), 'error');
      return null;
    }
  }

  /** Valida itens incompletos antes de salvar (selects sem escolha). */
  function validate(): boolean {
    for (const [i, it] of items.value.entries()) {
      const pos = i + 1;
      if (it.tipo === 'post' && !it.config.postId)       { showMessage(`Bloco ${pos}: selecione um post`, 'error'); return false; }
      if (it.tipo === 'portfolio' && !it.config.workId)  { showMessage(`Bloco ${pos}: selecione um ensaio`, 'error'); return false; }
      if (it.tipo === 'depoimento' && !it.config.depoimentoId) { showMessage(`Bloco ${pos}: selecione um depoimento`, 'error'); return false; }
      if (it.tipo === 'banner' && !it.config.imageCfId)  { showMessage(`Bloco ${pos}: envie a imagem do banner`, 'error'); return false; }
      if (it.tipo === 'custom' && !it.config.titulo)     { showMessage(`Bloco ${pos}: informe um título`, 'error'); return false; }
    }
    return true;
  }

  async function save() {
    if (!validate()) return;
    saving.value = true;
    try {
      const body = {
        profile: {
          avatarCfId: profile.avatarCfId || null,
          nome:       profile.nome || '',
          headline:   profile.headline || null,
          tema:       profile.tema,
        },
        items: items.value.map((it, i) => ({
          tipo:  it.tipo,
          ordem: i,
          ativo: it.ativo,
          config: it.config,
        })),
      };
      await adminFetch('/api/admin/linktree', { method: 'PUT', body });

      try {
        await adminFetch('/api/admin/cache/purge', {
          method: 'POST',
          body: {
            urls: [
              'https://fotografalilliatavares.com.br/links',
              'https://fotografalilliatavares.com.br/api/public/linktree',
            ],
          },
        });
      } catch { /* purge silencioso */ }

      showMessage('Linktree salvo!', 'success');
    } catch (e: any) {
      showMessage('Erro ao salvar: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  // Labels amigáveis p/ o dropdown "Adicionar bloco"
  const TIPO_LABELS: Record<LinktreeItemType, string> = {
    atalho:     'Atalho / link do site',
    post:       'Post do blog',
    portfolio:  'Ensaio do portfólio',
    depoimento: 'Depoimento',
    banner:     'Banner / imagem',
    custom:     'Bloco personalizado',
  };

  const DESTINO_OPTIONS = Object.entries(LINKTREE_DESTINOS).map(([key, v]) => ({ key, label: v.label }));

  return {
    loading, saving, profile, items, clicks, itemClicks,
    posts, works, deps,
    load, addItem, removeItem, save, uploadImage,
    dragIdx, dragOverIdx, onDragStart, onDragOver, onDrop,
    TIPO_LABELS, DESTINO_OPTIONS,
  };
}
