import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LandingPageService } from '~/server/services/LandingPageService';
import { LandingPageInputSchema } from '~/shared/schemas/landing-page';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LandingPageService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const lp = await svc.getById(id);
    if (!lp) throw createError({ statusCode: 404, statusMessage: 'Landing page não encontrada' });
    const blocks = await svc.listBlocks(id);
    return { ...lp, blocks };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const parsed = LandingPageInputSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Validação falhou', data: parsed.error.flatten() });
    }

    const lp = await svc.getById(id);
    if (!lp) throw createError({ statusCode: 404, statusMessage: 'Landing page não encontrada' });

    // Slug único: se mudou, garante que não há conflito
    if (parsed.data.slug !== lp.slug) {
      const conflict = await svc.getBySlug(parsed.data.slug);
      if (conflict) throw createError({ statusCode: 409, statusMessage: 'slug já cadastrado' });
    }

    await svc.update(id, parsed.data);
    return { success: true };
  }

  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if ('ordem' in (body ?? {})) {
      await svc.setOrdem(id, Number(body.ordem));
      return { success: true };
    }
    throw createError({ statusCode: 400, statusMessage: 'Campo inválido para patch' });
  }

  if (getMethod(event) === 'DELETE') {
    const lp = await svc.getById(id);
    if (!lp) throw createError({ statusCode: 404, statusMessage: 'Landing page não encontrada' });
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
