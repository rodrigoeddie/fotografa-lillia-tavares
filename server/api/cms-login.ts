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

  const secret = process.env.ADMIN_JWT_SECRET ?? process.env.CLIENT_JWT_SECRET;
  if (!secret) {
    throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });
  }

  // Resposta genérica para não revelar informações
  const invalid = () => createError({ statusCode: 401, statusMessage: 'Email ou senha incorretos' });

  const admin = await new AdminUserService(getOrm(event)).getByEmail(email);

  // Sempre executa o PBKDF2 (mesmo sem usuário) para evitar enumeração por timing.
  // Hash/salt dummy gerados com os mesmos parâmetros de password.ts.
  const DUMMY_HASH = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const DUMMY_SALT = 'AAAAAAAAAAAAAAAAAAAAAAA';
  const ok = await verifyPassword(
    password,
    admin?.password_hash ?? DUMMY_HASH,
    admin?.salt ?? DUMMY_SALT,
  );
  if (!admin || !ok) throw invalid();

  const token = await signAdminToken(admin.username, admin.role ?? 'editor', secret);
  return { success: true, token };
});
