import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  portfolio_works,
  portfolio_fotos,
  type PortfolioWorkInsert,
  type PortfolioFotoInsert,
} from '~/server/db/schema';

export class PortfolioService {
  constructor(private db: ORM) {}

  // ── Works ─────────────────────────────────────────────────

  list(onlyAtivo = false) {
    const q = this.db.select().from(portfolio_works);
    return (onlyAtivo
      ? q.where(eq(portfolio_works.ativo, 1))
      : q).orderBy(asc(portfolio_works.ordem));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(portfolio_works).where(eq(portfolio_works.id, id));
    return row ?? null;
  }

  async getBySlug(slug: string) {
    const [row] = await this.db.select().from(portfolio_works).where(eq(portfolio_works.slug, slug));
    return row ?? null;
  }

  create(data: Omit<PortfolioWorkInsert, 'id'>) {
    return this.db.insert(portfolio_works).values(data);
  }

  update(id: number, data: Omit<PortfolioWorkInsert, 'id'>) {
    return this.db.update(portfolio_works).set(data).where(eq(portfolio_works.id, id));
  }

  delete(id: number) {
    return this.db.delete(portfolio_works).where(eq(portfolio_works.id, id));
  }

  setAtivo(id: number, ativo: boolean) {
    return this.db.update(portfolio_works).set({ ativo: ativo ? 1 : 0 }).where(eq(portfolio_works.id, id));
  }

  setHome(id: number, home: boolean) {
    return this.db.update(portfolio_works).set({ home: home ? 1 : 0 }).where(eq(portfolio_works.id, id));
  }

  setOrdem(id: number, ordem: number) {
    return this.db.update(portfolio_works).set({ ordem }).where(eq(portfolio_works.id, id));
  }

  // ── Fotos ─────────────────────────────────────────────────

  listAllThumbs() {
    return this.db
      .select({
        id: portfolio_fotos.id,
        work_id: portfolio_fotos.work_id,
        cf_image_id: portfolio_fotos.cf_image_id,
        width: portfolio_fotos.width,
        height: portfolio_fotos.height,
      })
      .from(portfolio_fotos)
      .where(eq(portfolio_fotos.can_be_thumb, 1))
      .orderBy(asc(portfolio_fotos.ordem));
  }

  setFotoCanBeThumb(fotoId: number, value: boolean) {
    return this.db
      .update(portfolio_fotos)
      .set({ can_be_thumb: value ? 1 : 0 })
      .where(eq(portfolio_fotos.id, fotoId));
  }

  listFotosByWork(workId: number) {
    return this.db
      .select()
      .from(portfolio_fotos)
      .where(eq(portfolio_fotos.work_id, workId))
      .orderBy(asc(portfolio_fotos.ordem));
  }

  createFoto(data: Omit<PortfolioFotoInsert, 'id'>) {
    return this.db.insert(portfolio_fotos).values(data);
  }

  deleteFotosByWork(workId: number) {
    return this.db.delete(portfolio_fotos).where(eq(portfolio_fotos.work_id, workId));
  }
}
