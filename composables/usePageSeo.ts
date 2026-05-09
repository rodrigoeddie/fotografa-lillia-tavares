import type { EntityType } from '~/shared/schemas/seo';

interface PageSeoData {
  meta_title: string | null;
  meta_description: string | null;
  og_image_cf_id: string | null;
  twitter_image_cf_id: string | null;
  canonical: string | null;
  jsonld_type: string | null;
  jsonld_data: string | null;
}

const CF_BASE = 'https://images.fotografalilliatavares.com.br/images';

function cfUrl(id: string | null | undefined): string | null {
  return id ? `${CF_BASE}/${id}/public` : null;
}

/**
 * Aplica useSeoMeta + useSchemaOrg + useHead a partir do registro page_seo
 * armazenado no DB. Aceita o objeto pré-carregado (vindo de useLandingPage,
 * useBlogPost, etc.) ou null para fallback aos defaults globais.
 */
export function applyPageSeo(seo: PageSeoData | null | undefined) {
  if (!seo) return;

  const ogImage     = cfUrl(seo.og_image_cf_id);
  const twImage     = cfUrl(seo.twitter_image_cf_id ?? seo.og_image_cf_id);
  const title       = seo.meta_title ?? undefined;
  const description = seo.meta_description ?? undefined;
  const url         = seo.canonical ?? undefined;

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogImage: ogImage ?? undefined,
    twitterCard: twImage ? 'summary_large_image' : 'summary',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: twImage ?? undefined,
  });

  if (seo.canonical) {
    useHead({ link: [{ rel: 'canonical', href: seo.canonical }] });
  }

  // JSON-LD: aplica via useSchemaOrg quando type for um suportado pelo @nuxtjs/seo;
  // para types arbitrários ou 'custom', injeta como <script type="application/ld+json"> via useHead.
  if (seo.jsonld_type && seo.jsonld_data) {
    try {
      const parsed = JSON.parse(seo.jsonld_data);
      useHead({
        script: [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': seo.jsonld_type, ...parsed }),
        }],
      });
    } catch {
      // JSON inválido — ignora silenciosamente
    }
  }
}

/**
 * Carrega page_seo de uma entidade dinâmica (blog/portfolio/lp via slug)
 * ou rota estática, e aplica os meta tags. Para LPs, prefira passar o
 * `pageSeo` que já vem em `useLandingPage()` (evita request duplicado).
 */
export async function usePageSeo(entityType: EntityType, slugOrRoute: string) {
  const url = entityType === 'static'
    ? `/api/public/page-seo/by-route?route=${encodeURIComponent(slugOrRoute)}`
    : `/api/public/page-seo/by/${entityType}/${slugOrRoute}`;

  const { data } = await useFetch<PageSeoData | null>(url, {
    key: `page-seo-${entityType}-${slugOrRoute}`,
  });
  applyPageSeo(data.value ?? null);
  return data;
}
