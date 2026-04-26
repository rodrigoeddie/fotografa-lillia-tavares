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

// ─── Produtos ─────────────────────────────────────────────────────────────────

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

// ─── Depoimentos ─────────────────────────────────────────────────────────────

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

// ─── FAQ ──────────────────────────────────────────────────────────────────────

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

// ─── Blog ─────────────────────────────────────────────────────────────────────

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

// ─── Menu ─────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: number;
  label: string;
  path: string;
  ordem: number;
}

export function dbListMenu(db: D1Database) {
  return db.prepare('SELECT * FROM menu_items ORDER BY ordem ASC').all<MenuItem>();
}

export async function dbReplaceMenu(db: D1Database, items: { label: string; path: string }[]) {
  const stmts = [
    db.prepare('DELETE FROM menu_items'),
    ...items.map((item, idx) =>
      db.prepare('INSERT INTO menu_items (label, path, ordem) VALUES (?, ?, ?)').bind(item.label, item.path, idx),
    ),
  ];
  return db.batch(stmts);
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

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

// ─── Cenários ─────────────────────────────────────────────────────────────────

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
