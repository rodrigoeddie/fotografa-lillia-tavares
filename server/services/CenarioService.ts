import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  cenario_paginas,
  cenarios,
  type CenarioInsert,
  type CenarioPaginaInsert,
} from '~/server/db/schema';

export class CenarioService {
  constructor(private db: ORM) {}

  // ── Páginas ───────────────────────────────────────────────

  listPaginas() {
    return this.db.select().from(cenario_paginas).orderBy(asc(cenario_paginas.ordem));
  }

  async getPaginaBySlug(slug: string) {
    const [row] = await this.db.select().from(cenario_paginas).where(eq(cenario_paginas.slug, slug));
    return row ?? null;
  }

  async getPaginaById(id: number) {
    const [row] = await this.db.select().from(cenario_paginas).where(eq(cenario_paginas.id, id));
    return row ?? null;
  }

  createPagina(slug: string, titulo: string, tituloPre: string | null, ordem: number) {
    return this.db.insert(cenario_paginas).values({ slug, titulo, titulo_pre: tituloPre, ordem });
  }

  updatePagina(id: number, slug: string, titulo: string, tituloPre: string | null, ordem: number) {
    return this.db.update(cenario_paginas).set({ slug, titulo, titulo_pre: tituloPre, ordem }).where(eq(cenario_paginas.id, id));
  }

  deletePagina(id: number) {
    return this.db.delete(cenario_paginas).where(eq(cenario_paginas.id, id));
  }

  // ── Cenários ──────────────────────────────────────────────

  listByPagina(paginaId: number) {
    return this.db.select().from(cenarios).where(eq(cenarios.pagina_id, paginaId)).orderBy(asc(cenarios.ordem));
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(cenarios).where(eq(cenarios.id, id));
    return row ?? null;
  }

  create(data: Omit<CenarioInsert, 'id'>) {
    return this.db.insert(cenarios).values(data);
  }

  update(id: number, data: Omit<CenarioInsert, 'id'>) {
    return this.db.update(cenarios).set(data).where(eq(cenarios.id, id));
  }

  delete(id: number) {
    return this.db.delete(cenarios).where(eq(cenarios.id, id));
  }

  // ── Composições ───────────────────────────────────────────

  async listPaginasComCenarios() {
    const paginas = await this.listPaginas();
    return Promise.all(
      paginas.map(async (p) => ({ ...p, cenarios: await this.listByPagina(p.id) })),
    );
  }

  async getPaginaComCenariosBySlug(slug: string) {
    const pagina = await this.getPaginaBySlug(slug);
    if (!pagina) return null;
    return { ...pagina, cenarios: await this.listByPagina(pagina.id) };
  }
}
