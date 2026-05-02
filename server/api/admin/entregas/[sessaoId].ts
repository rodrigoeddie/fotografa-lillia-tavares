import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListEntregasBySessao, dbGetEntregaById, dbUpdateEntrega, dbDeleteEntrega } from '~/server/utils/d1-client';
import { purgeCache } from '~/server/utils/purge-cache';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'sessaoId'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'sessaoId inválido' });

  // GET: lista todas as entregas de uma sessão
  if (getMethod(event) === 'GET') {
    const { results } = await dbListEntregasBySessao(db, sessaoId);
    return results;
  }

  // PUT: atualiza uma entrega específica (id no body)
  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};
    if (!id) throw createError({ statusCode: 400, statusMessage: 'id da entrega é obrigatório' });

    const entrega = await dbGetEntregaById(db, Number(id));
    if (!entrega || entrega.sessao_id !== sessaoId)
      throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });

    await dbUpdateEntrega(db, Number(id), r2_key ?? null, nome_arquivo ?? null, bg_image_id ?? null, mensagem ?? null, ativo !== false);
    await purgeCache(event, [`/api/cliente/entregas/${sessaoId}`]);
    return { success: true };
  }

  // DELETE: remove uma entrega específica (id no body)
  if (getMethod(event) === 'DELETE') {
    const body = await readBody(event);
    const entregaId = body?.id ? Number(body.id) : null;

    if (entregaId) {
      const entrega = await dbGetEntregaById(db, entregaId);
      if (!entrega || entrega.sessao_id !== sessaoId)
        throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });
      await dbDeleteEntrega(db, entregaId);
    } else {
      // Retrocompat: sem id deleta todas as entregas da sessão
      const { results } = await dbListEntregasBySessao(db, sessaoId);
      for (const e of results) await dbDeleteEntrega(db, e.id);
    }

    await purgeCache(event, [`/api/cliente/entregas/${sessaoId}`]);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});

