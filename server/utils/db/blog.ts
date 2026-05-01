export interface BlogPost {
  id: number;
  slug: string;
  categoria: string;
  titulo: string;
  descricao: string | null;
  data: string | null;
  imagem_cf_id: string | null;
  conteudo: string | null;
  conteudo_imagens: string | null; // JSON
  album: string | null; // JSON
  ativo: number;
  seo_keywords: string | null; // JSON
  criado_em: string;
}

export function dbListBlogPosts(db: D1Database, onlyAtivo = false) {
  const where = onlyAtivo ? 'WHERE ativo = 1' : '';
  return db.prepare(`SELECT * FROM blog_posts ${where} ORDER BY data DESC, criado_em DESC`).all<BlogPost>();
}

export function dbGetBlogPostBySlug(db: D1Database, slug: string) {
  return db.prepare('SELECT * FROM blog_posts WHERE slug = ?').bind(slug).first<BlogPost>();
}

export function dbGetBlogPostById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM blog_posts WHERE id = ?').bind(id).first<BlogPost>();
}

export function dbCreateBlogPost(db: D1Database, data: Omit<BlogPost, 'id' | 'criado_em'>) {
  return db.prepare(
    'INSERT INTO blog_posts (slug,categoria,titulo,descricao,data,imagem_cf_id,conteudo,conteudo_imagens,album,ativo,seo_keywords) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
  ).bind(data.slug, data.categoria, data.titulo, data.descricao, data.data, data.imagem_cf_id, data.conteudo, data.conteudo_imagens, data.album, data.ativo, data.seo_keywords).run();
}

export function dbUpdateBlogPost(db: D1Database, id: number, data: Omit<BlogPost, 'id' | 'criado_em'>) {
  return db.prepare(
    'UPDATE blog_posts SET slug=?,categoria=?,titulo=?,descricao=?,data=?,imagem_cf_id=?,conteudo=?,conteudo_imagens=?,album=?,ativo=?,seo_keywords=? WHERE id=?',
  ).bind(data.slug, data.categoria, data.titulo, data.descricao, data.data, data.imagem_cf_id, data.conteudo, data.conteudo_imagens, data.album, data.ativo, data.seo_keywords, id).run();
}

export function dbDeleteBlogPost(db: D1Database, id: number) {
  return db.prepare('DELETE FROM blog_posts WHERE id = ?').bind(id).run();
}
