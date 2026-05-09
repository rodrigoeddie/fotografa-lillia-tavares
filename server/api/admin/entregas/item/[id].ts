import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { EntregaService } from '~/server/services/EntregaService';
import { purgeCache } from '~/server/utils/purge-cache';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new EntregaService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const entrega = await svc.getById(id);
    if (!entrega) throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });
    return entrega;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};

    const entrega = await svc.getById(id);
    if (!entrega) throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });

    await svc.update(id, r2_key ?? null, nome_arquivo ?? null, bg_image_id ?? null, mensagem ?? null, ativo !== false);
    await purgeCache(event, [`/api/cliente/entregas/${entrega.sessao_id}`]);
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const entrega = await svc.getById(id);
    if (!entrega) throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });
    await svc.delete(id);
    await purgeCache(event, [`/api/cliente/entregas/${entrega.sessao_id}`]);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
