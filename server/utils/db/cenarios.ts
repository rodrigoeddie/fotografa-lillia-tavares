export interface CenarioPagina {
  id: number;
  slug: string;
  titulo: string;
  titulo_pre: string | null;
  ordem: number;
}

export interface Cenario {
  id: number;
  pagina_id: number;
  titulo: string;
  descricao: string | null;
  imagem_bg_cf_id: string | null;
  imagem_exemplo_cf_id: string | null;
  imagem_exemplo_alt: string | null;
  imagem_exemplo_link: string | null;
  imagem_exemplo_titulo: string | null;
  imagem_exemplo_orientacao: string | null;
  ordem: number;
}

export function dbListCenarioPaginas(db: D1Database) {
  return db.prepare('SELECT * FROM cenario_paginas ORDER BY ordem ASC').all<CenarioPagina>();
}

export function dbGetCenarioPaginaBySlug(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM cenario_paginas WHERE slug = ?').bind(slug).first<CenarioPagina>();
}

export function dbGetCenarioPaginaById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM cenario_paginas WHERE id = ?').bind(id).first<CenarioPagina>();
}

export function dbListCenariosByPagina(db: D1Database, paginaId: number) {
  return db.prepare('SELECT * FROM cenarios WHERE pagina_id = ? ORDER BY ordem ASC').bind(paginaId).all<Cenario>();
}

export function dbGetCenarioById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM cenarios WHERE id = ?').bind(id).first<Cenario>();
}

export function dbCreateCenarioPagina(db: D1Database, slug: string, titulo: string, tituloPreText: string | null, ordem: number) {
  return db.prepare('INSERT INTO cenario_paginas (slug,titulo,titulo_pre,ordem) VALUES (?,?,?,?)').bind(slug, titulo, tituloPreText, ordem).run();
}

export function dbUpdateCenarioPagina(db: D1Database, id: number, slug: string, titulo: string, tituloPreText: string | null, ordem: number) {
  return db.prepare('UPDATE cenario_paginas SET slug=?,titulo=?,titulo_pre=?,ordem=? WHERE id=?').bind(slug, titulo, tituloPreText, ordem, id).run();
}

export function dbDeleteCenarioPagina(db: D1Database, id: number) {
  return db.prepare('DELETE FROM cenario_paginas WHERE id = ?').bind(id).run();
}

export function dbCreateCenario(db: D1Database, data: Omit<Cenario, 'id'>) {
  return db.prepare(
    'INSERT INTO cenarios (pagina_id,titulo,descricao,imagem_bg_cf_id,imagem_exemplo_cf_id,imagem_exemplo_alt,imagem_exemplo_link,imagem_exemplo_titulo,imagem_exemplo_orientacao,ordem) VALUES (?,?,?,?,?,?,?,?,?,?)',
  ).bind(data.pagina_id, data.titulo, data.descricao, data.imagem_bg_cf_id, data.imagem_exemplo_cf_id, data.imagem_exemplo_alt, data.imagem_exemplo_link, data.imagem_exemplo_titulo, data.imagem_exemplo_orientacao, data.ordem).run();
}

export function dbUpdateCenario(db: D1Database, id: number, data: Omit<Cenario, 'id'>) {
  return db.prepare(
    'UPDATE cenarios SET pagina_id=?,titulo=?,descricao=?,imagem_bg_cf_id=?,imagem_exemplo_cf_id=?,imagem_exemplo_alt=?,imagem_exemplo_link=?,imagem_exemplo_titulo=?,imagem_exemplo_orientacao=?,ordem=? WHERE id=?',
  ).bind(data.pagina_id, data.titulo, data.descricao, data.imagem_bg_cf_id, data.imagem_exemplo_cf_id, data.imagem_exemplo_alt, data.imagem_exemplo_link, data.imagem_exemplo_titulo, data.imagem_exemplo_orientacao, data.ordem, id).run();
}

export function dbDeleteCenario(db: D1Database, id: number) {
  return db.prepare('DELETE FROM cenarios WHERE id = ?').bind(id).run();
}
