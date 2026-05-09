# Services Layer

Camada de serviços. Cada service encapsula a lógica de negócio e o acesso a
dados de uma entidade (ou conjunto coeso de entidades). Endpoints HTTP em
`server/api/**` consomem services em vez de fazer SQL inline.

## Padrão

```ts
// server/services/MinhaEntidadeService.ts
import { eq } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { minhaTabela } from '~/server/db/schema';

export class MinhaEntidadeService {
  constructor(private db: ORM) {}

  async listAll() {
    return this.db.select().from(minhaTabela);
  }

  async getById(id: number) {
    const [row] = await this.db.select().from(minhaTabela).where(eq(minhaTabela.id, id));
    return row ?? null;
  }
}
```

E no endpoint:

```ts
// server/api/admin/minha-entidade/index.ts
import { getOrm } from '~/server/utils/d1-client';
import { MinhaEntidadeService } from '~/server/services/MinhaEntidadeService';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const svc = new MinhaEntidadeService(getOrm(event));
  return svc.listAll();
});
```

## Regras

- **Sempre Drizzle**: nada de SQL raw nos services. A única excepção é quando
  o Drizzle não cobre uma feature SQL específica — nesse caso, usar
  `db.run(sql\`...\`)` em vez de `getDB(event).prepare(...)`.
- **Validação Zod nos endpoints**, não nos services. Service confia que recebeu
  input já validado.
- **Sem cache de instâncias**: um service novo por request (instanciado pelo
  endpoint). Eles são leves; D1 não tem connection pool.
- **Composição entre services**: um service pode receber outro no construtor
  ou instanciar internamente. Ex: `LandingPageService` usa `PageSeoService`
  para hidratar o SEO de uma LP renderizada.
