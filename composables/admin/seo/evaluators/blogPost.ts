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
import { analyzeReadability } from '../analyzers/readability';
import { compose } from '../scoring';

interface BlogEvaluatorInput {
  /** Dados da tabela blog_posts */
  post: {
    id: number;
    slug: string;
    titulo: string;
    descricao: string | null;
    conteudo: string | null;
    categoria: string;
    data: string | null;
    imagem_cf_id: string | null;
    ativo: number;
    seo_keywords: string | null;
  };
  /** page_seo associado (pode ser null se ainda não criado). */
  pageSeo: {
    focus_keyword: string | null;
    keywords: string | null;
    meta_title: string | null;
    meta_description: string | null;
    og_image_cf_id: string | null;
  } | null;
}

export function evaluateBlogPost(input: BlogEvaluatorInput) {
  const { post, pageSeo } = input;
  const issues: PageSeoIssue[] = [];

  // SEO base (vem de page_seo OU fallback para campos legacy do post)
  const title = pageSeo?.meta_title ?? post.titulo;
  const desc  = pageSeo?.meta_description ?? post.descricao;
  const ogId  = pageSeo?.og_image_cf_id ?? post.imagem_cf_id;
  const kwRaw = pageSeo?.keywords ?? post.seo_keywords;
  const kw    = kwRaw ? (Array.isArray(kwRaw) ? kwRaw : safeJsonArray(kwRaw)) : [];

  pushTitleIssues(issues, title);
  pushDescriptionIssues(issues, desc);
  pushOgImageIssues(issues, ogId);
  pushKeywordsIssues(issues, kw);
  pushFocusKeywordIssues(issues, pageSeo?.focus_keyword);

  // Conteúdo mínimo
  const conteudoTexto = (post.conteudo ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (conteudoTexto.length < 300) {
    issues.push({
      severity: 'warning',
      code: 'CONTENT_TOO_SHORT',
      field: 'conteudo',
      message: `Conteúdo curto (${conteudoTexto.length} chars, recomendado ≥ 300)`,
    });
  }

  if (!post.categoria) {
    issues.push({ severity: 'error', code: 'CATEGORY_MISSING', field: 'categoria', message: 'Sem categoria' });
  }
  if (!post.data) {
    issues.push({ severity: 'info', code: 'PUB_DATE_MISSING', field: 'data', message: 'Sem data de publicação' });
  }
  if (!post.ativo) {
    issues.push({ severity: 'info', code: 'POST_INACTIVE', message: 'Post inativo (não publicado)' });
  }

  // Focus keyword: análise de densidade + posições
  const keywordAnalysis = pageSeo?.focus_keyword
    ? analyzeKeyword(pageSeo.focus_keyword, {
        title,
        meta_description: desc,
        body: conteudoTexto,
        slug: post.slug,
      })
    : null;

  if (keywordAnalysis) {
    if (keywordAnalysis.totalOccurrences === 0) {
      issues.push({
        severity: 'warning',
        code: 'FOCUS_KEYWORD_NOT_USED',
        message: 'Focus keyword não aparece em nenhum campo',
      });
    } else {
      if (!keywordAnalysis.positions.find((p) => p.field === 'title')) {
        issues.push({ severity: 'warning', code: 'FOCUS_NOT_IN_TITLE', message: 'Focus keyword não está no title' });
      }
      if (!keywordAnalysis.positions.find((p) => p.field === 'meta_description')) {
        issues.push({ severity: 'info', code: 'FOCUS_NOT_IN_DESC', message: 'Focus keyword não está na meta description' });
      }
      if (keywordAnalysis.density > 2.5) {
        issues.push({
          severity: 'warning',
          code: 'KEYWORD_STUFFING',
          message: `Densidade de keyword alta (${keywordAnalysis.density}%)`,
          suggestion: 'Reduza repetições — Google penaliza overuse.',
        });
      } else if (keywordAnalysis.density > 0 && keywordAnalysis.density < 0.5) {
        issues.push({
          severity: 'info',
          code: 'KEYWORD_LOW_DENSITY',
          message: `Densidade baixa (${keywordAnalysis.density}%)`,
        });
      }
    }
  }

  // Legibilidade Flesch BR
  const readability = analyzeReadability(conteudoTexto);
  if (readability.fleschPt < 40) {
    issues.push({
      severity: 'warning',
      code: 'READABILITY_LOW',
      message: `Legibilidade baixa (Flesch ${readability.fleschPt}, ${readability.level})`,
      suggestion: 'Encurte frases (média atual: ' + readability.avgSentenceWords + ' palavras).',
    });
  } else if (readability.fleschPt < 60) {
    issues.push({
      severity: 'info',
      code: 'READABILITY_MODERATE',
      message: `Legibilidade moderada (Flesch ${readability.fleschPt})`,
    });
  }
  if (readability.longSentences > 0) {
    issues.push({
      severity: 'info',
      code: 'LONG_SENTENCES',
      message: `${readability.longSentences} frase(s) com mais de 25 palavras`,
    });
  }
  if (readability.longParagraphs > 0) {
    issues.push({
      severity: 'info',
      code: 'LONG_PARAGRAPHS',
      message: `${readability.longParagraphs} parágrafo(s) com mais de 150 palavras`,
    });
  }

  if (!issues.length) issues.push(NO_ISSUES);

  const { score } = compose(issues, {
    TITLE_MISSING: 25,
    DESCRIPTION_MISSING: 20,
    OG_IMAGE_MISSING: 15,
    CATEGORY_MISSING: 10,
    KEYWORDS_MISSING: 10,
    READABILITY_LOW: 10,
    CONTENT_TOO_SHORT: 10,
    FOCUS_KEYWORD_NOT_USED: 10,
    KEYWORD_STUFFING: 8,
    DESCRIPTION_TOO_SHORT: 8,
    DESCRIPTION_TOO_LONG: 5,
    TITLE_TOO_LONG: 5,
    READABILITY_MODERATE: 5,
    OK: 0,
  });

  return { issues, score, keyword: keywordAnalysis, readability };
}

function safeJsonArray(s: string): string[] {
  try { const v = JSON.parse(s); return Array.isArray(v) ? v : []; } catch { return []; }
}
