import { defineEventHandler, createError, getRouterParam } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';
import { BlogService } from '~/server/services/BlogService';
import { PortfolioService } from '~/server/services/PortfolioService';
import { LandingPageService } from '~/server/services/LandingPageService';
import { entityTypeSchema, type EntityType } from '~/shared/schemas/seo';

/**
 * GET /api/public/page-seo/by/{entity_type}/{slug}
 *
 * Retorna o registro de page_seo associado à entidade identificada por slug.
 * `entity_type` deve ser 'lp' | 'blog' | 'portfolio' (não cobre 'static' — para
 * static use /api/public/page-seo/by-route?route=...).
 */
export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
  const orm = getOrm(event);
  const seoSvc = new PageSeoService(orm);

  const entityTypeRaw = getRouterParam(event, 'entity_type');
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'slug obrigatório' });

  const t = entityTypeSchema.safeParse(entityTypeRaw);
  if (!t.success) throw createError({ statusCode: 400, statusMessage: 'entity_type inválido' });

  const type: EntityType = t.data;
  if (type === 'static') {
    throw createError({ statusCode: 400, statusMessage: 'Use /by-route?route=... para entity_type=static' });
  }

  // Resolve slug → id por entidade
  let entityId: number | null = null;
  if (type === 'blog') {
    const post = await new BlogService(orm).getBySlug(slug);
    entityId = post?.id ?? null;
  } else if (type === 'portfolio') {
    const work = await new PortfolioService(orm).getBySlug(slug);
    entityId = work?.id ?? null;
  } else if (type === 'lp') {
    const lp = await new LandingPageService(orm).getBySlug(slug);
    entityId = lp?.id ?? null;
  }

  if (!entityId) return null;
  return seoSvc.getForEntity(type, entityId) ?? null;
});
