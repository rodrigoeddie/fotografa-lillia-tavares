import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { CenarioService } from '~/server/services/CenarioService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new CenarioService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const pagina = await svc.getPaginaById(id);
    if (!pagina) throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' });
    const cenarios = await svc.listByPagina(id);
    return { ...pagina, cenarios };
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { slug, titulo, titulo_pre, ordem, cenarios } = body ?? {};
    if (!slug || !titulo) throw createError({ statusCode: 400, statusMessage: 'slug e titulo são obrigatórios' });

    const pagina = await svc.getPaginaById(id);
    if (!pagina) throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' });

    await svc.updatePagina(id, slug, titulo, titulo_pre ?? null, ordem ?? pagina.ordem);

    if (Array.isArray(cenarios)) {
      const existing = await svc.listByPagina(id);
      const newIds = cenarios.filter((c) => c.id).map((c) => c.id);
      for (const e of existing) {
        if (!newIds.includes(e.id)) await svc.delete(e.id);
      }
      for (let i = 0; i < cenarios.length; i++) {
        const c = cenarios[i];
        if (!c.titulo) continue;
        const data = {
          pagina_id: id,
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
        };
        if (c.id) {
          await svc.update(c.id, data);
        } else {
          await svc.create(data);
        }
      }
    }

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const pagina = await svc.getPaginaById(id);
    if (!pagina) throw createError({ statusCode: 404, statusMessage: 'Página não encontrada' });
    await svc.deletePagina(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
