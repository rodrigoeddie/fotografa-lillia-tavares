import { defineEventHandler, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { NotificacaoService } from '~/server/services/NotificacaoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new NotificacaoService(getOrm(event));

  if (getMethod(event) === 'GET') {
    const [notificacoes, unread] = await Promise.all([
      svc.list('admin', null),
      svc.countUnread('admin', null),
    ]);
    return { notificacoes, unread };
  }

  if (getMethod(event) === 'POST') {
    await svc.markRead('admin', null);
    return { success: true };
  }
});
