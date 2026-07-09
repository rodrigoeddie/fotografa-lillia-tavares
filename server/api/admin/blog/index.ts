import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { BlogService } from '~/server/services/BlogService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new BlogService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.list();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { slug, categoria, titulo, descricao, data, imagem_cf_id, conteudo, conteudo_imagens, album, ativo, seo_keywords, works, show_schedule } = body ?? {};
    if (!slug || !categoria || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug, categoria e titulo são obrigatórios' });

    const result = await svc.create({
      slug,
      categoria,
      titulo,
      descricao: descricao ?? null,
      data: data ?? null,
      imagem_cf_id: imagem_cf_id ?? null,
      conteudo: conteudo ?? null,
      conteudo_imagens: conteudo_imagens ? JSON.stringify(conteudo_imagens) : null,
      album: album ? JSON.stringify(album) : null,
      ativo: ativo !== false ? 1 : 0,
      seo_keywords: seo_keywords ? JSON.stringify(seo_keywords) : null,
      works: works || null,
      show_schedule: show_schedule ? 1 : 0,
    });
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
