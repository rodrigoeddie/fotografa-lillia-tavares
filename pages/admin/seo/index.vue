<script lang="ts" setup>
import { useSeoEvaluator } from '~/composables/admin/seo';

definePageMeta({ layout: 'admin' });

const { items, loading, summary, evaluate } = useSeoEvaluator();
const { adminFetch } = useAdminFetch();
const showMessage = inject<(msg: string, type: 'success' | 'error') => void>('showMessage')!;

const filterType = ref<'all' | 'lp' | 'portfolio' | 'blog' | 'static'>('all');
const filterScore = ref<'all' | 'bad' | 'ok' | 'good'>('all');
const recalculating = ref(false);

async function recalculateScores() {
  recalculating.value = true;
  try {
    const res = await adminFetch<{ updated: number }>('/api/admin/seo/evaluate-all', { method: 'POST' });
    showMessage(`Scores recalculados em ${res.updated} registros`, 'success');
    await evaluate();
  } catch (e: any) {
    showMessage('Erro ao recalcular: ' + (e.statusMessage || e.message), 'error');
  } finally {
    recalculating.value = false;
  }
}

const filtered = computed(() => {
  return items.value.filter((item) => {
    if (filterType.value !== 'all' && item.type !== filterType.value) return false;
    if (filterScore.value === 'bad' && item.score >= 60) return false;
    if (filterScore.value === 'ok' && (item.score < 60 || item.score >= 80)) return false;
    if (filterScore.value === 'good' && item.score < 80) return false;
    return true;
  });
});

function scoreClass(score: number) {
  if (score >= 80) return 'score-good';
  if (score >= 60) return 'score-ok';
  return 'score-bad';
}

onMounted(evaluate);
</script>

