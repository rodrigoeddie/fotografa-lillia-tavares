/**
 * Kill-switch do gateway de pagamento (SumUp).
 *
 * Fonte única: env `NUXT_PUBLIC_PAGAMENTOS_ATIVOS` — a mesma lida por
 * `runtimeConfig.public.pagamentosAtivos` no front (nuxt.config.ts).
 * Desligado por padrão.
 *
 * Com a flag OFF a seleção de fotos continua 100% funcional — lotes, extras,
 * descontos e o resumo de valores seguem sendo calculados (GET do checkout).
 * Só o que envolve dinheiro de fato é recusado: criar checkout, webhook e
 * consulta de retorno.
 */
export function pagamentosAtivos(): boolean {
  return process.env.NUXT_PUBLIC_PAGAMENTOS_ATIVOS === 'true';
}
