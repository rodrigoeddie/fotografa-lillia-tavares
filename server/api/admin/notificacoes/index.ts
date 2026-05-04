import { defineEventHandler, getMethod, readBody } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbListNotificacoes,
  dbCountUnreadNotificacoes,
  dbMarkNotificacoesLidas,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const [{ results }, unread] = await Promise.all([
      dbListNotificacoes(db, 'admin', null),
      dbCountUnreadNotificacoes(db, 'admin', null),
    ]);
    return { notificacoes: results, unread: unread?.count ?? 0 };
  }

  if (getMethod(event) === 'POST') {
    // Mark all as read
    await dbMarkNotificacoesLidas(db, 'admin', null);
    return { success: true };
  }
});
