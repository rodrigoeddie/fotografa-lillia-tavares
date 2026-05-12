import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

export const cenario_paginas = sqliteTable('cenario_paginas', {
  id:         integer().primaryKey({ autoIncrement: true }),
  slug:       text().notNull().unique(),
  titulo:     text().notNull(),
  titulo_pre: text(),
  ordem:      integer().notNull().default(0),
});

export const cenarios = sqliteTable('cenarios', {
  id:                         integer().primaryKey({ autoIncrement: true }),
  pagina_id:                  integer().notNull().references(() => cenario_paginas.id, { onDelete: 'cascade' }),
  titulo:                     text().notNull(),
  descricao:                  text(),
  imagem_bg_cf_id:            text(),
  imagem_bg_alt:              text(),
  imagem_exemplo_cf_id:       text(),
  imagem_exemplo_alt:         text(),
  imagem_exemplo_link:        text(),
  imagem_exemplo_titulo:      text(),
  imagem_exemplo_orientacao:  text(),
  ordem:                      integer().notNull().default(0),
}, (t) => ({
  paginaIdx: index('idx_cenarios_pagina').on(t.pagina_id),
}));

// Alias camelCase
export const cenarioPaginas = cenario_paginas;

export type CenarioPagina       = typeof cenario_paginas.$inferSelect;
export type CenarioPaginaInsert = typeof cenario_paginas.$inferInsert;
export type Cenario             = typeof cenarios.$inferSelect;
export type CenarioInsert       = typeof cenarios.$inferInsert;
