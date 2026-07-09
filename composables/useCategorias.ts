/**
 * Categorias de blog e portfolio lidas do D1 (tabelas blog_categorias /
 * portfolio_categorias), com fallback para os mapas hardcoded de
 * useD1Adapters.ts e, por fim, para o próprio slug. Substitui o uso direto
 * dos mapas nas páginas públicas — categorias novas cadastradas no admin
 * passam a exibir o título correto sem precisar de deploy.
 */

interface Categoria {
  slug: string;
  titulo: string;
  descricao?: string | null;
  ordem?: number;
}

function makeUseCategorias(endpoint: string, key: string, fallback: Record<string, string>) {
  return async function () {
    const { data } = await useFetch<Categoria[]>(endpoint, { key });

    const categorias = computed<Categoria[]>(() => {
      if (data.value?.length) return data.value;
      return Object.entries(fallback).map(([slug, titulo]) => ({ slug, titulo }));
    });

    function titleFor(slug: string | null | undefined): string {
      if (!slug) return '';
      const match = categorias.value.find((c) => c.slug === slug);
      return match?.titulo ?? fallback[slug] ?? slug;
    }

    return { categorias, titleFor };
  };
}

export const useBlogCategorias = makeUseCategorias(
  '/api/public/blog/categorias',
  'blog-categorias',
  BLOG_CATEGORIAS,
);

export const usePortfolioCategorias = makeUseCategorias(
  '/api/public/portfolio/categorias',
  'portfolio-categorias',
  PORTFOLIO_CATEGORIAS,
);
