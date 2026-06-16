/**
 * Compõe URLs públicas do Cloudflare Images a partir do `cf_id`.
 *
 * Fonte única da base: runtimeConfig.public.cfImageBase (nuxt.config.ts).
 * Todas as imagens públicas (portfolio, blog, depoimentos, hero, avatares,
 * cenários) vêm da MESMA conta CF Images — use sempre este composable em vez
 * de redeclarar a base em cada componente.
 *
 * @example
 * const cfImg = useCfImg()
 * cfImg('abc123')            // https://images.../images/abc123/public
 * cfImg('abc123', 'thumb')   // https://images.../images/abc123/thumb
 */
export const useCfImg = () => {
  const base = useRuntimeConfig().public.cfImageBase
  return (id: string | null | undefined, variant: string = 'public'): string =>
    id ? `${base}/${id}/${variant}` : ''
}

/** URL canônica do site (runtimeConfig.public.siteUrl). */
export const useSiteUrl = (): string => useRuntimeConfig().public.siteUrl
