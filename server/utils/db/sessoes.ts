// ─── Sessoes ──────────────────────────────────────────────────────────────────

export interface Sessao {
  id: number;
  cliente_id: number;
  nome_sessao: string;
  produto_tipo: string;
  pacote_index: number;
  fotos_incluidas: number;
  preco_foto_extra: number;
  status: 'aguardando_fotos' | 'aguardando_selecao' | 'selecao_concluida' | 'entregue';
  criado_em: string;
}

export interface SessaoComCliente extends Sessao {
  cliente_nome: string;
  cliente_email: string;
  primeira_foto_id: string | null;
}

export function dbListSessoes(db: D1Database) {
  return db.prepare(`
    SELECT s.*, c.nome AS cliente_nome, c.email AS cliente_email,
      (SELECT cloudflare_image_id FROM sessao_fotos WHERE sessao_id = s.id ORDER BY ordem ASC, id ASC LIMIT 1) AS primeira_foto_id
    FROM sessoes s JOIN clientes c ON s.cliente_id = c.id
    ORDER BY s.criado_em DESC
  `).all<SessaoComCliente>();
}

export function dbGetSessaoById(db: D1Database, id: number) {
  return db.prepare(`
    SELECT s.*, c.nome AS cliente_nome, c.email AS cliente_email
    FROM sessoes s JOIN clientes c ON s.cliente_id = c.id
    WHERE s.id = ?
  `).bind(id).first<SessaoComCliente>();
}

export function dbListSessoesByCliente(db: D1Database, clienteId: number) {
  return db.prepare('SELECT * FROM sessoes WHERE cliente_id = ? ORDER BY criado_em DESC').bind(clienteId).all<Sessao>();
}

export function dbCreateSessao(
  db: D1Database,
  clienteId: number,
  nomeSessao: string,
  produtoTipo: string,
  pacoteIndex: number,
  fotosIncluidas: number,
  precoFotoExtra: number,
) {
  return db.prepare(
    'INSERT INTO sessoes (cliente_id, nome_sessao, produto_tipo, pacote_index, fotos_incluidas, preco_foto_extra) VALUES (?, ?, ?, ?, ?, ?)',
  ).bind(clienteId, nomeSessao, produtoTipo, pacoteIndex, fotosIncluidas, precoFotoExtra).run();
}

export function dbUpdateSessaoStatus(db: D1Database, id: number, status: Sessao['status']) {
  return db.prepare('UPDATE sessoes SET status = ? WHERE id = ?').bind(status, id).run();
}

export function dbUpdateSessao(
  db: D1Database,
  id: number,
  nomeSessao: string,
  produtoTipo: string,
  pacoteIndex: number,
  fotosIncluidas: number,
  precoFotoExtra: number,
  status: Sessao['status'],
) {
  return db.prepare(
    'UPDATE sessoes SET nome_sessao = ?, produto_tipo = ?, pacote_index = ?, fotos_incluidas = ?, preco_foto_extra = ?, status = ? WHERE id = ?',
  ).bind(nomeSessao, produtoTipo, pacoteIndex, fotosIncluidas, precoFotoExtra, status, id).run();
}

export function dbDeleteSessao(db: D1Database, id: number) {
  return db.prepare('DELETE FROM sessoes WHERE id = ?').bind(id).run();
}

// ─── Fotos da Sessão ──────────────────────────────────────────────────────────

export interface SessaoFoto {
  id: number;
  sessao_id: number;
  cloudflare_image_id: string;
  ordem: number;
  entregue: number;
}

export function dbListFotosBySessao(db: D1Database, sessaoId: number) {
  return db.prepare('SELECT * FROM sessao_fotos WHERE sessao_id = ? ORDER BY ordem ASC').bind(sessaoId).all<SessaoFoto>();
}

export function dbAddFoto(db: D1Database, sessaoId: number, cfImageId: string, ordem: number) {
  return db.prepare('INSERT INTO sessao_fotos (sessao_id, cloudflare_image_id, ordem) VALUES (?, ?, ?)').bind(sessaoId, cfImageId, ordem).run();
}

