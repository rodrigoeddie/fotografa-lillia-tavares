export interface Depoimento {
  id: number;
  nome: string;
  foto_cf_id: string | null;
  rating: number;
  data: string | null;
  texto: string;
  link: string | null;
  featured: number;
  portfolio_link: string | null;
  ordem: number;
}

export function dbListDepoimentos(db: D1Database) {
  return db.prepare('SELECT * FROM depoimentos ORDER BY ordem ASC').all<Depoimento>();
}

export function dbGetDepoimentoById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM depoimentos WHERE id = ?').bind(id).first<Depoimento>();
}

export function dbCreateDepoimento(db: D1Database, data: Omit<Depoimento, 'id'>) {
  return db.prepare(
    'INSERT INTO depoimentos (nome,foto_cf_id,rating,data,texto,link,featured,portfolio_link,ordem) VALUES (?,?,?,?,?,?,?,?,?)',
  ).bind(data.nome, data.foto_cf_id, data.rating, data.data, data.texto, data.link, data.featured, data.portfolio_link, data.ordem).run();
}

export function dbUpdateDepoimento(db: D1Database, id: number, data: Omit<Depoimento, 'id'>) {
  return db.prepare(
    'UPDATE depoimentos SET nome=?,foto_cf_id=?,rating=?,data=?,texto=?,link=?,featured=?,portfolio_link=?,ordem=? WHERE id=?',
  ).bind(data.nome, data.foto_cf_id, data.rating, data.data, data.texto, data.link, data.featured, data.portfolio_link, data.ordem, id).run();
}

export function dbDeleteDepoimento(db: D1Database, id: number) {
  return db.prepare('DELETE FROM depoimentos WHERE id = ?').bind(id).run();
}
