# Pagamentos (SumUp) — Revisão de Segurança e Guia Operacional

> Documento de referência para o subsistema de pagamentos. **Ler antes de configurar as
> keys de produção e antes de qualquer alteração no fluxo de checkout/webhook.**
> Este é o ponto mais sensível do sistema: falhas aqui significam entregar fotos sem
> cobrança ou cobrar valores errados.

## 1. Visão geral do fluxo

```
Cliente (área de fotos, JWT cookie)
  │
  │ 1. POST /api/cliente/sessoes/[id]/checkout  { lote_id }
  ▼
checkout.ts ──(valor calculado NO SERVIDOR a partir do D1)──► PagamentoService.createSumupCheckout()
  │                                                              │
  │ 2. grava `pagamentos` (status=pendente, valor_cents)         ▼
  │                                                          SumUp API  /v0.1/checkouts
  │ 3. devolve checkout_url (pay.sumup.com)
  ▼
window.location → pay.sumup.com  (cliente paga no ambiente SumUp; NÓS nunca vemos o cartão)
  │
  ├──► 4a. SumUp → POST /api/webhooks/sumup   (fonte de verdade assíncrona, valida HMAC)
  │                                            └─► PagamentoService.updateStatus()
  │
  └──► 4b. redirect → /area-cliente/pagamento/retorno  (confirmação síncrona best-effort)
                                              └─► GET /api/cliente/pagamento/retorno
                                                  └─► consulta SumUp + updateStatus()
```

**Princípios já corretos no design (manter):**

- ✅ O valor é **sempre recalculado no servidor** a partir do D1 (`checkout.ts` lê fotos,
  pacote e `valor_restante_pacote`). O cliente só envia `lote_id` — **nunca** o valor.
  Não confiar em valor vindo do front em hipótese alguma.
- ✅ Dados de cartão/PAN **nunca** trafegam pelo nosso backend — SumUp Checkout cuida disso.
- ✅ Ownership: `checkout.ts` e `retorno.ts` validam que a sessão pertence ao
  `clienteId` do JWT (403 caso contrário).
- ✅ `sumup_checkout_id` é `UNIQUE` (idempotência de linha).

## 2. Arquivos do subsistema

| Arquivo | Papel |
|---|---|
| `server/api/cliente/sessoes/[id]/checkout.ts` | GET (info de valor) / POST (cria checkout) |
| `server/api/cliente/pagamento/retorno.ts` | Confirmação síncrona pós-redirect |
| `server/api/webhooks/sumup.ts` | Callback assíncrono SumUp — **fonte de verdade** |
| `server/services/PagamentoService.ts` | Chamadas à API SumUp + CRUD `pagamentos` |
| `server/db/schema/pagamentos.ts` | Schema Drizzle |
| `server/db/migrations/023_pagamentos.sql` | Migration |
| `pages/area-cliente/pagamento/retorno.vue` | Tela de confirmação |
| `pages/area-cliente/selecao/[id].vue` | Inicia o checkout |

## 3. Secrets necessários (Cloudflare Pages)

Configurar como **secrets/variáveis de ambiente no painel do Cloudflare Pages** (não só
em `wrangler.toml`). O código lê via `process.env.*`.

| Nome | Tipo | Uso | Obrigatório |
|---|---|---|---|
| `SUMUP_API_KEY` | secret | Bearer token da API SumUp | **sim — o webhook reconsulta a SumUp para validar o valor antes de marcar pago; sem a key, pagamentos não são confirmados automaticamente** |
| `SUMUP_MERCHANT_CODE` | secret/var | `merchant_code` no checkout | sim |
| `SUMUP_WEBHOOK_SECRET` | secret | HMAC do webhook | **sim — sem ele o webhook recusa tudo (fail-closed)** |
| `SITE_URL` | var | base do `return_url` | recomendado |

> ⚠️ **Confirme o segredo do HMAC com a SumUp.** A validação assume HMAC-SHA256 do corpo
> cru com `SUMUP_WEBHOOK_SECRET`, comparado ao header `X-Signature` (hex, com possível
> prefixo `sha256=`). Se a SumUp usar outro esquema (ex.: assinatura por chave pública,
> ou HMAC de um campo específico), `validateHmac()` precisa ser ajustado **antes** de ir
> a produção, senão todos os webhooks legítimos serão rejeitados. Validar em sandbox.

