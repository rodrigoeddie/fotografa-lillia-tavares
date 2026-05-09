import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { EntregaService } from '~/server/services/EntregaService';
import { purgeCache } from '~/server/utils/purge-cache';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new EntregaService(getOrm(event));
  const sessaoId = Number(getRouterParam(event, 'sessaoId'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'sessaoId inválido' });

  // GET: lista todas as entregas de uma sessão
  if (getMethod(event) === 'GET') {
    return svc.listBySessao(sessaoId);
  }

  // PUT: atualiza uma entrega específica (id no body)
  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};
    if (!id) throw createError({ statusCode: 400, statusMessage: 'id da entrega é obrigatório' });

    const entrega = await svc.getById(Number(id));
    if (!entrega || entrega.sessao_id !== sessaoId)
      throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });

    await svc.update(Number(id), r2_key ?? null, nome_arquivo ?? null, bg_image_id ?? null, mensagem ?? null, ativo !== false);
    await purgeCache(event, [`/api/cliente/entregas/${sessaoId}`]);
    return { success: true };
  }

  // DELETE: remove uma entrega específica (id no body)
  if (getMethod(event) === 'DELETE') {
    const body = await readBody(event);
    const entregaId = body?.id ? Number(body.id) : null;

    if (entregaId) {
      const entrega = await svc.getById(entregaId);
      if (!entrega || entrega.sessao_id !== sessaoId)
        throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });
      await svc.delete(entregaId);
    } else {
      // Retrocompat: sem id deleta todas as entregas da sessão
      const lista = await svc.listBySessao(sessaoId);
      for (const e of lista) await svc.delete(e.id);
    }

    await purgeCache(event, [`/api/cliente/entregas/${sessaoId}`]);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