<template>
  <div class="page">
    <div class="dep-header">
      <div>
        <h2>Avaliação SEO</h2>
      </div>
      <div class="header-actions">
        <NuxtLink to="/admin/seo/static-pages/save" class="btn-add-item">+ Nova página estática</NuxtLink>
        <NuxtLink to="/admin/seo/audit" class="btn-secondary">🛠 Auditoria técnica</NuxtLink>
        <button class="btn-secondary" :disabled="recalculating" @click="recalculateScores">
          {{ recalculating ? 'Recalculando...' : '↻ Recalcular scores (DB)' }}
        </button>
        <button class="btn-add-item" :disabled="loading" @click="evaluate">
          {{ loading ? 'Analisando...' : '🔍 Reanalisar' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-hint">Carregando e avaliando conteúdo...</div>

    <template v-else>
      <!-- Summary -->
      <div v-if="summary" class="seo-summary">
        <div class="stat-card stat-total">
          <span class="stat-value">{{ summary.total }}</span>
          <span class="stat-label">Itens avaliados</span>
        </div>
        <div class="stat-card" :class="summary.avg >= 80 ? 'stat-good' : summary.avg >= 60 ? 'stat-ok' : 'stat-bad'">
          <span class="stat-value">{{ summary.avg }}</span>
          <span class="stat-label">Score médio</span>
        </div>
        <div class="stat-card" :class="summary.errors > 0 ? 'stat-bad' : 'stat-good'">
          <span class="stat-value">{{ summary.errors }}</span>
          <span class="stat-label">Erros</span>
        </div>
        <div class="stat-card" :class="summary.warnings > 5 ? 'stat-ok' : 'stat-good'">
          <span class="stat-value">{{ summary.warnings }}</span>
          <span class="stat-label">Avisos</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="seo-filters">
        <div class="filter-group">
          <label>Tipo:</label>
          <button :class="['filter-btn', filterType === 'all' ? 'active' : '']" @click="filterType = 'all'">Todos</button>
          <button :class="['filter-btn', filterType === 'lp' ? 'active' : '']" @click="filterType = 'lp'">LPs</button>
          <button :class="['filter-btn', filterType === 'blog' ? 'active' : '']" @click="filterType = 'blog'">Blog</button>
          <button :class="['filter-btn', filterType === 'portfolio' ? 'active' : '']" @click="filterType = 'portfolio'">Portfolio</button>
          <button :class="['filter-btn', filterType === 'static' ? 'active' : '']" @click="filterType = 'static'">Estáticas</button>
        </div>
        <div class="filter-group">
          <label>Score:</label>
          <button :class="['filter-btn', filterScore === 'all' ? 'active' : '']" @click="filterScore = 'all'">Todos</button>
          <button :class="['filter-btn filter-bad', filterScore === 'bad' ? 'active' : '']" @click="filterScore = 'bad'">Crítico (&lt;60)</button>
          <button :class="['filter-btn filter-ok', filterScore === 'ok' ? 'active' : '']" @click="filterScore = 'ok'">Médio (60-79)</button>
          <button :class="['filter-btn filter-good', filterScore === 'good' ? 'active' : '']" @click="filterScore = 'good'">Bom (≥80)</button>
        </div>
      </div>

      <!-- List -->
      <p v-if="!filtered || filtered.length === 0" class="list-empty">Nenhum item encontrado.</p>
      <div v-else class="item-list">
        <div
          v-for="item in filtered"
          :key="`${item.type}-${item.id}`"
          class="item-row seo-row"
        >
        <div class="wrap-data">
          <span :class="['type-badge', `type-${item.type}`]">{{ item.type }}</span><br>
          <span class="item-title">{{ item.title }}</span><br>
          <span class="item-route">{{ item.route }}</span>
        </div>
          <span :class="['score-badge', scoreClass(item.score)]">{{ item.score }}</span>
          <ul class="issues-list">
            <li
              v-for="(issue, i) in (item.issues ?? [])"
              :key="i"
              :class="`issue-${issue.severity}`"
            >{{ issue.message }}</li>
          </ul>
          <div class="item-actions">
            <NuxtLink :to="item.editUrl" class="btn-icon">✏️</NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-tokens' as t;
@use '~/assets/styles/admin-shared' as *;

.seo-summary {
  display: flex;
  gap: 16rem;
  margin-bottom: 24rem;
  flex-wrap: wrap;
}

.stat-card {
  background: t.$surface;
  border: 1px solid t.$border;
  border-radius: 8px;
  padding: 16rem 24rem;
  text-align: center;
  min-width: 110px;

  .stat-value { display: block; font-size: 16rem; font-weight: 700; line-height: 1; }
  .stat-label { font-size: 17rem; color: t.$text-2; margin-top: 5rem; display: block; }

  &.stat-total { border-color: t.$border-strong; background: t.$surface-2; .stat-value { color: t.$text; } }
  &.stat-good { border-color: t.$success; background: t.$success-bg; .stat-value { color: t.$success; } }
  &.stat-ok   { border-color: t.$warning; background: t.$warning-bg; .stat-value { color: t.$warning; } }
  &.stat-bad  { border-color: t.$danger; background: t.$danger-bg; .stat-value { color: t.$danger; } }
}

.seo-filters {
  display: flex;
  gap: 24rem;
  margin-bottom: 16rem;
  flex-wrap: wrap;
  align-items: center;

  .filter-group {
    display: flex;
    align-items: center;
    gap: 7rem;
    label { font-size: 14rem; color: t.$text-2; font-weight: 600; }
  }
}

.filter-btn {
  padding: 4rem 12rem;
  border: 1px solid t.$border-strong;
  border-radius: 4px;
  background: t.$surface-2;
  font-size: 14rem;
  cursor: pointer;
  &.active { background: t.$accent; color: t.$accent-ink; border-color: t.$accent; }
  &.filter-bad.active  { background: t.$danger; border-color: t.$danger; }
  &.filter-ok.active   { background: t.$warning; border-color: t.$warning; }
  &.filter-good.active { background: t.$success; border-color: t.$success; }
}

.score-badge {
  display: inline-block;
  width: 34px;
  text-align: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;

  &.score-good { background: t.$success-bg; color: t.$success; }
  &.score-ok   { background: t.$warning-bg; color: t.$warning; }
  &.score-bad  { background: t.$danger-bg; color: t.$danger; }
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;

  &.type-portfolio { background: #1e3a5f; color: #93c5fd; }
  &.type-blog      { background: #3b1f5e; color: #d8b4fe; }
  &.type-lp        { background: #5e2f1f; color: #fdba74; }
  &.type-static    { background: #1f3b2f; color: #86efac; }
}

.seo-row {
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.item-route {
  font-size: 12px;
  color: t.$text-2;
  font-family: monospace;
  flex-shrink: 0;
}

.wrap-data {
  width: 63%;
}

.issues-list {
  width: 22%;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.issue-error   { color: t.$danger; &::before { content: '✗ '; } }
.issue-warning { color: t.$warning; &::before { content: '⚠ '; } }
.issue-info    { color: t.$text-3; &::before { content: 'ℹ '; } }

.header-actions {
  display: flex;
  gap: 8rem;
  align-items: center;
}
</style>
