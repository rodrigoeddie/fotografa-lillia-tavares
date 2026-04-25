import { createError, type H3Event } from 'h3';

/**
 * Retorna o binding D1 do Cloudflare Workers.
 * Em desenvolvimento local (nitro-cloudflare-dev), o binding é simulado.
 */
export function getDB(event: H3Event): D1Database {
  const cf = (event.context as any).cloudflare;
  const db = cf?.env?.DB;
  if (!db) {
    throw createError({ statusCode: 500, statusMessage: 'D1 binding DB não disponível' });
  }
  return db as D1Database;
}

// ─── Clientes ────────────────────────────────────────────────────────────────

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
  criado_em: string;
}

export function dbGetClienteByEmail(db: D1Database, email: string) {
  return db.prepare('SELECT * FROM clientes WHERE email = ?').bind(email).first<Cliente>();
}

export function dbGetClienteById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM clientes WHERE id = ?').bind(id).first<Cliente>();
}

export function dbListClientes(db: D1Database) {
  return db.prepare('SELECT id, nome, email, criado_em FROM clientes ORDER BY nome ASC').all<Omit<Cliente, 'senha_hash'>>();
}

export function dbCreateCliente(db: D1Database, nome: string, email: string, senhaHash: string) {
  return db.prepare('INSERT INTO clientes (nome, email, senha_hash) VALUES (?, ?, ?)').bind(nome, email, senhaHash).run();
}

export function dbUpdateCliente(db: D1Database, id: number, nome: string, email: string) {
  return db.prepare('UPDATE clientes SET nome = ?, email = ? WHERE id = ?').bind(nome, email, id).run();
}

export function dbUpdateClienteSenha(db: D1Database, id: number, senhaHash: string) {
  return db.prepare('UPDATE clientes SET senha_hash = ? WHERE id = ?').bind(senhaHash, id).run();
}

export function dbDeleteCliente(db: D1Database, id: number) {
  return db.prepare('DELETE FROM clientes WHERE id = ?').bind(id).run();
}

// ─── Sessoes ─────────────────────────────────────────────────────────────────

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
}

export function dbListSessoes(db: D1Database) {
  return db.prepare(`
    SELECT s.*, c.nome AS cliente_nome, c.email AS cliente_email
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

// ─── Sessao Fotos ─────────────────────────────────────────────────────────────

export interface SessaoFoto {
  id: number;
  sessao_id: number;
  cloudflare_image_id: string;
  ordem: number;
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

// ─── Selecoes ─────────────────────────────────────────────────────────────────

export interface Selecao {
  id: number;
  sessao_id: number;
  foto_id: number;
  selecionada: number;
  comentario: string | null;
}

export interface SelecaoComFoto extends Selecao {
  cloudflare_image_id: string;
  ordem: number;
}

export function dbGetSelecoesBySessao(db: D1Database, sessaoId: number) {
  return db.prepare(`
    SELECT sf.*, sel.selecionada, sel.comentario
    FROM sessao_fotos sf
    LEFT JOIN selecoes sel ON sel.foto_id = sf.id AND sel.sessao_id = sf.sessao_id
    WHERE sf.sessao_id = ?
    ORDER BY sf.ordem ASC
  `).bind(sessaoId).all<SelecaoComFoto>();
}

export function dbUpsertSelecao(
  db: D1Database,
  sessaoId: number,
  fotoId: number,
  selecionada: boolean,
  comentario: string,
) {
  return db.prepare(`
    INSERT INTO selecoes (sessao_id, foto_id, selecionada, comentario)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(sessao_id, foto_id) DO UPDATE SET
      selecionada = excluded.selecionada,
      comentario = excluded.comentario
  `).bind(sessaoId, fotoId, selecionada ? 1 : 0, comentario || null).run();
}

// ─── Entregas ─────────────────────────────────────────────────────────────────

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
