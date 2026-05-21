import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const admin_users = sqliteTable('admin_users', {
  id:            integer().primaryKey({ autoIncrement: true }),
  username:      text().notNull().unique(),
  email:         text(),
  password_hash: text().notNull(),
  salt:          text().notNull(),
  created_at:    text().notNull().default(sql`(datetime('now'))`),
});

// Alias camelCase
export const adminUsers = admin_users;

export type AdminUser       = typeof admin_users.$inferSelect;
export type AdminUserInsert = typeof admin_users.$inferInsert;
