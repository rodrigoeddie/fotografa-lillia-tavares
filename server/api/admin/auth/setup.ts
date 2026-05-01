import { defineEventHandler, readBody, createError, getHeader } from 'h3';
import { getDB, dbCountAdminUsers, dbCreateAdminUser } from '~/server/utils/d1-client';
import { hashPassword } from '~/server/utils/password';

/**
 * POST /api/admin/auth/setup
 *
 * Cria o primeiro usuário admin. Só funciona quando a tabela admin_users
 * está vazia. Após o primeiro cadastro, o endpoint fica permanentemente
 * bloqueado.
 *
 * Requer o header `x-setup-key` com o valor atual de KEYCMS (a chave
 * de bootstrap que já está no .env), garantindo que apenas quem já tem
 * acesso ao ambiente pode criar o admin.
 *
 * Body: { password: string }
 */
export default defineEventHandler(async (event) => {
  // Verifica chave de bootstrap: SHA-512 do valor enviado deve bater com KEYCMS do .env
  const setupKey  = getHeader(event, 'x-setup-key');
  const expected  = process.env.KEYCMS;

  if (!expected) {
    throw createError({ statusCode: 403, statusMessage: 'Setup desativado: KEYCMS não configurado' });
  }
  if (!setupKey) {
    throw createError({ statusCode: 403, statusMessage: 'Chave de setup inválida' });
  }

  const hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(setupKey));
  const hashHex    = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

  if (hashHex !== expected) {
    throw createError({ statusCode: 403, statusMessage: 'Chave de setup inválida' });
  }

  const db    = getDB(event);
  const count = await dbCountAdminUsers(db);

  if ((count?.count ?? 0) > 0) {
    throw createError({ statusCode: 409, statusMessage: 'Admin já configurado' });
  }

  const body = await readBody(event);
  const { password } = body ?? {};

  if (!password || typeof password !== 'string' || password.length < 12) {
    throw createError({ statusCode: 400, statusMessage: 'Senha deve ter no mínimo 12 caracteres' });
  }

  const { hash, salt } = await hashPassword(password);
  await dbCreateAdminUser(db, 'admin', hash, salt);

  return { success: true, message: 'Usuário admin criado. Você já pode remover KEYCMS do .env.' };
});
