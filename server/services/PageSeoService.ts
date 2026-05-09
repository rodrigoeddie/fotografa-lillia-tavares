import { eq, and, desc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { page_seo, type PageSeoInsert } from '~/server/db/schema';
import type { EntityType, PageSeoInput } from '~/shared/schemas/seo';

export class PageSeoService {
  constructor(private db: ORM) {}

  async getForEntity(entityType: EntityType, entityId: number) {
    const [row] = await this.db
      .select()
      .from(page_seo)
      .where(and(eq(page_seo.entity_type, entityType), eq(page_seo.entity_id, entityId)));
    return row ?? null;
  }

  async getForRoute(route: string) {
    const [row] = await this.db
      .select()
      .from(page_seo)
      .where(and(eq(page_seo.entity_type, 'static'), eq(page_seo.route, route)));
    return row ?? null;
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(page_seo).where(eq(page_seo.id, id));
    return row ?? null;
  }

  list(entityType?: EntityType) {
    if (entityType) {
      return this.db.select().from(page_seo).where(eq(page_seo.entity_type, entityType)).orderBy(desc(page_seo.score));
    }
    return this.db.select().from(page_seo).orderBy(desc(page_seo.score));
  }

  /** Cria ou atualiza o SEO de uma entidade. Para 'static' usa `route`. */
  async upsert(input: PageSeoInput) {
    const base: Partial<PageSeoInsert> = {
      focus_keyword:        input.focus_keyword ?? null,
      keywords:             input.keywords ? JSON.stringify(input.keywords) : null,
      meta_title:           input.meta_title ?? null,
      meta_description:     input.meta_description ?? null,
      og_image_cf_id:       input.og_image_cf_id ?? null,
      og_image_alt:         input.og_image_alt ?? null,
      twitter_image_cf_id:  input.twitter_image_cf_id ?? null,
      canonical:            input.canonical ?? null,
      robots:               input.robots ?? null,
      jsonld_type:          input.jsonld_type ?? null,
      jsonld_data:          input.jsonld_data ? JSON.stringify(input.jsonld_data) : null,
      atualizado_em:        new Date().toISOString(),
    };

    if (input.entity_type === 'static') {
      const existing = await this.getForRoute(input.route);
      if (existing) {
        await this.db.update(page_seo).set(base).where(eq(page_seo.id, existing.id));
        return { id: existing.id, created: false };
      }
      const result = await this.db.insert(page_seo).values({
        entity_type: 'static',
        route: input.route,
        ...base,
      });
      return { id: result.meta.last_row_id as number, created: true };
    }

    const existing = await this.getForEntity(input.entity_type, input.entity_id);
    if (existing) {
      await this.db.update(page_seo).set(base).where(eq(page_seo.id, existing.id));
      return { id: existing.id, created: false };
    }
    const result = await this.db.insert(page_seo).values({
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      ...base,
    });
    return { id: result.meta.last_row_id as number, created: true };
  }

  delete(id: number) {
    return this.db.delete(page_seo).where(eq(page_seo.id, id));
  }

  /** Persiste avaliação (score + issues + last_evaluated_at). */
  saveEvaluation(id: number, score: number, issuesJson: string) {
    return this.db
      .update(page_seo)
      .set({
        score,
        last_issues: issuesJson,
        last_evaluated_at: new Date().toISOString(),
      })
      .where(eq(page_seo.id, id));
  }

  saveTechnicalAudit(id: number, auditJson: string) {
    return this.db
      .update(page_seo)
      .set({
        technical_audit: auditJson,
        last_audited_at: new Date().toISOString(),
      })
      .where(eq(page_seo.id, id));
  }
}
