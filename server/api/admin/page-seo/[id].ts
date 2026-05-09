import { defineEventHandler, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PageSeoService } from '~/server/services/PageSeoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new PageSeoService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const row = await svc.getById(id);
    if (!row) throw createError({ statusCode: 404, statusMessage: 'page_seo não encontrado' });
    return row;
  }

  if (getMethod(event) === 'DELETE') {
    const row = await svc.getById(id);
    if (!row) throw createError({ statusCode: 404, statusMessage: 'page_seo não encontrado' });
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
