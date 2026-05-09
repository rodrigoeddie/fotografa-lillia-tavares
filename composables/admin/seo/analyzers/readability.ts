/**
 * Análise de legibilidade adaptada ao PT-BR (Índice Flesch — Martins et al., NILC/USP).
 * Função pura — recebe texto, retorna métricas.
 *
 * Fórmula:
 *   ILF = 248.835 − (1.015 × ASL) − (84.6 × ASW)
 *   ASL = palavras / frases
 *   ASW = sílabas / palavras
 *
 * Faixas adaptadas (PT-BR):
 *   75–100  muito fácil
 *   50–75   fácil
 *   25–50   difícil
 *    0–25   muito difícil
 */

export interface ReadabilityAnalysis {
  /** Índice Flesch (escore bruto, pode ficar fora de 0–100). */
  fleschPt: number;
  /** Faixa textual (humano). */
  level: 'muito facil' | 'facil' | 'dificil' | 'muito dificil';
  /** Tamanho médio de frases (palavras/frase). */
  avgSentenceWords: number;
  /** Tamanho médio de palavras (sílabas/palavra). */
  avgWordSyllables: number;
  /** Quantas frases têm > 25 palavras. */
  longSentences: number;
  /** Quantos parágrafos têm > 150 palavras. */
  longParagraphs: number;
  /** Total de palavras analisadas. */
  totalWords: number;
}

const VOWEL_GROUPS_RE = /[aeiouáéíóúâêîôûãõy]+/gi;

/**
 * Heurística de contagem de sílabas para PT-BR (margem ~5% — suficiente p/ SEO).
 * Conta grupos vocálicos consecutivos por palavra.
 */
function countSyllables(word: string): number {
  const matches = word.match(VOWEL_GROUPS_RE);
  return Math.max(1, matches?.length ?? 0);
}

function splitSentences(text: string): string[] {
  return text.split(/[.!?…]+\s+/).filter((s) => s.trim().length > 0);
}

function splitParagraphs(text: string): string[] {
  return text.split(/\n\s*\n+/).filter((p) => p.trim().length > 0);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-záéíóúâêîôûãõçñ\s]/gi, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function levelOf(score: number): ReadabilityAnalysis['level'] {
  if (score >= 75) return 'muito facil';
  if (score >= 50) return 'facil';
  if (score >= 25) return 'dificil';
  return 'muito dificil';
}

export function analyzeReadability(text: string): ReadabilityAnalysis {
  const cleanText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanText) {
    return {
      fleschPt: 100,
      level: 'muito facil',
      avgSentenceWords: 0,
      avgWordSyllables: 0,
      longSentences: 0,
      longParagraphs: 0,
      totalWords: 0,
    };
  }

  const sentences = splitSentences(cleanText);
  const paragraphs = splitParagraphs(text);
  const words = tokenize(cleanText);

  const totalWords = words.length;
  const totalSentences = Math.max(1, sentences.length);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const avgSentenceWords = totalWords / totalSentences;
  const avgWordSyllables = totalWords > 0 ? totalSyllables / totalWords : 0;

  const fleschPt = 248.835 - 1.015 * avgSentenceWords - 84.6 * avgWordSyllables;

  const longSentences = sentences.filter((s) => tokenize(s).length > 25).length;
  const longParagraphs = paragraphs
    .map((p) => p.replace(/<[^>]+>/g, ' '))
    .filter((p) => tokenize(p).length > 150).length;

  return {
    fleschPt: Math.round(fleschPt * 100) / 100,
    level: levelOf(fleschPt),
    avgSentenceWords: Math.round(avgSentenceWords * 100) / 100,
    avgWordSyllables: Math.round(avgWordSyllables * 100) / 100,
    longSentences,
    longParagraphs,
    totalWords,
  };
}
