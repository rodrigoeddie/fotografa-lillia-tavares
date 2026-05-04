// ─── Notificações ─────────────────────────────────────────────────────────────

export interface Notificacao {
  id: number;
  tipo: 'admin' | 'cliente';
  destinatario_id: number | null;
  titulo: string;
  mensagem: string | null;
  lida: number;
  criado_em: string;
}

export function dbCreateNotificacao(
  db: D1Database,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
  titulo: string,
  mensagem: string | null,
) {
  return db
    .prepare(
      'INSERT INTO notificacoes (tipo, destinatario_id, titulo, mensagem) VALUES (?, ?, ?, ?)',
    )
    .bind(tipo, destinatarioId, titulo, mensagem)
    .run();
}

export function dbListNotificacoes(
  db: D1Database,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
) {
  if (destinatarioId === null) {
    return db
      .prepare(
        'SELECT * FROM notificacoes WHERE tipo = ? ORDER BY criado_em DESC LIMIT 50',
      )
      .bind(tipo)
      .all<Notificacao>();
  }
  return db
    .prepare(
      'SELECT * FROM notificacoes WHERE tipo = ? AND destinatario_id = ? ORDER BY criado_em DESC LIMIT 50',
    )
    .bind(tipo, destinatarioId)
    .all<Notificacao>();
}

export function dbCountUnreadNotificacoes(
  db: D1Database,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
) {
  if (destinatarioId === null) {
    return db
      .prepare('SELECT COUNT(*) AS count FROM notificacoes WHERE tipo = ? AND lida = 0')
      .bind(tipo)
      .first<{ count: number }>();
  }
  return db
    .prepare(
      'SELECT COUNT(*) AS count FROM notificacoes WHERE tipo = ? AND destinatario_id = ? AND lida = 0',
    )
    .bind(tipo, destinatarioId)
    .first<{ count: number }>();
}

export function dbMarkNotificacoesLidas(
  db: D1Database,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
) {
  if (destinatarioId === null) {
    return db
      .prepare('UPDATE notificacoes SET lida = 1 WHERE tipo = ?')
      .bind(tipo)
      .run();
  }
  return db
    .prepare(
      'UPDATE notificacoes SET lida = 1 WHERE tipo = ? AND destinatario_id = ?',
    )
    .bind(tipo, destinatarioId)
    .run();
}

// ─── Push Subscriptions ────────────────────────────────────────────────────────

export interface PushSubscription {
  id: number;
  tipo: 'admin' | 'cliente';
  destinatario_id: number | null;
  endpoint: string;
  p256dh: string;
  auth: string;
  criado_em: string;
}

export function dbUpsertPushSubscription(
  db: D1Database,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
  endpoint: string,
  p256dh: string,
  auth: string,
) {
  return db
    .prepare(
      `INSERT INTO push_subscriptions (tipo, destinatario_id, endpoint, p256dh, auth)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET
         tipo = excluded.tipo,
         destinatario_id = excluded.destinatario_id,
         p256dh = excluded.p256dh,
         auth = excluded.auth`,
    )
    .bind(tipo, destinatarioId, endpoint, p256dh, auth)
    .run();
}

export function dbListPushSubscriptions(
  db: D1Database,
  tipo: 'admin' | 'cliente',
  destinatarioId: number | null,
) {
  if (destinatarioId === null) {
    return db
      .prepare('SELECT * FROM push_subscriptions WHERE tipo = ?')
      .bind(tipo)
      .all<PushSubscription>();
  }
  return db
    .prepare('SELECT * FROM push_subscriptions WHERE tipo = ? AND destinatario_id = ?')
    .bind(tipo, destinatarioId)
    .all<PushSubscription>();
}

export function dbDeletePushSubscription(db: D1Database, endpoint: string) {
  return db
    .prepare('DELETE FROM push_subscriptions WHERE endpoint = ?')
    .bind(endpoint)
    .run();
}
