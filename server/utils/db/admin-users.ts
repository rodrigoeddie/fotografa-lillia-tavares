export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  salt: string;
  created_at: string;
}

export function dbGetAdminByUsername(db: D1Database, username: string) {
  return db.prepare('SELECT * FROM admin_users WHERE username = ?').bind(username).first<AdminUser>();
}

export function dbCountAdminUsers(db: D1Database) {
  return db.prepare('SELECT COUNT(*) as count FROM admin_users').first<{ count: number }>();
}

export function dbCreateAdminUser(db: D1Database, username: string, passwordHash: string, salt: string) {
  return db.prepare('INSERT INTO admin_users (username, password_hash, salt) VALUES (?, ?, ?)').bind(username, passwordHash, salt).run();
}

export function dbUpdateAdminPassword(db: D1Database, username: string, passwordHash: string, salt: string) {
  return db.prepare('UPDATE admin_users SET password_hash = ?, salt = ? WHERE username = ?').bind(passwordHash, salt, username).run();
}
