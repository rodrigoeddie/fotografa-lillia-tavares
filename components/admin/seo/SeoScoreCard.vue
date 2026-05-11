<script setup lang="ts">
import type { PageSeoIssue } from '~/shared/schemas/seo';

const props = defineProps<{
  score: number;
  issues: PageSeoIssue[];
}>();

const colorClass = computed(() => {
  if (props.score >= 80) return 'score-good';
  if (props.score >= 60) return 'score-ok';
  return 'score-bad';
});

const errors   = computed(() => props.issues.filter((i) => i.severity === 'error'));
const warnings = computed(() => props.issues.filter((i) => i.severity === 'warning'));
const infos    = computed(() => props.issues.filter((i) => i.severity === 'info'));
</script>

<template>
  <div class="seo-score-card">
    <div class="score-header">
      <div class="score-circle" :class="colorClass">
        <span class="score-value">{{ score }}</span>
        <span class="score-label">/ 100</span>
      </div>
      <div class="score-counts">
        <span v-if="errors.length"   class="count count-error">{{ errors.length }} erro(s)</span>
        <span v-if="warnings.length" class="count count-warning">{{ warnings.length }} aviso(s)</span>
        <span v-if="infos.length"    class="count count-info">{{ infos.length }} info</span>
      </div>
    </div>

    <ul v-if="issues.length" class="issues">
      <li
        v-for="(issue, i) in issues"
        :key="i"
        :class="`issue-${issue.severity}`"
      >
        <span class="issue-msg">{{ issue.message }}</span>
        <small v-if="issue.suggestion" class="issue-suggestion">{{ issue.suggestion }}</small>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.seo-score-card {
  background: #1a1a1a;
  border: 1rem solid #333;
  border-radius: 8rem;
  padding: 16rem;
}

.score-header {
  display: flex;
  align-items: center;
  gap: 16rem;
  margin-bottom: 12rem;
}

.score-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90rem;
  height: 90rem;
  border-radius: 50%;
  border: 3rem solid currentColor;
  flex-shrink: 0;

  &.score-good { color: #16a34a; }
  &.score-ok   { color: #d97706; }
  &.score-bad  { color: #dc2626; }
}

.score-value {
  font-size: 32rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 12rem;
  opacity: 0.7;
}

.score-counts {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  font-size: 13rem;
}

.count {
  &.count-error   { color: #f87171; }
  &.count-warning { color: #fbbf24; }
  &.count-info    { color: #94a3b8; }
}

.issues {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6rem;
  font-size: 12rem;

  li {
    padding-left: 16rem;
    position: relative;

    &::before {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}

.issue-error   { color: #f87171; &::before { content: '✗'; } }
.issue-warning { color: #fbbf24; &::before { content: '⚠'; } }
.issue-info    { color: #94a3b8; &::before { content: 'ℹ'; } }

.issue-msg { display: block; }
.issue-suggestion {
  display: block;
  color: #888;
  font-size: 11rem;
  margin-top: 2rem;
  font-style: italic;
}
</style>
