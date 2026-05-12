import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const menu_items = sqliteTable('menu_items', {
  id:    integer().primaryKey({ autoIncrement: true }),
  label: text().notNull(),
  path:  text().notNull(),
  ordem: integer().notNull().default(0),
  blank: integer({ mode: 'boolean' }).notNull().default(false),
});

// Alias camelCase
export const menuItems = menu_items;

export type MenuItem       = typeof menu_items.$inferSelect;
export type MenuItemInsert = typeof menu_items.$inferInsert;
