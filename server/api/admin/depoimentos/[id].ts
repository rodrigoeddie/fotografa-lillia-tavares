import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { DepoimentoService } from '~/server/services/DepoimentoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new DepoimentoService(getOrm(event));
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const dep = await svc.getById(id);
    if (!dep) throw createError({ statusCode: 404, statusMessage: 'Depoimento não encontrado' });
    return dep;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { nome, foto_cf_id, rating, data, texto, link, featured, portfolio_link, ordem } = body ?? {};
    if (!nome || !texto) throw createError({ statusCode: 400, statusMessage: 'nome e texto são obrigatórios' });

    const dep = await svc.getById(id);
    if (!dep) throw createError({ statusCode: 404, statusMessage: 'Depoimento não encontrado' });

    await svc.update(id, {
      nome,
      foto_cf_id: foto_cf_id ?? null,
      rating: rating ?? 5,
      data: data ?? null,
      texto,
      link: link ?? null,
      featured: featured ? 1 : 0,
      portfolio_link: portfolio_link ?? null,
      ordem: ordem ?? dep.ordem,
    });
    return { success: true };
  }

  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if ('featured' in (body ?? {})) {
      await svc.setFeatured(id, Boolean(body.featured));
      return { success: true };
    }
    throw createError({ statusCode: 400, statusMessage: 'Campo inválido para patch' });
  }

  if (getMethod(event) === 'DELETE') {
    const dep = await svc.getById(id);
    if (!dep) throw createError({ statusCode: 404, statusMessage: 'Depoimento não encontrado' });
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
