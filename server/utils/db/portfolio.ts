export interface PortfolioWork {
  id: number;
  slug: string;
  categoria: string;
  titulo: string | null;
  descricao: string | null;
  artigo: string | null;
  data: string | null;
  local: string | null;
  depoimento_texto: string | null;
  depoimento_avatar: string | null;
  depoimento_link: string | null;
  cor_destaque: string | null;
  home: number;
  home_order: number;
  video: string | null;
  instagram_uri: string | null;
  instagram_title: string | null;
  site: string | null;
  ativo: number;
  ordem: number;
  seo_keywords: string | null; // JSON
}

export interface PortfolioFoto {
  id: number;
  work_id: number;
  cf_image_id: string;
  width: number | null;
  height: number | null;
  formato: string | null;
  custom_class: string | null;
  alt: string | null;
  highlight: number;
  can_be_thumb: number;
  ordem: number;
}

export function dbListPortfolioWorks(db: D1Database, onlyAtivo = false) {
  const where = onlyAtivo ? 'WHERE ativo = 1' : '';
  return db.prepare(`SELECT * FROM portfolio_works ${where} ORDER BY ordem ASC`).all<PortfolioWork>();
}

export function dbGetPortfolioWorkBySlug(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM portfolio_works WHERE slug = ?').bind(slug).first<PortfolioWork>();
}

export function dbGetPortfolioWorkById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM portfolio_works WHERE id = ?').bind(id).first<PortfolioWork>();
}

export function dbListPortfolioFotosByWork(db: D1Database, workId: number) {
  return db.prepare('SELECT * FROM portfolio_fotos WHERE work_id = ? ORDER BY ordem ASC').bind(workId).all<PortfolioFoto>();
}

export function dbCreatePortfolioWork(db: D1Database, data: Omit<PortfolioWork, 'id'>) {
  return db.prepare(
    'INSERT INTO portfolio_works (slug,categoria,titulo,descricao,artigo,data,local,depoimento_texto,depoimento_avatar,depoimento_link,cor_destaque,home,home_order,video,instagram_uri,instagram_title,site,ativo,ordem,seo_keywords) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
  ).bind(data.slug, data.categoria, data.titulo, data.descricao, data.artigo, data.data, data.local, data.depoimento_texto, data.depoimento_avatar, data.depoimento_link, data.cor_destaque, data.home, data.home_order, data.video, data.instagram_uri, data.instagram_title, data.site, data.ativo, data.ordem, data.seo_keywords).run();
}

export function dbUpdatePortfolioWork(db: D1Database, id: number, data: Omit<PortfolioWork, 'id'>) {
  return db.prepare(
    'UPDATE portfolio_works SET slug=?,categoria=?,titulo=?,descricao=?,artigo=?,data=?,local=?,depoimento_texto=?,depoimento_avatar=?,depoimento_link=?,cor_destaque=?,home=?,home_order=?,video=?,instagram_uri=?,instagram_title=?,site=?,ativo=?,ordem=?,seo_keywords=? WHERE id=?',
  ).bind(data.slug, data.categoria, data.titulo, data.descricao, data.artigo, data.data, data.local, data.depoimento_texto, data.depoimento_avatar, data.depoimento_link, data.cor_destaque, data.home, data.home_order, data.video, data.instagram_uri, data.instagram_title, data.site, data.ativo, data.ordem, data.seo_keywords, id).run();
}

export function dbDeletePortfolioWork(db: D1Database, id: number) {
  return db.prepare('DELETE FROM portfolio_works WHERE id = ?').bind(id).run();
}

export function dbDeletePortfolioFotosByWork(db: D1Database, workId: number) {
  return db.prepare('DELETE FROM portfolio_fotos WHERE work_id = ?').bind(workId).run();
}

export function dbCreatePortfolioFoto(db: D1Database, data: Omit<PortfolioFoto, 'id'>) {
  return db.prepare(
    'INSERT INTO portfolio_fotos (work_id,cf_image_id,width,height,formato,custom_class,alt,highlight,can_be_thumb,ordem) VALUES (?,?,?,?,?,?,?,?,?,?)',
  ).bind(data.work_id, data.cf_image_id, data.width, data.height, data.formato, data.custom_class, data.alt, data.highlight, data.can_be_thumb, data.ordem).run();
}
