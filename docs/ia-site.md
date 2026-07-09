# ia-site.md — Arquitetura de Informação e Navegação

> **Última atualização:** 2026-07-09
> Estratégia de IA do site: prioridades de negócio, funil, regras de linking interno, estratégia de CTA e spec do menu. **Consultar antes de mexer em menu, links internos ou CTAs.**
> O estado real de cada página está em [paginas.md](paginas.md). O trabalho priorizado está no [ROADMAP.md](ROADMAP.md).

## 1. Prioridade de negócio (tabela canônica)

Única fonte desta ordem no repositório. Toda decisão de menu, CTA e link interno referencia esta tabela.

| # | Serviço | Estado no site | Páginas de dinheiro |
|---|---|---|---|
| 1 | **Ensaio fotográfico** | Maduro (carro-chefe: corporativo) | `/ensaio-fotografico`, `/precos-ensaios-fotograficos`, `/ensaio-profissional-em-mogi`, `/presente-ensaio-fotografico-mogi`, `/agende-seu-ensaio` |
| 2 | **Aluguel do estúdio** | Página existe, mal linkada | `/estudio-fotografico-em-mogi-das-cruzes/aluguel` |
| 3 | **Análise de coloração pessoal** | LP existe, pouca visibilidade | `/analise-coloracao-pessoal-em-mogi` |
| 4 | **Consultoria de imagem** | Quase invisível (citada em sobre e na LP de coloração) | Nenhuma — ver decisão §7 |

## 2. Funil e estágios

Cada página pública pertence a um estágio. O estágio determina o CTA (§4) e o tipo de link permitido (§3).

| Estágio | Definição | Rotas |
|---|---|---|
| `descoberta` | Visitante frio, veio de busca/social. Objetivo: educar e mostrar trabalho | `/blog/**`, `/ensaio-fotografico` (índice e categorias), `/sobre-fotografa-lillia-tavares`, `/` (home = hub, com dupla função) |
| `consideracao` | Já conhece, está avaliando. Objetivo: reduzir objeções | `/precos-ensaios-fotograficos/**`, `/estudio-fotografico-em-mogi-das-cruzes/**` (incl. cenários e aluguel), `/depoimentos`, `/perguntas-frequentes`, `/ensaio-fotografico/[cat]/[slug]` (detalhe) |
| `conversao` | Pronto para agir. Objetivo: fechar sem distração | `/agende-seu-ensaio`, LPs de campanha (`/ensaio-profissional-em-mogi`, `/presente-ensaio-fotografico-mogi/**`, `/analise-coloracao-pessoal-em-mogi`), `/orcamentos/**` |
| `pos-venda` | Cliente já fechou | `/area-cliente/**` |
| `suporte` | Institucional/legal | `/privacidade-e-termos`, `/links` |

## 3. Regras de linking interno (policy)

1. **Nenhuma página pública pode ficar órfã** — mínimo 2 links de entrada (menu conta como 1). Menos que isso → issue obrigatória em [paginas.md](paginas.md).
2. **Todo post de blog fecha com ≥1 link educativo + 1 CTA contextual** (portfolio da categoria, LP relacionada ou preços — nunca só texto).
3. **Toda página de serviço linka preço e agendamento** (direto ou via CTA de seção).
4. **Link de dinheiro tem prioridade**: se uma página menciona um serviço da tabela §1, ela linka a página de dinheiro daquele serviço (ex: página do estúdio DEVE linkar o aluguel).
5. **Páginas de conversão minimizam links de fuga** — FAQ inline se necessário, não link para fora do fluxo.
6. **Sazonal aponta para permanente**: posts/LPs de campanha (dia das mães, natal) linkam o portfolio/hub permanente do tema, para o link equity sobreviver à campanha.

## 4. Estratégia de CTA por estágio

| Estágio | CTA primário | CTA secundário | Tinyform? | Regra |
|---|---|---|---|---|
| `descoberta` | Link educativo (portfolio da categoria, post relacionado, preços) | WhatsApp discreto com texto pré-preenchido contextual | Sim, **só no fim** da página/post | Nunca conversão dura acima da dobra |
| `consideracao` | `/agende-seu-ensaio` | WhatsApp contextual ("vi o pacote X...") | Sim, como fechamento (padrão já existente no detalhe de portfolio) | Links educativos aqui são redutores de objeção (FAQ, depoimentos), não distração |
| `conversao` | WhatsApp com texto configurado (form da página / CTA do bloco da LP) | — | **Não** (a página É o form) | Minimizar links de fuga |
| `pos-venda` / `suporte` | — | — | Não | Sem CTA comercial |

**Papel do Tinyform** (`SectionsScheduleTinyform`): é a versão-seção do `/agende-seu-ensaio`. Usar como **fechamento** de páginas de descoberta e consideração; nunca competir com o form completo nas páginas de conversão. (O Tinyform dos posts do blog está morto hoje — religá-lo é item do ROADMAP P0-D.)

## 5. Spec do menu — flat v2 (executável hoje via `/admin/menu`, sem dev)

