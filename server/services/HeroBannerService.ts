import { eq, asc, inArray, sql } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { hero_banners, hero_banner_pages, type HeroBannerInsert } from '~/server/db/schema';

export class HeroBannerService {
  constructor(private db: ORM) {}

  // ── Banners ───────────────────────────────────────────────

  listBanners() {
    return this.db.select().from(hero_banners).orderBy(asc(hero_banners.ordem), asc(hero_banners.id));
  }

  async getBannerById(id: number) {
    const [row] = await this.db.select().from(hero_banners).where(eq(hero_banners.id, id));
    return row ?? null;
  }

  async nextOrdem() {
    const [row] = await this.db
      .select({ next: sql<number>`COALESCE(MAX(${hero_banners.ordem}), 0) + 1` })
      .from(hero_banners);
    return row?.next ?? 1;
  }

  async createBanner(data: Omit<HeroBannerInsert, 'id' | 'criado_em'>) {
    const [row] = await this.db.insert(hero_banners).values(data).returning();
    return row!;
  }

  async updateBanner(id: number, data: Partial<Omit<HeroBannerInsert, 'id' | 'criado_em'>>) {
    const [row] = await this.db.update(hero_banners).set(data).where(eq(hero_banners.id, id)).returning();
    return row ?? null;
  }

  deleteBanner(id: number) {
    return this.db.delete(hero_banners).where(eq(hero_banners.id, id));
  }

  // ── Páginas associadas ────────────────────────────────────

  getPagesByBanner(bannerId: number) {
    return this.db
      .select({ route: hero_banner_pages.route })
      .from(hero_banner_pages)
      .where(eq(hero_banner_pages.banner_id, bannerId));
  }

  /** Substitui todas as rotas de um banner atomicamente. */
  async setPages(bannerId: number, routes: string[]) {
    await this.db.delete(hero_banner_pages).where(eq(hero_banner_pages.banner_id, bannerId));
    if (routes.length === 0) return;
    await this.db
      .insert(hero_banner_pages)
      .values(routes.map((route) => ({ banner_id: bannerId, route })));
  }

  /** Carrega banner + rotas de uma só vez. */
  async getBannerWithPages(id: number) {
    const banner = await this.getBannerById(id);
    if (!banner) return null;
    const pages = await this.getPagesByBanner(id);
    return { ...banner, routes: pages.map((p) => p.route) };
  }

  /** Lista todos os banners com suas rotas. */
  async listWithPages() {
    const banners = await this.listBanners();
    return Promise.all(
      banners.map(async (b) => {
        const pages = await this.getPagesByBanner(b.id);
        return { ...b, routes: pages.map((p) => p.route) };
      }),
    );
  }

  /** Retorna os banners ativos para uma rota específica. */
  async getBannersForRoute(route: string) {
    const rows = await this.db
      .select({ banner_id: hero_banner_pages.banner_id })
      .from(hero_banner_pages)
      .where(eq(hero_banner_pages.route, route));
    if (rows.length === 0) return [];
    const ids = rows.map((r) => r.banner_id);
    return this.db
      .select()
      .from(hero_banners)
      .where(inArray(hero_banners.id, ids))
      .orderBy(asc(hero_banners.ordem));
  }
}
