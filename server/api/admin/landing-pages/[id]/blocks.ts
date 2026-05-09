import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LandingPageService } from '~/server/services/LandingPageService';
import { BlocksReplaceSchema } from '~/shared/schemas/landing-page';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LandingPageService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const lp = await svc.getById(id);
  if (!lp) throw createError({ statusCode: 404, statusMessage: 'Landing page não encontrada' });

  if (getMethod(event) === 'GET') {
    return svc.listBlocks(id);
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const parsed = BlocksReplaceSchema.safeParse(body?.blocks ?? body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Validação falhou', data: parsed.error.flatten() });
    }
    await svc.replaceBlocks(id, parsed.data);
    return { success: true, count: parsed.data.length };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
