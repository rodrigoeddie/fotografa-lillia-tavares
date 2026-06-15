import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { z } from 'zod';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { FaqService } from '~/server/services/FaqService';

const FaqCategoriaSchema = z.object({
  titulo: z.string().min(1, 'titulo é obrigatório').max(200),
  slug: z.string().min(1, 'slug é obrigatório').regex(/^[a-z0-9-]+$/, 'slug deve ser kebab-case'),
  perguntas: z.array(z.object({
    pergunta: z.string().min(1),
    resposta: z.string().min(1),
  })).optional(),
});

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new FaqService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.listCategoriasComPerguntas();
  }

  // POST cria categoria
  if (getMethod(event) === 'POST') {
    const body = await readBody(event);
    const parsed = FaqCategoriaSchema.safeParse(body);
    if (!parsed.success) {
      throw createError({ statusCode: 400, statusMessage: 'Dados inválidos', data: parsed.error.flatten() });
    }
    const { titulo, slug, perguntas } = parsed.data;

    const ordem = await svc.nextCategoriaOrdem();
    const result = await svc.createCategoria(titulo, slug, ordem);
    const catId = result.meta.last_row_id as number;

    if (Array.isArray(perguntas)) {
      for (let i = 0; i < perguntas.length; i++) {
        const p = perguntas[i];
        if (p.pergunta && p.resposta) {
          await svc.createPergunta(catId, p.pergunta, p.resposta, i + 1);
        }
      }
    }

    return { success: true, id: catId };
  }

  // PATCH reordena categorias: body = [{id, ordem}]
  if (getMethod(event) === 'PATCH') {
    const body = await readBody(event);
    if (!Array.isArray(body)) throw createError({ statusCode: 400, statusMessage: 'Body deve ser um array' });
    await svc.reorderCategorias(body.filter((i) => i.id && i.ordem !== undefined));
    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
