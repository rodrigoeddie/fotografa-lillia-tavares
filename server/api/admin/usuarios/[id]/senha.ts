import { defineEventHandler, readBody, createError, getRouterParam } from 'h3';
import { validateSuperAdmin } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { AdminUserService } from '~/server/services/AdminUserService';
import { hashPassword } from '~/server/utils/password';

export default defineEventHandler(async (event) => {
  await validateSuperAdmin(event);
  const svc = new AdminUserService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const body = await readBody(event);
  const { password } = body ?? {};

  if (!password || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: 'Senha deve ter no mínimo 8 caracteres' });
  }

  const target = await svc.getById(id);
  if (!target) throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado' });

  const { hash, salt } = await hashPassword(password);
  await svc.updatePassword(id, hash, salt);
  return { success: true };
});
