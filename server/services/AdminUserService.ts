import { eq, count } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { admin_users } from '~/server/db/schema';

const SAFE_FIELDS = {
  id:         admin_users.id,
  username:   admin_users.username,
  email:      admin_users.email,
  role:       admin_users.role,
  created_at: admin_users.created_at,
} as const;

export class AdminUserService {
  constructor(private db: ORM) {}

  async list() {
    return this.db.select(SAFE_FIELDS).from(admin_users).orderBy(admin_users.id);
  }

  async getById(id: number) {
    const [row] = await this.db.select(SAFE_FIELDS).from(admin_users).where(eq(admin_users.id, id));
    return row ?? null;
  }

  async getByUsername(username: string) {
    const [row] = await this.db.select().from(admin_users).where(eq(admin_users.username, username));
    return row ?? null;
  }

  async getByEmail(email: string) {
    const [row] = await this.db.select().from(admin_users).where(eq(admin_users.email, email.toLowerCase()));
    return row ?? null;
  }

  async count() {
    const [row] = await this.db.select({ count: count() }).from(admin_users);
    return row?.count ?? 0;
  }

  async create(username: string, passwordHash: string, salt: string, email?: string, role = 'editor') {
    return this.db.insert(admin_users).values({
      username,
      password_hash: passwordHash,
      salt,
      email: email?.toLowerCase() ?? null,
      role,
    });
  }

  async update(id: number, data: { username?: string; email?: string | null; role?: string }) {
    return this.db
      .update(admin_users)
      .set({
        ...(data.username !== undefined && { username: data.username }),
        ...(data.email    !== undefined && { email: data.email?.toLowerCase() ?? null }),
        ...(data.role     !== undefined && { role: data.role }),
      })
      .where(eq(admin_users.id, id));
  }

  async updatePassword(id: number, passwordHash: string, salt: string) {
    return this.db
      .update(admin_users)
      .set({ password_hash: passwordHash, salt })
      .where(eq(admin_users.id, id));
  }

  async delete(id: number) {
    return this.db.delete(admin_users).where(eq(admin_users.id, id));
  }
}
