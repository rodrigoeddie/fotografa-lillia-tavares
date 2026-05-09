import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { LandingPageService } from '~/server/services/LandingPageService';
import { LandingPageInputSchema } from '~/shared/schemas/landing-page';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new LandingPageService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.list();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const parsed = LandingPageInputSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Validação falhou', data: parsed.error.flatten() });
    }

    const existing = await svc.getBySlug(parsed.data.slug);
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'slug já cadastrado' });
    }

    const result = await svc.create(parsed.data);
    return { success: true, id: result.id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
