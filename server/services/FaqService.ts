import { eq, asc, sql } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { faq_categorias, faq_perguntas } from '~/server/db/schema';

export class FaqService {
  constructor(private db: ORM) {}

  // ── Categorias ────────────────────────────────────────────

  listCategorias() {
    return this.db.select().from(faq_categorias).orderBy(asc(faq_categorias.ordem));
  }

  async getCategoriaById(id: number) {
    const [row] = await this.db.select().from(faq_categorias).where(eq(faq_categorias.id, id));
    return row ?? null;
  }

  async nextCategoriaOrdem() {
    const [row] = await this.db
      .select({ next: sql<number>`COALESCE(MAX(${faq_categorias.ordem}), 0) + 1` })
      .from(faq_categorias);
    return row?.next ?? 1;
  }

  createCategoria(titulo: string, slug: string, ordem: number) {
    return this.db.insert(faq_categorias).values({ titulo, slug, ordem });
  }

  updateCategoria(id: number, titulo: string, slug: string, ordem: number) {
    return this.db.update(faq_categorias).set({ titulo, slug, ordem }).where(eq(faq_categorias.id, id));
  }

  deleteCategoria(id: number) {
    return this.db.delete(faq_categorias).where(eq(faq_categorias.id, id));
  }

  reorderCategorias(items: { id: number; ordem: number }[]) {
    return Promise.all(
      items.map((item) =>
        this.db.update(faq_categorias).set({ ordem: item.ordem }).where(eq(faq_categorias.id, item.id))
      ),
    );
  }

  // ── Perguntas ─────────────────────────────────────────────

  listByCategoria(catId: number) {
    return this.db.select().from(faq_perguntas).where(eq(faq_perguntas.categoria_id, catId)).orderBy(asc(faq_perguntas.ordem));
  }

  createPergunta(catId: number, pergunta: string, resposta: string, ordem: number) {
    return this.db.insert(faq_perguntas).values({ categoria_id: catId, pergunta, resposta, ordem });
  }

  updatePergunta(id: number, pergunta: string, resposta: string, ordem: number) {
    return this.db.update(faq_perguntas).set({ pergunta, resposta, ordem }).where(eq(faq_perguntas.id, id));
  }

  deletePergunta(id: number) {
    return this.db.delete(faq_perguntas).where(eq(faq_perguntas.id, id));
  }

  // ── Composições ───────────────────────────────────────────

  async listCategoriasComPerguntas() {
    const cats = await this.listCategorias();
    return Promise.all(
      cats.map(async (c) => ({ ...c, perguntas: await this.listByCategoria(c.id) })),
    );
  }
}
