import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbGetPortfolioWorkById,
  dbListPortfolioFotosByWork,
  dbDeletePortfolioFotosByWork,
  dbCreatePortfolioFoto,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  const work = await dbGetPortfolioWorkById(db, id);
  if (!work) throw createError({ statusCode: 404, statusMessage: 'Portfolio work não encontrado' });

  if (getMethod(event) === 'GET') {
    const { results } = await dbListPortfolioFotosByWork(db, id);
    return results;
  }

  // PUT replaces all fotos
  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { fotos } = body ?? {};
    if (!Array.isArray(fotos)) throw createError({ statusCode: 400, statusMessage: 'fotos deve ser um array' });

    await dbDeletePortfolioFotosByWork(db, id);
    for (let i = 0; i < fotos.length; i++) {
      const f = fotos[i];
      if (!f.cf_image_id) continue;
      await dbCreatePortfolioFoto(db, {
        work_id: id, cf_image_id: f.cf_image_id,
        width: f.width ?? null, height: f.height ?? null,
        formato: f.formato ?? null, custom_class: f.custom_class ?? null,
        alt: f.alt ?? null, highlight: f.highlight ? 1 : 0,
        can_be_thumb: f.can_be_thumb !== false ? 1 : 0, ordem: i + 1,
      });
    }
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
