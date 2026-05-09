import { defineEventHandler, readBody, createError } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { AdminUserService } from '~/server/services/AdminUserService';
import { verifyPassword } from '~/server/utils/password';
import { signAdminToken } from '~/server/utils/admin-jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { password } = body ?? {};

  if (!password) {
    throw createError({ statusCode: 400, statusMessage: 'Senha obrigatória' });
  }

  const secret = process.env.CLIENT_JWT_SECRET;
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });
  }

  const admin = await new AdminUserService(getOrm(event)).getByUsername('admin');

  // Resposta genérica para não revelar se o usuário existe
  const invalid = () => createError({ statusCode: 401, statusMessage: 'Senha incorreta' });

  if (!admin) throw invalid();

  const ok = await verifyPassword(password, admin.password_hash, admin.salt);
  if (!ok) throw invalid();

  const token = await signAdminToken(admin.username, secret);
  return { success: true, token };
});
