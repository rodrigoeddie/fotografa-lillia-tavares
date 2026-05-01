import { defineEventHandler, readBody, createError } from 'h3';
import { getDB, dbGetAdminByUsername } from '~/server/utils/d1-client';
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

  const db    = getDB(event);
  const admin = await dbGetAdminByUsername(db, 'admin');

  // Resposta genérica para não revelar se o usuário existe
  const invalid = () => createError({ statusCode: 401, statusMessage: 'Senha incorreta' });

  if (!admin) throw invalid();

  const ok = await verifyPassword(password, admin.password_hash, admin.salt);
  if (!ok) throw invalid();

  const token = await signAdminToken(admin.username, secret);
  return { success: true, token };
});
