<script lang="ts" setup>
import type { JsonLdType } from '~/shared/schemas/seo';

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
const saving = ref(false);

const form = reactive({
  route:                '',
  meta_title:           '',
  meta_description:    '',
  focus_keyword:       '',
  keywords:            [] as string[],
  og_image_cf_id:      '',
  og_image_alt:        '',
  twitter_image_cf_id: '',
  canonical:           '',
  robots:              '',
  jsonld_type:         '' as JsonLdType | '',
  jsonld_data:         '',
});

const keywordsInput = ref('');

const JSONLD_TYPES: JsonLdType[] = [
  'WebPage', 'Article', 'BlogPosting', 'Service', 'LocalBusiness',
  'FAQPage', 'BreadcrumbList', 'ImageGallery', 'CollectionPage',
  'Person', 'Organization', 'custom',
];

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
    form.route               = data.route ?? '';
    form.meta_title          = data.meta_title ?? '';
    form.meta_description    = data.meta_description ?? '';
    form.focus_keyword       = data.focus_keyword ?? '';
    form.keywords            = data.keywords ? safeJsonArr(data.keywords) : [];
    form.og_image_cf_id      = data.og_image_cf_id ?? '';
    form.og_image_alt        = data.og_image_alt ?? '';
    form.twitter_image_cf_id = data.twitter_image_cf_id ?? '';
    form.canonical           = data.canonical ?? '';
    form.robots              = data.robots ?? '';
    form.jsonld_type         = (data.jsonld_type ?? '') as JsonLdType | '';
    form.jsonld_data         = data.jsonld_data ?? '';
    keywordsInput.value      = form.keywords.join(', ');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
    router.push('/admin/seo');
  } finally {
    loading.value = false;
  }
}

function syncKeywords() {
  form.keywords = keywordsInput.value
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 15);
}

async function save() {
  syncKeywords();

  if (!form.route || !form.route.startsWith('/')) {
    showMessage('Route obrigatório (deve começar com /)', 'error');
    return;
  }
  if (form.jsonld_data) {
    try { JSON.parse(form.jsonld_data); } catch {
      showMessage('JSON-LD inválido', 'error');
      return;
    }
  }

  saving.value = true;
  try {
    const body: any = {
      entity_type: 'static',
      route: form.route,
      meta_title: form.meta_title || null,
      meta_description: form.meta_description || null,
      focus_keyword: form.focus_keyword || null,
      keywords: form.keywords.length ? form.keywords : null,
      og_image_cf_id: form.og_image_cf_id || null,
      og_image_alt: form.og_image_alt || null,
      twitter_image_cf_id: form.twitter_image_cf_id || null,
      canonical: form.canonical || null,
      robots: form.robots || null,
      jsonld_type: form.jsonld_type || null,
      jsonld_data: form.jsonld_data ? JSON.parse(form.jsonld_data) : null,
    };
    await adminFetch('/api/admin/page-seo', { method: 'POST', body });
    showMessage(isEdit.value ? 'SEO atualizado!' : 'SEO criado!', 'success');
    router.push('/admin/seo');
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    saving.value = false;
  }
}

function safeJsonArr(s: string | string[]): string[] {
  if (Array.isArray(s)) return s;
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}

onMounted(init);

const titleLen = computed(() => form.meta_title.length);
const descLen  = computed(() => form.meta_description.length);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/seo" class="page-back">← Voltar</NuxtLink>
      <h2>{{ isEdit ? 'Editar SEO de página estática' : 'Nova entrada de SEO' }}</h2>
    </div>

    <div v-if="loading" class="loading-hint">Carregando...</div>

    <form v-else @submit.prevent="save" class="form-card">
      <div class="form-grid">
        <div class="form-field">
          <label>Route da página *</label>
          <input v-model="form.route" required placeholder="/sobre-fotografa-lillia-tavares" />
          <small>Caminho da rota Nuxt (sem domínio). Deve começar com /</small>
        </div>

        <div class="form-field">
          <label>Meta title <span class="counter" :class="{ warn: titleLen > 60 }">{{ titleLen }}/60</span></label>
          <input v-model="form.meta_title" placeholder="Título exibido na aba do navegador e Google" />
        </div>

        <div class="form-field full">
          <label>Meta description <span class="counter" :class="{ warn: descLen > 160 || (descLen > 0 && descLen < 80) }">{{ descLen }}/160</span></label>
          <textarea v-model="form.meta_description" rows="3" placeholder="Resumo de 80 a 160 caracteres exibido nos resultados de busca"></textarea>
        </div>

        <div class="form-field">
          <label>Focus keyword</label>
          <input v-model="form.focus_keyword" placeholder="ex: ensaio fotográfico mogi" />
          <small>Palavra-chave principal — usada para análise de densidade.</small>
        </div>

        <div class="form-field">
          <label>Keywords (até 15, separadas por vírgula)</label>
          <input v-model="keywordsInput" @blur="syncKeywords" placeholder="ensaio, fotografia, mogi" />
        </div>

        <div class="form-field">
          <label>OG image (Cloudflare Image ID)</label>
          <input v-model="form.og_image_cf_id" placeholder="ex: a0839ccd-..." />
        </div>

        <div class="form-field">
          <label>OG image alt</label>
          <input v-model="form.og_image_alt" placeholder="Descrição da imagem para acessibilidade" />
        </div>

        <div class="form-field">
          <label>Twitter image (CF ID — fallback OG)</label>
          <input v-model="form.twitter_image_cf_id" placeholder="opcional" />
        </div>

        <div class="form-field">
          <label>Canonical URL</label>
          <input v-model="form.canonical" placeholder="https://fotografalilliatavares.com.br/..." />
        </div>

        <div class="form-field">
          <label>Robots</label>
          <input v-model="form.robots" placeholder="index, follow" />
        </div>

        <div class="form-field">
          <label>JSON-LD type</label>
          <select v-model="form.jsonld_type">
            <option value="">— Nenhum —</option>
            <option v-for="t in JSONLD_TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <div class="form-field full">
          <label>JSON-LD data (objeto JSON, mesclado com @context + @type)</label>
          <textarea v-model="form.jsonld_data" rows="6" placeholder='{"name": "...", "description": "..."}'></textarea>
        </div>
      </div>

      <div class="form-actions">
        <NuxtLink to="/admin/seo" class="btn-secondary">Cancelar</NuxtLink>
        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar SEO') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.form-field.full {
  grid-column: 1 / -1;
}

.counter {
  font-weight: normal;
  font-size: 12rem;
  color: #888;
  margin-left: 8rem;
  &.warn { color: #fbbf24; }
}

textarea {
  font-family: inherit;
  resize: vertical;
}

select {
  width: 100%;
  padding: 8rem;
  background: #222;
  color: #eee;
  border: 1rem solid #444;
  border-radius: 4rem;
}
</style>
