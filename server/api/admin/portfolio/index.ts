import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListPortfolioWorks, dbCreatePortfolioWork } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results } = await dbListPortfolioWorks(db);
    return results;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const {
      slug, categoria, titulo, descricao, artigo, data, local,
      depoimento_texto, depoimento_avatar, depoimento_link,
      cor_destaque, home, home_order, video,
      instagram_uri, instagram_title, site,
      ativo, ordem, seo_keywords,
    } = body ?? {};
    if (!slug || !categoria) throw createError({ statusCode: 400, statusMessage: 'slug e categoria são obrigatórios' });

    const result = await dbCreatePortfolioWork(db, {
      slug, categoria, titulo: titulo ?? null, descricao: descricao ?? null, artigo: artigo ?? 'a', data: data ?? null,
      local: local ?? null,
      depoimento_texto: depoimento_texto ?? null, depoimento_avatar: depoimento_avatar ?? null,
      depoimento_link: depoimento_link ?? null, cor_destaque: cor_destaque ?? null,
      home: home ? 1 : 0, home_order: home_order ?? 0, video: video ?? null,
      instagram_uri: instagram_uri ?? null, instagram_title: instagram_title ?? null,
      site: site ?? null, ativo: ativo !== false ? 1 : 0, ordem: ordem ?? 0,
      seo_keywords: seo_keywords ? JSON.stringify(seo_keywords) : null,
    });
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
