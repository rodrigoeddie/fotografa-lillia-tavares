import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { ClienteService } from '~/server/services/ClienteService';
import { encryptField } from '~/server/utils/encrypt-field';
import { hashPassword } from '~/server/utils/password';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new ClienteService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.list();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { nome, email, senha, celular, bg_image } = body ?? {};

    if (!nome || !email || !senha) {
      throw createError({ statusCode: 400, statusMessage: 'nome, email e senha são obrigatórios' });
    }

    const existing = await svc.getByEmail(email);
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'E-mail já cadastrado' });
    }

    const { hash, salt } = await hashPassword(senha);
    const senhaHash = `pbkdf2$${salt}$${hash}`;

    const fieldKey = process.env.FIELD_ENCRYPT_KEY;
    const senhaAcesso = fieldKey ? await encryptField(senha, fieldKey) : null;
    const result = await svc.create(nome, email, senhaHash, senhaAcesso ?? undefined);
    const newId = result.meta.last_row_id as number;

    if (bg_image || celular) {
      await svc.update(newId, nome, email, bg_image ?? null, celular ?? null);
    }

    return { success: true, id: newId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
