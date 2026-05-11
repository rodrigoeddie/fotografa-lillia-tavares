import type { LpBlock } from '~/shared/schemas/landing-page';

interface RenderedLandingPage {
  landingPage: {
    id: number;
    slug: string;
    rota: string;
    titulo: string;
    lp_class: string | null;
    ativo: number;
  };
  blocks: LpBlock[];
  pageSeo: {
    meta_title: string | null;
    meta_description: string | null;
    og_image_cf_id: string | null;
    og_image_alt: string | null;
    twitter_image_cf_id: string | null;
    canonical: string | null;
    keywords: string | null;
    jsonld_type: string | null;
    jsonld_data: string | null;
  } | null;
}

/**
 * Carrega uma landing page (LP + blocks + page_seo) E aplica o SEO da
 * página reativamente. Chamada SÍNCRONA — sem `await`. O Nuxt bloqueia
 * o SSR até o useFetch resolver. As páginas LP apenas consomem `lp.value`.
 */
export function useLandingPage(slug: string) {
  const { data, pending, error, refresh } = useFetch<RenderedLandingPage>(`/api/public/landing-pages/${slug}`, {
    key: `lp-${slug}`,
  });

  // Aplica SEO ANTES de qualquer await — Nuxt context preservado.
  applyPageSeo(() => data.value?.pageSeo);

  return { data, pending, error, refresh };
}
