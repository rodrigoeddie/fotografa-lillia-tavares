interface SobrePaginaForm {
  titulo: string;
  imagem_cf_id: string;
  imagem_alt: string;
  imagem_width: number;
  imagem_height: number;
  bio: string;
  servicos_titulo: string;
  timeline_titulo: string;
  timeline_descricao: string;
}

interface ServicoForm {
  id?: number;
  tag: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  descricao_extra: string;
  cta_label: string;
  cta_url: string;
  sub_link_label: string;
  sub_link_url: string;
  destaque: boolean;
  ativo: boolean;
}

interface MarcoForm {
  id?: number;
  ano: number;
  mes: string;
  titulo: string;
  descricao: string;
  imagem_cf_id: string;
  formato: string;
  ativo: boolean;
}

/** Estado + persistência da página "Sobre" (bloco único + serviços + linha do tempo). */
export function useSobreForm() {
  const { adminFetch } = useAdminFetch();
  const { resizeImage } = useImageResize();
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

  const loading   = ref(false);
  const saving    = ref(false);
  const uploading = ref('');

  const form = reactive<SobrePaginaForm>({
    titulo: '',
    imagem_cf_id: '',
    imagem_alt: '',
    imagem_width: 935,
    imagem_height: 935,
    bio: '',
    servicos_titulo: '',
    timeline_titulo: '',
    timeline_descricao: '',
  });

  const servicos = ref<ServicoForm[]>([]);
  const marcos   = ref<MarcoForm[]>([]);

  function addServico() {
    servicos.value.push({
      tag: '', titulo: '', subtitulo: '', descricao: '', descricao_extra: '',
      cta_label: '', cta_url: '', sub_link_label: '', sub_link_url: '',
      destaque: false, ativo: true,
    });
  }

  function removeServico(idx: number) {
    servicos.value.splice(idx, 1);
  }

  function addMarco() {
    marcos.value.push({
      ano: new Date().getFullYear(), mes: '', titulo: '', descricao: '',
      imagem_cf_id: '', formato: '', ativo: true,
    });
  }

  function removeMarco(idx: number) {
    marcos.value.splice(idx, 1);
  }

  function moveMarco(idx: number, delta: number) {
    const alvo = idx + delta;
    if (alvo < 0 || alvo >= marcos.value.length) return;
    const lista = marcos.value;
    [lista[idx], lista[alvo]] = [lista[alvo]!, lista[idx]!];
  }

  function moveServico(idx: number, delta: number) {
    const alvo = idx + delta;
    if (alvo < 0 || alvo >= servicos.value.length) return;
    const lista = servicos.value;
    [lista[idx], lista[alvo]] = [lista[alvo]!, lista[idx]!];
  }

  /** Sobe a imagem para o Cloudflare Images e devolve o ID no destino informado. */
  async function uploadImagem(e: Event, apply: (id: string) => void, key: string) {
    const input = e.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;
    uploading.value = key;
    try {
      const resized  = await resizeImage(file);
      const formData = new FormData();
      formData.append('file', resized, resized.name);
      const result = await adminFetch<any>('/api/upload', { method: 'POST', body: formData });
      if (result.success && result.result?.id) apply(result.result.id);
      else showMessage('Upload falhou', 'error');
    } catch (err: any) {
      showMessage('Upload falhou: ' + (err.statusMessage || err.message), 'error');
    } finally {
      uploading.value = '';
      input.value = '';
    }
  }

  async function init() {
    loading.value = true;
    try {
      const data = await adminFetch<any>('/api/admin/sobre');
      const p = data?.pagina ?? {};
      form.titulo             = p.titulo ?? '';
      form.imagem_cf_id       = p.imagem_cf_id ?? '';
      form.imagem_alt         = p.imagem_alt ?? '';
      form.imagem_width       = p.imagem_width ?? 935;
      form.imagem_height      = p.imagem_height ?? 935;
      form.bio                = p.bio ?? '';
      form.servicos_titulo    = p.servicos_titulo ?? '';
      form.timeline_titulo    = p.timeline_titulo ?? '';
      form.timeline_descricao = p.timeline_descricao ?? '';

      servicos.value = (data?.servicos ?? []).map((s: any) => ({
        id: s.id,
        tag: s.tag ?? '',
        titulo: s.titulo ?? '',
        subtitulo: s.subtitulo ?? '',
        descricao: s.descricao ?? '',
        descricao_extra: s.descricao_extra ?? '',
        cta_label: s.cta_label ?? '',
        cta_url: s.cta_url ?? '',
        sub_link_label: s.sub_link_label ?? '',
        sub_link_url: s.sub_link_url ?? '',
        destaque: s.destaque === 1 || s.destaque === true,
        ativo: s.ativo !== 0,
      }));

      marcos.value = (data?.marcos ?? []).map((m: any) => ({
        id: m.id,
        ano: m.ano ?? new Date().getFullYear(),
        mes: m.mes ?? '',
        titulo: m.titulo ?? '',
        descricao: m.descricao ?? '',
        imagem_cf_id: m.imagem_cf_id ?? '',
        formato: m.formato ?? '',
        ativo: m.ativo !== 0,
      }));
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    saving.value = true;
    try {
      await adminFetch('/api/admin/sobre', {
        method: 'PUT',
        body: { pagina: { ...form }, servicos: servicos.value, marcos: marcos.value },
      });
      showMessage('Página Sobre atualizada!', 'success');
      await init();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return {
    loading, saving, uploading, uploadImagem, form, servicos, marcos,
    addServico, removeServico, moveServico,
    addMarco, removeMarco, moveMarco,
    init, save,
  };
}
