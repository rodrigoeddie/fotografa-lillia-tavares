import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListEntregas, dbUpsertEntrega, dbGetSessaoById } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListEntregas(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { sessao_id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};

    if (!sessao_id) throw createError({ statusCode: 400, statusMessage: 'sessao_id é obrigatório' });

    const sessao = await dbGetSessaoById(db, Number(sessao_id));
    if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

    await dbUpsertEntrega(
      db,
      Number(sessao_id),
      r2_key ?? null,
      nome_arquivo ?? null,
      bg_image_id ?? null,
      mensagem ?? null,
      ativo !== false,
    );

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
