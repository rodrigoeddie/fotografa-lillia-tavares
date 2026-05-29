import { createError, getCookie, getHeader, type H3Event } from 'h3';
import { verifyClientToken } from './client-jwt';
import { verifyAdminToken } from './admin-jwt';

async function resolveAdminPayload(event: H3Event) {
  const token  = getHeader(event, 'x-cms-token');
  const secret = process.env.CLIENT_JWT_SECRET;

  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });
  if (!token)  throw createError({ statusCode: 401, statusMessage: 'Não autorizado' });

  const payload = await verifyAdminToken(token, secret);
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'Sessão inválida ou expirada' });

  return payload;
}

/**
 * Valida o token JWT admin (header x-cms-token).
 */
export async function validateAdminToken(event: H3Event): Promise<void> {
  await resolveAdminPayload(event);
}

/**
 * Retorna { username, adminRole } do token admin. Lança 401 se inválido.
 */
export async function getAdminPayload(event: H3Event): Promise<{ username: string; adminRole: string }> {
  return resolveAdminPayload(event);
}

/**
 * Valida token e exige role super_admin. Lança 403 para outros roles.
 */
export async function validateSuperAdmin(event: H3Event): Promise<void> {
  const { adminRole } = await resolveAdminPayload(event);
  if (adminRole !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito a super administradores' });
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
