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
    twitter_image_cf_id: string | null;
    canonical: string | null;
    keywords: string | null;
    jsonld_type: string | null;
    jsonld_data: string | null;
  } | null;
}

/** Carrega uma landing page (LP + blocks + page_seo) do endpoint público. */
export async function useLandingPage(slug: string) {
  return useFetch<RenderedLandingPage>(`/api/public/landing-pages/${slug}`, {
    key: `lp-${slug}`,
  });
}
