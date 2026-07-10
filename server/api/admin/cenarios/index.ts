import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { CenarioService } from '~/server/services/CenarioService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new CenarioService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.listPaginasComCenarios();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { slug, titulo, titulo_pre, ordem, cenarios } = body ?? {};
    if (!slug || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug e titulo são obrigatórios' });

    const result   = await svc.createPagina(slug, titulo, titulo_pre ?? null, ordem ?? 0);
    const paginaId = result.meta.last_row_id as number;

    if (Array.isArray(cenarios)) {
      for (let i = 0; i < cenarios.length; i++) {
        const c = cenarios[i];
        if (!c.titulo) continue;
        await svc.create({
          pagina_id: paginaId,
          titulo: c.titulo,
          descricao: c.descricao ?? null,
          imagem_bg_cf_id: c.imagem_bg_cf_id ?? null,
          imagem_bg_alt: c.imagem_bg_alt ?? null,
          imagem_exemplo_cf_id: c.imagem_exemplo_cf_id ?? null,
          imagem_exemplo_alt: c.imagem_exemplo_alt ?? null,
          imagem_exemplo_link: c.imagem_exemplo_link ?? null,
          imagem_exemplo_titulo: c.imagem_exemplo_titulo ?? null,
          imagem_exemplo_orientacao: c.imagem_exemplo_orientacao ?? null,
          ordem: i + 1,
          ativo: c.ativo === false ? 0 : 1,
        });
      }
    }

    return { success: true, id: paginaId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
