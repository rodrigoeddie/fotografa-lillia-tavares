import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB, dbGetSessaoById, dbListLotesBySessao, dbCreateLote, dbUpdateLoteStatus,
  dbMarkFotosEntregues, dbUpdateSessaoStatus,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'id'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const sessao = await dbGetSessaoById(db, sessaoId);
  if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

  // GET: lista todos os lotes da sessão
  if (getMethod(event) === 'GET') {
    const { results } = await dbListLotesBySessao(db, sessaoId);
    return results;
  }

  // POST: cria novo lote de seleção (nova leva)
  if (getMethod(event) === 'POST') {
    const result = await dbCreateLote(db, sessaoId);
    // Volta o status da sessão para aguardando_selecao
    await dbUpdateSessaoStatus(db, sessaoId, 'aguardando_selecao');
    return { success: true, id: result.meta.last_row_id };
  }

  // PUT: atualiza status de um lote (?lote_id=X no body)
  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { lote_id, status } = body ?? {};
    if (!lote_id || !status) throw createError({ statusCode: 400, statusMessage: 'lote_id e status são obrigatórios' });

    const allowed = ['aguardando_selecao', 'selecao_concluida', 'entregue'];
    if (!allowed.includes(status)) throw createError({ statusCode: 400, statusMessage: 'Status inválido' });

    await dbUpdateLoteStatus(db, Number(lote_id), status);

    // Ao marcar como entregue: bloqueia as fotos selecionadas para levas futuras
    if (status === 'entregue') {
      await dbMarkFotosEntregues(db, Number(lote_id));
      await dbUpdateSessaoStatus(db, sessaoId, 'entregue');
    }

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
