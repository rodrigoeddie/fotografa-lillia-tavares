import { eq } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { depoimentos, type DepoimentoInsert } from '~/server/db/schema';

const LIST_SQL = `
  SELECT
    d.id, d.nome, d.foto_cf_id, d.rating, d.data, d.texto, d.link,
    d.featured, d.portfolio_link, d.ordem,
    pw.slug      AS portfolio_slug,
    pw.categoria AS portfolio_categoria,
    pw.titulo    AS portfolio_titulo,
    (
      SELECT pf.cf_image_id
      FROM portfolio_fotos pf
      WHERE pf.work_id = pw.id
      ORDER BY pf.highlight DESC, pf.can_be_thumb DESC, pf.ordem ASC
      LIMIT 1
    ) AS portfolio_foto_cf_id
  FROM depoimentos d
  LEFT JOIN portfolio_works pw
    ON pw.categoria || '/' || pw.slug = d.portfolio_link
    AND d.portfolio_link IS NOT NULL
    AND d.portfolio_link != ''
  ORDER BY d.ordem ASC
`;

export class DepoimentoService {
  constructor(private db: ORM, private d1?: D1Database) {}

  list(): Promise<Record<string, unknown>[]> {
    if (!this.d1) throw new Error('D1 binding required for DepoimentoService.list()');
    return this.d1.prepare(LIST_SQL).all().then(r => r.results as Record<string, unknown>[]);
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

  async reorder(items: { id: number; ordem: number }[]) {
    await Promise.all(
      items.map(({ id, ordem }) =>
        this.db.update(depoimentos).set({ ordem }).where(eq(depoimentos.id, id))
      )
    );
  }
}
