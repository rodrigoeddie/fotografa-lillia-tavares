import { z } from 'zod';

export const entityTypeSchema = z.enum(['lp', 'blog', 'portfolio', 'static']);

export const seoSeveritySchema = z.enum(['error', 'warning', 'info']);

export const jsonLdTypeSchema = z.enum([
  'WebPage', 'Article', 'BlogPosting', 'Service',
  'LocalBusiness', 'FAQPage', 'BreadcrumbList',
  'ImageGallery', 'CollectionPage', 'Person', 'Organization', 'custom',
]);

export const seoIssueSchema = z.object({
  severity:   seoSeveritySchema,
  code:       z.string(),
  message:    z.string(),
  field:      z.string().optional(),
  suggestion: z.string().optional(),
});

export const keywordsSchema = z.array(z.string().trim().min(1).max(60)).max(15);

const seoBase = {
  focus_keyword:        z.string().trim().max(160).nullable().optional(),
  keywords:             keywordsSchema.nullable().optional(),
  meta_title:           z.string().trim().max(160).nullable().optional(),
  meta_description:     z.string().trim().max(500).nullable().optional(),
  og_image_cf_id:       z.string().trim().max(120).nullable().optional(),
  og_image_alt:         z.string().trim().max(300).nullable().optional(),
  twitter_image_cf_id:  z.string().trim().max(120).nullable().optional(),
  canonical:            z.string().trim().max(500).nullable().optional(),
  robots:               z.string().trim().max(100).nullable().optional(),
  jsonld_type:          jsonLdTypeSchema.nullable().optional(),
  jsonld_data:          z.unknown().nullable().optional(),
};

// Discriminated union por entity_type
export const PageSeoUpsertSchema = z.discriminatedUnion('entity_type', [
  z.object({
    entity_type: z.literal('lp'),
    entity_id:   z.number().int().positive(),
    route:       z.null().optional(),
    ...seoBase,
  }),
  z.object({
    entity_type: z.literal('blog'),
    entity_id:   z.number().int().positive(),
    route:       z.null().optional(),
    ...seoBase,
  }),
  z.object({
    entity_type: z.literal('portfolio'),
    entity_id:   z.number().int().positive(),
    route:       z.null().optional(),
    ...seoBase,
  }),
  z.object({
    entity_type: z.literal('static'),
    entity_id:   z.null().optional(),
    route:       z.string().trim().regex(/^\/[a-z0-9\-/]*$/),
    ...seoBase,
  }),
]);

export const PageSeoUpdateSchema = z.object(seoBase).partial();

export const SeoEvaluationSchema = z.object({
  score:  z.number().int().min(0).max(100),
  issues: z.array(seoIssueSchema),
});

export type EntityType    = z.infer<typeof entityTypeSchema>;
export type JsonLdType    = z.infer<typeof jsonLdTypeSchema>;
export type PageSeoIssue  = z.infer<typeof seoIssueSchema>;
export type SeoSeverity   = z.infer<typeof seoSeveritySchema>;
export type PageSeoInput  = z.infer<typeof PageSeoUpsertSchema>;
export type PageSeoUpdate = z.infer<typeof PageSeoUpdateSchema>;
export type SeoEvaluation = z.infer<typeof SeoEvaluationSchema>;
