import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import {
  getDB,
  dbListProdutos,
  dbCreateProduto,
  dbListPacotesByProduto,
} from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results: produtos } = await dbListProdutos(db);
    const result = await Promise.all(
      produtos.map(async (p) => {
        const { results: pacotes } = await dbListPacotesByProduto(db, p.id);
        return { ...p, pacotes };
      }),
    );
    return result;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { slug, title, description, lp_slug, icon, includes, cta_title, cta_description, cta_whatsapp_msg, active, ordem, pacotes } = body ?? {};
    if (!slug || !title) throw createError({ statusCode: 400, statusMessage: 'slug e title são obrigatórios' });

    const result = await dbCreateProduto(db, {
      slug, title, description: description ?? null, lp_slug: lp_slug ?? null,
      icon: icon ?? null,
      includes: includes ? JSON.stringify(includes) : null,
      cta_title: cta_title ?? null, cta_description: cta_description ?? null,
      cta_whatsapp_msg: cta_whatsapp_msg ?? null,
      active: active ? 1 : 0, ordem: ordem ?? 0,
    });
    const produtoId = result.meta.last_row_id as number;

    if (Array.isArray(pacotes)) {
      const { dbCreatePacote } = await import('~/server/utils/d1-client');
      for (let i = 0; i < pacotes.length; i++) {
        const p = pacotes[i];
        await dbCreatePacote(db, {
          produto_id: produtoId, title: p.title, subtitle: p.subtitle ?? null,
          preco: p.preco ?? 0, num_parcelas: p.num_parcelas ?? 1,
          preco_parcelas: p.preco_parcelas ?? null,
          fotos_incluidas: p.fotos_incluidas ?? 0, preco_foto_extra: p.preco_foto_extra ?? 0,
          features: p.features ? JSON.stringify(p.features) : null,
          is_recommended: p.is_recommended ? 1 : 0, ordem: i + 1,
        });
      }
    }

    return { success: true, id: produtoId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
