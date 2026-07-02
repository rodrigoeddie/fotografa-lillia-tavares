# Segurança & LGPD — Estado e Operação

> **Última atualização:** 2026-07-01 (execução do P1 do [ROADMAP.md](ROADMAP.md))
> Complementa [pagamentos-seguranca.md](pagamentos-seguranca.md) (específico do gateway SumUp).

## 1. Consentimento de cookies (LGPD)

**Como funciona agora:**

- Nenhum script não-essencial carrega antes do opt-in. O GA4 (único tracker ativo) só é injetado por [plugins/third-party.client.ts](../plugins/third-party.client.ts) quando a categoria `analytics` está consentida.
- Fonte única do estado: [composables/useCookieConsent.ts](../composables/useCookieConsent.ts) (`localStorage.lgpd_consent` + `useState`).
- O banner ([components/templates/CookieConsent.vue](../components/templates/CookieConsent.vue)) tem 3 categorias (analytics / marketing / recording) + essenciais fixos.
- **Revogação:** ao reduzir permissões, o composable apaga cookies conhecidos (`_ga*`, `_gcl*`, `_fbp/_fbc`, `smartlook*`) e recarrega a página para descarregar os scripts.
- **Reabertura:** botão "Gerenciar preferências de cookies" na página `/privacidade-e-termos` chama `manage()`.
- **Trilha de auditoria:** todo save é registrado no D1, tabela `consentimentos` (migration `026_consentimentos.sql`, aplicada em produção em 2026-07-01), via `POST /api/public/consent` — guarda UUID anônimo do navegador, flags, user-agent e timestamp. É a prova de consentimento exigida pelo art. 8º §2º.

**⚠️ Ao reativar Meta Pixel ou Smartlook:**
1. Descomentar o bloco correspondente em `plugins/third-party.client.ts` (já condicionado à categoria certa).
2. **Adicionar os hosts na CSP** em `nuxt.config.ts` (const `contentSecurityPolicy`): `connect.facebook.net` + `www.facebook.com` (Pixel) ou `web-sdk.smartlook.com` + `*.smartlook.cloud` (Smartlook). Sem isso o navegador bloqueia silenciosamente.

## 2. Direito ao esquecimento

`DELETE /api/admin/clientes/[id]` agora executa a exclusão LGPD completa via [LgpdService.wipeCliente()](../server/services/LgpdService.ts):

| O que | Onde |
|---|---|
| Cliente (nome, email, celular, senha) | D1 `clientes` |
| Sessões, fotos de sessão, lotes, seleções (inclui comentários) | D1 |
| Entregas e pagamentos | D1 |
| Notificações e push subscriptions do cliente | D1 |
| Fotos dos ensaios + avatares + BGs | **Cloudflare Images** (API delete) |
| ZIPs de entrega | **R2** (delete assinado) |

Notas:
- A exclusão é **irreversível** — o confirm no admin (`/admin/clientes`) avisa o escopo completo.
- Se as credenciais R2 não estiverem configuradas, as chaves órfãs são logadas com prefixo `[lgpd]` para limpeza manual.
- **Registros financeiros:** as linhas de `pagamentos` saem do D1; os comprovantes fiscais permanecem no painel SumUp (a obrigação de guarda fiscal é coberta pelo processador). Se um dia for necessário reter localmente, trocar o delete por anonimização.
- Fluxo do titular: pedido chega por e-mail (política de privacidade, §1.8) → admin abre `/admin/clientes` → excluir. Prazo de resposta prometido: 15 dias úteis.

## 3. Retenção de dados

