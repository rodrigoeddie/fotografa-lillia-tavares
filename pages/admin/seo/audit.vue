<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;
const { adminFetch } = useAdminFetch();

interface AuditResult {
  canonical_conflicts: string[];
  in_sitemap: boolean;
  broken_links: string[];
  robots_ok: boolean;
}
interface SeoRow {
  id: number;
  entity_type: 'lp' | 'blog' | 'portfolio' | 'static';
  entity_id: number | null;
  route: string | null;
  meta_title: string | null;
  canonical: string | null;
  technical_audit: string | null;
  last_audited_at: string | null;
}

const items = ref<SeoRow[]>([]);
const loading = ref(false);
const running = ref(false);
const lastRunInfo = ref<{ audited: number; issues: number; summary: Record<string, number> } | null>(null);

const filterType = ref<'all' | 'with-issues' | 'lp' | 'blog' | 'portfolio' | 'static'>('with-issues');

async function load() {
  loading.value = true;
  try {
    items.value = await adminFetch<SeoRow[]>('/api/admin/page-seo');
  } catch (e: any) {
    showMessage('Erro ao carregar: ' + (e.statusMessage || e.message), 'error');
  } finally {
    loading.value = false;
  }
}

async function runAudit() {
  running.value = true;
  try {
    lastRunInfo.value = await adminFetch('/api/admin/seo/audit', { method: 'POST' });
    showMessage(`Auditoria concluída: ${lastRunInfo.value?.audited} itens analisados, ${lastRunInfo.value?.issues} com problemas`, 'success');
    await load();
  } catch (e: any) {
    showMessage('Erro: ' + (e.statusMessage || e.message), 'error');
  } finally {
    running.value = false;
  }
}

function parseAudit(json: string | null): AuditResult | null {
  if (!json) return null;
  try { return JSON.parse(json); } catch { return null; }
}

function hasIssues(audit: AuditResult | null): boolean {
  if (!audit) return false;
  return audit.canonical_conflicts.length > 0
    || !audit.in_sitemap
    || audit.broken_links.length > 0
    || !audit.robots_ok;
}

const filtered = computed(() => {
  return items.value
    .map((item) => ({ ...item, audit: parseAudit(item.technical_audit) }))
    .filter((item) => {
      if (filterType.value === 'all') return true;
      if (filterType.value === 'with-issues') return hasIssues(item.audit);
      return item.entity_type === filterType.value;
    })
    .sort((a, b) => {
      // Itens com mais issues primeiro
      const aIssues = a.audit ? (a.audit.canonical_conflicts.length + a.audit.broken_links.length + (a.audit.in_sitemap ? 0 : 1) + (a.audit.robots_ok ? 0 : 1)) : 0;
      const bIssues = b.audit ? (b.audit.canonical_conflicts.length + b.audit.broken_links.length + (b.audit.in_sitemap ? 0 : 1) + (b.audit.robots_ok ? 0 : 1)) : 0;
      return bIssues - aIssues;
    });
});

const totalsByCategory = computed(() => {
  let canonicalConflicts = 0;
  let notInSitemap = 0;
  let brokenLinks = 0;
  let robotsIssues = 0;
  let notAudited = 0;
  for (const item of items.value) {
    const audit = parseAudit(item.technical_audit);
    if (!audit) { notAudited++; continue; }
    if (audit.canonical_conflicts.length) canonicalConflicts++;
    if (!audit.in_sitemap) notInSitemap++;
    if (audit.broken_links.length) brokenLinks += audit.broken_links.length;
    if (!audit.robots_ok) robotsIssues++;
  }
  return { canonicalConflicts, notInSitemap, brokenLinks, robotsIssues, notAudited };
});

onMounted(load);
</script>

