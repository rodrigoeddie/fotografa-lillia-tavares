import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbGetClienteById,
  dbUpdateCliente,
  dbUpdateClienteSenha,
  dbDeleteCliente,
} from '~/server/utils/d1-client';
import { purgeCache } from '~/server/utils/purge-cache';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const cliente = await dbGetClienteById(db, id);
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });
    const { senha_hash: _, ...safe } = cliente;
    return safe;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { nome, email, senha, celular, bg_image } = body ?? {};
    if (!nome || !email) throw createError({ statusCode: 400, statusMessage: 'nome e email são obrigatórios' });

    const cliente = await dbGetClienteById(db, id);
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });

    await dbUpdateCliente(db, id, nome, email, bg_image ?? null, celular ?? null);

    if (senha) {
      const hashBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(senha));
      const senhaHash = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
      await dbUpdateClienteSenha(db, id, senhaHash);
    }

    await purgeCache(event, ['/api/cliente/sessoes']);
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const cliente = await dbGetClienteById(db, id);
    if (!cliente) throw createError({ statusCode: 404, statusMessage: 'Cliente não encontrado' });
    await dbDeleteCliente(db, id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
