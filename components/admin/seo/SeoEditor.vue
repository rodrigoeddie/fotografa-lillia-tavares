<script setup lang="ts">
import type { EntityType, JsonLdType, PageSeoIssue } from '~/shared/schemas/seo';
import type { PreviewInput } from '~/composables/admin/seo/analyzers/preview';

interface SeoFormState {
  focus_keyword:        string;
  keywords:             string[];
  meta_title:           string;
  meta_description:     string;
  og_image_cf_id:       string;
  og_image_alt:         string;
  twitter_image_cf_id:  string;
  canonical:            string;
  robots:               string;
  jsonld_type:          JsonLdType | null;
  jsonld_data:          string;
}

const props = defineProps<{
  entityType: EntityType;
  /** Para entity_type='static', passar route. Para outros, entity_id (após criar a entity-pai). */
  entityId?: number | null;
  route?: string | null;
  /** Quando inline, usa para previews antes de salvar. */
  pageUrl?: string;
  /** Issues opcionais já calculadas pelo evaluator do CRUD pai. */
  precomputedIssues?: PageSeoIssue[];
  precomputedScore?: number;
  /** Modo: inline (embutido em CRUD pai) ou standalone (página própria). */
  mode?: 'inline' | 'standalone';
  /** Defaults sugeridos quando não há registro ainda. */
  defaults?: Partial<SeoFormState>;
}>();

const emit = defineEmits<{
  (e: 'update:value', v: SeoFormState): void;
  (e: 'saved', id: number): void;
}>();

const { adminFetch } = useAdminFetch();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

const loading = ref(false);
const saving = ref(false);
const existingId = ref<number | null>(null);

const form = reactive<SeoFormState>({
  focus_keyword:        props.defaults?.focus_keyword ?? '',
  keywords:             props.defaults?.keywords ?? [],
  meta_title:           props.defaults?.meta_title ?? '',
  meta_description:     props.defaults?.meta_description ?? '',
  og_image_cf_id:       props.defaults?.og_image_cf_id ?? '',
  og_image_alt:         props.defaults?.og_image_alt ?? '',
  twitter_image_cf_id:  props.defaults?.twitter_image_cf_id ?? '',
  canonical:            props.defaults?.canonical ?? '',
  robots:               props.defaults?.robots ?? '',
  jsonld_type:          props.defaults?.jsonld_type ?? null,
  jsonld_data:          props.defaults?.jsonld_data ?? '',
});

const titleLen = computed(() => form.meta_title.length);
const descLen  = computed(() => form.meta_description.length);

const previewInput = computed<PreviewInput>(() => ({
  meta_title:           form.meta_title,
  meta_description:     form.meta_description,
  og_image_cf_id:       form.og_image_cf_id || null,
  twitter_image_cf_id:  form.twitter_image_cf_id || null,
  canonical:            form.canonical || null,
  pageUrl:              props.pageUrl,
}));

// Score local: se precomputed vier do pai, usa; senão computa básico aqui.
const score = computed(() => props.precomputedScore ?? localScore.value);
const issues = computed(() => props.precomputedIssues ?? localIssues.value);

const localIssues = computed(() => {
  const out: PageSeoIssue[] = [];
  if (!form.meta_title) out.push({ severity: 'error', code: 'TITLE_MISSING', message: 'Sem meta title' });
  else if (form.meta_title.length > 60) out.push({ severity: 'warning', code: 'TITLE_TOO_LONG', message: `Title longo (${form.meta_title.length} chars, ≤60)` });
  else if (form.meta_title.length < 20) out.push({ severity: 'info', code: 'TITLE_TOO_SHORT', message: `Title curto (${form.meta_title.length} chars, ≥20)` });

  if (!form.meta_description) out.push({ severity: 'error', code: 'DESCRIPTION_MISSING', message: 'Sem meta description' });
  else if (form.meta_description.length > 160) out.push({ severity: 'warning', code: 'DESCRIPTION_TOO_LONG', message: `Description longa (${form.meta_description.length}, ≤160)` });
  else if (form.meta_description.length < 80) out.push({ severity: 'warning', code: 'DESCRIPTION_TOO_SHORT', message: `Description curta (${form.meta_description.length}, ≥80)` });

  if (!form.og_image_cf_id) out.push({ severity: 'warning', code: 'OG_IMAGE_MISSING', message: 'Sem imagem de compartilhamento (OG)' });
  if (!form.keywords.length) out.push({ severity: 'warning', code: 'KEYWORDS_MISSING', message: 'Sem palavras-chave' });
  if (!form.focus_keyword) out.push({ severity: 'info', code: 'FOCUS_KEYWORD_MISSING', message: 'Sem focus keyword definida' });

  if (!out.length) out.push({ severity: 'info', code: 'OK', message: 'Tudo OK!' });
  return out;
});

