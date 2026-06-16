import { defineEventHandler, readBody, createError } from 'h3';
import { z } from 'zod';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { DepoimentoService } from '~/server/services/DepoimentoService';

const ReorderSchema = z.object({
  items: z.array(z.object({ id: z.number().int(), ordem: z.number().int() })).min(1),
});

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const body = await readBody(event);
  const parsed = ReorderSchema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Dados inválidos', data: parsed.error.flatten() });
  }

  const svc = new DepoimentoService(getOrm(event));
  await svc.reorder(parsed.data.items);
  return { success: true };
});
