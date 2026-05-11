/**
 * POST /api/admin/seo/evaluate-all
 *
 * Recalcula o score SEO de todos os registros `page_seo` e persiste no DB
 * (campo `score` + `last_issues` JSON + `last_evaluated_at`). Avaliação básica
 * server-side (sem keyword density / readability — esses ficam no client).
 */
import { defineEventHandler } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';

interface Issue { severity: 'error' | 'warning' | 'info'; code: string; message: string; }

function evaluateRow(row: any): { score: number; issues: Issue[] } {
  const issues: Issue[] = [];
  let dedu = 0;

  if (!row.meta_title) {
    issues.push({ severity: 'error', code: 'TITLE_MISSING', message: 'Sem meta title' });
    dedu += 25;
  } else if (row.meta_title.length > 60) {
    issues.push({ severity: 'warning', code: 'TITLE_TOO_LONG', message: `Title longo (${row.meta_title.length})` });
    dedu += 5;
  }

  if (!row.meta_description) {
    issues.push({ severity: 'error', code: 'DESCRIPTION_MISSING', message: 'Sem meta description' });
    dedu += 20;
  } else if (row.meta_description.length > 160) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_TOO_LONG', message: `Description longa (${row.meta_description.length})` });
    dedu += 5;
  } else if (row.meta_description.length < 80) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_TOO_SHORT', message: `Description curta (${row.meta_description.length})` });
    dedu += 8;
  }

  if (!row.og_image_cf_id) {
    issues.push({ severity: 'warning', code: 'OG_IMAGE_MISSING', message: 'Sem imagem OG' });
    dedu += 12;
  }

  const kws = row.keywords ? (typeof row.keywords === 'string' ? safeJsonArr(row.keywords) : row.keywords) : [];
  if (!kws.length) {
    issues.push({ severity: 'warning', code: 'KEYWORDS_MISSING', message: 'Sem palavras-chave' });
    dedu += 10;
  }
  if (!row.focus_keyword) {
    issues.push({ severity: 'info', code: 'FOCUS_KEYWORD_MISSING', message: 'Sem focus keyword' });
    dedu += 3;
  }
  if (!row.canonical) {
    issues.push({ severity: 'info', code: 'CANONICAL_MISSING', message: 'Sem canonical' });
    dedu += 3;
  }

  if (!issues.length) issues.push({ severity: 'info', code: 'OK', message: 'Tudo OK!' });

  return { score: Math.max(0, 100 - dedu), issues };
}

function safeJsonArr(s: string): string[] {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new PageSeoService(getOrm(event));

  const rows = await svc.list();
  let updated = 0;
  for (const row of rows) {
    const { score, issues } = evaluateRow(row);
    await svc.saveEvaluation(row.id, score, JSON.stringify(issues));
    updated++;
  }

  return { success: true, updated };
});
