import { LINKTREE_DESTINOS, linktreeItemKey, type LinktreeItemType } from '~/shared/schemas/linktree';

/** Item no estado do form (config é objeto; ordem derivada do índice no save). */
export interface LinktreeFormItem {
  tipo: LinktreeItemType;
  ativo: boolean;
  config: Record<string, any>;
}

/** Resumo de preset (espelha PresetSummary do service). */
export interface LinktreePresetSummary {
  id: number;
  titulo: string;
  ativo: boolean;
  tema: string;
  nome: string;
  blocos: number;
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
  const { resizeImage } = useImageResize();

  const loading = ref(false);   // carga inicial (lista + opções)
  const loadingPreset = ref(false); // troca de preset selecionado
  const saving  = ref(false);

  // ── Presets ──────────────────────────────────────────────────────
  const presets = ref<LinktreePresetSummary[]>([]);
  const selectedId = ref<number | null>(null);
  const activePreset = computed(() => presets.value.find((p) => p.ativo) ?? null);
  const selectedPreset = computed(() => presets.value.find((p) => p.id === selectedId.value) ?? null);
  const isSelectedActive = computed(() => selectedPreset.value?.ativo ?? false);

  // ── Cabeçalho + blocos do preset selecionado ─────────────────────
  const profile = reactive({
    avatarCfId: '' as string,
    nome:       '',
    headline:   '',
    tema:       'claro' as 'claro' | 'escuro' | 'marrom' | 'azul',
  });
  const items = ref<LinktreeFormItem[]>([]);
  const clicks = ref<Record<string, number>>({});

  /** Marca alterações não salvas (ignora durante hidratação de dados). */
  const dirty = ref(false);
  let hydrating = false;
  watch([() => ({ ...profile }), items], () => { if (!hydrating) dirty.value = true; }, { deep: true });

  function itemClicks(item: LinktreeFormItem): number {
    return clicks.value[linktreeItemKey(item)] ?? 0;
  }

  // Opções para selects (carregadas dos endpoints admin existentes)
  const posts = ref<OptionPost[]>([]);
  const works = ref<OptionWork[]>([]);
  const deps  = ref<OptionDep[]>([]);

  async function loadPresets() {
    const data = await adminFetch<{ presets: LinktreePresetSummary[]; clicks: Record<string, number> }>('/api/admin/linktree');
    presets.value = data.presets ?? [];
    clicks.value  = data.clicks ?? {};
  }

  /** Carga inicial: presets + opções + preset ativo (ou primeiro). */
  async function load() {
    loading.value = true;
    try {
      const [, blogList, portfolioList, depList] = await Promise.all([
        loadPresets(),
        adminFetch<any[]>('/api/admin/blog'),
        adminFetch<any[]>('/api/admin/portfolio'),
        adminFetch<any[]>('/api/admin/depoimentos'),
      ]);

      posts.value = (blogList ?? []).map((p: any) => ({ id: p.id, titulo: p.titulo, categoria: p.categoria }));
      works.value = (portfolioList ?? []).map((w: any) => ({ id: w.id, titulo: w.titulo, slug: w.slug }));
      deps.value  = (depList ?? []).map((d: any) => ({ id: Number(d.id), nome: String(d.nome) }));

      const alvo = activePreset.value?.id ?? presets.value[0]?.id ?? null;
      if (alvo) await selectPreset(alvo, true);
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    } finally {
      loading.value = false;
    }
  }

  /** Carrega o cabeçalho + blocos de um preset no form. */
  async function selectPreset(id: number, force = false) {
    if (!force && dirty.value && !confirm('Há alterações não salvas neste preset. Trocar mesmo assim?')) return;
    loadingPreset.value = true;
    try {
      const data = await adminFetch<{ preset: any; items: any[] }>(`/api/admin/linktree/${id}`);
      hydrating = true;
      selectedId.value = id;
      profile.avatarCfId = data.preset?.avatar_cf_id ?? '';
      profile.nome       = data.preset?.nome ?? '';
      profile.headline   = data.preset?.headline ?? '';
      const temaDb = data.preset?.tema;
      profile.tema = (['claro', 'escuro', 'marrom', 'azul'] as const).includes(temaDb) ? temaDb : 'claro';
      items.value = (data.items ?? []).map((it: any) => ({
        tipo:  it.tipo,
        ativo: it.ativo ?? true,
        config: { ...defaultConfig(it.tipo), ...(it.config ?? {}) },
      }));
      await nextTick();
      dirty.value = false;
    } catch (e: any) {
      showMessage('Erro ao abrir preset: ' + (e.statusMessage || e.message), 'error');
    } finally {
      hydrating = false;
      loadingPreset.value = false;
    }
  }

