import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { landing_pages, lp_blocks, type LandingPageInsert } from '~/server/db/schema';
import { BlockSchema, BlocksReplaceSchema, type LpBlock, type LandingPageInput } from '~/shared/schemas/landing-page';
import { PageSeoService } from './PageSeoService';

export class LandingPageService {
  constructor(private db: ORM) {}

  list() {
    return this.db.select().from(landing_pages).orderBy(asc(landing_pages.ordem));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(landing_pages).where(eq(landing_pages.id, id));
    return row ?? null;
  }

  async getBySlug(slug: string) {
    const [row] = await this.db.select().from(landing_pages).where(eq(landing_pages.slug, slug));
    return row ?? null;
  }

  create(input: LandingPageInput): Promise<{ id: number }> {
    return this.db
      .insert(landing_pages)
      .values({
        slug:      input.slug,
        rota:      input.rota,
        titulo:    input.titulo,
        descricao: input.descricao ?? null,
        lp_class:  input.lp_class ?? null,
        ativo:     input.ativo ? 1 : 0,
        ordem:     input.ordem,
      })
      .then((r) => ({ id: r.meta.last_row_id as number }));
  }

  update(id: number, input: LandingPageInput) {
    return this.db
      .update(landing_pages)
      .set({
        slug:          input.slug,
        rota:          input.rota,
        titulo:        input.titulo,
        descricao:     input.descricao ?? null,
        lp_class:      input.lp_class ?? null,
        ativo:         input.ativo ? 1 : 0,
        ordem:         input.ordem,
        atualizado_em: new Date().toISOString(),
      })
      .where(eq(landing_pages.id, id));
  }

  delete(id: number) {
    return this.db.delete(landing_pages).where(eq(landing_pages.id, id));
  }

  setOrdem(id: number, ordem: number) {
    return this.db.update(landing_pages).set({ ordem }).where(eq(landing_pages.id, id));
  }

  // ── Blocks ────────────────────────────────────────────────

  listBlocks(lpId: number) {
    return this.db.select().from(lp_blocks).where(eq(lp_blocks.lp_id, lpId)).orderBy(asc(lp_blocks.ordem));
  }

  /** Substitui todos os blocks de uma LP (delete + insert atômico via batch). */
  async replaceBlocks(lpId: number, blocks: LpBlock[]) {
    BlocksReplaceSchema.parse(blocks);
    const inserts = blocks.map((b) =>
      this.db.insert(lp_blocks).values({
        lp_id: lpId,
        tipo:  b.tipo,
        ordem: b.ordem,
        dados: JSON.stringify(b.dados),
      }),
    );
    return this.db.batch([
      this.db.delete(lp_blocks).where(eq(lp_blocks.lp_id, lpId)),
      ...inserts,
    ] as any);
  }

  // ── Composição: LP + blocks parseados + page_seo ──────────

  async getRendered(slug: string) {
    const lp = await this.getBySlug(slug);
    if (!lp || lp.ativo !== 1) return null;

    const rows = await this.listBlocks(lp.id);
    const blocks: LpBlock[] = rows
      .map((r) => {
        try {
          return BlockSchema.parse({
            tipo:  r.tipo,
            ordem: r.ordem,
            dados: JSON.parse(r.dados),
          });
        } catch {
          return null;
        }
      })
      .filter((b): b is LpBlock => b !== null);

    const pageSeo = await new PageSeoService(this.db).getForEntity('lp', lp.id);

    return { landingPage: lp, blocks, pageSeo };
  }
}
