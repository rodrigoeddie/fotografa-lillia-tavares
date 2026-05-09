/**
 * Geração de previews Google / Facebook / Twitter Cards a partir do estado
 * de page_seo. Funções puras — input string + URL → preview object.
 */

const CF_IMAGE_BASE = 'https://images.fotografalilliatavares.com.br/images';
const SITE_URL      = 'https://fotografalilliatavares.com.br';

export interface PreviewInput {
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_cf_id?: string | null;
  twitter_image_cf_id?: string | null;
  canonical?: string | null;
  /** URL da página renderizada (fallback quando não há canonical). */
  pageUrl?: string;
  /** Brand para suffix em title se faltar. */
  brand?: string;
}

export interface GooglePreview {
  url: string;
  displayTitle: string;
  displayDescription: string;
  truncatedTitle: boolean;
  truncatedDescription: boolean;
}

export interface FacebookPreview {
  url: string;
  imageUrl: string | null;
  title: string;
  description: string;
}

export interface TwitterPreview {
  cardType: 'summary_large_image' | 'summary';
  url: string;
  imageUrl: string | null;
  title: string;
  description: string;
}

function truncate(s: string, max: number): { value: string; truncated: boolean } {
  if (s.length <= max) return { value: s, truncated: false };
  return { value: s.slice(0, max - 1).trim() + '…', truncated: true };
}

function cfUrl(cfId: string | null | undefined): string | null {
  return cfId ? `${CF_IMAGE_BASE}/${cfId}/public` : null;
}

export function buildGooglePreview(input: PreviewInput): GooglePreview {
  const titleRaw = input.meta_title ?? '';
  const descRaw  = input.meta_description ?? '';
  const t = truncate(titleRaw, 60);
  const d = truncate(descRaw, 160);
  const url = input.canonical ?? input.pageUrl ?? SITE_URL;
  return {
    url,
    displayTitle: t.value,
    displayDescription: d.value,
    truncatedTitle: t.truncated,
    truncatedDescription: d.truncated,
  };
}

export function buildFacebookPreview(input: PreviewInput): FacebookPreview {
  return {
    url: input.canonical ?? input.pageUrl ?? SITE_URL,
    imageUrl: cfUrl(input.og_image_cf_id),
    title: input.meta_title ?? '',
    description: input.meta_description ?? '',
  };
}

export function buildTwitterPreview(input: PreviewInput): TwitterPreview {
  const imageUrl = cfUrl(input.twitter_image_cf_id ?? input.og_image_cf_id);
  return {
    cardType: imageUrl ? 'summary_large_image' : 'summary',
    url: input.canonical ?? input.pageUrl ?? SITE_URL,
    imageUrl,
    title: input.meta_title ?? '',
    description: input.meta_description ?? '',
  };
}

export function buildPreviews(input: PreviewInput) {
  return {
    google: buildGooglePreview(input),
    facebook: buildFacebookPreview(input),
    twitter: buildTwitterPreview(input),
  };
}
