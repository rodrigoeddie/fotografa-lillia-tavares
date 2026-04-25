import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbGetEntregaBySessao, dbUpsertEntrega, dbDeleteEntrega } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);
  const sessaoId = Number(getRouterParam(event, 'sessaoId'));
  if (!sessaoId) throw createError({ statusCode: 400, statusMessage: 'sessaoId inválido' });

  if (getMethod(event) === 'GET') {
    const entrega = await dbGetEntregaBySessao(db, sessaoId);
    if (!entrega) throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });
    return entrega;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};

    await dbUpsertEntrega(
      db,
      sessaoId,
      r2_key ?? null,
      nome_arquivo ?? null,
      bg_image_id ?? null,
      mensagem ?? null,
      ativo !== false,
    );

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const entrega = await dbGetEntregaBySessao(db, sessaoId);
    if (!entrega) throw createError({ statusCode: 404, statusMessage: 'Entrega não encontrada' });
    await dbDeleteEntrega(db, entrega.id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
