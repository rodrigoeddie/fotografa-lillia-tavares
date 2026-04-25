import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbGetProdutoById,
  dbUpdateProduto,
  dbDeleteProduto,
  dbListPacotesByProduto,
  dbDeletePacotesByProduto,
  dbCreatePacote,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);
  const id = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const produto = await dbGetProdutoById(db, id);
    if (!produto) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' });
    const { results: pacotes } = await dbListPacotesByProduto(db, id);
    return { ...produto, pacotes };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { slug, title, description, lp_slug, icon, includes, cta_title, cta_description, cta_whatsapp_msg, active, ordem, pacotes } = body ?? {};
    if (!slug || !title) throw createError({ statusCode: 400, statusMessage: 'slug e title são obrigatórios' });

    const produto = await dbGetProdutoById(db, id);
    if (!produto) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' });

    await dbUpdateProduto(db, id, {
      slug, title, description: description ?? null, lp_slug: lp_slug ?? null,
      icon: icon ?? null,
      includes: includes ? JSON.stringify(includes) : null,
      cta_title: cta_title ?? null, cta_description: cta_description ?? null,
      cta_whatsapp_msg: cta_whatsapp_msg ?? null,
      active: active ? 1 : 0, ordem: ordem ?? 0,
    });

    if (Array.isArray(pacotes)) {
      await dbDeletePacotesByProduto(db, id);
      for (let i = 0; i < pacotes.length; i++) {
        const p = pacotes[i];
        await dbCreatePacote(db, {
          produto_id: id, title: p.title, subtitle: p.subtitle ?? null,
          preco: p.preco ?? 0, num_parcelas: p.num_parcelas ?? 1,
          preco_parcelas: p.preco_parcelas ?? null,
          fotos_incluidas: p.fotos_incluidas ?? 0, preco_foto_extra: p.preco_foto_extra ?? 0,
          features: p.features ? JSON.stringify(p.features) : null,
          is_recommended: p.is_recommended ? 1 : 0, ordem: i + 1,
        });
      }
    }

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const produto = await dbGetProdutoById(db, id);
    if (!produto) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' });
    await dbDeleteProduto(db, id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
