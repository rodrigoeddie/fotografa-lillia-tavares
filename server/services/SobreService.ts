import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  sobre_pagina,
  sobre_servicos,
  sobre_marcos,
  type SobrePaginaInsert,
  type SobreServicoInsert,
  type SobreMarcoInsert,
} from '~/server/db/schema';

/** Conteúdo da página "Sobre a Fotógrafa": bloco único + serviços + linha do tempo. */
export class SobreService {
  constructor(private db: ORM) {}

  // ── Bloco principal (linha única, id = 1) ─────────────────

  async getPagina() {
    const [row] = await this.db.select().from(sobre_pagina).where(eq(sobre_pagina.id, 1));
    return row ?? null;
  }

  async upsertPagina(data: Omit<SobrePaginaInsert, 'id'>) {
    const existing = await this.getPagina();
    if (existing) {
      return this.db.update(sobre_pagina).set(data).where(eq(sobre_pagina.id, 1));
    }
    return this.db.insert(sobre_pagina).values({ ...data, id: 1 });
  }

  // ── Serviços ──────────────────────────────────────────────

  listServicos(onlyAtivo = false) {
    const q = this.db.select().from(sobre_servicos);
    return (onlyAtivo ? q.where(eq(sobre_servicos.ativo, 1)) : q).orderBy(asc(sobre_servicos.ordem));
  }

  createServico(data: Omit<SobreServicoInsert, 'id'>) {
    return this.db.insert(sobre_servicos).values(data);
  }

  updateServico(id: number, data: Omit<SobreServicoInsert, 'id'>) {
    return this.db.update(sobre_servicos).set(data).where(eq(sobre_servicos.id, id));
  }

  deleteServico(id: number) {
    return this.db.delete(sobre_servicos).where(eq(sobre_servicos.id, id));
  }

  // ── Marcos (Nossa história) ───────────────────────────────

  listMarcos(onlyAtivo = false) {
    const q = this.db.select().from(sobre_marcos);
    return (onlyAtivo ? q.where(eq(sobre_marcos.ativo, 1)) : q)
      .orderBy(asc(sobre_marcos.ordem), asc(sobre_marcos.id));
  }

  createMarco(data: Omit<SobreMarcoInsert, 'id'>) {
    return this.db.insert(sobre_marcos).values(data);
  }

  updateMarco(id: number, data: Omit<SobreMarcoInsert, 'id'>) {
    return this.db.update(sobre_marcos).set(data).where(eq(sobre_marcos.id, id));
  }

  deleteMarco(id: number) {
    return this.db.delete(sobre_marcos).where(eq(sobre_marcos.id, id));
  }

  // ── Composição ────────────────────────────────────────────

  async getConteudo(onlyAtivo = false) {
    const [pagina, servicos, marcos] = await Promise.all([
      this.getPagina(),
      this.listServicos(onlyAtivo),
      this.listMarcos(onlyAtivo),
    ]);
    return { pagina, servicos, marcos };
  }
}
