import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { PortfolioService } from '~/server/services/PortfolioService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new PortfolioService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const work = await svc.getById(id);
    if (!work) throw createError({ statusCode: 404, statusMessage: 'Portfolio work não encontrado' });
    const fotos = await svc.listFotosByWork(id);
    return { ...work, fotos };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const {
      slug, categoria, titulo, descricao, artigo, data, local,
      depoimento_texto, depoimento_avatar, depoimento_link,
      cor_destaque, home, home_order, video,
      instagram_uri, instagram_title, site,
      ativo, ordem, seo_keywords,
    } = body ?? {};
    if (!slug || !categoria) throw createError({ statusCode: 400, statusMessage: 'slug e categoria são obrigatórios' });

    const work = await svc.getById(id);
    if (!work) throw createError({ statusCode: 404, statusMessage: 'Portfolio work não encontrado' });

    await svc.update(id, {
      slug,
      categoria,
      titulo: titulo ?? null,
      descricao: descricao ?? null,
      artigo: artigo ?? 'a',
      data: data ?? null,
      local: local ?? null,
      depoimento_texto: depoimento_texto ?? null,
      depoimento_avatar: depoimento_avatar ?? null,
      depoimento_link: depoimento_link ?? null,
      cor_destaque: cor_destaque ?? null,
      home: home ? 1 : 0,
      home_order: home_order ?? 0,
      video: video ?? null,
      instagram_uri: instagram_uri ?? null,
      instagram_title: instagram_title ?? null,
      site: site ?? null,
      ativo: ativo !== false ? 1 : 0,
      ordem: ordem ?? work.ordem,
      seo_keywords: seo_keywords ? JSON.stringify(seo_keywords) : null,
    });
    return { success: true };
  }

  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if ('ativo' in (body ?? {})) {
      await svc.setAtivo(id, Boolean(body.ativo));
      return { success: true };
    }
    if ('home' in (body ?? {})) {
      await svc.setHome(id, Boolean(body.home));
      return { success: true };
    }
    if ('ordem' in (body ?? {})) {
      await svc.setOrdem(id, Number(body.ordem));
      return { success: true };
    }
    throw createError({ statusCode: 400, statusMessage: 'Campo inválido para patch' });
  }

  if (getMethod(event) === 'DELETE') {
    const work = await svc.getById(id);
    if (!work) throw createError({ statusCode: 404, statusMessage: 'Portfolio work não encontrado' });
    await svc.delete(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
