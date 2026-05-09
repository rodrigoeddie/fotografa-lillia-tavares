/**
 * Defaults globais de SEO usados como fallback quando uma página não tem
 * registro em `page_seo` ou faltam campos. Os valores aqui devem ficar em
 * sintonia com nuxt.config.ts (siteConfig + schemaOrg.identity).
 */

export const SEO_DEFAULTS = {
  brand:           'Fotógrafa Lillia Tavares',
  siteUrl:         'https://fotografalilliatavares.com.br',
  ogImageCfId:     'a0839ccd-c1b8-4142-e44f-77c07c62c800',
  twitterHandle:   '@fotografalillia',
  fbAppId:         '1304313054896815',
  description:     'Lillia Tavares: Fotógrafa de retratos femininos que celebra a singularidade das mulheres. Destaque sua realeza com uma sessão única que empodera sua autoestima.',
  cfImageBaseUrl:  'https://images.fotografalilliatavares.com.br/images',
} as const;

/** Compõe a URL pública de uma imagem do Cloudflare Images a partir do `cf_id`. */
export function cfImageUrl(cfId: string | null | undefined, variant: string = 'public'): string | null {
  if (!cfId) return null;
  return `${SEO_DEFAULTS.cfImageBaseUrl}/${cfId}/${variant}`;
}
