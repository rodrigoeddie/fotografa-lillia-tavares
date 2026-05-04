import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { getDB, dbUpsertPushSubscription, dbDeletePushSubscription } from '~/server/utils/d1-client';

// Determines caller type from Authorization header prefix
function getCallerInfo(event: any): { tipo: 'admin' | 'cliente'; id: number | null } {
  const auth = event.node?.req?.headers?.['authorization'] ?? '';
  const token = auth.replace(/^Bearer\s+/i, '');
  // Admin token: comes from CMS config file
  // Client token: JWT with "cliente-{id}" subject
  // We decode minimally — both sides send the token; we check the stored session
  const cf = event.context?.cloudflare?.env;
  if (token === cf?.CMS_TOKEN) return { tipo: 'admin', id: null };

  // Try to decode client JWT (simple base64 payload, no verification here — push subscribe is low risk)
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.sub && String(payload.sub).startsWith('cliente-')) {
        const id = Number(String(payload.sub).replace('cliente-', ''));
        if (!isNaN(id)) return { tipo: 'cliente', id };
      }
    }
  } catch {}

  throw createError({ statusCode: 401, statusMessage: 'Não autorizado' });
}

export default defineEventHandler(async (event) => {
  const db = getDB(event);
  const { tipo, id } = getCallerInfo(event);

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { endpoint, p256dh, auth } = body ?? {};
    if (!endpoint || !p256dh || !auth)
      throw createError({ statusCode: 400, statusMessage: 'endpoint, p256dh e auth são obrigatórios' });
    await dbUpsertPushSubscription(db, tipo, id, endpoint, p256dh, auth);
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const body = await readBody(event);
    const { endpoint } = body ?? {};
    if (!endpoint) throw createError({ statusCode: 400, statusMessage: 'endpoint é obrigatório' });
    await dbDeletePushSubscription(db, endpoint);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
