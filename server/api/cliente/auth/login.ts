import { defineEventHandler, readBody, createError, setCookie } from 'h3';
import { getDB, dbGetClienteByEmail } from '~/server/utils/d1-client';
import { signClientToken } from '~/server/utils/client-jwt';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, senha } = body ?? {};

  if (!email || !senha) {
    throw createError({ statusCode: 400, statusMessage: 'email e senha são obrigatórios' });
  }

  const secret = process.env.CLIENT_JWT_SECRET;
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });

  const db = getDB(event);
  const cliente = await dbGetClienteByEmail(db, email.toLowerCase().trim());

  if (!cliente) {
    throw createError({ statusCode: 401, statusMessage: 'E-mail ou senha incorretos' });
  }

  const hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(senha));
  const senhaHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

  if (senhaHash !== cliente.senha_hash) {
    throw createError({ statusCode: 401, statusMessage: 'E-mail ou senha incorretos' });
  }

  const token = await signClientToken(cliente.id, secret);

  setCookie(event, 'cliente_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
    path: '/',
  });

  return {
    success: true,
    cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email },
  };
});
