/**
 * Validações de SEO comuns a todas as entidades — operam sobre os campos
 * `page_seo` (meta_title, meta_description, keywords, og_image, etc.).
 *
 * Cada função empurra `PageSeoIssue` no array recebido. Não calcula score
 * (delegado a `scoring.ts`).
 */
import type { PageSeoIssue } from '~/shared/schemas/seo';

const TITLE_MIN = 20;
const TITLE_MAX = 60;
const DESC_MIN = 80;
const DESC_MAX = 160;

export function pushTitleIssues(issues: PageSeoIssue[], title: string | null | undefined) {
  if (!title) {
    issues.push({ severity: 'error', code: 'TITLE_MISSING', field: 'meta_title', message: 'Sem meta title' });
    return;
  }
  if (title.length > TITLE_MAX) {
    issues.push({ severity: 'warning', code: 'TITLE_TOO_LONG', field: 'meta_title', message: `Title longo (${title.length} chars, recomendado ≤ ${TITLE_MAX})`, suggestion: 'O Google trunca títulos longos.' });
  } else if (title.length < TITLE_MIN) {
    issues.push({ severity: 'info', code: 'TITLE_TOO_SHORT', field: 'meta_title', message: `Title curto (${title.length} chars, recomendado ≥ ${TITLE_MIN})` });
  }
}

export function pushDescriptionIssues(issues: PageSeoIssue[], desc: string | null | undefined) {
  if (!desc) {
    issues.push({ severity: 'error', code: 'DESCRIPTION_MISSING', field: 'meta_description', message: 'Sem meta description' });
    return;
  }
  if (desc.length > DESC_MAX) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_TOO_LONG', field: 'meta_description', message: `Description longa (${desc.length} chars, máximo ${DESC_MAX})` });
  } else if (desc.length < DESC_MIN) {
    issues.push({ severity: 'warning', code: 'DESCRIPTION_TOO_SHORT', field: 'meta_description', message: `Description curta (${desc.length} chars, mínimo ${DESC_MIN})` });
  }
}

export function pushKeywordsIssues(issues: PageSeoIssue[], keywords: unknown) {
  const arr = Array.isArray(keywords) ? keywords : [];
  if (!arr.length) {
    issues.push({ severity: 'warning', code: 'KEYWORDS_MISSING', field: 'keywords', message: 'Sem palavras-chave' });
  } else if (arr.length < 3) {
    issues.push({ severity: 'info', code: 'KEYWORDS_FEW', field: 'keywords', message: `Poucas palavras-chave (${arr.length}, recomendado ≥ 3)` });
  }
}

export function pushFocusKeywordIssues(issues: PageSeoIssue[], focusKeyword: string | null | undefined) {
  if (!focusKeyword) {
    issues.push({ severity: 'info', code: 'FOCUS_KEYWORD_MISSING', field: 'focus_keyword', message: 'Sem focus keyword definida' });
  }
}

export function pushOgImageIssues(issues: PageSeoIssue[], ogId: string | null | undefined) {
  if (!ogId) {
    issues.push({ severity: 'warning', code: 'OG_IMAGE_MISSING', field: 'og_image_cf_id', message: 'Sem imagem de compartilhamento (OG)' });
  }
}

/** Issue genérico de "tudo OK". */
export const NO_ISSUES: PageSeoIssue = { severity: 'info', code: 'OK', message: 'Tudo OK!' };
