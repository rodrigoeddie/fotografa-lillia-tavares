import type { Ref } from 'vue';

interface Sessao { id: number; nome_sessao: string; cliente_nome: string; produto_tipo: string; status: string; }

export function useEntregaForm(entregaIdParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const { resizeImage } = useImageResize();
  const cfURI = useRuntimeConfig().public.cloudflareURI;
  const router = useRouter();
  const route = useRoute();

  const isEdit = computed(() => !!entregaIdParam.value && !isNaN(entregaIdParam.value));
  const loading = ref(false);
  const saving = ref(false);
  const sessoes = ref<Sessao[]>([]);
  const sessoNome = ref('');

  const form = reactive({
    sessao_id: 0,
    lote_id: null as number | null,
    r2_key: '',
    nome_arquivo: '',
    bg_image_id: '',
    mensagem: '',
    ativo: true,
  });

  // ─── ZIP upload ────────────────────────────────────────────────────────────
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const uploadDone = ref(false);
  const zipFileRef = ref<HTMLInputElement | null>(null);
  const selectedZipFile = ref<File | null>(null);
  const replacingZip = ref(false);
  const oldZipKey = ref('');

  // ─── BG image ──────────────────────────────────────────────────────────────
  const bgFileRef = ref<HTMLInputElement | null>(null);
  const isBgUploading = ref(false);
  const replacingBg = ref(false);

  function cfUrl(id: string) { return `${cfURI}${id}/public`; }

  function resetUploadState() {
    uploadDone.value = false;
    selectedZipFile.value = null;
    replacingZip.value = false;
    oldZipKey.value = '';
    replacingBg.value = false;
  }

  async function init() {
    if (isEdit.value) {
      loading.value = true;
      try {
        const e = await adminFetch<any>(`/api/admin/entregas/item/${entregaIdParam.value}`);
        form.sessao_id = e.sessao_id;
        form.lote_id = e.lote_id ?? null;
        form.r2_key = e.r2_key ?? '';
        form.nome_arquivo = e.nome_arquivo ?? '';
        form.bg_image_id = e.bg_image_id ?? '';
        form.mensagem = e.mensagem ?? '';
        form.ativo = e.ativo === 1;
        sessoNome.value = e.nome_sessao ?? '';
        resetUploadState();
      } catch (e: any) {
        showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
        router.push('/admin/entregas');
      } finally {
        loading.value = false;
      }
    } else {
      // Pré-preenche sessao_id e lote_id vindos de query params
      const qSessao = route.query.sessao_id;
      const qLote = route.query.lote_id;
      if (qSessao) form.sessao_id = Number(qSessao);
      if (qLote) form.lote_id = Number(qLote);
      try {
        sessoes.value = await adminFetch<Sessao[]>('/api/admin/sessoes');
      } catch (e: any) {
        showMessage('Erro ao carregar sessões: ' + (e.statusMessage || e.message), 'error');
      }

      // Auto-preenche nome_arquivo quando usuário seleciona sessão
      watch(() => form.sessao_id, (sessaoId) => {
        if (!form.nome_arquivo && sessaoId) {
          const s = sessoes.value.find((x) => x.id === sessaoId);
          if (s) {
            const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9\u00C0-\u024F]+/g, '-').replace(/^-|-$/g, '');
            form.nome_arquivo = `Ensaio-${sanitize(s.produto_tipo)}-${sanitize(s.cliente_nome)}.zip`;
          }
        }
      });
    }
  }

  // ─── ZIP handlers ──────────────────────────────────────────────────────────

  function onZipSelected(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    selectedZipFile.value = f;
    if (!form.nome_arquivo) form.nome_arquivo = f.name;
    uploadZip();
  }

  async function uploadZip() {
    if (!selectedZipFile.value) return;
    isUploading.value = true;
    uploadProgress.value = 0;
    try {
      const { url, key } = await adminFetch<{ url: string; key: string }>('/api/admin/r2/presign', {
        method: 'POST',
        body: { filename: selectedZipFile.value.name, content_type: selectedZipFile.value.type || 'application/zip' },
      });
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable) uploadProgress.value = Math.round((ev.loaded / ev.total) * 100);
        });
        xhr.addEventListener('load', () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`))));
        xhr.addEventListener('error', () => reject(new Error('Erro de rede')));
        xhr.open('PUT', url);
        xhr.setRequestHeader('Content-Type', selectedZipFile.value!.type || 'application/zip');
        xhr.send(selectedZipFile.value);
      });
      if (oldZipKey.value) {
        try { await adminFetch('/api/admin/r2/delete', { method: 'POST', body: { key: oldZipKey.value } }); } catch {}
        oldZipKey.value = '';
      }
      form.r2_key = key;
      if (!form.nome_arquivo) form.nome_arquivo = selectedZipFile.value.name;
      uploadDone.value = true;
      replacingZip.value = false;
      showMessage('ZIP enviado com sucesso!', 'success');
    } catch (e: any) {
      showMessage('Erro no upload: ' + e.message, 'error');
    } finally {
      isUploading.value = false;
    }
  }

  function startReplaceZip() {
    oldZipKey.value = form.r2_key;
    form.r2_key = ''; form.nome_arquivo = ''; uploadDone.value = false;
    selectedZipFile.value = null; replacingZip.value = true;
    nextTick(() => zipFileRef.value?.click());
  }

  function removeZip() {
    form.r2_key = ''; form.nome_arquivo = ''; uploadDone.value = false;
    selectedZipFile.value = null; replacingZip.value = false; oldZipKey.value = '';
  }

  // ─── BG handlers ──────────────────────────────────────────────────────────

  function startReplaceBg() {
    replacingBg.value = true;
    nextTick(() => bgFileRef.value?.click());
  }

  async function uploadBgImage(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    isBgUploading.value = true;
    try {
      const resized = await resizeImage(file);
      const fd = new FormData();
      fd.append('file', resized, resized.name);
      const res = await adminFetch<any>('/api/upload', {
        method: 'POST', body: fd,
      });
      form.bg_image_id = res.result?.id ?? '';
      if (!form.bg_image_id) throw new Error('ID de imagem não retornado');
      replacingBg.value = false;
      showMessage('Imagem de fundo enviada!', 'success');
    } catch (err: any) {
      showMessage('Erro ao enviar imagem: ' + (err.statusMessage || err.message), 'error');
    } finally {
      isBgUploading.value = false;
      if (bgFileRef.value) bgFileRef.value.value = '';
    }
  }

  // ─── Save ─────────────────────────────────────────────────────────────────

  async function save(onSuccess: () => void) {
    if (!isEdit.value && !form.sessao_id) {
      showMessage('Selecione uma sessão', 'error');
      return;
    }
    saving.value = true;
    try {
      if (isEdit.value) {
        await adminFetch(`/api/admin/entregas/item/${entregaIdParam.value}`, {
          method: 'PUT',
          body: {
            r2_key: form.r2_key, nome_arquivo: form.nome_arquivo,
            bg_image_id: form.bg_image_id, mensagem: form.mensagem, ativo: form.ativo,
          },
        });
        showMessage('Entrega atualizada!', 'success');
      } else {
        await adminFetch('/api/admin/entregas', {
          method: 'POST',
          body: {
            sessao_id: Number(form.sessao_id), lote_id: form.lote_id,
            r2_key: form.r2_key, nome_arquivo: form.nome_arquivo,
            bg_image_id: form.bg_image_id, mensagem: form.mensagem, ativo: form.ativo,
          },
        });
        showMessage('Entrega criada!', 'success');
      }
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return {
    isEdit, loading, saving, form, sessoes, sessoNome,
    uploadProgress, isUploading, uploadDone, zipFileRef, selectedZipFile, replacingZip,
    bgFileRef, isBgUploading, replacingBg,
    cfUrl, init, onZipSelected, startReplaceZip, removeZip, startReplaceBg, uploadBgImage, save,
  };
}
