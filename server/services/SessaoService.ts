import { eq, and, asc, desc, sql, count, inArray } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  sessoes,
  sessao_fotos,
  selecao_lotes,
  selecoes,
  clientes,
  entregas,
  type Sessao,
  type SessaoFoto,
  type SelecaoLote,
} from '~/server/db/schema';

export class SessaoService {
  constructor(private db: ORM) {}

  // ── Sessões ───────────────────────────────────────────────

  async listAll() {
    const subFoto = sql<string | null>`(
      SELECT cloudflare_image_id FROM sessao_fotos
      WHERE sessao_id = ${sessoes.id}
      ORDER BY ordem ASC, id ASC LIMIT 1
    )`;
    return this.db
      .select({
        id:                sessoes.id,
        cliente_id:        sessoes.cliente_id,
        nome_sessao:       sessoes.nome_sessao,
        produto_tipo:      sessoes.produto_tipo,
        pacote_index:      sessoes.pacote_index,
        fotos_incluidas:   sessoes.fotos_incluidas,
        preco_foto_extra:  sessoes.preco_foto_extra,
        status:            sessoes.status,
        criado_em:         sessoes.criado_em,
        produto_id:        sessoes.produto_id,
        prazo_selecao:     sessoes.prazo_selecao,
        capa_foto_id:      sessoes.capa_foto_id,
        cliente_nome:      clientes.nome,
        cliente_email:     clientes.email,
        cliente_celular:   clientes.celular,
        cliente_senha:     clientes.senha_acesso,
        primeira_foto_id:  subFoto,
      })
      .from(sessoes)
      .innerJoin(clientes, eq(sessoes.cliente_id, clientes.id))
      .orderBy(desc(sessoes.criado_em));
  }

  async getById(id: number) {
    const [row] = await this.db
      .select({
        id:                sessoes.id,
        cliente_id:        sessoes.cliente_id,
        nome_sessao:       sessoes.nome_sessao,
        produto_tipo:      sessoes.produto_tipo,
        pacote_index:      sessoes.pacote_index,
        fotos_incluidas:   sessoes.fotos_incluidas,
        preco_foto_extra:  sessoes.preco_foto_extra,
        status:            sessoes.status,
        criado_em:         sessoes.criado_em,
        produto_id:        sessoes.produto_id,
        prazo_selecao:     sessoes.prazo_selecao,
        capa_foto_id:      sessoes.capa_foto_id,
        cliente_nome:      clientes.nome,
        cliente_email:     clientes.email,
      })
      .from(sessoes)
      .innerJoin(clientes, eq(sessoes.cliente_id, clientes.id))
      .where(eq(sessoes.id, id));
    return row ?? null;
  }

  /**
   * Lista sessões de um cliente, sobrescrevendo `status` para 'entregue' quando
   * houver uma entrega ativa associada à sessão (compat com área do cliente).
   */
  async listByCliente(clienteId: number) {
    const rows = await this.db
      .select({
        id:               sessoes.id,
        cliente_id:       sessoes.cliente_id,
        nome_sessao:      sessoes.nome_sessao,
        produto_tipo:     sessoes.produto_tipo,
        pacote_index:     sessoes.pacote_index,
        fotos_incluidas:  sessoes.fotos_incluidas,
        preco_foto_extra: sessoes.preco_foto_extra,
        status:           sessoes.status,
        criado_em:        sessoes.criado_em,
        produto_id:       sessoes.produto_id,
        prazo_selecao:    sessoes.prazo_selecao,
        capa_foto_id:     sessoes.capa_foto_id,
        entregue_ativo: sql<number>`(
          SELECT COUNT(*) FROM entregas e
          WHERE e.sessao_id = sessoes.id AND e.ativo = 1
        )`,
      })
      .from(sessoes)
      .where(eq(sessoes.cliente_id, clienteId))
      .orderBy(desc(sessoes.criado_em));

    if (rows.length === 0) return [];

    // Busca a primeira foto de cada sessão — evita subquery correlacionada que
    // pode retornar null incorretamente no D1.
    const ids = rows.map((r) => r.id);
    const fotos = await this.db
      .select({ sessao_id: sessao_fotos.sessao_id, cloudflare_image_id: sessao_fotos.cloudflare_image_id })
      .from(sessao_fotos)
      .where(inArray(sessao_fotos.sessao_id, ids))
      .orderBy(asc(sessao_fotos.ordem), asc(sessao_fotos.id));

    const fotosMap = new Map<number, string>();
    for (const f of fotos) {
      if (!fotosMap.has(f.sessao_id)) fotosMap.set(f.sessao_id, f.cloudflare_image_id);
    }

    return rows.map((r) => ({
      ...r,
      status: r.entregue_ativo > 0 ? ('entregue' as const) : r.status,
      entregue_ativo: undefined,
      primeira_foto_id: fotosMap.get(r.id) ?? null,
    }));
  }

  create(
    clienteId: number,
    nomeSessao: string,
    produtoTipo: string,
    pacoteIndex: number,
    fotosIncluidas: number,
    precoFotoExtra: number,
  ) {
    return this.db.insert(sessoes).values({
      cliente_id: clienteId,
      nome_sessao: nomeSessao,
      produto_tipo: produtoTipo,
      pacote_index: pacoteIndex,
      fotos_incluidas: fotosIncluidas,
      preco_foto_extra: precoFotoExtra,
    });
  }

  updateStatus(id: number, status: Sessao['status']) {
    return this.db.update(sessoes).set({ status }).where(eq(sessoes.id, id));
  }

