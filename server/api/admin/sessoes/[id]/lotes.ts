import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SessaoService } from '~/server/services/SessaoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new SessaoService(getOrm(event));
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await svc.getById(sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  // GET: lista todos os lotes da sessão
  if (getMethod(event) === 'GET') {
    return svc.listLotes(sessaoId);
  }

  // POST: cria novo lote de seleção (nova leva)
  if (getMethod(event) === 'POST') {
    const result = await svc.createLote(sessaoId);
    await svc.updateStatus(sessaoId, 'aguardando_selecao');
    return { success: true, id: result.meta.last_row_id };
  }

  // PUT: atualiza status de um lote (lote_id no body)
  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { lote_id, status } = body ?? {};
    if (!lote_id || !status) throw createError({ statusCode: 400, statusMessage: 'lote_id e status são obrigatórios' });

    const allowed = ['aguardando_selecao', 'selecao_concluida', 'entregue'] as const;
    if (!allowed.includes(status)) throw createError({ statusCode: 400, statusMessage: 'Status inválido' });

    await svc.updateLoteStatus(Number(lote_id), status);

    if (status === 'entregue') {
      await svc.markFotosEntregues(Number(lote_id));
      await svc.updateStatus(sessaoId, 'entregue');
    }

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
