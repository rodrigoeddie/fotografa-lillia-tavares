import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { sendPushNotifications } from '~/server/utils/send-push';
import { NotificacaoService } from '~/server/services/NotificacaoService';
import { ClienteService } from '~/server/services/ClienteService';
import { SessaoService } from '~/server/services/SessaoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const orm = getOrm(event);
  const svc = new SessaoService(orm);

  if (getMethod(event) === 'GET') {
    return svc.listAll();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { cliente_id, nome_sessao, produto_tipo, pacote_index, fotos_incluidas, preco_foto_extra } = body ?? {};

    if (!cliente_id || !nome_sessao || !produto_tipo) {
      throw createError({ statusCode: 400, statusMessage: 'cliente_id, nome_sessao e produto_tipo são obrigatórios' });
    }

    const cliente = await new ClienteService(orm).getById(Number(cliente_id));
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });

    const result = await svc.create(
      Number(cliente_id),
      nome_sessao,
      produto_tipo,
      Number(pacote_index ?? 0),
      Number(fotos_incluidas ?? 0),
      Number(preco_foto_extra ?? 0),
    );

    // Notifica o cliente que a sessão foi criada
    const notif = new NotificacaoService(orm);
    await notif.create(
      'cliente', Number(cliente_id),
      `Sessão criada: ${nome_sessao}`,
      'Sua sessão foi criada! Em breve as fotos estarão disponíveis para seleção.',
    );
    await sendPushNotifications(
      event, orm, 'cliente', Number(cliente_id),
      `Sessão criada: ${nome_sessao}`,
      'Sua sessão foi criada! Em breve as fotos estarão disponíveis para seleção.',
    );

    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
