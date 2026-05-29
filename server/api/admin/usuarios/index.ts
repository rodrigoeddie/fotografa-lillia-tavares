import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateSuperAdmin } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { AdminUserService } from '~/server/services/AdminUserService';
import { hashPassword } from '~/server/utils/password';
import { ADMIN_ROLES } from '~/server/db/schema/admin-users';

export default defineEventHandler(async (event) => {
  await validateSuperAdmin(event);
  const svc = new AdminUserService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.list();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { username, email, password, role } = body ?? {};

    if (!username || !password) {
      throw createError({ statusCode: 400, statusMessage: 'username e password são obrigatórios' });
    }
    if (password.length < 8) {
      throw createError({ statusCode: 400, statusMessage: 'Senha deve ter no mínimo 8 caracteres' });
    }
    if (role && !ADMIN_ROLES.includes(role)) {
      throw createError({ statusCode: 400, statusMessage: 'Role inválido' });
    }

    const existing = await svc.getByUsername(username);
    if (existing) throw createError({ statusCode: 409, statusMessage: 'Username já em uso' });

    if (email) {
      const existingEmail = await svc.getByEmail(email);
      if (existingEmail) throw createError({ statusCode: 409, statusMessage: 'E-mail já cadastrado' });
    }

    const { hash, salt } = await hashPassword(password);
    const result = await svc.create(username, hash, salt, email || undefined, role || 'editor');
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
