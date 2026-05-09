import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { produtos, pacotes, type ProdutoInsert, type PacoteInsert } from '~/server/db/schema';

export class ProdutoService {
  constructor(private db: ORM) {}

  // ── Produtos ──────────────────────────────────────────────

  list() {
    return this.db.select().from(produtos).orderBy(asc(produtos.ordem));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(produtos).where(eq(produtos.id, id));
    return row ?? null;
  }

  async getBySlug(slug: string) {
    const [row] = await this.db.select().from(produtos).where(eq(produtos.slug, slug));
    return row ?? null;
  }

  create(data: Omit<ProdutoInsert, 'id'>) {
    return this.db.insert(produtos).values(data);
  }

  update(id: number, data: Omit<ProdutoInsert, 'id'>) {
    return this.db.update(produtos).set(data).where(eq(produtos.id, id));
  }

  delete(id: number) {
    return this.db.delete(produtos).where(eq(produtos.id, id));
  }

  setActive(id: number, active: boolean) {
    return this.db.update(produtos).set({ active: active ? 1 : 0 }).where(eq(produtos.id, id));
  }

  setOrdem(id: number, ordem: number) {
    return this.db.update(produtos).set({ ordem }).where(eq(produtos.id, id));
  }

  // ── Pacotes ───────────────────────────────────────────────

  listPacotesByProduto(produtoId: number) {
    return this.db.select().from(pacotes).where(eq(pacotes.produto_id, produtoId)).orderBy(asc(pacotes.ordem));
  }

  createPacote(data: Omit<PacoteInsert, 'id'>) {
    return this.db.insert(pacotes).values(data);
  }

  deletePacotesByProduto(produtoId: number) {
    return this.db.delete(pacotes).where(eq(pacotes.produto_id, produtoId));
  }

  // ── Composições ───────────────────────────────────────────

  async listComPacotes() {
    const list = await this.list();
    return Promise.all(list.map(async (p) => ({ ...p, pacotes: await this.listPacotesByProduto(p.id) })));
  }

  async listAtivosComPacotes() {
    const list = await this.list();
    const ativos = list.filter((p) => p.active === 1);
    return Promise.all(ativos.map(async (p) => ({ ...p, pacotes: await this.listPacotesByProduto(p.id) })));
  }
}
