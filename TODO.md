
# ToDo
Env vars a configurar no Wrangler

SUMUP_API_KEY       = Bearer token da API SumUp
SUMUP_MERCHANT_CODE = Código do estabelecimento SumUp
SUMUP_WEBHOOK_SECRET= Segredo para validar HMAC dos webhooks
SITE_URL            = https://fotografalilliatavares.com.br
Configurar no painel SumUp
Webhook URL: https://fotografalilliatavares.com.br/api/webhooks/sumup

Rodar a migration

wrangler d1 execute DB --remote --file=server/db/migrations/023_pagamentos.sql

------Dois pontos que você precisa validar em sandbox antes de produção
Campos amount/currency da resposta SumUp — o código assume amount em reais (ex.: 150.00) e currency = 'BRL'. Se os nomes/unidades forem diferentes, a verificação rejeitará pagamentos legítimos. (A checagem de amount só roda se o campo existir; a de moeda só bloqueia se vier ≠ BRL — então é tolerante, mas confirme.)
Esquema do HMAC do webhook — confirmar que a SumUp assina HMAC-SHA256 do corpo cru no header X-Signature.
Nova dependência: o webhook agora exige SUMUP_API_KEY (além do SUMUP_WEBHOOK_SECRET) para confirmar pagamentos. Documentei isso, atualizei a tabela de secrets e a checklist em docs/pagamentos-seguranca.md.

Pendências restantes (não-bloqueantes, documentadas): idempotência do POST de checkout e a regra explícita de liberação de entrega vs pagamento.

Não rodei build/typecheck (não há script dedicado e vue-tsc não está instalado). Se quiser, posso rodar um bun run build para validar a compilação completa.


Resumo das correções
🔴 Críticas

fs/raw.ts, fs/action.ts, fs/tree.ts — adicionado validateAdminToken(event) no topo dos três handlers. Também corrigido o bug de prefixo no safeResolve (startsWith(contentDir + path.sep)) e o re-path.resolve nos checks de rename/create.
upload.ts — exige validateAdminToken; adicionado limite de 15 MB e whitelist de tipos de imagem.
cf-images.ts — exige validateAdminToken.
🟠 Altas

