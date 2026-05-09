import { eq, sql, count } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { admin_users } from '~/server/db/schema';

export class AdminUserService {
  constructor(private db: ORM) {}

  async getByUsername(username: string) {
    const [row] = await this.db.select().from(admin_users).where(eq(admin_users.username, username));
    return row ?? null;
  }

  async count() {
    const [row] = await this.db.select({ count: count() }).from(admin_users);
    return row?.count ?? 0;
  }

  async create(username: string, passwordHash: string, salt: string) {
    return this.db.insert(admin_users).values({
      username,
      password_hash: passwordHash,
      salt,
    });
  }

  async updatePassword(username: string, passwordHash: string, salt: string) {
    return this.db
      .update(admin_users)
      .set({ password_hash: passwordHash, salt })
      .where(eq(admin_users.username, username));
  }
}
