import { eq, desc } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import { pagamentos } from '~/server/db/schema';

const SUMUP_API = 'https://api.sumup.com/v0.1';

export class PagamentoService {
  constructor(private db: ORM) {}

  async getByLote(loteId: number) {
    const [row] = await this.db
      .select()
      .from(pagamentos)
      .where(eq(pagamentos.lote_id, loteId))
      .orderBy(desc(pagamentos.criado_em))
      .limit(1);
    return row ?? null;
  }

  async getByCheckoutId(checkoutId: string) {
    const [row] = await this.db
      .select()
      .from(pagamentos)
      .where(eq(pagamentos.sumup_checkout_id, checkoutId));
    return row ?? null;
  }

  async listBySessao(sessaoId: number) {
    return this.db
      .select()
      .from(pagamentos)
      .where(eq(pagamentos.sessao_id, sessaoId))
      .orderBy(desc(pagamentos.criado_em));
  }

  async create(params: {
    sessaoId: number;
    loteId: number;
    sumupCheckoutId: string;
    valorCents: number;
    metodo: string | null;
    descricao: string;
  }) {
    return this.db.insert(pagamentos).values({
      sessao_id:         params.sessaoId,
      lote_id:           params.loteId,
      sumup_checkout_id: params.sumupCheckoutId,
      valor_cents:       params.valorCents,
      metodo:            params.metodo,
      descricao:         params.descricao,
      status:            'pendente',
    });
  }

  async updateStatus(checkoutId: string, status: string, transactionId?: string) {
    return this.db.update(pagamentos).set({
      status,
      atualizado_em: new Date().toISOString(),
      ...(transactionId ? { sumup_transaction_id: transactionId } : {}),
    }).where(eq(pagamentos.sumup_checkout_id, checkoutId));
  }

  /** Cria um checkout na SumUp e retorna o objeto com o `id` gerado. */
  async createSumupCheckout(params: {
    apiKey: string;
    merchantCode: string;
    amount: number;
    reference: string;
    description: string;
    returnUrl: string;
  }): Promise<{ id: string; status: string }> {
    const res = await fetch(`${SUMUP_API}/checkouts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: params.reference,
        amount: params.amount,
        currency: 'BRL',
        merchant_code: params.merchantCode,
        description: params.description,
        return_url: params.returnUrl,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`SumUp ${res.status}: ${text}`);
    }

    return res.json();
  }

  /** Consulta o status de um checkout diretamente na API SumUp. */
  async fetchSumupCheckoutStatus(apiKey: string, checkoutId: string) {
    const res = await fetch(`${SUMUP_API}/checkouts/${checkoutId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(`SumUp ${res.status}`);
    return res.json() as Promise<{ id: string; status: string; transactions?: any[] }>;
  }
}
