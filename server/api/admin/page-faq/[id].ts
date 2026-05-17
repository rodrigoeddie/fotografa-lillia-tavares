import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageFaqService } from '~/server/services/PageFaqService';

/** PUT /api/admin/page-faq/:id — atualiza
 *  DELETE /api/admin/page-faq/:id — remove */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const id = Number(event.context.params?.id);
  if (!id || isNaN(id)) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const svc = new PageFaqService(getOrm(event));

  if (getMethod(event) === 'PUT') {
    const { route, faq_slug } = (await readBody(event)) ?? {};
    if (!route || !faq_slug) throw createError({ statusCode: 400, statusMessage: 'route e faq_slug são obrigatórios' });
    if (!route.startsWith('/')) throw createError({ statusCode: 400, statusMessage: 'route deve começar com /' });
    const row = await svc.update(id, { route: route.trim(), faq_slug: faq_slug.trim() });
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Não encontrado' });
    return row;
  }

  if (getMethod(event) === 'DELETE') {
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
