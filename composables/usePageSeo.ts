import type { EntityType } from '~/shared/schemas/seo';

interface PageSeoData {
  meta_title: string | null;
  meta_description: string | null;
  og_image_cf_id: string | null;
  og_image_alt: string | null;
  twitter_image_cf_id: string | null;
  canonical: string | null;
  jsonld_type: string | null;
  jsonld_data: string | null;
}

const CF_BASE = 'https://images.fotografalilliatavares.com.br/images';
const DEFAULT_OG_IMAGE_CF_ID = 'a0839ccd-c1b8-4142-e44f-77c07c62c800';

function cfUrl(id: string | null | undefined): string | null {
  return id ? `${CF_BASE}/${id}/public` : null;
}

type SeoSource = PageSeoData | null | undefined | (() => PageSeoData | null | undefined);

/**
 * Aplica useSeoMeta + useHead reativamente a partir do registro page_seo.
 *
 * IMPORTANTE: deve ser chamado dentro de setup ANTES de qualquer await.
 * Aceita getter (função) para que os valores sejam reativos — quando o
 * `useFetch` que popula a fonte completar, os meta tags atualizam.
 */
export function applyPageSeo(source: SeoSource) {
  const get = (): PageSeoData | null | undefined =>
    typeof source === 'function' ? (source as () => PageSeoData | null | undefined)() : source;

  useSeoMeta({
    title:              () => get()?.meta_title ?? undefined,
    description:        () => get()?.meta_description ?? undefined,
    ogTitle:            () => get()?.meta_title ?? undefined,
    ogDescription:      () => get()?.meta_description ?? undefined,
    ogUrl:              () => get()?.canonical ?? undefined,
    ogImage:            () => cfUrl(get()?.og_image_cf_id ?? DEFAULT_OG_IMAGE_CF_ID) ?? undefined,
    ogImageAlt:         () => get()?.og_image_alt ?? undefined,
    twitterCard:        () => 'summary_large_image',
    twitterTitle:       () => get()?.meta_title ?? undefined,
    twitterDescription: () => get()?.meta_description ?? undefined,
    twitterImage:       () => cfUrl(get()?.twitter_image_cf_id ?? get()?.og_image_cf_id ?? DEFAULT_OG_IMAGE_CF_ID) ?? undefined,
  });

  useHead({
    link: computed(() => {
      const seo = get();
      return seo?.canonical ? [{ rel: 'canonical', href: seo.canonical }] : [];
    }),
    script: computed(() => {
      const seo = get();
      if (!seo?.jsonld_type || !seo.jsonld_data) return [];
      try {
        const parsed = typeof seo.jsonld_data === 'string' ? JSON.parse(seo.jsonld_data) : seo.jsonld_data;
        return [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': seo.jsonld_type, ...parsed }),
        }];
      } catch {
        return [];
      }
    }),
  });
}

/**
 * Carrega page_seo de uma entidade dinâmica ou rota estática e aplica os
 * meta tags reativamente. Chamada SÍNCRONA — não use `await` aqui.
 *
 * O `useFetch` retorna ref reativo que preenche quando o request completa.
 * O Nuxt bloqueia o SSR automaticamente até o useFetch resolver.
 *
 * Uso:
 *   <script setup>
 *   usePageSeo('static', '/');
 *   </script>
 */
export function usePageSeo(entityType: EntityType, slugOrRoute: string) {
  const url = entityType === 'static'
    ? `/api/public/page-seo/by-route?route=${encodeURIComponent(slugOrRoute)}`
    : `/api/public/page-seo/by/${entityType}/${slugOrRoute}`;

  const { data } = useFetch<PageSeoData | null>(url, {
    key: `page-seo-${entityType}-${slugOrRoute}`,
  });
  applyPageSeo(() => data.value);
  return data;
}
