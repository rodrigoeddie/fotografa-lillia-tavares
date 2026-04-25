import { createError, getCookie, getHeader, type H3Event } from 'h3';
import { verifyClientToken } from './client-jwt';

/**
 * Valida o token CMS do admin (header x-cms-token).
 * O token é os primeiros 64 chars do hash SHA-512 da senha.
 */
export function validateAdminToken(event: H3Event): void {
  const token = getHeader(event, 'x-cms-token');
  const expected = process.env.KEYCMS?.slice(0, 64);
  if (!expected || !token || token !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Não autorizado' });
  }
}

/**
 * Valida o cookie de sessão do cliente e retorna o clienteId.
 */
export async function getAuthenticatedCliente(event: H3Event): Promise<number> {
  const token = getCookie(event, 'cliente_session');
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' });
  }
  const secret = process.env.CLIENT_JWT_SECRET;
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });
  }
  const clienteId = await verifyClientToken(token, secret);
  if (!clienteId) {
    throw createError({ statusCode: 401, statusMessage: 'Sessão inválida ou expirada' });
  }
  return clienteId;
}