URL do webhook a cadastrar no painel SumUp:
`https://fotografalilliatavares.com.br/api/webhooks/sumup`

## 4. Achados da revisão de segurança

Severidade: 🔴 crítico · 🟠 alto · 🟡 médio · 🔵 baixo/defesa-em-profundidade

### 🔴 [CORRIGIDO] Bypass de validação de assinatura no webhook

**Era:** `if (secret && signature) { ... }` — se o secret não estivesse configurado, **ou**
se o atacante simplesmente omitisse o header de assinatura, a validação era pulada e o
payload aceito. Qualquer um na internet poderia `POST /api/webhooks/sumup` com
`{"id":"<checkout_id>","status":"PAID"}` e marcar pagamentos como pagos **sem pagar nada**.

**Correção aplicada:** webhook agora é **fail-closed** — recusa (503) se `SUMUP_WEBHOOK_SECRET`
não estiver configurado e recusa (401) se a assinatura estiver ausente ou inválida.
A comparação do HMAC passou a ser **tempo-constante** (`timingSafeEqual`) para evitar
timing attacks.

### 🔴 [CORRIGIDO] `return_url` enviava `checkout_id` vazio

`checkout.ts` montava o `return_url` com o placeholder `__CHECKOUT_ID__` e o substituía
por string vazia. A SumUp **não** anexa o `checkout_id` na URL de retorno, então
`retorno.vue` recebia `checkout_id` vazio e **sempre** mostrava "erro" após pagar.

**Correção aplicada:** `return_url` agora leva só `?sessao_id=`. O front guarda o
`checkout_id` (devolvido no POST) em `sessionStorage` antes do redirect
(`selecao/[id].vue`) e o usa como fallback em `retorno.vue` (limpando depois). O webhook
continua sendo a fonte de verdade independente do retorno síncrono.

### 🟠 [CORRIGIDO] Regressão de status (`pago` → `cancelado`)

`updateStatus` sobrescrevia qualquer status. Webhooks da SumUp **podem chegar fora de
ordem**; um `CHECKOUT_CANCELLED` tardio poderia rebaixar um pagamento já `pago`.

**Correção aplicada:** `pago` virou **estado terminal** (`WHERE status != 'pago'` no update).
Uma vez confirmado, nada o rebaixa.

### 🟠 [CORRIGIDO] Verificação do VALOR pago (defesa em profundidade)

Antes, `pago` era confirmado só pelo `status`, sem conferir o valor efetivamente pago.

**Correção aplicada em ambos os caminhos:**
- `retorno.ts`: ao ver `PAID`, compara `Math.round(sumup.amount * 100)` com
  `pagamento.valor_cents` e confere a moeda (`BRL`). Divergência ⇒ **não** marca pago,
  loga e retorna `pendente`.
- `webhook sumup.ts`: ao receber evento `pago`, **reconsulta o checkout autoritativo** na
  SumUp (`SUMUP_API_KEY`) e valida `status` + valor + moeda antes de marcar pago — não
  confia no `amount` do payload. Sem a key, ou se a SumUp estiver indisponível, **não**
  confirma automaticamente (loga; o retorno síncrono / retry reconfirmam).

> ⚠️ **Confirmar em sandbox** o nome/unidade dos campos `amount` e `currency` na resposta
> da SumUp. O código assume `amount` em unidade maior (reais, ex.: `150.00`) e
> `currency = 'BRL'`. Se o campo for diferente, a verificação rejeitará pagamentos
> legítimos. A checagem de `amount` só roda quando o campo está presente; a de moeda só
> bloqueia se vier diferente de BRL.

### 🟡 [CORRIGIDO] Arredondamento do valor enviado à SumUp

O cálculo de desconto (`bruto * (1 - desconto/100)`) com floats pode gerar mais de 2
casas decimais (ex.: `451.2500000001`). A SumUp aceita no máximo 2 decimais e poderia
rejeitar o checkout ou arredondar de forma divergente de `valor_cents`. **Corrigido**
arredondando `valorTotal` a 2 casas antes de enviar e de calcular os cents.

