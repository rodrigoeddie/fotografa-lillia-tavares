import { defineEventHandler, readBody, createError, getMethod, getRouterParam } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { HeroBannerService } from '~/server/services/HeroBannerService';
import { deleteCfImages } from '~/server/utils/delete-cf-images';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new HeroBannerService(getOrm(event));
  const id  = Number(getRouterParam(event, 'id'));
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID inválido' });

  if (getMethod(event) === 'GET') {
    const banner = await svc.getBannerWithPages(id);
    if (!banner) throw createError({ statusCode: 404, statusMessage: 'Banner não encontrado' });
    return banner;
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { titulo, subtitulo, descricao, bg_image, bg_image_mobile, cta_nome, cta_url, cta_target, ativo, ordem, routes } = body ?? {};
    if (!bg_image) throw createError({ statusCode: 400, statusMessage: 'Imagem de fundo é obrigatória' });

    const existing = await svc.getBannerById(id);
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Banner não encontrado' });

    await svc.updateBanner(id, {
      titulo:          titulo          ?? null,
      subtitulo:       subtitulo       ?? null,
      descricao:       descricao       ?? null,
      bg_image:        bg_image        ?? null,
      bg_image_mobile: bg_image_mobile ?? null,
      cta_nome:        cta_nome        ?? null,
      cta_url:    cta_url    ?? null,
      cta_target: cta_target === 'blank' ? 'blank' : 'self',
      ativo:      ativo === false ? 0 : 1,
      ordem:      typeof ordem === 'number' ? ordem : existing.ordem,
    });

    if (Array.isArray(routes)) {
      await svc.setPages(id, routes.filter((r: string) => r?.startsWith('/')));
    }

    return { success: true };
  }

  if (getMethod(event) === 'DELETE') {
    const existing = await svc.getBannerById(id);
    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Banner não encontrado' });
    await deleteCfImages(event, [existing.bg_image, existing.bg_image_mobile]);
    await svc.deleteBanner(id);
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
