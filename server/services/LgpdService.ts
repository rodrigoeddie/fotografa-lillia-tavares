import { eq, and, inArray } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  clientes,
  sessoes,
  sessao_fotos,
  selecao_lotes,
  selecoes,
  entregas,
  entrega_portfolio_fotos,
  pagamentos,
  notificacoes,
  push_subscriptions,
} from '~/server/db/schema';

export interface WipeResult {
  cfImageIds: string[];
  r2Keys: string[];
  sessaoCount: number;
}

export class LgpdService {
  constructor(private db: ORM) {}

  /**
   * Direito ao esquecimento (LGPD art. 18): apaga o cliente e TODOS os dados
   * associados no D1 — sessões, fotos, lotes, seleções (incluindo comentários),
   * entregas, pagamentos, notificações e push subscriptions.
   *
   * Não confia em ON DELETE CASCADE do runtime: apaga explicitamente na ordem
   * inversa das dependências. Retorna os ponteiros de arquivos externos
   * (Cloudflare Images + R2) para o handler apagar nos respectivos storages.
   *
   * Registros financeiros: as linhas de `pagamentos` são removidas do D1; os
   * comprovantes fiscais permanecem no painel SumUp (obrigação legal coberta
   * pelo processador — ver docs/seguranca-lgpd.md).
   */
  async wipeCliente(clienteId: number): Promise<WipeResult | null> {
    const [cliente] = await this.db.select().from(clientes).where(eq(clientes.id, clienteId));
    if (!cliente) return null;

    const cfImageIds: string[] = [];
    const r2Keys: string[] = [];
    if (cliente.bg_image) cfImageIds.push(cliente.bg_image);

    const sessoesDoCliente = await this.db
      .select({ id: sessoes.id, capa_foto_id: sessoes.capa_foto_id })
      .from(sessoes)
      .where(eq(sessoes.cliente_id, clienteId));
    const sessaoIds = sessoesDoCliente.map((s) => s.id);

    if (sessaoIds.length) {
      const fotos = await this.db
        .select({ cf: sessao_fotos.cloudflare_image_id })
        .from(sessao_fotos)
        .where(inArray(sessao_fotos.sessao_id, sessaoIds));
      cfImageIds.push(...fotos.map((f) => f.cf));

      const lotes = await this.db
        .select({ id: selecao_lotes.id })
        .from(selecao_lotes)
        .where(inArray(selecao_lotes.sessao_id, sessaoIds));
      const loteIds = lotes.map((l) => l.id);

      const ents = await this.db
        .select({ id: entregas.id, r2_key: entregas.r2_key, bg_image_id: entregas.bg_image_id })
        .from(entregas)
        .where(inArray(entregas.sessao_id, sessaoIds));
      const entregaIds = ents.map((e) => e.id);
      r2Keys.push(...ents.map((e) => e.r2_key).filter((k): k is string => !!k));
      cfImageIds.push(...ents.map((e) => e.bg_image_id).filter((k): k is string => !!k));

      if (entregaIds.length) {
        const entFotos = await this.db
          .select({ cf: entrega_portfolio_fotos.cf_image_id })
          .from(entrega_portfolio_fotos)
          .where(inArray(entrega_portfolio_fotos.entrega_id, entregaIds));
        cfImageIds.push(...entFotos.map((f) => f.cf));
        await this.db.delete(entrega_portfolio_fotos).where(inArray(entrega_portfolio_fotos.entrega_id, entregaIds));
      }

      if (loteIds.length) {
        await this.db.delete(selecoes).where(inArray(selecoes.lote_id, loteIds));
      }
      await this.db.delete(pagamentos).where(inArray(pagamentos.sessao_id, sessaoIds));
      await this.db.delete(entregas).where(inArray(entregas.sessao_id, sessaoIds));
      await this.db.delete(selecao_lotes).where(inArray(selecao_lotes.sessao_id, sessaoIds));
      await this.db.delete(sessao_fotos).where(inArray(sessao_fotos.sessao_id, sessaoIds));
      await this.db.delete(sessoes).where(eq(sessoes.cliente_id, clienteId));
    }

    await this.db.delete(notificacoes).where(and(eq(notificacoes.tipo, 'cliente'), eq(notificacoes.destinatario_id, clienteId)));
    await this.db.delete(push_subscriptions).where(and(eq(push_subscriptions.tipo, 'cliente'), eq(push_subscriptions.destinatario_id, clienteId)));
    await this.db.delete(clientes).where(eq(clientes.id, clienteId));

    /* capa_foto_id aponta para uma foto já coletada em sessao_fotos — dedup no final */
    return { cfImageIds: [...new Set(cfImageIds)], r2Keys, sessaoCount: sessaoIds.length };
  }
}
