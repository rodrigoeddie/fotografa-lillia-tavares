import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListEntregas, dbCreateEntrega, dbGetSessaoById, dbGetLoteById, dbUpdateLoteStatus, dbMarkFotosEntregues, dbUpdateSessaoStatus, dbCreateNotificacao } from '~/server/utils/d1-client';
import { sendPushNotifications } from '~/server/utils/send-push';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListEntregas(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { sessao_id, lote_id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};

    if (!sessao_id) throw createError({ statusCode: 400, statusMessage: 'sessao_id é obrigatório' });

    const sessao = await dbGetSessaoById(db, Number(sessao_id));
    if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

    const loteIdNum = lote_id ? Number(lote_id) : null;

    // Valida lote se informado
    if (loteIdNum) {
      const lote = await dbGetLoteById(db, loteIdNum);
      if (!lote || lote.sessao_id !== Number(sessao_id))
        throw createError({ statusCode: 400, statusMessage: 'Lote não pertence à sessão' });
    }

    const result = await dbCreateEntrega(
      db, Number(sessao_id), loteIdNum,
      r2_key ?? null, nome_arquivo ?? null, bg_image_id ?? null, mensagem ?? null, ativo !== false,
    );

    // Ao criar entrega: sempre marca sessão como entregue
    await dbUpdateSessaoStatus(db, Number(sessao_id), 'entregue');

    // Se há lote associado: marca o lote e bloqueia fotos do lote
    if (loteIdNum) {
      await dbUpdateLoteStatus(db, loteIdNum, 'entregue');
      await dbMarkFotosEntregues(db, loteIdNum);
    }

    // Notifica o cliente que o ensaio foi entregue
    await dbCreateNotificacao(
      db, 'cliente', Number(sessao.cliente_id),
      'Seu ensaio está pronto! 🎉',
      `O ensaio "${sessao.nome_sessao}" foi entregue. Acesse a área do cliente para baixar.`,
    );
    await sendPushNotifications(
      event, db, 'cliente', Number(sessao.cliente_id),
      'Seu ensaio está pronto! 🎉',
      `O ensaio “${sessao.nome_sessao}” foi entregue. Acesse a área do cliente para baixar.`,
    );

    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