Menu e footer compartilham a tabela `menu_items` — uma edição resolve os dois. Após salvar: purge de cache (`/admin/cache`).

| # | Label | Path | Racional |
|---|---|---|---|
| 1 | Ensaios | `/ensaio-fotografico` | Renomeia "Trabalhos" — "ensaio" é a palavra que o cliente busca; prioridade nº 1 |
| 2 | Preços | `/precos-ensaios-fotograficos` | Consideração do serviço nº 1 |
| 3 | Estúdio | `/estudio-fotografico-em-mogi-das-cruzes` | Prioridade nº 2 (aluguel linkado de dentro — link L7 da matriz) |
| 4 | Coloração Pessoal | `/analise-coloracao-pessoal-em-mogi` | Prioridade nº 3 ganha a visibilidade que hoje não tem |
| 5 | Sobre | `/sobre-fotografa-lillia-tavares` | **Resolve a página órfã** no header E footer de uma vez |
| 6 | Blog | `/blog` | Descoberta |
| 7 | FAQ | `/perguntas-frequentes` | Suporte à consideração |
| 8 | Agende seu ensaio | `/agende-seu-ensaio` | CTA do menu vira a página de conversão (rastreável, com form + mapa) em vez do link cru de WhatsApp |

- **Remover "Home"**: o logo já leva para a home (padrão consolidado); libera espaço para os 8 itens.
- **WhatsApp direto** permanece no footer (bloco de links sociais, separado do menu) e nos CTAs contextuais das páginas.

## 6. Spec do menu — alvo com submenus (exige dev; 1 nível, máximo)

Grupos na ordem exata da prioridade de negócio (§1):

```
Ensaios                          Estúdio                         Imagem & Estilo         Sobre                     [CTA] Agende seu ensaio
├─ Portfólio                     ├─ Conheça o estúdio            ├─ Análise de           ├─ A fotógrafa Lillia
│  /ensaio-fotografico           │  /estudio-fotografico-...     │  coloração pessoal    ├─ Depoimentos
├─ Preços e pacotes              ├─ Aluguel do estúdio           └─ Consultoria de       ├─ Blog
│  /precos-ensaios-...           │  /estudio-.../aluguel            imagem (futuro,      └─ FAQ
├─ Ensaio corporativo            └─ Cenários                        ver §7)
│  /ensaio-profissional-...         /estudio-.../cenarios
└─ Presenteie um ensaio
   /presente-ensaio-...-mogi
```

**Escopo técnico** (item do ROADMAP P0-D):
- Migration: coluna `parent_id INTEGER NULL REFERENCES menu_items(id)` em `menu_items`.
- `MenuEditor.vue`: aninhamento de 1 nível no drag-and-drop (hoje é lista plana).
- `Menu.vue`: dropdown acessível — `aria-expanded`/`aria-controls`, navegação por teclado, hover + click — e acordeão no mobile.
- Footer: renderizar grupos como colunas (o footer P3 split assimétrico já aplicado comporta isso).
- Ao ativar: atualizar esta seção (a flat v2 vira histórico) e o campo "No menu" dos registros em [paginas.md](paginas.md).

## 7. Decisões de IA tomadas

Registro para não re-discutir. Novas decisões entram aqui com data.

- **2026-07-09 — NÃO criar rota `/servicos`.** O grupo "serviços" do menu com submenus **é** a taxonomia — visível em todas as páginas, sem custo de mais uma página. `/servicos` seria uma doorway page sem keyword (ninguém busca "serviços"; buscam "ensaio fotográfico em mogi", "aluguel de estúdio fotográfico", "análise de coloração pessoal") e forçaria um `/servicos/ensaio-fotografico` colidindo semanticamente com o portfolio `/ensaio-fotografico`. As páginas de dinheiro já existem por keyword (tabela §1) — o trabalho de IA é interligá-las, não adicionar camada de hierarquia.
- **2026-07-09 — Hero da home mantém `/agende-seu-ensaio` como CTA primário.** Parte do tráfego da home é morno (GBP, indicação, retorno de LP) e está pronto para converter — tirar a conversão do hero perde esse fluxo. A página `/sobre` sai da orfandade por menu (flat v2, item 5), footer (mesma tabela) e quick-link "Conheça a Lillia" no hero (task P0-B). Cliques já são rastreados (`data-track-event="cta-agendar-home"`) — se o GA4 mostrar outro padrão, reavaliar.
- **2026-07-09 — Consultoria de imagem em 3 tempos.** (1) Agora: seção de upsell na LP de coloração (coloração → consultoria é o upsell natural) + parágrafo com âncora na `/sobre` + item futuro no submenu "Imagem & Estilo" apontando para a âncora. (2) LP própria (`/consultoria-de-imagem-em-mogi`, via admin) **somente quando houver oferta/preço definidos** (decisão pendente #8 do ROADMAP). (3) Nunca criar rota fina sem oferta — página sem preço/pacote não converte nem rankeia.
- **2026-07-09 — Coloração pessoal fica na rota própria de LP** (`/analise-coloracao-pessoal-em-mogi`, keyword própria) — nem filha de `/servicos`, nem de `/sobre`.