export function dbDeleteFoto(db: D1Database, fotoId: number, sessaoId: number) {
  return db.prepare('DELETE FROM sessao_fotos WHERE id = ? AND sessao_id = ?').bind(fotoId, sessaoId).run();
}

export function dbCountFotosBySessao(db: D1Database, sessaoId: number) {
  return db.prepare('SELECT COUNT(*) as count FROM sessao_fotos WHERE sessao_id = ?').bind(sessaoId).first<{ count: number }>();
}

// ─── Seleções ─────────────────────────────────────────────────────────────────

export interface SelecaoLote {
  id: number;
  sessao_id: number;
  criado_em: string;
  status: 'aguardando_selecao' | 'selecao_concluida' | 'entregue';
}

export function dbListLotesBySessao(db: D1Database, sessaoId: number) {
  return db.prepare('SELECT * FROM selecao_lotes WHERE sessao_id = ? ORDER BY criado_em ASC').bind(sessaoId).all<SelecaoLote>();
}

export function dbGetLoteById(db: D1Database, loteId: number) {
  return db.prepare('SELECT * FROM selecao_lotes WHERE id = ?').bind(loteId).first<SelecaoLote>();
}

export function dbGetActiveLoteBySessao(db: D1Database, sessaoId: number) {
  return db.prepare(
    "SELECT * FROM selecao_lotes WHERE sessao_id = ? AND status = 'aguardando_selecao' ORDER BY criado_em DESC LIMIT 1"
  ).bind(sessaoId).first<SelecaoLote>();
}

export function dbCreateLote(db: D1Database, sessaoId: number) {
  return db.prepare('INSERT INTO selecao_lotes (sessao_id) VALUES (?)').bind(sessaoId).run();
}

export function dbUpdateLoteStatus(db: D1Database, loteId: number, status: SelecaoLote['status']) {
  return db.prepare('UPDATE selecao_lotes SET status = ? WHERE id = ?').bind(status, loteId).run();
}

export interface Selecao {
  id: number;
  lote_id: number;
  foto_id: number;
  selecionada: number;
  comentario: string | null;
}

export interface SelecaoComFoto extends Selecao {
  cloudflare_image_id: string;
  ordem: number;
  entregue: number;
}

export function dbGetSelecoesByLote(db: D1Database, loteId: number) {
  return db.prepare(`
    SELECT sf.*, sel.selecionada, sel.comentario, sel.lote_id
    FROM sessao_fotos sf
    LEFT JOIN selecoes sel ON sel.foto_id = sf.id AND sel.lote_id = ?
    WHERE sf.sessao_id = (SELECT sessao_id FROM selecao_lotes WHERE id = ?)
    ORDER BY sf.ordem ASC
  `).bind(loteId, loteId).all<SelecaoComFoto>();
}

/** Fotos disponíveis para nova leva: apenas as ainda não entregues */
export function dbGetFotosDisponiveis(db: D1Database, sessaoId: number) {
  return db.prepare(
    'SELECT * FROM sessao_fotos WHERE sessao_id = ? AND entregue = 0 ORDER BY ordem ASC'
  ).bind(sessaoId).all<SessaoFoto>();
}

export function dbUpsertSelecao(
  db: D1Database,
  loteId: number,
  fotoId: number,
  selecionada: boolean,
  comentario: string,
) {
  return db.prepare(`
    INSERT INTO selecoes (lote_id, foto_id, selecionada, comentario)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(lote_id, foto_id) DO UPDATE SET
      selecionada = excluded.selecionada,
      comentario  = excluded.comentario
  `).bind(loteId, fotoId, selecionada ? 1 : 0, comentario || null).run();
}

/** Marca todas as fotos selecionadas de um lote como entregues */
export function dbMarkFotosEntregues(db: D1Database, loteId: number) {
  return db.prepare(`
    UPDATE sessao_fotos SET entregue = 1
    WHERE id IN (
      SELECT foto_id FROM selecoes WHERE lote_id = ? AND selecionada = 1
    )
  `).bind(loteId).run();
}
