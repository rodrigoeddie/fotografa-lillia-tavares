import { defineEventHandler, readBody, createError, getMethod, getQuery } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageFaqService } from '~/server/services/PageFaqService';

/** GET  /api/admin/page-faq            — lista todas (ou filtra por ?faq_slug=)
 *  POST /api/admin/page-faq            — cria uma associação individual
 *  PUT  /api/admin/page-faq?set=1      — substitui todas as rotas de um slug */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new PageFaqService(getOrm(event));
  const method = getMethod(event);

  if (method === 'GET') {
    const { faq_slug } = getQuery(event);
    if (faq_slug && typeof faq_slug === 'string') return svc.getBySlug(faq_slug);
    return svc.list();
  }

  if (method === 'PUT') {
    // Batch: substitui todas as rotas para um faq_slug
    const { faq_slug, routes } = (await readBody(event)) ?? {};
    if (!faq_slug || !Array.isArray(routes)) throw createError({ statusCode: 400, statusMessage: 'faq_slug e routes[] são obrigatórios' });
    await svc.setForSlug(faq_slug, routes.filter((r: string) => r?.startsWith('/')));
    return { success: true };
  }

  if (method === 'POST') {
    const { route, faq_slug } = (await readBody(event)) ?? {};
    if (!route || !faq_slug) throw createError({ statusCode: 400, statusMessage: 'route e faq_slug são obrigatórios' });
    if (!route.startsWith('/')) throw createError({ statusCode: 400, statusMessage: 'route deve começar com /' });
    const row = await svc.create({ route: route.trim(), faq_slug: faq_slug.trim() });
    return row;
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
