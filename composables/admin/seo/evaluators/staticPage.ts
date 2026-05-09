import type { PageSeoIssue } from '~/shared/schemas/seo';
import {
  pushTitleIssues,
  pushDescriptionIssues,
  pushKeywordsIssues,
  pushFocusKeywordIssues,
  pushOgImageIssues,
  NO_ISSUES,
} from './shared';
import { compose } from '../scoring';

interface StaticEvaluatorInput {
  pageSeo: {
    route: string;
    focus_keyword: string | null;
    keywords: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_image_cf_id: string | null;
    canonical: string | null;
  };
}

/** Avalia uma página estática — só os campos page_seo (não há body fetchável). */
export function evaluateStaticPage(input: StaticEvaluatorInput) {
  const { pageSeo } = input;
  const issues: PageSeoIssue[] = [];

  pushTitleIssues(issues, pageSeo.meta_title);
  pushDescriptionIssues(issues, pageSeo.meta_description);
  pushOgImageIssues(issues, pageSeo.og_image_cf_id);
  pushKeywordsIssues(issues, pageSeo.keywords ? safeJsonArray(pageSeo.keywords) : []);
  pushFocusKeywordIssues(issues, pageSeo.focus_keyword);

  if (!pageSeo.canonical) {
    issues.push({
      severity: 'info',
      code: 'CANONICAL_MISSING',
      field: 'canonical',
      message: 'Canonical não definida',
      suggestion: 'Use a URL absoluta da rota.',
    });
  }

  if (!issues.length) issues.push(NO_ISSUES);

  const { score } = compose(issues, {
    TITLE_MISSING: 30,
    DESCRIPTION_MISSING: 25,
    OG_IMAGE_MISSING: 15,
    KEYWORDS_MISSING: 10,
    OK: 0,
  });

  return { issues, score };
}

function safeJsonArray(s: string): string[] {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}