<template>
  <div class="page">
    <div class="page-header">
      <NuxtLink to="/admin/seo" class="page-back">← Voltar</NuxtLink>
      <h2>Auditoria técnica SEO</h2>
    </div>

    <div class="audit-actions">
      <button class="btn-primary" :disabled="running" @click="runAudit">
        {{ running ? 'Rodando auditoria...' : '🔍 Rodar auditoria técnica' }}
      </button>
      <p v-if="lastRunInfo" class="audit-info">
        Última: {{ lastRunInfo.audited }} itens, {{ lastRunInfo.issues }} com problemas
      </p>
    </div>

    <!-- Stats -->
    <div class="audit-stats">
      <div class="stat-card stat-bad">
        <span class="stat-value">{{ totalsByCategory.canonicalConflicts }}</span>
        <span class="stat-label">Canonical conflitando</span>
      </div>
      <div class="stat-card stat-ok">
        <span class="stat-value">{{ totalsByCategory.notInSitemap }}</span>
        <span class="stat-label">Fora do sitemap</span>
      </div>
      <div class="stat-card stat-bad">
        <span class="stat-value">{{ totalsByCategory.brokenLinks }}</span>
        <span class="stat-label">Links internos quebrados</span>
      </div>
      <div class="stat-card stat-ok">
        <span class="stat-value">{{ totalsByCategory.robotsIssues }}</span>
        <span class="stat-label">Problemas com robots</span>
      </div>
      <div class="stat-card stat-info">
        <span class="stat-value">{{ totalsByCategory.notAudited }}</span>
        <span class="stat-label">Nunca auditados</span>
      </div>
    </div>

    <!-- Filtros -->
    <div class="audit-filters">
      <button :class="['filter-btn', filterType === 'with-issues' ? 'active' : '']" @click="filterType = 'with-issues'">Com problemas</button>
      <button :class="['filter-btn', filterType === 'all' ? 'active' : '']" @click="filterType = 'all'">Todos</button>
      <button :class="['filter-btn', filterType === 'lp' ? 'active' : '']" @click="filterType = 'lp'">LPs</button>
      <button :class="['filter-btn', filterType === 'blog' ? 'active' : '']" @click="filterType = 'blog'">Blog</button>
      <button :class="['filter-btn', filterType === 'portfolio' ? 'active' : '']" @click="filterType = 'portfolio'">Portfolio</button>
      <button :class="['filter-btn', filterType === 'static' ? 'active' : '']" @click="filterType = 'static'">Estáticas</button>
    </div>

    <p v-if="loading" class="loading-hint">Carregando...</p>
    <p v-else-if="filtered.length === 0" class="list-empty">
      {{ filterType === 'with-issues' ? 'Nenhum problema técnico encontrado 🎉' : 'Nenhum item.' }}
    </p>

    <div v-else class="audit-list">
      <div v-for="item in filtered" :key="item.id" class="audit-row">
        <div class="row-header">
          <span :class="['type-badge', `type-${item.entity_type}`]">{{ item.entity_type }}</span>
          <span class="row-title">{{ item.meta_title || item.route || `#${item.id}` }}</span>
          <small v-if="item.last_audited_at" class="row-when">{{ new Date(item.last_audited_at).toLocaleString('pt-BR') }}</small>
        </div>

        <div v-if="!item.audit" class="audit-pending">Ainda não auditado.</div>

        <div v-else class="audit-checks">
          <div :class="['check', item.audit.in_sitemap ? 'ok' : 'fail']">
            <span class="check-icon">{{ item.audit.in_sitemap ? '✓' : '✗' }}</span>
            <span>{{ item.audit.in_sitemap ? 'No sitemap' : 'Fora do sitemap' }}</span>
          </div>
          <div :class="['check', item.audit.canonical_conflicts.length ? 'fail' : 'ok']">
            <span class="check-icon">{{ item.audit.canonical_conflicts.length ? '✗' : '✓' }}</span>
            <span>
              Canonical
              <small v-if="item.audit.canonical_conflicts.length">— conflita com IDs {{ item.audit.canonical_conflicts.join(', ') }}</small>
            </span>
          </div>
          <div :class="['check', item.audit.robots_ok ? 'ok' : 'fail']">
            <span class="check-icon">{{ item.audit.robots_ok ? '✓' : '✗' }}</span>
            <span>Robots {{ item.audit.robots_ok ? 'OK' : 'bloqueando indexação' }}</span>
          </div>
          <div :class="['check', item.audit.broken_links.length ? 'fail' : 'ok']">
            <span class="check-icon">{{ item.audit.broken_links.length ? '✗' : '✓' }}</span>
            <span>
              Links internos
              <small v-if="item.audit.broken_links.length">— {{ item.audit.broken_links.length }} quebrado(s)</small>
            </span>
          </div>
          <ul v-if="item.audit.broken_links.length" class="broken-list">
            <li v-for="link in item.audit.broken_links" :key="link">{{ link }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.audit-actions {
  display: flex;
  align-items: center;
  gap: 16rem;
  margin-bottom: 16rem;
}

.audit-info {
  color: t.$text-3;
  font-size: 13rem;
  margin: 0;
}

.audit-stats {
  display: flex;
  gap: 12rem;
  margin-bottom: 16rem;
  flex-wrap: wrap;
}

.stat-card {
  background: t.$surface;
  border: 1rem solid t.$border-strong;
  border-radius: 8rem;
  padding: 12rem 16rem;
  min-width: 130rem;
  display: flex;
  flex-direction: column;

  .stat-value { font-size: 22rem; font-weight: 700; line-height: 1; }
  .stat-label { font-size: 12rem; color: t.$text-3; margin-top: 4rem; }

  &.stat-bad   { .stat-value { color: t.$danger; } }
  &.stat-ok    { .stat-value { color: t.$warning; } }
  &.stat-info  { .stat-value { color: t.$text-2; } }
}

.audit-filters {
  display: flex;
  gap: 8rem;
  margin-bottom: 16rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 6rem 14rem;
  border: 1rem solid t.$border-strong;
  border-radius: 4rem;
  background: transparent;
  color: t.$text;
  font-size: 13rem;
  cursor: pointer;
  &:hover { background: t.$border; }
  &.active { background: t.$accent; color: t.$accent-ink; border-color: t.$accent; }
}

.audit-list {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}

.audit-row {
  background: t.$surface;
  border: 1rem solid t.$border;
  border-radius: 8rem;
  padding: 12rem 16rem;
}

.row-header {
  display: flex;
  align-items: center;
  gap: 12rem;
  margin-bottom: 8rem;
}

.row-title {
  flex: 1;
  font-size: 14rem;
  color: t.$text;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-when {
  color: t.$text-3;
  font-size: 11rem;
}

.type-badge {
  display: inline-block;
  padding: 2rem 8rem;
  border-radius: 4rem;
  font-size: 10rem;
  font-weight: 600;
  text-transform: uppercase;

  &.type-portfolio { background: #1e3a5f; color: #93c5fd; }
  &.type-blog      { background: #3b1f5e; color: #d8b4fe; }
  &.type-lp        { background: #5e2f1f; color: #fdba74; }
  &.type-static    { background: #1f3b2f; color: #86efac; }
}

.audit-pending {
  color: t.$text-3;
  font-style: italic;
  font-size: 13rem;
}

.audit-checks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220rem, 1fr));
  gap: 6rem;
  font-size: 12rem;
}

.check {
  display: flex;
  align-items: center;
  gap: 6rem;

  small { color: t.$text-3; margin-left: 4rem; }

  &.ok   { color: t.$success; }
  &.fail { color: t.$danger; }

  .check-icon {
    width: 14rem;
    display: inline-block;
    text-align: center;
    font-weight: 700;
  }
}

.broken-list {
  grid-column: 1 / -1;
  margin: 4rem 0 0;
  padding: 8rem 12rem;
  background: t.$danger-bg;
  border-radius: 4rem;
  list-style: none;
  font-family: 'Fira Code', monospace;
  font-size: 11rem;
  color: t.$danger;

  li {
    padding: 2rem 0;
  }
}
</style>
