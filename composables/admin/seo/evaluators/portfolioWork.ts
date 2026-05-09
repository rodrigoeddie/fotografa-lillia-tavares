import type { PageSeoIssue } from '~/shared/schemas/seo';
import {
  pushTitleIssues,
  pushDescriptionIssues,
  pushKeywordsIssues,
  pushFocusKeywordIssues,
  pushOgImageIssues,
  NO_ISSUES,
} from './shared';
import { analyzeKeyword } from '../analyzers/keywordDensity';
import { compose } from '../scoring';

interface PortfolioEvaluatorInput {
  work: {
    id: number;
    slug: string;
    titulo: string | null;
    descricao: string | null;
    categoria: string;
    local: string | null;
    seo_keywords: string | null;
  };
  fotos?: { alt: string | null; can_be_thumb: number }[];
  pageSeo: {
    focus_keyword: string | null;
    keywords: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_image_cf_id: string | null;
  } | null;
}

export function evaluatePortfolioWork(input: PortfolioEvaluatorInput) {
  const { work, fotos = [], pageSeo } = input;
  const issues: PageSeoIssue[] = [];

  const title = pageSeo?.meta_title ?? work.titulo;
  const desc  = pageSeo?.meta_description ?? work.descricao;
  const ogId  = pageSeo?.og_image_cf_id ?? null;
  const kwRaw = pageSeo?.keywords ?? work.seo_keywords;
  const kw    = kwRaw ? (Array.isArray(kwRaw) ? kwRaw : safeJsonArray(kwRaw)) : [];

  pushTitleIssues(issues, title);
  pushDescriptionIssues(issues, desc);
  pushOgImageIssues(issues, ogId);
  pushKeywordsIssues(issues, kw);
  pushFocusKeywordIssues(issues, pageSeo?.focus_keyword);

  if (!work.categoria) {
    issues.push({ severity: 'error', code: 'CATEGORY_MISSING', message: 'Sem categoria' });
  }

  if (!fotos.length) {
    issues.push({ severity: 'error', code: 'FOTOS_MISSING', message: 'Nenhuma foto adicionada' });
  } else {
    const semAlt = fotos.filter((f) => !f.alt).length;
    if (semAlt > 0) {
      issues.push({
        severity: 'warning',
        code: 'FOTOS_NO_ALT',
        message: `${semAlt} foto(s) sem alt text`,
      });
    }
    const hasThumb = fotos.some((f) => f.can_be_thumb === 1);
    if (!hasThumb) {
      issues.push({
        severity: 'warning',
        code: 'FOTOS_NO_THUMB',
        message: 'Nenhuma foto marcada como thumbnail',
      });
    }
  }

  if (!work.local) {
    issues.push({ severity: 'info', code: 'LOCAL_MISSING', message: 'Sem local definido' });
  }
  if (work.slug.length > 60) {
    issues.push({
      severity: 'info',
      code: 'SLUG_TOO_LONG',
      message: `Slug longo (${work.slug.length} chars, recomendado ≤ 60)`,
    });
  }

  // Análise de focus keyword (sem `body` pois portfolio é primariamente fotos)
  const keywordAnalysis = pageSeo?.focus_keyword
    ? analyzeKeyword(pageSeo.focus_keyword, {
        title,
        meta_description: desc,
        slug: work.slug,
        altTexts: fotos.map((f) => f.alt ?? '').filter(Boolean),
      })
    : null;

  if (keywordAnalysis && keywordAnalysis.totalOccurrences === 0) {
    issues.push({
      severity: 'warning',
      code: 'FOCUS_KEYWORD_NOT_USED',
      message: 'Focus keyword não aparece em nenhum campo (title/desc/slug/alt)',
    });
  }

  if (!issues.length) issues.push(NO_ISSUES);

  const { score } = compose(issues, {
    TITLE_MISSING: 25,
    DESCRIPTION_MISSING: 20,
    OG_IMAGE_MISSING: 10,
    KEYWORDS_MISSING: 10,
    CATEGORY_MISSING: 10,
    FOTOS_MISSING: 20,
    FOTOS_NO_THUMB: 5,
    FOTOS_NO_ALT: 8,
    FOCUS_KEYWORD_NOT_USED: 10,
    OK: 0,
  });

  return { issues, score, keyword: keywordAnalysis };
}

function safeJsonArray(s: string): string[] {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}