const localScore = computed(() => {
  let dedu = 0;
  for (const i of localIssues.value) {
    if (i.code === 'OK') continue;
    if (i.severity === 'error') dedu += i.code === 'TITLE_MISSING' ? 25 : i.code === 'DESCRIPTION_MISSING' ? 20 : 15;
    else if (i.severity === 'warning') dedu += 8;
    else dedu += 3;
  }
  return Math.max(0, 100 - dedu);
});

// ── Carregamento ──────────────────────────────────────────────
async function load() {
  if (props.entityType === 'static') {
    if (!props.route) return;
    loading.value = true;
    try {
      const data = await adminFetch<any>(`/api/admin/page-seo/by/static/${encodeURIComponent(props.route)}`);
      if (data) {
        existingId.value = data.id;
        applyToForm(data);
      }
    } catch { /* nenhum registro ainda */ }
    finally { loading.value = false; }
    return;
  }
  if (!props.entityId) return;
  loading.value = true;
  try {
    const data = await adminFetch<any>(`/api/admin/page-seo/by/${props.entityType}/${props.entityId}`);
    if (data) {
      existingId.value = data.id;
      applyToForm(data);
    }
  } catch { /* nenhum registro ainda */ }
  finally { loading.value = false; }
}

function applyToForm(data: any) {
  form.focus_keyword       = data.focus_keyword ?? '';
  form.keywords            = data.keywords ? safeJsonArr(data.keywords) : [];
  form.meta_title          = data.meta_title ?? '';
  form.meta_description    = data.meta_description ?? '';
  form.og_image_cf_id      = data.og_image_cf_id ?? '';
  form.og_image_alt        = data.og_image_alt ?? '';
  form.twitter_image_cf_id = data.twitter_image_cf_id ?? '';
  form.canonical           = data.canonical ?? '';
  form.robots              = data.robots ?? '';
  form.jsonld_type         = (data.jsonld_type ?? null) as JsonLdType | null;
  form.jsonld_data         = data.jsonld_data ? (typeof data.jsonld_data === 'string' ? data.jsonld_data : JSON.stringify(data.jsonld_data, null, 2)) : '';
}

function safeJsonArr(s: string | string[]): string[] {
  if (Array.isArray(s)) return s;
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}

watch(() => [props.entityId, props.route], load, { immediate: true });

// Em modo inline, emitir mudanças continuamente
watch(form, (v) => emit('update:value', { ...v }), { deep: true });

