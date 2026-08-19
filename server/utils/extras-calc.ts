/* Cálculo de fotos extras + desconto progressivo.
   Regra única usada pela área do cliente (checkout) e pelo admin:
   a cada 5 fotos extras o cliente ganha +5% de desconto sobre o total. */
export function calcExtras(selecionadas: number, fotosIncluidas: number, precoFotoExtra: number) {
  const extras = Math.max(0, selecionadas - fotosIncluidas);
  const descontoPercent = Math.floor(extras / 5) * 5;
  const bruto = extras * precoFotoExtra;
  const valor = bruto * (1 - descontoPercent / 100);
  return { extras, descontoPercent, valorExtrasBruto: bruto, valorExtras: valor };
}
