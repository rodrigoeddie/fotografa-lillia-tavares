/**
 * Análise de densidade e posicionamento de focus keyword.
 * Funções puras — sem fetch ou estado.
 */

export interface KeywordPosition {
  /** Onde a keyword aparece. */
  field: 'title' | 'h1' | 'h2' | 'meta_description' | 'body' | 'slug' | 'alt' | 'url';
  /** Quantas vezes aparece nesse campo. */
  count: number;
}

export interface KeywordAnalysis {
  /** Densidade no body (0–100%). */
  density: number;
  /** Total de ocorrências em todos os campos. */
  totalOccurrences: number;
  /** Onde apareceu (lista de posições). */
  positions: KeywordPosition[];
  /** Número de palavras no body (para contexto da densidade). */
  bodyWords: number;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim();
}

function countMatches(haystack: string, needle: string): number {
  if (!haystack || !needle) return 0;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${escaped}\\b`, 'gi');
  return (haystack.match(re) ?? []).length;
}

function countWords(text: string): number {
  return normalize(text).split(/\s+/).filter(Boolean).length;
}

/**
 * Analisa onde a focus keyword aparece e calcula densidade no body.
 *
 * Faixas saudáveis:
 *  - density 0.5%–2.5% → bom
 *  - density < 0.5%    → keyword sub-utilizada
 *  - density > 2.5%    → keyword stuffing
 */
export function analyzeKeyword(
  keyword: string | null | undefined,
  fields: {
    title?: string | null;
    h1?: string | null;
    h2?: string | null;
    meta_description?: string | null;
    body?: string | null;       // texto puro (sem HTML)
    slug?: string | null;
    altTexts?: string[];
    url?: string | null;
  },
): KeywordAnalysis | null {
  if (!keyword) return null;
  const k = normalize(keyword);
  if (!k) return null;

  const positions: KeywordPosition[] = [];
  let totalOccurrences = 0;

  function add(field: KeywordPosition['field'], hay: string | null | undefined) {
    if (!hay) return;
    const c = countMatches(normalize(hay), k);
    if (c > 0) {
      positions.push({ field, count: c });
      totalOccurrences += c;
    }
  }

  add('title', fields.title);
  add('h1', fields.h1);
  add('h2', fields.h2);
  add('meta_description', fields.meta_description);
  add('slug', fields.slug);
  add('url', fields.url);

  if (fields.altTexts?.length) {
    const altMatches = fields.altTexts.reduce((sum, alt) => sum + countMatches(normalize(alt), k), 0);
    if (altMatches > 0) {
      positions.push({ field: 'alt', count: altMatches });
      totalOccurrences += altMatches;
    }
  }

  const body = fields.body ?? '';
  const bodyWords = countWords(body);
  const bodyMatches = countMatches(normalize(body), k);
  if (bodyMatches > 0) {
    positions.push({ field: 'body', count: bodyMatches });
    totalOccurrences += bodyMatches;
  }

  const density = bodyWords > 0 ? (bodyMatches / bodyWords) * 100 : 0;

  return {
    density: Math.round(density * 100) / 100,
    totalOccurrences,
    positions,
    bodyWords,
  };
}
