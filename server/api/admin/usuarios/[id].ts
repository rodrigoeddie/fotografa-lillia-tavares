import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateSuperAdmin, getAdminPayload } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { AdminUserService } from '~/server/services/AdminUserService';
import { ADMIN_ROLES } from '~/server/db/schema/admin-users';

export default defineEventHandler(async (event) => {
  await validateSuperAdmin(event);
  const { username: callerUsername } = await getAdminPayload(event);

  const svc = new AdminUserService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { username, email, role } = body ?? {};

    if (!username) throw createError({ statusCode: 400, statusMessage: 'username é obrigatório' });
    if (role && !ADMIN_ROLES.includes(role)) {
      throw createError({ statusCode: 400, statusMessage: 'Role inválido' });
    }

    const target = await svc.getById(id);
    if (!target) throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado' });

    // Impede rebaixar o próprio role para evitar lock-out
    if (target.username === callerUsername && role && role !== 'super_admin') {
      throw createError({ statusCode: 400, statusMessage: 'Você não pode alterar o próprio role' });
    }

    if (username !== target.username) {
      const existing = await svc.getByUsername(username);
      if (existing) throw createError({ statusCode: 409, statusMessage: 'Username já em uso' });
    }

    await svc.update(id, { username, email: email || null, role });
    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const target = await svc.getById(id);
    if (!target) throw createError({ statusCode: 404, statusMessage: 'Usuário não encontrado' });

    if (target.username === callerUsername) {
      throw createError({ statusCode: 400, statusMessage: 'Você não pode excluir sua própria conta' });
    }

    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
