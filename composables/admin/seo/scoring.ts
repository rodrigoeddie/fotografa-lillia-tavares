import type { PageSeoIssue } from '~/shared/schemas/seo';

/** Mapa de severidade → peso de dedução padrão. */
export const DEDUCTIONS = {
  error:   20,
  warning: 8,
  info:    3,
} as const;

/**
 * Compõe um score 0-100 a partir de uma lista de issues, descontando
 * pesos definidos no `code` ou caindo no default por severidade.
 *
 * Os evaluators podem passar `customDeductions` para sobrescrever pesos
 * específicos por código (ex: TITLE_MISSING: 25).
 */
export function compose(
  issues: PageSeoIssue[],
  customDeductions: Record<string, number> = {},
): { score: number; deductions: number } {
  let deductions = 0;
  for (const issue of issues) {
    const w = customDeductions[issue.code] ?? DEDUCTIONS[issue.severity];
    deductions += w;
  }
  return {
    score: Math.max(0, Math.min(100, 100 - deductions)),
    deductions,
  };
}
