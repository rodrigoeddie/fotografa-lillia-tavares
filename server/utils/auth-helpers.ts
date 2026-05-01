import { createError, getCookie, getHeader, type H3Event } from 'h3';
import { verifyClientToken } from './client-jwt';
import { verifyAdminToken } from './admin-jwt';

/**
 * Valida o token JWT admin (header x-cms-token).
 * O token é um JWT HS256 assinado com CLIENT_JWT_SECRET, expira em 8h.
 */
export async function validateAdminToken(event: H3Event): Promise<void> {
  const token  = getHeader(event, 'x-cms-token');
  const secret = process.env.CLIENT_JWT_SECRET;

  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });
  }
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Não autorizado' });
  }

  const username = await verifyAdminToken(token, secret);
  if (!username) {
    throw createError({ statusCode: 401, statusMessage: 'Sessão inválida ou expirada' });
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
