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
import { and, eq } from 'drizzle-orm';
import { validateAdminToken } from '~/server/utils/auth-helpers';
import { getOrm } from '~/server/utils/d1-client';
import { sessoes as sessoesTable } from '~/server/db/schema';
import { NotificacaoService } from '~/server/services/NotificacaoService';
import { sendPushNotifications } from '~/server/utils/send-push';

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);
  const orm   = getOrm(event);
  const notif = new NotificacaoService(orm);

  const today = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);

  const targets = [
    { date: format(new Date(today.getTime() + 1 * 86400000)), dias: 1 },
    { date: format(new Date(today.getTime() + 3 * 86400000)), dias: 3 },
  ];

  let total = 0;

  for (const { date, dias } of targets) {
    const sessoes = await orm
      .select({
        id:          sessoesTable.id,
        nome_sessao: sessoesTable.nome_sessao,
        cliente_id:  sessoesTable.cliente_id,
      })
      .from(sessoesTable)
      .where(
        and(
          eq(sessoesTable.status, 'aguardando_selecao'),
          eq(sessoesTable.prazo_selecao, date),
        ),
      );

    for (const sessao of sessoes) {
      const titulo = dias === 1
        ? 'Prazo de seleção: amanhã é o último dia!'
        : 'Prazo de seleção: 3 dias restantes';
      const mensagem = `Finalize a seleção do ensaio "${sessao.nome_sessao}" antes do prazo.`;

      await notif.create('cliente', sessao.cliente_id, titulo, mensagem);
      await sendPushNotifications(event, orm, 'cliente', sessao.cliente_id, titulo, mensagem);
      total++;
    }
  }

  return { success: true, notificacoes_enviadas: total };
});
