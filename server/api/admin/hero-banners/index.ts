import { defineEventHandler, readBody, createError, getMethod, getQuery } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { HeroBannerService } from '~/server/services/HeroBannerService';

/** GET  /api/admin/hero-banners         — lista todos (com rotas)
 *  POST /api/admin/hero-banners         — cria novo banner */
export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new HeroBannerService(getOrm(event));
  const method = getMethod(event);

  if (method === 'GET') {
    const { route } = getQuery(event);
    if (route && typeof route === 'string') return svc.getBannersForRoute(route);
    return svc.listWithPages();
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const { titulo, subtitulo, descricao, bg_image, bg_image_mobile, cta_nome, cta_url, cta_target, ativo, routes } = body ?? {};
    if (!bg_image) throw createError({ statusCode: 400, statusMessage: 'Imagem de fundo é obrigatória' });

    const ordem = await svc.nextOrdem();
    const banner = await svc.createBanner({
      titulo:          titulo          ?? null,
      subtitulo:       subtitulo       ?? null,
      descricao:       descricao       ?? null,
      bg_image:        bg_image        ?? null,
      bg_image_mobile: bg_image_mobile ?? null,
      cta_nome:        cta_nome        ?? null,
      cta_url:    cta_url    ?? null,
      cta_target: cta_target === 'blank' ? 'blank' : 'self',
      ativo:      ativo === false ? 0 : 1,
      ordem,
    });

    if (Array.isArray(routes) && routes.length > 0) {
      await svc.setPages(banner.id, routes.filter((r: string) => r?.startsWith('/')));
    }

    return { success: true, id: banner.id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