// ── Persistência (chamada pelo parent via expose ou pelo botão standalone) ──
async function save(): Promise<number | null> {
  // Para 'static', precisa route. Para outros, precisa entity_id.
  if (props.entityType === 'static' && !props.route) {
    showMessage('Route obrigatório para SEO estático', 'error');
    return null;
  }
  if (props.entityType !== 'static' && !props.entityId) {
    showMessage('Entity ID obrigatório (a entidade-pai precisa ser salva primeiro)', 'error');
    return null;
  }
  if (form.jsonld_data) {
    try { JSON.parse(form.jsonld_data); } catch {
      showMessage('JSON-LD inválido', 'error');
      return null;
    }
  }

  saving.value = true;
  try {
    const body: any = {
      entity_type: props.entityType,
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
    if (props.entityType === 'static') body.route = props.route;
    else body.entity_id = props.entityId;

    const result = await adminFetch<{ id: number; created: boolean }>('/api/admin/page-seo', { method: 'POST', body });
    existingId.value = result.id;
    emit('saved', result.id);
    return result.id;
  } catch (e: any) {
    showMessage('Erro ao salvar SEO: ' + (e.statusMessage || e.message), 'error');
    return null;
  } finally {
    saving.value = false;
  }
}

defineExpose({ save, getValue: () => ({ ...form }) });

async function onStandaloneSubmit(e: Event) {
  e.preventDefault();
  const id = await save();
  if (id) showMessage(existingId.value ? 'SEO atualizado!' : 'SEO criado!', 'success');
}
</script>

<template>
  <div class="seo-editor" :class="`mode-${mode ?? 'inline'}`">
    <div v-if="loading" class="loading-hint">Carregando SEO...</div>

    <form v-else @submit="onStandaloneSubmit">
      <div class="seo-grid">
        <div class="seo-form">
          <div class="form-field">
            <label>Focus keyword</label>
            <input v-model="form.focus_keyword" placeholder="ex: ensaio fotográfico mogi" />
          </div>

          <div class="form-field">
            <label>Keywords (até 15)</label>
            <AdminSeoKeywordsInput v-model="form.keywords" />
          </div>

          <div class="form-field">
            <label>
              Meta title
              <span class="counter" :class="{ warn: titleLen > 60, info: titleLen > 0 && titleLen < 20 }">{{ titleLen }}/60</span>
            </label>
            <input v-model="form.meta_title" placeholder="Título exibido na aba do navegador e Google" />
          </div>

          <div class="form-field">
            <label>
              Meta description
              <span class="counter" :class="{ warn: descLen > 160 || (descLen > 0 && descLen < 80) }">{{ descLen }}/160</span>
            </label>
            <textarea v-model="form.meta_description" rows="3" placeholder="Resumo de 80 a 160 caracteres exibido nos resultados de busca"></textarea>
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
            <label>Twitter image (fallback OG)</label>
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
            <label>JSON-LD</label>
            <AdminSeoJsonLdEditor
              :type="form.jsonld_type"
              :data="form.jsonld_data"
              @update:type="(v) => form.jsonld_type = v"
              @update:data="(v) => form.jsonld_data = v"
            />
          </div>
        </div>

        <div class="seo-side">
          <AdminSeoScoreCard :score="score" :issues="issues" />
          <AdminSeoPreview :input="previewInput" />
        </div>
      </div>

      <div v-if="mode === 'standalone'" class="form-actions">
        <button type="submit" class="btn-primary" :disabled="saving">
          {{ saving ? 'Salvando...' : (existingId ? 'Salvar alterações' : 'Criar SEO') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.seo-editor {
  &.mode-inline {
    background: #0f0f0f;
    border: 1rem solid #2a2a2a;
    border-radius: 8rem;
    padding: 16rem;
    margin-top: 24rem;
  }
}

.seo-grid {
  display: grid;
  grid-template-columns: 1fr 380rem;
  gap: 24rem;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
}

.seo-form {
  display: flex;
  flex-direction: column;
  gap: 12rem;
}

.seo-side {
  display: flex;
  flex-direction: column;
  gap: 16rem;
}

.counter {
  font-weight: normal;
  font-size: 11rem;
  color: #888;
  margin-left: 8rem;
  &.warn { color: #fbbf24; }
  &.info { color: #94a3b8; }
}

.form-field label {
  font-size: 13rem;
  color: #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
}

textarea, input[type="text"], input:not([type]) {
  width: 100%;
  background: #222;
  color: #eee;
  border: 1rem solid #444;
  border-radius: 4rem;
  padding: 8rem;
  font-size: 13rem;
  font-family: inherit;

  &:focus { outline: none; border-color: #60a5fa; }
}

textarea { resize: vertical; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8rem;
  margin-top: 16rem;
  padding-top: 16rem;
  border-top: 1rem solid #2a2a2a;
}

.loading-hint {
  padding: 20rem;
  text-align: center;
  color: #888;
}
</style>
