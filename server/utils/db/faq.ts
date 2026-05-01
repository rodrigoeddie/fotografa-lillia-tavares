export interface FaqCategoria {
  id: number;
  titulo: string;
  slug: string;
  ordem: number;
}

export interface FaqPergunta {
  id: number;
  categoria_id: number;
  pergunta: string;
  resposta: string;
  ordem: number;
}

export function dbListFaqCategorias(db: D1Database) {
  return db.prepare('SELECT * FROM faq_categorias ORDER BY ordem ASC').all<FaqCategoria>();
}

export function dbGetFaqCategoriaById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM faq_categorias WHERE id = ?').bind(id).first<FaqCategoria>();
}

export function dbListFaqPerguntasByCategoria(db: D1Database, catId: number) {
  return db.prepare('SELECT * FROM faq_perguntas WHERE categoria_id = ? ORDER BY ordem ASC').bind(catId).all<FaqPergunta>();
}

export function dbListAllFaqWithPerguntas(db: D1Database) {
  return db.prepare(`
    SELECT c.id AS cat_id, c.titulo AS cat_titulo, c.slug AS cat_slug, c.ordem AS cat_ordem,
           p.id AS perg_id, p.pergunta, p.resposta, p.ordem AS perg_ordem
    FROM faq_categorias c
    LEFT JOIN faq_perguntas p ON p.categoria_id = c.id
    ORDER BY c.ordem ASC, p.ordem ASC
  `).all<FaqCategoria & { cat_id: number; cat_titulo: string; cat_slug: string; cat_ordem: number; perg_id: number; pergunta: string; resposta: string; perg_ordem: number }>();
}

export function dbCreateFaqCategoria(db: D1Database, titulo: string, slug: string, ordem: number) {
  return db.prepare('INSERT INTO faq_categorias (titulo,slug,ordem) VALUES (?,?,?)').bind(titulo, slug, ordem).run();
}

export function dbUpdateFaqCategoria(db: D1Database, id: number, titulo: string, slug: string, ordem: number) {
  return db.prepare('UPDATE faq_categorias SET titulo=?,slug=?,ordem=? WHERE id=?').bind(titulo, slug, ordem, id).run();
}

export function dbDeleteFaqCategoria(db: D1Database, id: number) {
  return db.prepare('DELETE FROM faq_categorias WHERE id = ?').bind(id).run();
}

export function dbGetFaqPerguntaById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM faq_perguntas WHERE id = ?').bind(id).first<FaqPergunta>();
}

export function dbCreateFaqPergunta(db: D1Database, catId: number, pergunta: string, resposta: string, ordem: number) {
  return db.prepare('INSERT INTO faq_perguntas (categoria_id,pergunta,resposta,ordem) VALUES (?,?,?,?)').bind(catId, pergunta, resposta, ordem).run();
}

export function dbUpdateFaqPergunta(db: D1Database, id: number, pergunta: string, resposta: string, ordem: number) {
  return db.prepare('UPDATE faq_perguntas SET pergunta=?,resposta=?,ordem=? WHERE id=?').bind(pergunta, resposta, ordem, id).run();
}

export function dbDeleteFaqPergunta(db: D1Database, id: number) {
  return db.prepare('DELETE FROM faq_perguntas WHERE id = ?').bind(id).run();
}
