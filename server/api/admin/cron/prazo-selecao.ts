/**
 * POST /api/admin/cron/prazo-selecao
 *
 * Endpoint de cron protegido por admin token.
 * Chamado diariamente às 9h por um Cloudflare Cron (Workers) externo
 * ou manualmente pelo painel admin.
 *
 * Notifica clientes cujo prazo de seleção é em 1 ou 3 dias.
 */
import { defineEventHandler } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getDB, dbCreateNotificacao } from '~/server/utils/d1-client';
import { sendPushNotifications } from '~/server/utils/send-push';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const db = getDB(event);

  const today = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const targets = [
    { date: format(new Date(today.getTime() + 1 * 86400000)), dias: 1 },
    { date: format(new Date(today.getTime() + 3 * 86400000)), dias: 3 },
  ];

  let total = 0;

  for (const { date, dias } of targets) {
    const { results: sessoes } = await db
      .prepare(
        `SELECT s.id, s.nome_sessao, s.prazo_selecao, s.cliente_id
         FROM sessoes s
         WHERE s.status = 'aguardando_selecao' AND s.prazo_selecao = ?`,
      )
      .bind(date)
      .all<{ id: number; nome_sessao: string; prazo_selecao: string; cliente_id: number }>();

    for (const sessao of sessoes) {
      const titulo = dias === 1
        ? 'Prazo de seleção: amanhã é o último dia!'
        : 'Prazo de seleção: 3 dias restantes';
      const mensagem = `Finalize a seleção do ensaio "${sessao.nome_sessao}" antes do prazo.`;

      await dbCreateNotificacao(db, 'cliente', sessao.cliente_id, titulo, mensagem);
      await sendPushNotifications(event, db, 'cliente', sessao.cliente_id, titulo, mensagem);
      total++;
    }
  }

  return { success: true, notificacoes_enviadas: total };
});
