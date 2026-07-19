import type { Ref } from 'vue';

export function useHeroBannerForm(idParam: Ref<number | undefined>) {
  const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
  const { adminFetch } = useAdminFetch();
  const { resizeImage } = useImageResize();

  const isEdit  = computed(() => !!idParam.value && !isNaN(idParam.value));
  const loading = ref(false);
  const saving  = ref(false);
  const uploading = ref(false);

  const cfImg = useCfImg();

  const form = reactive({
    titulo:          '',
    subtitulo:       '',
    descricao:       '',
    bg_image:        '',
    bg_image_mobile: '',
    cta_nome:        '',
    uploading_mobile: false,
    cta_url:    '',
    cta_target: 'self' as 'self' | 'blank',
    ativo:      true,
  });

  const selectedPages = ref<string[]>([]);

  async function _uploadImage(e: Event, target: 'bg_image' | 'bg_image_mobile', loadingKey: 'uploading' | 'uploading_mobile') {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (loadingKey === 'uploading') uploading.value = true;
    else form.uploading_mobile = true;
    const resized = await resizeImage(file);
    const formData = new FormData();
    formData.append('file', resized, resized.name);
    try {
      const result = await adminFetch<any>('/api/upload', { method: 'POST', body: formData });
      if (result.success && result.result?.id) {
        form[target] = result.result.id;
      }
    } catch (err: any) {
      showMessage('Upload falhou: ' + (err.statusMessage || err.message), 'error');
    } finally {
      if (loadingKey === 'uploading') uploading.value = false;
      else form.uploading_mobile = false;
    }
  }

  function uploadBgImage(e: Event)       { return _uploadImage(e, 'bg_image',        'uploading'); }
  function uploadBgImageMobile(e: Event)  { return _uploadImage(e, 'bg_image_mobile', 'uploading_mobile'); }

  function bgImageUrl(id: string) {
    return cfImg(id);
  }

  async function init() {
    if (!isEdit.value) return;
    loading.value = true;
    try {
      const data = await adminFetch<any>(`/api/admin/hero-banners/${idParam.value}`);
      form.titulo     = data.titulo    ?? '';
      form.subtitulo  = data.subtitulo ?? '';
      form.descricao  = data.descricao ?? '';
      form.bg_image        = data.bg_image        ?? '';
      form.bg_image_mobile = data.bg_image_mobile ?? '';
      form.cta_nome   = data.cta_nome  ?? '';
      form.cta_url    = data.cta_url   ?? '';
      form.cta_target = data.cta_target === 'blank' ? 'blank' : 'self';
      form.ativo      = data.ativo !== 0;
      selectedPages.value = data.routes ?? [];
    } catch (e: any) {
      showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    } finally {
      loading.value = false;
    }
  }

  async function save(onSuccess: () => void) {
    if (!form.bg_image.trim()) {
      showMessage('Imagem de fundo é obrigatória', 'error');
      return;
    }
    if (selectedPages.value.length === 0) {
      showMessage('Selecione ao menos uma página para exibir o banner', 'error');
      return;
    }
    saving.value = true;
    try {
      const body = {
        titulo:     form.titulo.trim(),
        subtitulo:  form.subtitulo.trim() || null,
        descricao:  form.descricao.trim() || null,
        bg_image:        form.bg_image.trim()        || null,
        bg_image_mobile: form.bg_image_mobile.trim()  || null,
        cta_nome:   form.cta_nome.trim()  || null,
        cta_url:    form.cta_url.trim()   || null,
        cta_target: form.cta_target,
        ativo:      form.ativo,
        routes:     selectedPages.value,
      };

      if (isEdit.value) {
        await adminFetch(`/api/admin/hero-banners/${idParam.value}`, { method: 'PUT', body });
        showMessage('Banner atualizado!', 'success');
      } else {
        await adminFetch('/api/admin/hero-banners', { method: 'POST', body });
        showMessage('Banner criado!', 'success');
      }
      onSuccess();
    } catch (e: any) {
      showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
    } finally {
      saving.value = false;
    }
  }

  return {
    isEdit,
    loading,
    saving,
    uploading,
    form,
    selectedPages,
    uploadBgImage,
    uploadBgImageMobile,
    bgImageUrl,
    init,
    save,
  };
}
