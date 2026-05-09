import { eq, and, desc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { entregas, entrega_portfolio_fotos, sessoes, clientes } from '~/server/db/schema';

export class EntregaService {
  constructor(private db: ORM) {}

  /** Última entrega ativa de uma sessão */
  async getActiveBySessao(sessaoId: number) {
    const [row] = await this.db
      .select()
      .from(entregas)
      .where(and(eq(entregas.sessao_id, sessaoId), eq(entregas.ativo, 1)))
      .orderBy(desc(entregas.criado_em))
      .limit(1);
    return row ?? null;
  }

  async getById(id: number) {
    const [row] = await this.db
      .select({
        id:           entregas.id,
        sessao_id:    entregas.sessao_id,
        lote_id:      entregas.lote_id,
        r2_key:       entregas.r2_key,
        nome_arquivo: entregas.nome_arquivo,
        bg_image_id:  entregas.bg_image_id,
        mensagem:     entregas.mensagem,
        ativo:        entregas.ativo,
        criado_em:    entregas.criado_em,
        nome_sessao:  sessoes.nome_sessao,
        produto_tipo: sessoes.produto_tipo,
        cliente_nome: clientes.nome,
      })
      .from(entregas)
      .innerJoin(sessoes, eq(sessoes.id, entregas.sessao_id))
      .innerJoin(clientes, eq(clientes.id, sessoes.cliente_id))
      .where(eq(entregas.id, id));
    return row ?? null;
  }

  listBySessao(sessaoId: number) {
    return this.db
      .select()
      .from(entregas)
      .where(eq(entregas.sessao_id, sessaoId))
      .orderBy(desc(entregas.criado_em));
  }

  listAll() {
    return this.db
      .select({
        id:           entregas.id,
        sessao_id:    entregas.sessao_id,
        lote_id:      entregas.lote_id,
        r2_key:       entregas.r2_key,
        nome_arquivo: entregas.nome_arquivo,
        bg_image_id:  entregas.bg_image_id,
        mensagem:     entregas.mensagem,
        ativo:        entregas.ativo,
        criado_em:    entregas.criado_em,
        nome_sessao:  sessoes.nome_sessao,
        cliente_nome: clientes.nome,
      })
      .from(entregas)
      .innerJoin(sessoes, eq(sessoes.id, entregas.sessao_id))
      .innerJoin(clientes, eq(clientes.id, sessoes.cliente_id))
      .orderBy(desc(entregas.criado_em));
  }

  create(
    sessaoId: number,
    loteId: number | null,
    r2Key: string | null,
    nomeArquivo: string | null,
    bgImageId: string | null,
    mensagem: string | null,
    ativo: boolean,
  ) {
    return this.db.insert(entregas).values({
      sessao_id: sessaoId,
      lote_id: loteId,
      r2_key: r2Key,
      nome_arquivo: nomeArquivo,
      bg_image_id: bgImageId,
      mensagem,
      ativo: ativo ? 1 : 0,
    });
  }

  update(
    id: number,
    r2Key: string | null,
    nomeArquivo: string | null,
    bgImageId: string | null,
    mensagem: string | null,
    ativo: boolean,
  ) {
    return this.db.update(entregas).set({
      r2_key: r2Key,
      nome_arquivo: nomeArquivo,
      bg_image_id: bgImageId,
      mensagem,
      ativo: ativo ? 1 : 0,
    }).where(eq(entregas.id, id));
  }

  delete(id: number) {
    return this.db.delete(entregas).where(eq(entregas.id, id));
  }
}
