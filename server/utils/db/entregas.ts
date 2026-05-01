export interface Entrega {
  id: number;
  sessao_id: number;
  r2_key: string | null;
  nome_arquivo: string | null;
  bg_image_id: string | null;
  mensagem: string | null;
  ativo: number;
  criado_em: string;
}

export function dbGetEntregaBySessao(db: D1Database, sessaoId: number) {
  return db.prepare('SELECT * FROM entregas WHERE sessao_id = ?').bind(sessaoId).first<Entrega>();
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

export function dbUpsertEntrega(
  db: D1Database,
  sessaoId: number,
  r2Key: string | null,
  nomeArquivo: string | null,
  bgImageId: string | null,
  mensagem: string | null,
  ativo: boolean,
) {
  return db.prepare(`
    INSERT INTO entregas (sessao_id, r2_key, nome_arquivo, bg_image_id, mensagem, ativo)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(sessao_id) DO UPDATE SET
      r2_key = excluded.r2_key,
      nome_arquivo = excluded.nome_arquivo,
      bg_image_id = excluded.bg_image_id,
      mensagem = excluded.mensagem,
      ativo = excluded.ativo
  `).bind(sessaoId, r2Key, nomeArquivo, bgImageId, mensagem, ativo ? 1 : 0).run();
}

export function dbDeleteEntrega(db: D1Database, id: number) {
  return db.prepare('DELETE FROM entregas WHERE id = ?').bind(id).run();
}