  // ── CRUD de presets ──────────────────────────────────────────────
  async function createPreset() {
    const titulo = prompt('Nome do novo preset (ex.: "Dia das Mães"):', '')?.trim();
    if (!titulo) return;
    try {
      const { id } = await adminFetch<{ id: number }>('/api/admin/linktree', { method: 'POST', body: { titulo } });
      await loadPresets();
      await selectPreset(id, true);
      showMessage('Preset criado!', 'success');
    } catch (e: any) {
      showMessage('Erro ao criar: ' + (e.statusMessage || e.message), 'error');
    }
  }

  async function duplicatePreset(id: number) {
    const base = presets.value.find((p) => p.id === id);
    const titulo = prompt('Nome do preset duplicado:', base ? `${base.titulo} (cópia)` : '')?.trim();
    if (!titulo) return;
    try {
      const res = await adminFetch<{ id: number }>(`/api/admin/linktree/${id}/duplicate`, { method: 'POST', body: { titulo } });
      await loadPresets();
      await selectPreset(res.id, true);
      showMessage('Preset duplicado!', 'success');
    } catch (e: any) {
      showMessage('Erro ao duplicar: ' + (e.statusMessage || e.message), 'error');
    }
  }

  async function renamePreset(id: number) {
    const base = presets.value.find((p) => p.id === id);
    const titulo = prompt('Novo nome do preset:', base?.titulo ?? '')?.trim();
    if (!titulo || titulo === base?.titulo) return;
    try {
      await adminFetch(`/api/admin/linktree/${id}`, { method: 'PATCH', body: { titulo } });
      await loadPresets();
      showMessage('Preset renomeado!', 'success');
    } catch (e: any) {
      showMessage('Erro ao renomear: ' + (e.statusMessage || e.message), 'error');
    }
  }

  async function deletePreset(id: number) {
    const base = presets.value.find((p) => p.id === id);
    if (!confirm(`Excluir o preset "${base?.titulo}" e todos os seus blocos? Esta ação não pode ser desfeita.`)) return;
    try {
      await adminFetch(`/api/admin/linktree/${id}`, { method: 'DELETE' });
      await loadPresets();
      if (selectedId.value === id) {
        const proximo = activePreset.value?.id ?? presets.value[0]?.id ?? null;
        if (proximo) await selectPreset(proximo, true);
      }
      if (base?.ativo) await purgePublic();
      showMessage('Preset excluído.', 'success');
    } catch (e: any) {
      showMessage('Erro ao excluir: ' + (e.statusMessage || e.message), 'error');
    }
  }

  async function activatePreset(id: number) {
    try {
      await adminFetch(`/api/admin/linktree/${id}/activate`, { method: 'POST' });
      await loadPresets();
      await purgePublic();
      showMessage('Preset ativado no ar!', 'success');
    } catch (e: any) {
      showMessage('Erro ao ativar: ' + (e.statusMessage || e.message), 'error');
    }
  }

  // ── Blocos ───────────────────────────────────────────────────────
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
    const resized = await resizeImage(file);
    const formData = new FormData();
    formData.append('file', resized, resized.name);
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

  async function purgePublic() {
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
  }

  async function save() {
    if (selectedId.value === null) return;
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
      await adminFetch(`/api/admin/linktree/${selectedId.value}`, { method: 'PUT', body });
      dirty.value = false;
      await loadPresets();
      // Só faz sentido purgar o cache se o preset salvo é o que está no ar.
      if (isSelectedActive.value) await purgePublic();
      showMessage(isSelectedActive.value ? 'Preset salvo e publicado!' : 'Preset salvo (não está no ar).', 'success');
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
    loading, loadingPreset, saving,
    presets, selectedId, selectedPreset, activePreset, isSelectedActive, dirty,
    profile, items, clicks, itemClicks,
    posts, works, deps,
    load, selectPreset,
    createPreset, duplicatePreset, renamePreset, deletePreset, activatePreset,
    addItem, removeItem, save, uploadImage,
    dragIdx, dragOverIdx, onDragStart, onDragOver, onDrop,
    TIPO_LABELS, DESTINO_OPTIONS,
  };
}
