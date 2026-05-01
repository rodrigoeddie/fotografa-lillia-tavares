import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbGetSessaoById, dbUpdateSessao, dbDeleteSessao, type Sessao } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const sessao = await dbGetSessaoById(db, id);
    if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });
    return sessao;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { nome_sessao, produto_tipo, pacote_index, fotos_incluidas, preco_foto_extra, status } = body ?? {};

    if (!nome_sessao || !produto_tipo || !status) {
      throw createError({ statusCode: 400, statusMessage: 'nome_sessao, produto_tipo e status são obrigatórios' });
    }

    const sessao = await dbGetSessaoById(db, id);
    if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

    await dbUpdateSessao(
      db,
      id,
      nome_sessao,
      produto_tipo,
      Number(pacote_index ?? 0),
      Number(fotos_incluidas ?? 0),
      Number(preco_foto_extra ?? 0),
      status as Sessao['status'],
    );

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const sessao = await dbGetSessaoById(db, id);
    if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });
    await dbDeleteSessao(db, id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
