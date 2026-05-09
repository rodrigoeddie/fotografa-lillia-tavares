import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { depoimentos, type DepoimentoInsert } from '~/server/db/schema';

export class DepoimentoService {
  constructor(private db: ORM) {}

  list() {
    return this.db.select().from(depoimentos).orderBy(asc(depoimentos.ordem));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(depoimentos).where(eq(depoimentos.id, id));
    return row ?? null;
  }

  create(data: Omit<DepoimentoInsert, 'id'>) {
    return this.db.insert(depoimentos).values(data);
  }

  update(id: number, data: Omit<DepoimentoInsert, 'id'>) {
    return this.db.update(depoimentos).set(data).where(eq(depoimentos.id, id));
  }

  delete(id: number) {
    return this.db.delete(depoimentos).where(eq(depoimentos.id, id));
  }

  setFeatured(id: number, featured: boolean) {
    return this.db.update(depoimentos).set({ featured: featured ? 1 : 0 }).where(eq(depoimentos.id, id));
  }
}
