import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { MenuService, type MenuTreeItem } from '~/server/services/MenuService';

function sanitizeItem(raw: any, allowChildren: boolean): MenuTreeItem {
  if (!raw || typeof raw.label !== 'string' || typeof raw.path !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Item de menu inválido: label e path são obrigatórios' });
  }
  const item: MenuTreeItem = {
    label: raw.label,
    path: raw.path,
    blank: Boolean(raw.blank),
  };
  if (allowChildren && Array.isArray(raw.children) && raw.children.length) {
    item.children = raw.children.map((c: any) => sanitizeItem(c, false));
  }
  return item;
}

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new MenuService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.tree();
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    if (!Array.isArray(body)) {
      throw createError({ statusCode: 400, statusMessage: 'Body deve ser um array de itens' });
    }
    await svc.replace(body.map((item) => sanitizeItem(item, true)));
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
