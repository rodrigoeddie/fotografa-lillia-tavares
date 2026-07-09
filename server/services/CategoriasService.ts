import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  blog_categorias, portfolio_categorias,
  blog_posts, portfolio_works,
  type BlogCategoriaInsert, type PortfolioCategoriaInsert,
} from '~/server/db/schema';

export class CategoriasService {
  constructor(private db: ORM) {}

  // ─── Blog Categorias ──────────────────────────────────────────────────────

  listBlog(onlyAtivo = false) {
    const q = this.db.select().from(blog_categorias);
    return (onlyAtivo ? q.where(eq(blog_categorias.ativo, 1)) : q)
      .orderBy(asc(blog_categorias.ordem), asc(blog_categorias.titulo));
  }

  async getBlogById(id: number) {
    const [row] = await this.db.select().from(blog_categorias).where(eq(blog_categorias.id, id));
    return row ?? null;
  }

  async getBlogBySlug(slug: string) {
    const [row] = await this.db.select().from(blog_categorias).where(eq(blog_categorias.slug, slug));
    return row ?? null;
  }

  createBlog(data: Omit<BlogCategoriaInsert, 'id' | 'criado_em'>) {
    return this.db.insert(blog_categorias).values(data);
  }

  updateBlog(id: number, data: Partial<Omit<BlogCategoriaInsert, 'id' | 'criado_em'>>) {
    return this.db.update(blog_categorias).set(data).where(eq(blog_categorias.id, id));
  }

  deleteBlog(id: number) {
    return this.db.delete(blog_categorias).where(eq(blog_categorias.id, id));
  }

  /** Retorna posts que usam esta categoria (slug) */
  getPostsWithBlogCategoria(slug: string) {
    return this.db
      .select({ id: blog_posts.id, titulo: blog_posts.titulo, slug: blog_posts.slug })
      .from(blog_posts)
      .where(eq(blog_posts.categoria, slug));
  }

  // ─── Portfolio Categorias ─────────────────────────────────────────────────

  listPortfolio(onlyAtivo = false) {
    const q = this.db.select().from(portfolio_categorias);
    return (onlyAtivo ? q.where(eq(portfolio_categorias.ativo, 1)) : q)
      .orderBy(asc(portfolio_categorias.ordem), asc(portfolio_categorias.titulo));
  }

  async getPortfolioById(id: number) {
    const [row] = await this.db.select().from(portfolio_categorias).where(eq(portfolio_categorias.id, id));
    return row ?? null;
  }

  async getPortfolioBySlug(slug: string) {
    const [row] = await this.db.select().from(portfolio_categorias).where(eq(portfolio_categorias.slug, slug));
    return row ?? null;
  }

  createPortfolio(data: Omit<PortfolioCategoriaInsert, 'id' | 'criado_em'>) {
    return this.db.insert(portfolio_categorias).values(data);
  }

  updatePortfolio(id: number, data: Partial<Omit<PortfolioCategoriaInsert, 'id' | 'criado_em'>>) {
    return this.db.update(portfolio_categorias).set(data).where(eq(portfolio_categorias.id, id));
  }

  deletePortfolio(id: number) {
    return this.db.delete(portfolio_categorias).where(eq(portfolio_categorias.id, id));
  }

  /** Retorna works que usam esta categoria (slug) */
  getWorksWithPortfolioCategoria(slug: string) {
    return this.db
      .select({ id: portfolio_works.id, titulo: portfolio_works.titulo, slug: portfolio_works.slug })
      .from(portfolio_works)
      .where(eq(portfolio_works.categoria, slug));
  }
}
