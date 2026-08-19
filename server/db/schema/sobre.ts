import { sqliteTable, integer, text, index } from 'drizzle-orm/sqlite-core';

/** Conteúdo textual da página "Sobre a Fotógrafa" (linha única, id = 1). */
export const sobre_pagina = sqliteTable('sobre_pagina', {
  id:                  integer().primaryKey({ autoIncrement: true }),
  titulo:              text().notNull().default(''),
  imagem_cf_id:        text(),
  imagem_alt:          text(),
  imagem_width:        integer().notNull().default(935),
  imagem_height:       integer().notNull().default(935),
  bio:                 text().notNull().default(''),
  servicos_titulo:     text().notNull().default(''),
  timeline_titulo:     text().notNull().default(''),
  timeline_descricao:  text(),
  atualizado_em:       text(),
});

/** Cards de "O que eu ofereço". */
export const sobre_servicos = sqliteTable('sobre_servicos', {
  id:              integer().primaryKey({ autoIncrement: true }),
  tag:             text(),
  titulo:          text().notNull(),
  subtitulo:       text(),
  descricao:       text(),
  descricao_extra: text(),
  cta_label:       text(),
  cta_url:         text(),
  sub_link_label:  text(),
  sub_link_url:    text(),
  destaque:        integer().notNull().default(0),
  ordem:           integer().notNull().default(0),
  ativo:           integer().notNull().default(1),
});

/** Marcos da linha do tempo "Nossa história". */
export const sobre_marcos = sqliteTable('sobre_marcos', {
  id:           integer().primaryKey({ autoIncrement: true }),
  ano:          integer().notNull(),
  mes:          text(),
  titulo:       text().notNull(),
  descricao:    text(),
  imagem_cf_id: text(),
  formato:      text(),
  ordem:        integer().notNull().default(0),
  ativo:        integer().notNull().default(1),
}, (t) => ({
  ordemIdx: index('idx_sobre_marcos_ordem').on(t.ordem),
}));

export type SobrePagina        = typeof sobre_pagina.$inferSelect;
export type SobrePaginaInsert  = typeof sobre_pagina.$inferInsert;
export type SobreServico       = typeof sobre_servicos.$inferSelect;
export type SobreServicoInsert = typeof sobre_servicos.$inferInsert;
export type SobreMarco         = typeof sobre_marcos.$inferSelect;
export type SobreMarcoInsert   = typeof sobre_marcos.$inferInsert;
