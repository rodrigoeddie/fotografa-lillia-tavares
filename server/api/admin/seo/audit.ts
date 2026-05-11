/**
 * POST /api/admin/seo/audit
 *
 * Auditoria técnica de SEO. Para cada registro em `page_seo`:
 *   - canonical_conflicts: URLs canonical que conflitam com outras entidades
 *   - in_sitemap: a URL canonical está no /api/__sitemap__/urls?
 *   - broken_links: links internos no conteúdo apontando para rotas inexistentes (max 50)
 *   - robots_ok: o valor robots permite indexação para rotas indexáveis?
 *
 * Persiste resultado em `page_seo.technical_audit` (JSON) + `last_audited_at`.
 */
import { defineEventHandler } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';
import { BlogService } from '~/server/services/BlogService';
import { PortfolioService } from '~/server/services/PortfolioService';
import { LandingPageService } from '~/server/services/LandingPageService';

interface AuditResult {
  canonical_conflicts: string[];
  in_sitemap: boolean;
  broken_links: string[];
  robots_ok: boolean;
}

const SITE_URL = 'https://fotografalilliatavares.com.br';
const MAX_BROKEN_LINKS_PER_ITEM = 50;
const INTERNAL_HREF_RE = /<a[^>]*\bhref=["'](\/[^"'#?]*)["'][^>]*>/gi;

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const orm = getOrm(event);
  const seoSvc = new PageSeoService(orm);

  // 1. Carrega todos os registros page_seo
  const allSeo = await seoSvc.list();

  // 2. Carrega rotas conhecidas (para detecção de links internos válidos)
  const knownRoutes = await collectKnownRoutes(orm);

  // 3. Agrupa por canonical para detectar conflitos
  const canonicalGroups = new Map<string, number[]>();
  for (const s of allSeo) {
    if (!s.canonical) continue;
    const arr = canonicalGroups.get(s.canonical) ?? [];
    arr.push(s.id);
    canonicalGroups.set(s.canonical, arr);
  }

  // 4. Carrega conteúdo de blog/portfolio para extrair links internos
  const blogPosts = await new BlogService(orm).list();
  const portfolioWorks = await new PortfolioService(orm).list();

  const contentByEntity = new Map<string, string>();
  for (const p of blogPosts) {
    contentByEntity.set(`blog::${p.id}`, p.conteudo ?? '');
  }
  for (const w of portfolioWorks) {
    const parts = [w.local ?? '', w.descricao ?? '', w.depoimento_texto ?? ''];
    contentByEntity.set(`portfolio::${w.id}`, parts.join(' '));
  }

  let totalAudited = 0;
  let totalIssues = 0;
  const summaryByType: Record<string, number> = {};

  for (const s of allSeo) {
    const result: AuditResult = {
      canonical_conflicts: [],
      in_sitemap: false,
      broken_links: [],
      robots_ok: true,
    };

    // 3a. Canonical conflicts
    if (s.canonical) {
      const sharing = canonicalGroups.get(s.canonical) ?? [];
      if (sharing.length > 1) {
        result.canonical_conflicts = sharing.filter((id) => id !== s.id).map(String);
      }
    }

    // 3b. Sitemap presence
    if (s.canonical) {
      result.in_sitemap = knownRoutes.has(s.canonical.replace(SITE_URL, '').replace(/\/$/, '') || '/');
    } else if (s.entity_type === 'static' && s.route) {
      result.in_sitemap = knownRoutes.has(s.route);
    }

    // 3c. Broken internal links (apenas para blog/portfolio com conteúdo)
    if (s.entity_type === 'blog' || s.entity_type === 'portfolio') {
      const content = contentByEntity.get(`${s.entity_type}::${s.entity_id}`) ?? '';
      const links = extractInternalLinks(content, MAX_BROKEN_LINKS_PER_ITEM);
      for (const link of links) {
        const cleaned = link.replace(/\/$/, '') || '/';
        if (!knownRoutes.has(cleaned) && !isLikelyDynamicRoute(cleaned, knownRoutes)) {
          result.broken_links.push(link);
        }
      }
    }

    // 3d. Robots
    if (s.robots) {
      const noindex = /noindex/i.test(s.robots);
      // Páginas estáticas indexáveis não deveriam ter noindex
      if (noindex && s.entity_type !== 'static') {
        result.robots_ok = false;
      }
    }

    const hasIssues =
      result.canonical_conflicts.length > 0 ||
      !result.in_sitemap ||
      result.broken_links.length > 0 ||
      !result.robots_ok;

    if (hasIssues) {
      totalIssues++;
      summaryByType[s.entity_type] = (summaryByType[s.entity_type] ?? 0) + 1;
    }

    await seoSvc.saveTechnicalAudit(s.id, JSON.stringify(result));
    totalAudited++;
  }

  return {
    success: true,
    audited: totalAudited,
    issues: totalIssues,
    summary: summaryByType,
  };
});

/** Coleta rotas conhecidas (estáticas + LPs ativas + blog + portfolio). */
async function collectKnownRoutes(orm: ReturnType<typeof getOrm>): Promise<Set<string>> {
  const routes = new Set<string>([
    '/',
    '/sobre-fotografa-lillia-tavares',
    '/depoimentos',
    '/perguntas-frequentes',
    '/agende-seu-ensaio',
    '/analise-coloracao-pessoal-em-mogi',
    '/privacidade-e-termos',
    '/blog',
    '/ensaio-fotografico',
    '/estudio',
    '/precos-ensaios-fotograficos',
    '/presente-ensaio-fotografico-mogi',
  ]);

  try {
    const lps = await new LandingPageService(orm).list();
    for (const lp of lps) if (lp.ativo === 1) routes.add(lp.rota);
  } catch { /* silent */ }

  try {
    const posts = await new BlogService(orm).list(true);
    const blogCats = new Set<string>();
    for (const p of posts) {
      routes.add(`/blog/${p.categoria}/${p.slug}`);
      blogCats.add(p.categoria);
    }
    for (const c of blogCats) routes.add(`/blog/${c}`);
  } catch { /* silent */ }

  try {
    const works = await new PortfolioService(orm).list(true);
    const portCats = new Set<string>();
    for (const w of works) {
      routes.add(`/ensaio-fotografico/${w.slug}`);
      portCats.add(w.categoria);
    }
    for (const c of portCats) routes.add(`/ensaio-fotografico/${c}`);
  } catch { /* silent */ }

  return routes;
}

function extractInternalLinks(html: string, max: number): string[] {
  if (!html) return [];
  const found: string[] = [];
  for (const match of html.matchAll(INTERNAL_HREF_RE)) {
    const href = match[1];
    if (href && !found.includes(href)) {
      found.push(href);
      if (found.length >= max) break;
    }
  }
  return found;
}

/**
 * Para rotas como `/blog/categoria/slug-do-post`, considera válida se a categoria
 * existe nas rotas conhecidas (mesmo que o slug específico não). Reduz falsos
 * positivos para conteúdo recente que ainda não foi indexado no sitemap.
 */
function isLikelyDynamicRoute(route: string, knownRoutes: Set<string>): boolean {
  const segments = route.split('/').filter(Boolean);
  if (segments.length < 2) return false;
  const parent = '/' + segments.slice(0, -1).join('/');
  return knownRoutes.has(parent);
}
