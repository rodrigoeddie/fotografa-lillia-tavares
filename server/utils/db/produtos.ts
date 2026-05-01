export interface Produto {
  id: number;
  slug: string;
  icon: string | null;
  title: string;
  description: string | null;
  lp_slug: string | null;
  includes: string | null; // JSON
  cta_title: string | null;
  cta_description: string | null;
  cta_whatsapp_msg: string | null;
  active: number;
  ordem: number;
}

export interface Pacote {
  id: number;
  produto_id: number;
  title: string;
  subtitle: string | null;
  preco: number;
  num_parcelas: number;
  preco_parcelas: number | null;
  fotos_incluidas: number;
  preco_foto_extra: number;
  features: string | null; // JSON
  is_recommended: number;
  ordem: number;
}

export function dbListProdutos(db: D1Database) {
  return db.prepare('SELECT * FROM produtos ORDER BY ordem ASC').all<Produto>();
}

export function dbGetProdutoById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM produtos WHERE id = ?').bind(id).first<Produto>();
}

export function dbGetProdutoBySlug(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM produtos WHERE slug = ?').bind(slug).first<Produto>();
}

export function dbListPacotesByProduto(db: D1Database, produtoId: number) {
  return db.prepare('SELECT * FROM pacotes WHERE produto_id = ? ORDER BY ordem ASC').bind(produtoId).all<Pacote>();
}

export function dbCreateProduto(db: D1Database, data: Omit<Produto, 'id'>) {
  return db.prepare(
    'INSERT INTO produtos (slug,title,description,lp_slug,icon,includes,cta_title,cta_description,cta_whatsapp_msg,active,ordem) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
  ).bind(data.slug, data.title, data.description, data.lp_slug, data.icon, data.includes, data.cta_title, data.cta_description, data.cta_whatsapp_msg, data.active, data.ordem).run();
}

export function dbUpdateProduto(db: D1Database, id: number, data: Omit<Produto, 'id'>) {
  return db.prepare(
    'UPDATE produtos SET slug=?,title=?,description=?,lp_slug=?,icon=?,includes=?,cta_title=?,cta_description=?,cta_whatsapp_msg=?,active=?,ordem=? WHERE id=?',
  ).bind(data.slug, data.title, data.description, data.lp_slug, data.icon, data.includes, data.cta_title, data.cta_description, data.cta_whatsapp_msg, data.active, data.ordem, id).run();
}

export function dbDeleteProduto(db: D1Database, id: number) {
  return db.prepare('DELETE FROM produtos WHERE id = ?').bind(id).run();
}

export function dbDeletePacotesByProduto(db: D1Database, produtoId: number) {
  return db.prepare('DELETE FROM pacotes WHERE produto_id = ?').bind(produtoId).run();
}

export function dbCreatePacote(db: D1Database, data: Omit<Pacote, 'id'>) {
  return db.prepare(
    'INSERT INTO pacotes (produto_id,title,subtitle,preco,num_parcelas,preco_parcelas,fotos_incluidas,preco_foto_extra,features,is_recommended,ordem) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
  ).bind(data.produto_id, data.title, data.subtitle, data.preco, data.num_parcelas, data.preco_parcelas, data.fotos_incluidas, data.preco_foto_extra, data.features, data.is_recommended, data.ordem).run();
}
