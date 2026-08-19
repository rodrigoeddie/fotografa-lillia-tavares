import { defineEventHandler, readBody, createError, getMethod } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { SobreService } from '~/server/services/SobreService';

const str = (v: unknown) => {
  const s = typeof v === 'string' ? v.trim() : '';
  return s === '' ? null : s;
};

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new SobreService(getOrm(event));

  if (getMethod(event) === 'GET') {
    return svc.getConteudo();
  }

  if (getMethod(event) === 'PUT') {
    const body = await readBody(event);
    const { pagina, servicos, marcos } = body ?? {};

    if (!pagina?.titulo?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Título é obrigatório' });
    }

    await svc.upsertPagina({
      titulo:             pagina.titulo.trim(),
      imagem_cf_id:       str(pagina.imagem_cf_id),
      imagem_alt:         str(pagina.imagem_alt),
      imagem_width:       Number(pagina.imagem_width) || 935,
      imagem_height:      Number(pagina.imagem_height) || 935,
      bio:                typeof pagina.bio === 'string' ? pagina.bio : '',
      servicos_titulo:    str(pagina.servicos_titulo) ?? '',
      timeline_titulo:    str(pagina.timeline_titulo) ?? '',
      timeline_descricao: str(pagina.timeline_descricao),
      atualizado_em:      new Date().toISOString(),
    });

    if (Array.isArray(servicos)) {
      const existentes = await svc.listServicos();
      const mantidos   = servicos.filter((s: any) => s.id).map((s: any) => Number(s.id));
      for (const e of existentes) {
        if (!mantidos.includes(e.id)) await svc.deleteServico(e.id);
      }
      for (let i = 0; i < servicos.length; i++) {
        const s = servicos[i];
        if (!s.titulo?.trim()) continue;
        const data = {
          tag:             str(s.tag),
          titulo:          s.titulo.trim(),
          subtitulo:       str(s.subtitulo),
          descricao:       str(s.descricao),
          descricao_extra: str(s.descricao_extra),
          cta_label:       str(s.cta_label),
          cta_url:         str(s.cta_url),
          sub_link_label:  str(s.sub_link_label),
          sub_link_url:    str(s.sub_link_url),
          destaque:        s.destaque ? 1 : 0,
          ordem:           i + 1,
          ativo:           s.ativo === false ? 0 : 1,
        };
        if (s.id) await svc.updateServico(Number(s.id), data);
        else await svc.createServico(data);
      }
    }

    if (Array.isArray(marcos)) {
      const existentes = await svc.listMarcos();
      const mantidos   = marcos.filter((m: any) => m.id).map((m: any) => Number(m.id));
      for (const e of existentes) {
        if (!mantidos.includes(e.id)) await svc.deleteMarco(e.id);
      }
      for (let i = 0; i < marcos.length; i++) {
        const m = marcos[i];
        if (!m.titulo?.trim()) continue;
        const data = {
          ano:          Number(m.ano) || new Date().getFullYear(),
          mes:          str(m.mes),
          titulo:       m.titulo.trim(),
          descricao:    str(m.descricao),
          imagem_cf_id: str(m.imagem_cf_id),
          formato:      str(m.formato),
          ordem:        i + 1,
          ativo:        m.ativo === false ? 0 : 1,
        };
        if (m.id) await svc.updateMarco(Number(m.id), data);
        else await svc.createMarco(data);
      }
    }

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
