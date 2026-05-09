/**
 * Auditoria técnica — análise pesada que se vale de chamadas server-side.
 * Funções puras client-side aqui são apenas wrappers para o endpoint
 * `/api/admin/seo/audit` (a ser implementado).
 */

export interface TechnicalAudit {
  /** URLs com canonical conflitando com outra entidade. */
  canonicalConflicts: string[];
  /** Esta entidade está no sitemap.xml? */
  inSitemap: boolean;
  /** Links internos quebrados encontrados no conteúdo (até 50). */
  brokenLinks: string[];
  /** robots desta entidade resolve sem conflito? */
  robotsOk: boolean;
}

/**
 * Roda auditoria técnica completa de todos os registros page_seo.
 * Esta função fica a cargo do endpoint server-side. No client,
 * wrap apenas para tipo. Implementação real chamará `useAdminFetch`.
 */
export function emptyAudit(): TechnicalAudit {
  return {
    canonicalConflicts: [],
    inSitemap: false,
    brokenLinks: [],
    robotsOk: true,
  };
}
