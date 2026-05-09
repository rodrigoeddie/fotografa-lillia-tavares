import { and, eq, desc, count, isNull } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { notificacoes, push_subscriptions } from '~/server/db/schema';

export type NotificacaoTipo = 'admin' | 'cliente';

export class NotificacaoService {
  constructor(private db: ORM) {}

  // ── Notificações ──────────────────────────────────────────

  create(tipo: NotificacaoTipo, destinatarioId: number | null, titulo: string, mensagem: string | null) {
    return this.db.insert(notificacoes).values({
      tipo,
      destinatario_id: destinatarioId,
      titulo,
      mensagem,
    });
  }

  list(tipo: NotificacaoTipo, destinatarioId: number | null) {
    const where = destinatarioId === null
      ? eq(notificacoes.tipo, tipo)
      : and(eq(notificacoes.tipo, tipo), eq(notificacoes.destinatario_id, destinatarioId));
    return this.db.select()
      .from(notificacoes)
      .where(where)
      .orderBy(desc(notificacoes.criado_em))
      .limit(50);
  }

  async countUnread(tipo: NotificacaoTipo, destinatarioId: number | null) {
    const where = destinatarioId === null
      ? and(eq(notificacoes.tipo, tipo), eq(notificacoes.lida, 0))
      : and(eq(notificacoes.tipo, tipo), eq(notificacoes.destinatario_id, destinatarioId), eq(notificacoes.lida, 0));
    const [row] = await this.db.select({ count: count() }).from(notificacoes).where(where);
    return row?.count ?? 0;
  }

  markRead(tipo: NotificacaoTipo, destinatarioId: number | null) {
    const where = destinatarioId === null
      ? eq(notificacoes.tipo, tipo)
      : and(eq(notificacoes.tipo, tipo), eq(notificacoes.destinatario_id, destinatarioId));
    return this.db.update(notificacoes).set({ lida: 1 }).where(where);
  }

  // ── Push Subscriptions ────────────────────────────────────

  upsertPushSubscription(tipo: NotificacaoTipo, destinatarioId: number | null, endpoint: string, p256dh: string, auth: string) {
    return this.db.insert(push_subscriptions)
      .values({ tipo, destinatario_id: destinatarioId, endpoint, p256dh, auth })
      .onConflictDoUpdate({
        target: push_subscriptions.endpoint,
        set: { tipo, destinatario_id: destinatarioId, p256dh, auth },
      });
  }

  listPushSubscriptions(tipo: NotificacaoTipo, destinatarioId: number | null) {
    const where = destinatarioId === null
      ? eq(push_subscriptions.tipo, tipo)
      : and(eq(push_subscriptions.tipo, tipo), eq(push_subscriptions.destinatario_id, destinatarioId));
    return this.db.select().from(push_subscriptions).where(where);
  }

  deletePushSubscription(endpoint: string) {
    return this.db.delete(push_subscriptions).where(eq(push_subscriptions.endpoint, endpoint));
  }
}
