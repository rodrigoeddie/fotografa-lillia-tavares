// Re-exports do módulo SEO (Fase 6 — refator).
//
// Todos os arquivos abaixo são tree-shakeable. Componentes do admin
// (`/components/admin/seo/*`) consomem daqui.

export { useSeoEvaluator } from './useSeoEvaluator';
export type { SeoItem, SeoSummary } from './useSeoEvaluator';

export { compose, DEDUCTIONS } from './scoring';

export { analyzeKeyword } from './analyzers/keywordDensity';
export type { KeywordAnalysis, KeywordPosition } from './analyzers/keywordDensity';

export { analyzeReadability } from './analyzers/readability';
export type { ReadabilityAnalysis } from './analyzers/readability';

export {
  buildGooglePreview,
  buildFacebookPreview,
  buildTwitterPreview,
  buildPreviews,
} from './analyzers/preview';
export type {
  GooglePreview,
  FacebookPreview,
  TwitterPreview,
  PreviewInput,
} from './analyzers/preview';

export { evaluateBlogPost } from './evaluators/blogPost';
export { evaluatePortfolioWork } from './evaluators/portfolioWork';
export { evaluateLandingPage } from './evaluators/landingPage';
export { evaluateStaticPage } from './evaluators/staticPage';
