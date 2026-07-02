import { defineEventHandler, readBody, createError, setCookie } from 'h3';
import { getOrm } from '~/server/utils/d1-client';
import { ClienteService } from '~/server/services/ClienteService';
import { signClientToken } from '~/server/utils/client-jwt';
import { verifyPassword, hashPassword } from '~/server/utils/password';
import { rateLimit } from '~/server/utils/rate-limit';

/**
 * Formato de senha_hash:
 * - Novo:    `pbkdf2$<salt>$<hash>` (PBKDF2-SHA256, 100k iterações — ver utils/password.ts)
 * - Legado:  SHA-512 hex puro (128 chars) — aceito no login e re-hashado
 *   transparentemente para PBKDF2 na primeira autenticação bem-sucedida.
 */
export default defineEventHandler(async (event) => {
  /* Brute force: 10 tentativas por IP a cada 10 minutos */
  await rateLimit(event, 'cliente-login', { limit: 10, windowSec: 600 });

  const body = await readBody(event);
  const { email, senha } = body ?? {};

  if (!email || !senha) {
    throw createError({ statusCode: 400, statusMessage: 'email e senha são obrigatórios' });
  }

  const secret = process.env.CLIENT_JWT_SECRET;
  if (!secret) throw createError({ statusCode: 500, statusMessage: 'JWT secret não configurado' });

  const invalid = () => createError({ statusCode: 401, statusMessage: 'E-mail ou senha incorretos' });

  const svc = new ClienteService(getOrm(event));
  const cliente = await svc.getByEmail(email.toLowerCase().trim());

  /* Sempre executa a verificação (mesmo sem cliente) para evitar enumeração por timing */
  const DUMMY_HASH = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const DUMMY_SALT = 'AAAAAAAAAAAAAAAAAAAAAA';
  const stored = cliente?.senha_hash ?? `pbkdf2$${DUMMY_SALT}$${DUMMY_HASH}`;

  let ok = false;
  if (stored.startsWith('pbkdf2$')) {
    const [, salt, hash] = stored.split('$');
    ok = await verifyPassword(senha, hash ?? DUMMY_HASH, salt ?? DUMMY_SALT);
  } else {
    /* Hash legado SHA-512 hex */
    const hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(senha));
    const senhaHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
    ok = senhaHash === stored;

    if (ok && cliente) {
      /* Upgrade transparente para PBKDF2 (mantém senha_acesso intacta) */
      const { hash, salt } = await hashPassword(senha);
      await svc.updateSenha(cliente.id, `pbkdf2$${salt}$${hash}`);
    }
  }

  if (!cliente || !ok) throw invalid();

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
    cliente: { id: cliente.id, nome: cliente.nome, email: cliente.email, bg_image: cliente.bg_image ?? null },
  };
});
