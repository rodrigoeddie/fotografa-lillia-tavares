<script lang="ts" setup>
definePageMeta({ layout: 'admin' });

const { items, loading, summary, evaluate } = useSeoEvaluator();

const filterType = ref<'all' | 'portfolio' | 'blog'>('all');
const filterScore = ref<'all' | 'bad' | 'ok' | 'good'>('all');

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
    <div class="page-header">
      <h2>Avaliação SEO</h2>
      <button class="btn-primary btn-sm" :disabled="loading" @click="evaluate">
        {{ loading ? 'Analisando...' : '🔍 Reanalisar' }}
      </button>
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
          <button :class="['filter-btn', filterType === 'portfolio' ? 'active' : '']" @click="filterType = 'portfolio'">Portfolio</button>
          <button :class="['filter-btn', filterType === 'blog' ? 'active' : '']" @click="filterType = 'blog'">Blog</button>
        </div>
        <div class="filter-group">
          <label>Score:</label>
          <button :class="['filter-btn', filterScore === 'all' ? 'active' : '']" @click="filterScore = 'all'">Todos</button>
          <button :class="['filter-btn filter-bad', filterScore === 'bad' ? 'active' : '']" @click="filterScore = 'bad'">Crítico (&lt;60)</button>
          <button :class="['filter-btn filter-ok', filterScore === 'ok' ? 'active' : '']" @click="filterScore = 'ok'">Médio (60-79)</button>
          <button :class="['filter-btn filter-good', filterScore === 'good' ? 'active' : '']" @click="filterScore = 'good'">Bom (≥80)</button>
        </div>
      </div>

      <!-- Table -->
      <div class="form-card">
        <p v-if="filtered.length === 0" class="empty-hint">Nenhum item encontrado.</p>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Título</th>
              <th>Score</th>
              <th>Issues</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="`${item.type}-${item.id}`">
              <td>
                <span :class="['type-badge', `type-${item.type}`]">{{ item.type }}</span>
              </td>
              <td class="title-cell">{{ item.title }}</td>
              <td>
                <span :class="['score-badge', scoreClass(item.score)]">{{ item.score }}</span>
              </td>
              <td class="issues-cell">
                <ul class="issues-list">
                  <li
                    v-for="(issue, i) in item.issues"
                    :key="i"
                    :class="`issue-${issue.severity}`">
                    {{ issue.message }}
                  </li>
                </ul>
              </td>
              <td>
                <NuxtLink :to="item.editUrl" class="btn-icon">✏️</NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use '~/assets/styles/admin-shared' as *;

.seo-summary {
  display: flex;
  gap: 16rem;
  margin-bottom: 24rem;
  flex-wrap: wrap;
}

.stat-card {
  background: white;
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  padding: 16rem 24rem;
  text-align: center;
  min-width: 110px;

  .stat-value { display: block; font-size: 16rem; font-weight: 700; line-height: 1; }
  .stat-label { font-size: 17rem; color: #64748b; margin-top: 5rem; display: block; }

  &.stat-total { border-color: #ccc; background: #f9f9f9; .stat-value { color: #333; } }
  &.stat-good { border-color: #86efac; background: #f0fdf4; .stat-value { color: #16a34a; } }
  &.stat-ok   { border-color: #fde68a; background: #fffbeb; .stat-value { color: #d97706; } }
  &.stat-bad  { border-color: #fca5a5; background: #fef2f2; .stat-value { color: #dc2626; } }
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
    label { font-size: 14rem; color: #64748b; font-weight: 600; }
  }
}

.filter-btn {
  padding: 4rem 12rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: black;
  font-size: 14rem;
  cursor: pointer;
  &.active { background: #1e293b; color: white; border-color: #1e293b; }
  &.filter-bad.active  { background: #dc2626; border-color: #dc2626; }
  &.filter-ok.active   { background: #d97706; border-color: #d97706; }
  &.filter-good.active { background: #16a34a; border-color: #16a34a; }
}

.score-badge {
  display: inline-block;
  min-width: 40rem;
  text-align: center;
  padding: 10rem 15rem;
  border-radius: 4px;
  font-weight: 700;
  font-size: 16rem;

  &.score-good { background: #dcfce7; color: #16a34a; }
  &.score-ok   { background: #fef9c3; color: #854d0e; }
  &.score-bad  { background: #fee2e2; color: #dc2626; }
}

.type-badge {
  display: inline-block;
  padding: 10rem 15rem;
  border-radius: 4px;
  font-size: 16rem;
  font-weight: 600;
  text-transform: uppercase;

  &.type-portfolio { background: #dbeafe; color: #1d4ed8; }
  &.type-blog      { background: #f3e8ff; color: #7e22ce; }
}

.title-cell { max-width: 200px; font-size: 19rem; }

.issues-cell { max-width: 300px; font-size: 19rem; }

.issues-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 19rem;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.issue-error   { color: #dc2626; &::before { content: '✗ '; } }
.issue-warning { color: #d97706; &::before { content: '⚠ '; } }
.issue-info    { color: #64748b; &::before { content: 'ℹ '; } }
</style>
