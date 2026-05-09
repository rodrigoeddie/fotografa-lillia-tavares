import { eq, asc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { clientes } from '~/server/db/schema';

export class ClienteService {
  constructor(private db: ORM) {}

  async getByEmail(email: string) {
    const [row] = await this.db.select().from(clientes).where(eq(clientes.email, email));
    return row ?? null;
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(clientes).where(eq(clientes.id, id));
    return row ?? null;
  }

  /** Lista sem expor `senha_hash`. */
  list() {
    return this.db
      .select({
        id:        clientes.id,
        nome:      clientes.nome,
        email:     clientes.email,
        celular:   clientes.celular,
        bg_image:  clientes.bg_image,
        criado_em: clientes.criado_em,
      })
      .from(clientes)
      .orderBy(asc(clientes.nome));
  }

  create(nome: string, email: string, senhaHash: string) {
    return this.db.insert(clientes).values({ nome, email, senha_hash: senhaHash });
  }

  update(id: number, nome: string, email: string, bgImage?: string | null, celular?: string | null) {
    return this.db
      .update(clientes)
      .set({ nome, email, bg_image: bgImage ?? null, celular: celular ?? null })
      .where(eq(clientes.id, id));
  }

  updateSenha(id: number, senhaHash: string) {
    return this.db.update(clientes).set({ senha_hash: senhaHash }).where(eq(clientes.id, id));
  }

  delete(id: number) {
    return this.db.delete(clientes).where(eq(clientes.id, id));
  }
}
