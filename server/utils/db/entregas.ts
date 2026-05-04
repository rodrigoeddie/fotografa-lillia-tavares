export interface Entrega {
  id: number;
  sessao_id: number;
  lote_id: number | null;
  r2_key: string | null;
  nome_arquivo: string | null;
  bg_image_id: string | null;
  mensagem: string | null;
  ativo: number;
  criado_em: string;
}

/** Última entrega ativa de uma sessão (compatibilidade com área do cliente) */
export function dbGetEntregaBySessao(db: D1Database, sessaoId: number) {
  return db.prepare(
    'SELECT * FROM entregas WHERE sessao_id = ? AND ativo = 1 ORDER BY criado_em DESC LIMIT 1'
  ).bind(sessaoId).first<Entrega>();
}

export function dbGetEntregaById(db: D1Database, id: number) {
  return db.prepare(`
    SELECT e.*,
           s.nome_sessao, s.produto_tipo,
           c.nome AS cliente_nome
    FROM entregas e
    JOIN sessoes s ON s.id = e.sessao_id
    JOIN clientes c ON c.id = s.cliente_id
    WHERE e.id = ?
  `).bind(id).first<Entrega & { nome_sessao: string; produto_tipo: string; cliente_nome: string }>();
}

export function dbListEntregasBySessao(db: D1Database, sessaoId: number) {
  return db.prepare(
    'SELECT * FROM entregas WHERE sessao_id = ? ORDER BY criado_em DESC'
  ).bind(sessaoId).all<Entrega>();
}

export function dbListEntregas(db: D1Database) {
  return db.prepare(`
    SELECT e.*, s.nome_sessao, c.nome AS cliente_nome
    FROM entregas e
    JOIN sessoes s ON s.id = e.sessao_id
    JOIN clientes c ON c.id = s.cliente_id
    ORDER BY e.criado_em DESC
  `).all<Entrega & { nome_sessao: string; cliente_nome: string }>();
}

export function dbCreateEntrega(
  db: D1Database,
  sessaoId: number,
  loteId: number | null,
  r2Key: string | null,
  nomeArquivo: string | null,
  bgImageId: string | null,
  mensagem: string | null,
  ativo: boolean,
) {
  return db.prepare(`
    INSERT INTO entregas (sessao_id, lote_id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(sessaoId, loteId, r2Key, nomeArquivo, bgImageId, mensagem, ativo ? 1 : 0).run();
}

export function dbUpdateEntrega(
  db: D1Database,
  id: number,
  r2Key: string | null,
  nomeArquivo: string | null,
  bgImageId: string | null,
  mensagem: string | null,
  ativo: boolean,
) {
  return db.prepare(`
    UPDATE entregas SET r2_key = ?, nome_arquivo = ?, bg_image_id = ?, mensagem = ?, ativo = ?
    WHERE id = ?
  `).bind(r2Key, nomeArquivo, bgImageId, mensagem, ativo ? 1 : 0, id).run();
}

export function dbDeleteEntrega(db: D1Database, id: number) {
  return db.prepare('DELETE FROM entregas WHERE id = ?').bind(id).run();
}
