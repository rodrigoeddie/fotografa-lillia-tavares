import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { sendPushNotifications } from '~/server/utils/send-push';
import { NotificacaoService } from '~/server/services/NotificacaoService';
import { SessaoService } from '~/server/services/SessaoService';
import { EntregaService } from '~/server/services/EntregaService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const orm        = getOrm(event);
  const entregaSvc = new EntregaService(orm);
  const sessaoSvc  = new SessaoService(orm);

  if (getMethod(event) === 'GET') {
    return entregaSvc.listAll();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { sessao_id, lote_id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo } = body ?? {};

    if (!sessao_id) throw createError({ statusCode: 400, statusMessage: 'sessao_id é obrigatório' });

    const sessao = await sessaoSvc.getById(Number(sessao_id));
    if (!sessao) throw createError({ statusCode: 404, statusMessage: 'Sessão não encontrada' });

    const loteIdNum = lote_id ? Number(lote_id) : null;

    if (loteIdNum) {
      const lote = await sessaoSvc.getLoteById(loteIdNum);
      if (!lote || lote.sessao_id !== Number(sessao_id))
        throw createError({ statusCode: 400, statusMessage: 'Lote não pertence à sessão' });
    }

    const result = await entregaSvc.create(
      Number(sessao_id),
      loteIdNum,
      r2_key ?? null,
      nome_arquivo ?? null,
      bg_image_id ?? null,
      mensagem ?? null,
      ativo !== false,
    );

    // Ao criar entrega: sempre marca sessão como entregue
    await sessaoSvc.updateStatus(Number(sessao_id), 'entregue');

    // Se há lote associado: marca o lote e bloqueia fotos do lote
    if (loteIdNum) {
      await sessaoSvc.updateLoteStatus(loteIdNum, 'entregue');
      await sessaoSvc.markFotosEntregues(loteIdNum);
    }

    // Notifica o cliente que o ensaio foi entregue
    await new NotificacaoService(orm).create(
      'cliente', Number(sessao.cliente_id),
      'Seu ensaio está pronto! 🎉',
      `O ensaio "${sessao.nome_sessao}" foi entregue. Acesse a área do cliente para baixar.`,
    );
    await sendPushNotifications(
      event, orm, 'cliente', Number(sessao.cliente_id),
      'Seu ensaio está pronto! 🎉',
      `O ensaio “${sessao.nome_sessao}” foi entregue. Acesse a área do cliente para baixar.`,
    );

    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
