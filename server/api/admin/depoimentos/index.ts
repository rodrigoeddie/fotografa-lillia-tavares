import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { z } from 'zod';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm, getDB } from '~/server/utils/d1-client';
import { DepoimentoService } from '~/server/services/DepoimentoService';

const DepoimentoSchema = z.object({
  nome: z.string().min(1, 'nome é obrigatório').max(200),
  texto: z.string().min(1, 'texto é obrigatório'),
  foto_cf_id: z.string().nullable().optional(),
  rating: z.number().int().min(1).max(5).optional(),
  data: z.string().nullable().optional(),
  link: z.string().url().nullable().optional(),
  featured: z.boolean().optional(),
  portfolio_link: z.string().nullable().optional(),
  ordem: z.number().int().optional(),
});

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new DepoimentoService(getOrm(event), getDB(event));

  if (getMethod(event) === 'GET') {
    return svc.list();
  }

  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const parsed = DepoimentoSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Dados inválidos', data: parsed.error.flatten() });
    }
    const { nome, foto_cf_id, rating, data, texto, link, featured, portfolio_link, ordem } = parsed.data;

    const result = await svc.create({
      nome,
      foto_cf_id: foto_cf_id ?? null,
      rating: rating ?? 5,
      data: data ?? null,
      texto,
      link: link ?? null,
      featured: featured ? 1 : 0,
      portfolio_link: portfolio_link ?? null,
      ordem: ordem ?? 0,
    });
    return { success: true, id: result.meta.last_row_id };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
