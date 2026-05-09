import { eq, and, desc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { blog_posts, type BlogPostInsert } from '~/server/db/schema';

export class BlogService {
  constructor(private db: ORM) {}

  list(onlyAtivo = false) {
    const q = this.db.select().from(blog_posts);
    return (onlyAtivo
      ? q.where(eq(blog_posts.ativo, 1))
      : q).orderBy(desc(blog_posts.data), desc(blog_posts.criado_em));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(blog_posts).where(eq(blog_posts.id, id));
    return row ?? null;
  }

  async getBySlug(slug: string) {
    const [row] = await this.db.select().from(blog_posts).where(eq(blog_posts.slug, slug));
    return row ?? null;
  }

  async getBySlugAndCategoria(slug: string, categoria: string) {
    const [row] = await this.db
      .select()
      .from(blog_posts)
      .where(and(eq(blog_posts.slug, slug), eq(blog_posts.categoria, categoria)));
    return row ?? null;
  }

  create(data: Omit<BlogPostInsert, 'id' | 'criado_em'>) {
    return this.db.insert(blog_posts).values(data);
  }

  update(id: number, data: Omit<BlogPostInsert, 'id' | 'criado_em'>) {
    return this.db.update(blog_posts).set(data).where(eq(blog_posts.id, id));
  }

  delete(id: number) {
    return this.db.delete(blog_posts).where(eq(blog_posts.id, id));
  }

  setAtivo(id: number, ativo: boolean) {
    return this.db.update(blog_posts).set({ ativo: ativo ? 1 : 0 }).where(eq(blog_posts.id, id));
  }
}
