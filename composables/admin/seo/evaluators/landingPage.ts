import type { PageSeoIssue } from '~/shared/schemas/seo';
import type { LpBlock } from '~/shared/schemas/landing-page';
import {
  pushTitleIssues,
  pushDescriptionIssues,
  pushKeywordsIssues,
  pushFocusKeywordIssues,
  pushOgImageIssues,
  NO_ISSUES,
} from './shared';
import { analyzeKeyword } from '../analyzers/keywordDensity';
import { analyzeReadability } from '../analyzers/readability';
import { compose } from '../scoring';

interface LpEvaluatorInput {
  lp: {
    id: number;
    slug: string;
    rota: string;
    titulo: string;
    ativo: number;
  };
  blocks: LpBlock[];
  pageSeo: {
    focus_keyword: string | null;
    keywords: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_image_cf_id: string | null;
  } | null;
}

/**
 * Concatena todo o texto exibido nos blocks da LP. Usado para análise de
 * keyword density e legibilidade (Flesch BR) do conteúdo da página.
 */
function extractBodyText(blocks: LpBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    const d = b.dados as Record<string, unknown>;
    for (const value of Object.values(d)) {
      if (typeof value === 'string') {
        parts.push(value.replace(/<[^>]+>/g, ' '));
      } else if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string') {
            parts.push(item.replace(/<[^>]+>/g, ' '));
          } else if (item && typeof item === 'object') {
            for (const inner of Object.values(item as Record<string, unknown>)) {
              if (typeof inner === 'string') parts.push(inner.replace(/<[^>]+>/g, ' '));
              else if (Array.isArray(inner)) {
                for (const x of inner) if (typeof x === 'string') parts.push(x.replace(/<[^>]+>/g, ' '));
              }
            }
          }
        }
      }
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

export function evaluateLandingPage(input: LpEvaluatorInput) {
  const { lp, blocks, pageSeo } = input;
  const issues: PageSeoIssue[] = [];

  const title = pageSeo?.meta_title ?? lp.titulo;
  const desc  = pageSeo?.meta_description ?? null;
  const ogId  = pageSeo?.og_image_cf_id ?? null;
  const kwRaw = pageSeo?.keywords ?? null;
  const kw    = kwRaw ? (Array.isArray(kwRaw) ? kwRaw : safeJsonArray(kwRaw)) : [];

  pushTitleIssues(issues, title);
  pushDescriptionIssues(issues, desc);
  pushOgImageIssues(issues, ogId);
  pushKeywordsIssues(issues, kw);
  pushFocusKeywordIssues(issues, pageSeo?.focus_keyword);

  if (!blocks.length) {
    issues.push({
      severity: 'error',
      code: 'NO_BLOCKS',
      message: 'Landing page sem blocos',
    });
  }
  if (!lp.ativo) {
    issues.push({ severity: 'info', code: 'LP_INACTIVE', message: 'LP inativa (não publicada)' });
  }

  // Garantir blocos essenciais
  const tipos = new Set(blocks.map((b) => b.tipo));
  if (!tipos.has('hero') && !tipos.has('heroPresentes')) {
    issues.push({ severity: 'warning', code: 'NO_HERO', message: 'Sem bloco hero' });
  }
  if (!tipos.has('ctaContact')) {
    issues.push({ severity: 'info', code: 'NO_CTA', message: 'Sem bloco de CTA de contato' });
  }

  // Análises de conteúdo
  const body = extractBodyText(blocks);

  const keywordAnalysis = pageSeo?.focus_keyword
    ? analyzeKeyword(pageSeo.focus_keyword, {
        title,
        meta_description: desc,
        body,
        slug: lp.slug,
        url: lp.rota,
      })
    : null;

  if (keywordAnalysis && keywordAnalysis.totalOccurrences === 0) {
    issues.push({
      severity: 'warning',
      code: 'FOCUS_KEYWORD_NOT_USED',
      message: 'Focus keyword não aparece em title/desc/slug/blocos',
    });
  }

  const readability = analyzeReadability(body);
  if (readability.totalWords > 50 && readability.fleschPt < 40) {
    issues.push({
      severity: 'info',
      code: 'READABILITY_LOW',
      message: `Legibilidade dos blocos baixa (Flesch ${readability.fleschPt})`,
    });
  }

  if (!issues.length) issues.push(NO_ISSUES);

  const { score } = compose(issues, {
    TITLE_MISSING: 25,
    DESCRIPTION_MISSING: 20,
    OG_IMAGE_MISSING: 12,
    KEYWORDS_MISSING: 10,
    NO_BLOCKS: 30,
    NO_HERO: 8,
    FOCUS_KEYWORD_NOT_USED: 8,
    OK: 0,
  });

  return { issues, score, keyword: keywordAnalysis, readability };
}

function safeJsonArray(s: string): string[] {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}
