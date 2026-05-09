import { defineEventHandler, getMethod } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { NotificacaoService } from '~/server/services/NotificacaoService';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const svc = new NotificacaoService(getOrm(event));

  if (getMethod(event) === 'GET') {
    const [notificacoes, unread] = await Promise.all([
      svc.list('cliente', clienteId),
      svc.countUnread('cliente', clienteId),
    ]);
    return { notificacoes, unread };
  }

  if (getMethod(event) === 'POST') {
    await svc.markRead('cliente', clienteId);
    return { success: true };
  }
});
