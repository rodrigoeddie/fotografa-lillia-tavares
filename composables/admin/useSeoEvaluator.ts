// Backward-compat shim: o evaluator foi refatorado para `~/composables/admin/seo/`.
// Este arquivo deve ser removido quando todos os consumidores forem migrados (Fase 8).
export type { SeoItem } from './seo/useSeoEvaluator';
export type { PageSeoIssue as SeoIssue } from '~/shared/schemas/seo';
export { useSeoEvaluator } from './seo/useSeoEvaluator';