  update(
    id: number,
    nomeSessao: string,
    produtoTipo: string,
    pacoteIndex: number,
    fotosIncluidas: number,
    precoFotoExtra: number,
    status: Sessao['status'],
    prazoSelecao: string | null,
  ) {
    return this.db.update(sessoes).set({
      nome_sessao: nomeSessao,
      produto_tipo: produtoTipo,
      pacote_index: pacoteIndex,
      fotos_incluidas: fotosIncluidas,
      preco_foto_extra: precoFotoExtra,
      status,
      prazo_selecao: prazoSelecao,
    }).where(eq(sessoes.id, id));
  }

  delete(id: number) {
    return this.db.delete(sessoes).where(eq(sessoes.id, id));
  }

  setCapa(id: number, capaFotoId: string | null) {
    return this.db.update(sessoes).set({ capa_foto_id: capaFotoId }).where(eq(sessoes.id, id));
  }

  // ── Fotos da sessão ───────────────────────────────────────

  listFotos(sessaoId: number) {
    return this.db.select().from(sessao_fotos).where(eq(sessao_fotos.sessao_id, sessaoId)).orderBy(asc(sessao_fotos.ordem));
  }

  async getFoto(fotoId: number, sessaoId: number) {
    const [row] = await this.db.select().from(sessao_fotos).where(and(eq(sessao_fotos.id, fotoId), eq(sessao_fotos.sessao_id, sessaoId)));
    return row ?? null;
  }

  addFoto(sessaoId: number, cfImageId: string, ordem: number) {
    return this.db.insert(sessao_fotos).values({ sessao_id: sessaoId, cloudflare_image_id: cfImageId, ordem });
  }

  deleteFoto(fotoId: number, sessaoId: number) {
    return this.db.delete(sessao_fotos).where(and(eq(sessao_fotos.id, fotoId), eq(sessao_fotos.sessao_id, sessaoId)));
  }

  async countFotos(sessaoId: number) {
    const [row] = await this.db.select({ count: count() }).from(sessao_fotos).where(eq(sessao_fotos.sessao_id, sessaoId));
    return row?.count ?? 0;
  }

  /** Fotos disponíveis para nova leva: apenas as ainda não entregues */
  fotosDisponiveis(sessaoId: number) {
    return this.db
      .select()
      .from(sessao_fotos)
      .where(and(eq(sessao_fotos.sessao_id, sessaoId), eq(sessao_fotos.entregue, 0)))
      .orderBy(asc(sessao_fotos.ordem));
  }

  // ── Lotes de seleção ──────────────────────────────────────

  listLotes(sessaoId: number) {
    return this.db.select().from(selecao_lotes).where(eq(selecao_lotes.sessao_id, sessaoId)).orderBy(asc(selecao_lotes.criado_em));
  }

  async getLoteById(loteId: number) {
    const [row] = await this.db.select().from(selecao_lotes).where(eq(selecao_lotes.id, loteId));
    return row ?? null;
  }

  async getActiveLote(sessaoId: number) {
    const [row] = await this.db
      .select()
      .from(selecao_lotes)
      .where(and(eq(selecao_lotes.sessao_id, sessaoId), eq(selecao_lotes.status, 'aguardando_selecao')))
      .orderBy(desc(selecao_lotes.criado_em))
      .limit(1);
    return row ?? null;
  }

  createLote(sessaoId: number) {
    return this.db.insert(selecao_lotes).values({ sessao_id: sessaoId });
  }

  updateLoteStatus(loteId: number, status: SelecaoLote['status']) {
    return this.db.update(selecao_lotes).set({ status }).where(eq(selecao_lotes.id, loteId));
  }

  // ── Seleções ──────────────────────────────────────────────

  /**
   * Lista todas as fotos da sessão associada a um lote, com selecao + comentário
   * do mesmo lote (LEFT JOIN). Retorna formato compatível com o front.
   */
  getSelecoesByLote(loteId: number) {
    return this.db
      .select({
        id:                  sessao_fotos.id,
        sessao_id:           sessao_fotos.sessao_id,
        cloudflare_image_id: sessao_fotos.cloudflare_image_id,
        ordem:               sessao_fotos.ordem,
        entregue:            sessao_fotos.entregue,
        selecionada:         selecoes.selecionada,
        comentario:          selecoes.comentario,
        lote_id:             selecoes.lote_id,
      })
      .from(sessao_fotos)
      .leftJoin(
        selecoes,
        and(eq(selecoes.foto_id, sessao_fotos.id), eq(selecoes.lote_id, loteId)),
      )
      .where(
        eq(
          sessao_fotos.sessao_id,
          sql<number>`(SELECT sessao_id FROM selecao_lotes WHERE id = ${loteId})`,
        ),
      )
      .orderBy(asc(sessao_fotos.ordem));
  }

  upsertSelecao(loteId: number, fotoId: number, selecionada: boolean, comentario: string) {
    return this.db
      .insert(selecoes)
      .values({
        lote_id: loteId,
        foto_id: fotoId,
        selecionada: selecionada ? 1 : 0,
        comentario: comentario || null,
      })
      .onConflictDoUpdate({
        target: [selecoes.lote_id, selecoes.foto_id],
        set: {
          selecionada: selecionada ? 1 : 0,
          comentario: comentario || null,
        },
      });
  }

  /** Marca como entregues todas as fotos selecionadas de um lote */
  markFotosEntregues(loteId: number) {
    return this.db.run(sql`
      UPDATE sessao_fotos SET entregue = 1
      WHERE id IN (SELECT foto_id FROM selecoes WHERE lote_id = ${loteId} AND selecionada = 1)
    `);
  }
}