### 🟡 [A AVALIAR] POST de checkout não é idempotente por lote

Cada POST cria um novo checkout SumUp + nova linha `pagamentos`. Um cliente que clique
duas vezes (ou recarregue) gera múltiplos checkouts pendentes para o mesmo lote.
Não é falha de segurança (valor recalculado, ownership validado), mas polui os dados e
pode confundir a conferência.

**Recomendado:** antes de criar, checar `getByLote(loteId)` — se já houver um `pendente`
recente, reutilizar/retornar o existente em vez de criar outro.

### 🟡 Status de "pago" não dispara liberação de entrega

A revisão não encontrou lógica que conecte `pagamentos.status = 'pago'` à liberação da
entrega/ZIP. Confirmar qual é a regra de negócio: o pagamento online é **opcional**
(cliente pode combinar com a Lillia), então a entrega provavelmente não deve ser
bloqueada por pagamento — mas isso precisa estar **explícito e documentado**, para não
haver suposição errada de que "pagou ⇒ liberou" ou "não pagou ⇒ bloqueado".

### 🔵 Vazamento de mensagem de erro da SumUp

`createSumupCheckout` faz `throw new Error('SumUp ${status}: ${text}')` com o corpo da
resposta da SumUp. Isso vira um 500 do Nitro; em produção o Nitro não expõe a stack, mas
convém **não** repassar `text` ao cliente. Logar internamente e devolver erro genérico
("Não foi possível iniciar o pagamento"). A API key nunca é logada — ok.

### 🔵 `.env` com secrets reais (local)

`.env` contém `CLIENT_JWT_SECRET`/`ADMIN_JWT_SECRET` reais e **está corretamente no
`.gitignore`** (não há vazamento no repositório). Recomendações: garantir que os secrets
de produção vivam **apenas** como secrets do Cloudflare Pages e que os valores em `.env`
local **não sejam reutilizados** em produção. Os mesmos cuidados valem ao adicionar os
secrets SumUp — não commitar, não colar em chats/PRs.

## 5. Checklist antes de ativar pagamentos em produção

- [ ] `SUMUP_WEBHOOK_SECRET` configurado no Cloudflare Pages (sem ele o webhook recusa tudo).
- [ ] Esquema de assinatura do webhook **confirmado em sandbox** contra `validateHmac()`.
- [ ] `SUMUP_API_KEY` e `SUMUP_MERCHANT_CODE` configurados (a key é necessária também no
      webhook, que reconsulta a SumUp para validar o valor).
- [ ] `SITE_URL` apontando para o domínio de produção.
- [ ] Campos `amount`/`currency` da resposta SumUp confirmados em sandbox (a verificação
      de valor depende deles — seção 4).
- [ ] Webhook cadastrado no painel SumUp na URL correta.
- [ ] Teste e2e em sandbox: criar checkout, pagar, voltar → tela mostra "pago"; webhook
      marca `pago`; valor confere; evento `cancelado` tardio NÃO rebaixa.
- [ ] Teste negativo: `POST /api/webhooks/sumup` sem assinatura → 401; com assinatura
      forjada → 401; pago com valor divergente → NÃO confirma.
- [ ] Regra de liberação de entrega vs pagamento documentada e validada (seção 4).

## 6. Regras invioláveis (para qualquer mudança futura)

1. **Nunca** confiar em valor/preço vindo do cliente — recalcular sempre do D1.
2. Webhook **sempre fail-closed**: sem assinatura válida, recusar. Nunca reintroduzir o
   `if (secret && signature)`.
3. `pago` é **terminal**. Não criar caminho que o rebaixe.
4. Comparações de assinatura/HMAC sempre em **tempo constante**.
5. **Não** armazenar nem logar dados de cartão, PAN, nem a `SUMUP_API_KEY`.
6. Toda rota de pagamento valida **ownership** (sessão pertence ao `clienteId` do JWT).
7. O webhook é a **fonte de verdade**; o retorno síncrono é best-effort e nunca deve ser
   a única forma de confirmar pagamento.
