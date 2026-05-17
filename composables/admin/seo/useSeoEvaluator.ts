import type { PageSeoIssue } from '~/shared/schemas/seo';

export interface SeoItem {
  id:        number | string;
  type:      'lp' | 'blog' | 'portfolio' | 'static';
  title:     string;
  editUrl:   string;
  score:     number;
  issues:    PageSeoIssue[];
}

export interface SeoSummary {
  total:    number;
  avg:      number;
  errors:   number;
  warnings: number;
}

/**
 * Orquestrador do SEO Evaluator (rebuild da Fase 6).
 *
 * Carrega entidades + page_seo associado e aplica os evaluators correspondentes.
 * As avaliações ficam em `items`, ordenadas pelo score (menor primeiro).
 */
export function useSeoEvaluator() {
  const { adminFetch } = useAdminFetch();
  const items = ref<SeoItem[]>([]);
  const loading = ref(false);

  const summary = computed<SeoSummary | null>(() => {
    const total = items.value.length;
    if (!total) return null;
    const avg = Math.round(items.value.reduce((s, i) => s + i.score, 0) / total);
    const errors   = items.value.reduce((n, i) => n + i.issues.filter((x) => x.severity === 'error').length, 0);
    const warnings = items.value.reduce((n, i) => n + i.issues.filter((x) => x.severity === 'warning').length, 0);
    return { total, avg, errors, warnings };
  });

  async function evaluate() {
    loading.value = true;
    items.value = [];
    try {
      const [
        { evaluateBlogPost },
        { evaluatePortfolioWork },
        { evaluateLandingPage },
        { evaluateStaticPage },
      ] = await Promise.all([
        import('./evaluators/blogPost'),
        import('./evaluators/portfolioWork'),
        import('./evaluators/landingPage'),
        import('./evaluators/staticPage'),
      ]);

      // Carrega tudo paralelo
      const [
        blogPosts,
        portfolioWorks,
        landingPages,
        seoEntries,
      ] = await Promise.all([
        adminFetch<any[]>('/api/admin/blog'),
        adminFetch<any[]>('/api/admin/portfolio'),
        adminFetch<any[]>('/api/admin/landing-pages'),
        adminFetch<any[]>('/api/admin/page-seo'),
      ]);

      const seoByEntity = new Map<string, any>();
      for (const s of seoEntries ?? []) {
        if (s.entity_type === 'static') seoByEntity.set(`static::${s.route}`, s);
        else seoByEntity.set(`${s.entity_type}::${s.entity_id}`, s);
      }

      const next: SeoItem[] = [];

      // Blog
      for (const post of blogPosts ?? []) {
        const pageSeo = seoByEntity.get(`blog::${post.id}`) ?? null;
        const { issues, score } = evaluateBlogPost({ post, pageSeo });
        next.push({
          id: post.id,
          type: 'blog',
          title: post.titulo || post.slug || `Post #${post.id}`,
          editUrl: `/admin/blog/save/${post.id}`,
          score,
          issues,
        });
      }

      // Portfolio (carrega fotos por work)
      const works = await Promise.all(
        (portfolioWorks ?? []).map(async (w: any) => {
          try {
            const full = await adminFetch<any>(`/api/admin/portfolio/${w.id}`);
            return full ?? w;
          } catch {
            return w;
          }
        }),
      );
      for (const work of works) {
        const pageSeo = seoByEntity.get(`portfolio::${work.id}`) ?? null;
        const { issues, score } = evaluatePortfolioWork({
          work,
          fotos: work.fotos ?? [],
          pageSeo,
        });
        next.push({
          id: work.id,
          type: 'portfolio',
          title: work.titulo || work.slug || `Work #${work.id}`,
          editUrl: `/admin/portfolio/save/${work.id}`,
          score,
          issues,
        });
      }

      // Landing Pages (carrega blocks por LP)
      const lps = await Promise.all(
        (landingPages ?? []).map(async (lp: any) => {
          try {
            const full = await adminFetch<any>(`/api/admin/landing-pages/${lp.id}`);
            return full ?? lp;
          } catch {
            return lp;
          }
        }),
      );
      for (const lp of lps) {
        const pageSeo = seoByEntity.get(`lp::${lp.id}`) ?? null;
        const blocks = (lp.blocks ?? []).map((b: any) => ({
          tipo: b.tipo,
          ordem: b.ordem,
          dados: typeof b.dados === 'string' ? safeJson(b.dados) : b.dados,
        }));
        const { issues, score } = evaluateLandingPage({ lp, blocks, pageSeo });
        next.push({
          id: lp.id,
          type: 'lp',
          title: lp.titulo || lp.slug || `LP #${lp.id}`,
          editUrl: `/admin/landing-pages/save/${lp.id}`,
          score,
          issues,
        });
      }

      // Estáticas (todas com entity_type='static')
      // Exclui páginas de categoria gerenciadas pelo bloco abaixo para evitar duplicatas
      const categoryRoutePatterns = [/^\/blog\/[^\/]+$/, /^\/ensaio-fotografico\/[^\/]+$/];
      const isCategoryRoute = (route: string) => categoryRoutePatterns.some((p) => p.test(route));

      for (const s of seoEntries ?? []) {
        if (s.entity_type !== 'static') continue;
        if (isCategoryRoute(s.route)) continue; // tratadas abaixo com contexto da categoria
        const { issues, score } = evaluateStaticPage({ pageSeo: s });
        next.push({
          id: s.route,
          type: 'static',
          title: s.meta_title || s.route,
          editUrl: `/admin/seo/static-pages/save/${s.id}`,
          score,
          issues,
        });
      }

      // Páginas de categoria de blog
      const [blogCats, portfolioCats] = await Promise.all([
        adminFetch<any[]>('/api/admin/blog/categorias'),
        adminFetch<any[]>('/api/admin/portfolio/categorias'),
      ]);

      for (const cat of blogCats ?? []) {
        const route = `/blog/${cat.slug}`;
        const pageSeo = seoByEntity.get(`static::${route}`) ?? null;
        const { issues, score } = evaluateStaticPage({ pageSeo: pageSeo ?? emptyPageSeo(route) });
        next.push({
          id: pageSeo ? pageSeo.id : `cat-blog-${cat.slug}`,
          type: 'static',
          title: pageSeo?.meta_title || `${cat.titulo} | BLOG`,
          editUrl: pageSeo ? `/admin/seo/static-pages/save/${pageSeo.id}` : `/admin/seo/static-pages/save?route=${encodeURIComponent(route)}`,
          score,
          issues,
        });
      }

      // Páginas de categoria de portfolio/ensaio-fotografico
      for (const cat of portfolioCats ?? []) {
        const route = `/ensaio-fotografico/${cat.slug}`;
        const pageSeo = seoByEntity.get(`static::${route}`) ?? null;
        const { issues, score } = evaluateStaticPage({ pageSeo: pageSeo ?? emptyPageSeo(route) });
        next.push({
          id: pageSeo ? pageSeo.id : `cat-portfolio-${cat.slug}`,
          type: 'static',
          title: pageSeo?.meta_title || `${cat.titulo} | Ensaios fotográficos profissionais`,
          editUrl: pageSeo ? `/admin/seo/static-pages/save/${pageSeo.id}` : `/admin/seo/static-pages/save?route=${encodeURIComponent(route)}`,
          score,
          issues,
        });
      }

      items.value = next.sort((a, b) => a.score - b.score);
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, summary, evaluate };
}

function safeJson(s: string) { try { return JSON.parse(s); } catch { return {}; } }

/** Objeto sentinela para páginas sem registro page_seo — gera score 0. */
function emptyPageSeo(route: string) {
  return {
    route,
    meta_title: null,
    meta_description: null,
    og_image_cf_id: null,
    canonical: null,
    keywords: null,
    focus_keyword: null,
  };
}
