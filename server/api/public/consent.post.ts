import { defineEventHandler, readBody, createError, getHeader } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { consentimentos } from '~/server/db/schema';
import { rateLimit } from '~/server/utils/rate-limit';

/**
 * Registra a escolha de consentimento de cookies no D1 (trilha de auditoria LGPD).
 * Endpoint público — recebe apenas flags booleanas e um UUID anônimo do navegador.
 */
export default defineEventHandler(async (event) => {
  event.node.res.setHeader('Cache-Control', 'no-store');

  await rateLimit(event, 'consent', { limit: 20, windowSec: 600 });

  const body = await readBody(event);
  const visitorId = typeof body?.visitor_id === 'string' ? body.visitor_id.slice(0, 64) : '';
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(visitorId)) {
    throw createError({ statusCode: 400, statusMessage: 'visitor_id inválido' });
  }

  await getOrm(event).insert(consentimentos).values({
    visitor_id: visitorId,
    analytics: body?.analytics ? 1 : 0,
    marketing: body?.marketing ? 1 : 0,
    recording: body?.recording ? 1 : 0,
    user_agent: (getHeader(event, 'user-agent') ?? '').slice(0, 255) || null,
  });

  return { success: true };
});
