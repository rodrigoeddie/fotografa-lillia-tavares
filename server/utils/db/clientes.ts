export interface Cliente {
  id: number;
  nome: string;
  email: string;
  celular: string | null;
  senha_hash: string;
  bg_image: string | null;
  criado_em: string;
}

export function dbGetClienteByEmail(db: D1Database, email: string) {
  return db.prepare('SELECT * FROM clientes WHERE email = ?').bind(email).first<Cliente>();
}

export function dbGetClienteById(db: D1Database, id: number) {
  return db.prepare('SELECT * FROM clientes WHERE id = ?').bind(id).first<Cliente>();
}

export function dbListClientes(db: D1Database) {
  return db.prepare('SELECT id, nome, email, celular, bg_image, criado_em FROM clientes ORDER BY nome ASC').all<Omit<Cliente, 'senha_hash'>>();
}

export function dbCreateCliente(db: D1Database, nome: string, email: string, senhaHash: string) {
  return db.prepare('INSERT INTO clientes (nome, email, senha_hash) VALUES (?, ?, ?)').bind(nome, email, senhaHash).run();
}

export function dbUpdateCliente(db: D1Database, id: number, nome: string, email: string, bgImage?: string | null, celular?: string | null) {
  return db.prepare('UPDATE clientes SET nome = ?, email = ?, bg_image = ?, celular = ? WHERE id = ?').bind(nome, email, bgImage ?? null, celular ?? null, id).run();
}

export function dbUpdateClienteSenha(db: D1Database, id: number, senhaHash: string) {
  return db.prepare('UPDATE clientes SET senha_hash = ? WHERE id = ?').bind(senhaHash, id).run();
}

export function dbDeleteCliente(db: D1Database, id: number) {
  return db.prepare('DELETE FROM clientes WHERE id = ?').bind(id).run();
}