server/middleware/admin-rbac.ts (novo) — autorização por role server-side em /api/admin/**, espelhando ROLE_SECTIONS da UI. editor/sessions só acessam suas seções; usuarios/* é exclusivo de super_admin; infra compartilhada (upload, r2, notificacoes, cron) liberada a qualquer admin. Fecha o broken function-level authorization.
server/api/auth.ts — removido (login legado com SHA1 + token estático).
🟡 Médias

admin-jwt.ts + useAdminAuth.ts — default de role sem claim mudou de super_admin → editor (fail-closed, menor privilégio).
cms-login.ts — agora roda PBKDF2 mesmo quando o e-mail não existe (hash/salt dummy), eliminando a enumeração de usuários por timing.
Docs atualizados em server/CLAUDE.md (middleware de RBAC + correção do hash de senha PBKDF2).

------

Não coberto (precisa de decisão/infra sua)
Rate limiting no login (#7, parte 2): brute force ainda é possível. Precisa de um binding KV ou Durable Object para contar tentativas por IP — não dá pra fazer confiável só em memória nos Workers. Posso implementar se você criar/apontar um namespace KV.
Caveat dos fs/*: no runtime Cloudflare o fs/promises provavelmente falha (FS read-only); o guard agora protege o uso em dev/preview de qualquer forma.
Não rodei build/typecheck (não há script de typecheck no projeto; não há auth.ts referenciado em lugar nenhum). Quer que eu rode bun run build para validar a compilação?
-----

Usando o gateway de pagamento da sumup (previamente pesquisado) crie um sistema de pagamentos para:

- um checkout para pagar o valor de fotos extras na seleção de fotos da area do cliente
- o admin pode adicionar o valor restante do pacote (fora o valor da entrada) na sessão (no lote) a ser pago no checkout da seleção (junto com as fotos extras)
- caso o cliente peça para selecionar mais fotos da sessão, após ter concluido uma primeira seleção, considerar que o lote será outro, e que a partir do lote 1 (a primeira entrega), o valor a ser calculado é somente de fotos extra
- o pagamento pode ser via cartão de crédito ou pix (o numero de parcelas permitidas está no prooduto->pacote-escolhido)
- o pagamento online não é obrigatório, ou seja, deixar claro que o cliente pode pagar online no checkout, ou se desejar tratar diretamente com a fotografa Lillia
<!-- 
criar um sistema de notificações para o admin e area-cliente:
- ao mudar o status das sessões no admin para avisar o cliente
- a uma entrega ser cadastrada no admin pra avisar o cliente
- a uma seleção ser feita na area-cliente para avisar o admin

- adicionar um prazo para a seleção (o prazo por ser aberto ou ter uma data especifica), e caso a data esteja proxima do prazo, mandar um email ou notificação
- no admin/sessoes quando a sessão for "Seleção concluída" e nao tiver nenhuma entrega mostrar um botão para cadastrar uma entrega
- no /admin/entregas/save o nome do arquivo na entrega, deve ter o nome do "Ensaio-" + produto + nome-do-cliente
- ao concluir a entrega, em area-cliente/meus-ensaios o card não mostra o novo status
- no admin entregas, ao clicar na entrega: Erro ao carregar: Entrega no encontrada (a url era pra ser /admin/entregas/save/1 ao invés disso, está mostrando /admin/entregas/save/3) -->

 - custom og-share para cada pagina
 - Páginas da interna dos outros preços
 - atualizar os produtos no google maps, e acrescentar dia das mães
 - Página de aluguel

 ## Página da lista de presentes:
 Presente com Ensaio Fotográfico em Mogi das Cruzes
 Conteúdo:
Explicação do porquê ensaio é um presente incrível
Benefícios emocionais
Para quais ocasiões serve
Seções:
🎁 Ideias de presente com ensaio
Dia das Mães → link
Aniversário → (futuro)
Casais → (futuro)

Trazer os produtos entregaveis
e na interna do presenteavel:
🔗 Interligação (OURO)

Na página de Dia das Mães, coloca:

“Veja outras ideias de presente com ensaio fotográfico”

👉 linkando de volta pro HUB

1) Nos últimos dias criei uma landing page para divulgar trabalhos comporativos ensaio-profissional-em-mogi (fiz o dominio ensaioprofissionalemmogi.com.br com redirect 301)
2) além disso tambem criei uma página presente-ensaio-fotografico-mogi/dia-das-maes para divulgar a campanha para o dia das mães, mas preciso criar presente-ensaio-fotografico-mogi/ com o intuito de criar um hub para as vendas das proximas campanhas, como natal, dia dos namorados, etc, essas são umas anotações que fiz para fazer na página:

## Página da lista de presentes:
Presente com Ensaio Fotográfico em Mogi das Cruzes
Conteúdo:
Explicação do porquê ensaio é um presente incrível
Benefícios emocionais
Para quais ocasiões serve

Seções:
- Ideias de presente com ensaio: Dia das Mães → link, Aniversário → (futuro), Casais → (futuro)
- Trazer os produtos entregaveis e na interna do presenteavel (entregáveis pois a ideia é mesmo que no dia das mães, o filho possa dar uma necessaire com um vale ensaio para a mãe)

Na página de Dia das Mães, coloca:
“Veja outras ideias de presente com ensaio fotográfico”
linkando de volta pro HUB

3) preciso criar um post no blog com o intuito de criar links internos, e promover a landingpage de presente de dia das mães

4) Página de análise coloração pessoal (a ideia é vender sempre análise de coloração pessoal e futuramente consultoria de imagem como sub-produto da fotografa Lillia Tavares)

5) como estou focando muito no SEO, faça uma varredura no site, para otimizar o SEO, especialmente JsonLD, title, description, imagem de share, e verificação do copy, o ênsafe é na venda de ensaios fotográficos em mogi das cruzes, e região (alto tiete)

