import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListClientes, dbCreateCliente, dbGetClienteByEmail } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListClientes(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { nome, email, senha, celular, bg_image } = body ?? {};

    if (!nome || !email || !senha) {
      throw createError({ statusCode: 400, statusMessage: 'nome, email e senha são obrigatórios' });
    }

    const existing = await dbGetClienteByEmail(db, email);
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'E-mail já cadastrado' });
    }

    const hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(senha));
    const senhaHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

    const result = await dbCreateCliente(db, nome, email, senhaHash);
    const newId = result.meta.last_row_id as number;

    if (bg_image || celular) {
      await db.prepare('UPDATE clientes SET bg_image = ?, celular = ? WHERE id = ?').bind(bg_image ?? null, celular ?? null, newId).run();
    }

    return { success: true, id: newId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
