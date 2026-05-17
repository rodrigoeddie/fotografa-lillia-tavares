import { eq, asc, inArray } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { page_faq, type PageFaqInsert } from '~/server/db/schema';

export class PageFaqService {
  constructor(private db: ORM) {}

  list() {
    return this.db.select().from(page_faq).orderBy(asc(page_faq.route));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(page_faq).where(eq(page_faq.id, id));
    return row ?? null;
  }

  async getByRoute(route: string) {
    const [row] = await this.db.select().from(page_faq).where(eq(page_faq.route, route));
    return row ?? null;
  }

  getBySlug(faq_slug: string) {
    return this.db.select().from(page_faq).where(eq(page_faq.faq_slug, faq_slug));
  }

  /** Substitui todas as rotas associadas a um slug (operação atômica via transação). */
  async setForSlug(faq_slug: string, routes: string[]) {
    await this.db.delete(page_faq).where(eq(page_faq.faq_slug, faq_slug));
    if (routes.length === 0) return;
    // Se uma rota já está em outro slug, remove antes de inserir (overwrite)
    await this.db.delete(page_faq).where(inArray(page_faq.route, routes));
    await this.db.insert(page_faq).values(routes.map((r) => ({ route: r, faq_slug })));
  }

  async create(data: Omit<PageFaqInsert, 'id' | 'criado_em'>) {
    const [row] = await this.db.insert(page_faq).values(data).returning();
    return row!;
  }

  async update(id: number, data: Partial<Omit<PageFaqInsert, 'id' | 'criado_em'>>) {
    const [row] = await this.db.update(page_faq).set(data).where(eq(page_faq.id, id)).returning();
    return row ?? null;
  }

  delete(id: number) {
    return this.db.delete(page_faq).where(eq(page_faq.id, id));
  }
}
