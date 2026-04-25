import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbListCenarioPaginas, dbListCenariosByPagina, dbCreateCenarioPagina, dbCreateCenario } from '~/server/utils/d1-client';

export default defineEventHandler(async (event) => {
  validateAdminToken(event);
  const db = getDB(event);

  if (getMethod(event) === 'GET') {
    const { results: paginas } = await dbListCenarioPaginas(db);
    const result = await Promise.all(
      paginas.map(async (p) => {
        const { results: cenarios } = await dbListCenariosByPagina(db, p.id);
        return { ...p, cenarios };
      }),
    );
    return result;
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const { slug, titulo, titulo_pre, ordem, cenarios } = body ?? {};
    if (!slug || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug e titulo são obrigatórios' });

    const result = await dbCreateCenarioPagina(db, slug, titulo, titulo_pre ?? null, ordem ?? 0);
    const paginaId = result.meta.last_row_id as number;

    if (Array.isArray(cenarios)) {
      for (let i = 0; i < cenarios.length; i++) {
        const c = cenarios[i];
        if (!c.titulo) continue;
        await dbCreateCenario(db, {
          pagina_id: paginaId, titulo: c.titulo, descricao: c.descricao ?? null,
          imagem_bg_cf_id: c.imagem_bg_cf_id ?? null,
          imagem_exemplo_cf_id: c.imagem_exemplo_cf_id ?? null,
          imagem_exemplo_alt: c.imagem_exemplo_alt ?? null,
          imagem_exemplo_link: c.imagem_exemplo_link ?? null,
          imagem_exemplo_titulo: c.imagem_exemplo_titulo ?? null,
          imagem_exemplo_orientacao: c.imagem_exemplo_orientacao ?? null,
          ordem: i + 1,
        });
      }
    }

    return { success: true, id: paginaId };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
