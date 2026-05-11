<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const route = useRoute();
const router = useRouter();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

const idParam = computed(() => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return id ? Number(id) : undefined;
});
const isEdit = computed(() => !!idParam.value && !isNaN(idParam.value as number));

const loading = ref(false);
const routeInput = ref('');
const editorRef = ref<{ save: () => Promise<number | null> } | null>(null);

async function init() {
  if (!isEdit.value) return;
  loading.value = true;
  try {
    const data = await adminFetch<any>(`/api/admin/page-seo/${idParam.value}`);
    if (data.entity_type !== 'static') {
      showMessage('Este registro não é uma página estática', 'error');
      router.push('/admin/seo');
      return;
    }
    routeInput.value = data.route ?? '';
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    router.push('/admin/seo');
  } finally {
    loading.value = false;
  }
}

async function onSubmit(e: Event) {
  e.preventDefault();
  if (!routeInput.value || !routeInput.value.startsWith('/')) {
    showMessage('Route obrigatório (deve começar com /)', 'error');
    return;
  }
  const id = await editorRef.value?.save();
  if (id) {
    showMessage(isEdit.value ? 'SEO atualizado!' : 'SEO criado!', 'success');
    router.push('/admin/seo');
  }
}

onMounted(init);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/seo" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar SEO de página estática' : 'Nova entrada de SEO' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <form v-else @submit="onSubmit" class="form-card">
      <div class="form-field">
        <label>Route da página *</label>
        <input v-model="routeInput" required placeholder="/sobre-fotografa-lillia-tavares" :disabled="isEdit" />
        <small>Caminho da rota Nuxt (sem domínio). Deve começar com /</small>
      </div>

      <AdminSeoEditor
        ref="editorRef"
        entity-type="static"
        :route="routeInput"
        mode="inline"
      />

      <div class="form-actions">
        <NuxtLink to="/admin/seo" class="btn-secondary">Cancelar</NuxtLink>
        <button type="submit" class="btn-primary">
          {{ isEdit ? 'Salvar alterações' : 'Criar SEO' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;
</style>
