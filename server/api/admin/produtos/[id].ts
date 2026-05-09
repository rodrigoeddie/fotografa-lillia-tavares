import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { ProdutoService } from '~/server/services/ProdutoService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new ProdutoService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const produto = await svc.getById(id);
    if (!produto) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' });
    const pacotes = await svc.listPacotesByProduto(id);
    return { ...produto, pacotes };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { slug, title, description, lp_slug, icon, includes, cta_title, cta_description, cta_whatsapp_msg, active, ordem, pacotes } = body ?? {};
    if (!slug || !title) throw createError({ statusCode: 400, statusMessage: 'slug e title são obrigatórios' });

    const produto = await svc.getById(id);
    if (!produto) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' });

    await svc.update(id, {
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

    if (Array.isArray(pacotes)) {
      await svc.deletePacotesByProduto(id);
      for (let i = 0; i < pacotes.length; i++) {
        const p = pacotes[i];
        await svc.createPacote({
          produto_id: id,
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

    return { success: true };
  }

  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if ('active' in (body ?? {})) {
      await svc.setActive(id, Boolean(body.active));
      return { success: true };
    }
    if ('ordem' in (body ?? {})) {
      await svc.setOrdem(id, Number(body.ordem));
      return { success: true };
    }
    throw createError({ statusCode: 400, statusMessage: 'Campo inválido para patch' });
  }

  if (getMethod(event) === 'DELETE') {
    const produto = await svc.getById(id);
    if (!produto) throw createError({ statusCode: 404, statusMessage: 'Produto não encontrado' });
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
