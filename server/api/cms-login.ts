import { defineEventHandler, readBody, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { AdminUserService } from '~/server/services/AdminUserService';
import { verifyPassword } from '~/server/utils/password';
import { signAdminToken } from '~/server/utils/admin-jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body ?? {};

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email e senha obrigatórios' });
  }

  const secret = process.env.CLIENT_JWT_SECRET;
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });
  }

  // Resposta genérica para não revelar informações
  const invalid = () => createError({ statusCode: 401, statusMessage: 'Email ou senha incorretos' });

  const admin = await new AdminUserService(getOrm(event)).getByEmail(email);

  if (!admin) throw invalid();

  const ok = await verifyPassword(password, admin.password_hash, admin.salt);
  if (!ok) throw invalid();

  const token = await signAdminToken(admin.username, admin.role ?? 'super_admin', secret);
  return { success: true, token };
});