- Política pública: **5 anos** após o fim da relação comercial, fotos incluídas (`/privacidade-e-termos` §1.8).
- 🔶 **Ainda não automatizado** — não há rotina que apague clientes/fotos com mais de 5 anos. Decisão pendente (ROADMAP → Decisões pendentes #2). Enquanto isso, a exclusão é sob demanda (item 2 acima).

## 4. Headers de segurança

Definidos em `nuxt.config.ts` → `nitro.routeRules['/**']` (vão para o `_headers` do Pages no build):

- `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (já existiam).
- **`Content-Security-Policy`** (adicionada 2026-07-01) — allowlist: self, Google Fonts, GA4/GTM, R2 (uploads presigned do admin), APIs do Iconify, e em `frame-src` Google Maps + YouTube/Vimeo/Instagram (embeds de vídeo do portfolio). `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`.
- `'unsafe-inline'` em script/style é exigido pelo payload inline do Nuxt — remover exigiria nonces (não suportado bem em Pages estático).
- **Regra de ouro: novo serviço externo ⇒ atualizar a CSP antes do deploy.**

## 5. Rate limiting

- Util: [server/utils/rate-limit.ts](../server/utils/rate-limit.ts) — janela fixa por IP em KV, fail-open sem binding (dev local).
- Binding: `RATE_LIMIT` (KV namespace `98c8632316814423a6f42cf99fbcb4a3`, criado 2026-07-01) em `wrangler.toml` (produção + preview).
- Aplicado em:

| Endpoint | Limite |
|---|---|
| `POST /api/cms-login` (admin) | 10 / 10 min / IP |
| `POST /api/cliente/auth/login` | 10 / 10 min / IP |
| `POST /api/webhooks/sumup` | 60 / min / IP |
| `POST /api/public/consent` | 20 / 10 min / IP |

- Caveat: KV é eventualmente consistente entre PoPs — o limite é aproximado; suficiente contra brute force, não é contador exato.

## 6. Senhas

| Conta | Formato | Observações |
|---|---|---|
| Admin | PBKDF2-SHA256 100k it. (colunas `password_hash` + `salt`) | desde revisão jun/2026 |
| Cliente | `pbkdf2$<salt>$<hash>` na coluna `senha_hash` | **novo (2026-07-01)** |
| Cliente legado | SHA-512 hex (128 chars) | aceito no login e **re-hashado automaticamente para PBKDF2 na primeira autenticação** |

- Login do cliente também ganhou verificação dummy (anti-enumeração por timing), como o do admin.
- `clientes.senha_acesso` (cópia AES para o admin exibir a senha de acesso) permanece inalterada.
- Não há migration de dados: o upgrade é gradual, no login. Clientes que nunca logarem mantêm SHA-512 — aceitável, mas se quiser forçar, basta redefinir a senha no admin (já grava PBKDF2).

## 7. Ambientes

- **Preview isolado**: `env.preview` no `wrangler.toml` agora aponta para o D1 `fotografa-lillia-preview` (`2dffc005-5691-40e2-b884-e9b636e70d26`), criado em 2026-07-01 com todas as migrations aplicadas. Preview **não escreve mais no banco de produção**.
  - Banco começa vazio (sem seed de conteúdo). Para popular: restaurar um backup de `scripts/backups/` com `wrangler d1 execute fotografa-lillia-preview --remote --file=<backup>.sql`.
  - O bucket R2 continua compartilhado (fotos não são apagadas por operações normais do preview).
- Nova migration ⇒ `bun run migrate:prod` + `bun run migrate:preview` (tabela `d1_migrations` controla o que já foi aplicado em cada banco — ver [../server/CLAUDE.md](../server/CLAUDE.md)).

## 8. Pendências desta frente (pós-P1)

- [ ] Automatizar retenção de 5 anos (depende da decisão de negócio).
- [ ] Registrar consentimento também para clientes logados (associar `visitor_id` ao `cliente_id`).
- [ ] 2FA para super_admin.
- [ ] Log de auditoria de ações do admin (quem apagou o quê).
- [ ] Validar a CSP em produção nas páginas com embeds (portfolio com vídeo, mapa do estúdio, admin com upload R2) — qualquer bloqueio aparece no console do navegador como `Refused to ...`.
