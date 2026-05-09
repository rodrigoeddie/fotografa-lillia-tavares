import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { ProdutoService } from '~/server/services/ProdutoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new ProdutoService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.listComPacotes();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { slug, title, description, lp_slug, icon, includes, cta_title, cta_description, cta_whatsapp_msg, active, ordem, pacotes } = body ?? {};
    if (!slug || !title) throw createError({ statusCode: 400, statusMessage: 'slug e title são obrigatórios' });

    const result = await svc.create({
      slug,
      title,
      description: description ?? null,
      lp_slug: lp_slug ?? null,
      icon: icon ?? null,
      includes: includes ? JSON.stringify(includes) : null,
      cta_title: cta_title ?? null,
      cta_description: cta_description ?? null,
      cta_whatsapp_msg: cta_whatsapp_msg ?? null,
      active: active ? 1 : 0,
      ordem: ordem ?? 0,
    });
    const produtoId = result.meta.last_row_id as number;

    if (Array.isArray(pacotes)) {
      for (let i = 0; i < pacotes.length; i++) {
        const p = pacotes[i];
        await svc.createPacote({
          produto_id: produtoId,
          title: p.title,
          subtitle: p.subtitle ?? null,
          preco: p.preco ?? 0,
          num_parcelas: p.num_parcelas ?? 1,
          preco_parcelas: p.preco_parcelas ?? null,
          fotos_incluidas: p.fotos_incluidas ?? 0,
          preco_foto_extra: p.preco_foto_extra ?? 0,
          features: p.features ? JSON.stringify(p.features) : null,
          is_recommended: p.is_recommended ? 1 : 0,
          ordem: i + 1,
        });
      }
    }

    return { success: true, id: produtoId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
