import { defineEventHandler, getMethod, readBody } from 'h3';
import { getAuthenticatedCliente } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbListNotificacoes,
  dbCountUnreadNotificacoes,
  dbMarkNotificacoesLidas,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  const clienteId = await getAuthenticatedCliente(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const [{ results }, unread] = await Promise.all([
      dbListNotificacoes(db, 'cliente', clienteId),
      dbCountUnreadNotificacoes(db, 'cliente', clienteId),
    ]);
    return { notificacoes: results, unread: unread?.count ?? 0 };
  }

  if (getMethod(event) === 'POST') {
    // Mark all as read
    await dbMarkNotificacoesLidas(db, 'cliente', clienteId);
    return { success: true };
  }
});
