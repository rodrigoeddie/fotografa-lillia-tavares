import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListSessoes, dbCreateSessao, dbGetClienteById } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListSessoes(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { cliente_id, nome_sessao, produto_tipo, pacote_index, fotos_incluidas, preco_foto_extra } = body ?? {};

    if (!cliente_id || !nome_sessao || !produto_tipo) {
      throw createError({ statusCode: 400, statusMessage: 'cliente_id, nome_sessao e produto_tipo são obrigatórios' });
    }

    const cliente = await dbGetClienteById(db, Number(cliente_id));
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });

    const result = await dbCreateSessao(
      db,
      Number(cliente_id),
      nome_sessao,
      produto_tipo,
      Number(pacote_index ?? 0),
      Number(fotos_incluidas ?? 0),
      Number(preco_foto_extra ?? 0),
    );

    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
