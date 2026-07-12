# Header — diagnóstico + 5 propostas

> **Data:** 2026-07-11 · Status: **P5 APLICADA** (2026-07-11) — `Header.vue` (strip), `Menu.vue` (bullets removidos, dropdown-vitrine, CTA `.cta`), `components/blocks/BrandIcon.vue` (ícones inline). As demais propostas ficam como registro.
> Mockups funcionais: [propostas-header.html](propostas-header.html) — submenus abrem no hover/foco, com o menu §6 real, Lato e logo verdadeiros.

## O bug reportado (bullets × chevron "se encavalando")

**Sintoma:** em cada grupo do menu desktop, o separador `•` aparece grudado/sobreposto à seta do dropdown ("ENSAIOS •⌄").

**Causa raiz** ([components/templates/Menu.vue](../../components/templates/Menu.vue)):
1. O bullet é um `::after` **do link** (bloco global `.link::after`, ~linha 597), posicionado com `right: -6rem` no contexto `.from-header` (~linha 371) — ou seja, ele é desenhado *fora* da borda direita do link.
2. Com os submenus (P0-D), os grupos ganharam o botão `.submenu-toggle` (chevron) imediatamente à direita do link, dentro de `.item-row` — exatamente onde o bullet cai.
3. A regra `.link:last-child` que esconderia o bullet do último item não alcança links embrulhados em `.item` — só o CTA (link direto) escapa.

**Leitura de UX:** o bullet era separador de itens *simples*; num menu de grupos com chevron ele virou ruído sem função. Não é só reposicionar — é decidir o que o separador significa agora.

## As 4 propostas

| | Essência | Resolve | Esforço | Risco |
|---|---|---|---|---|
| **P1** Correção cirúrgica | Bullet sai do link e vira separador **entre** itens de topo (`.item + .item::before`); chevron ganha respiro e área de toque 36px | bug | ~15 linhas SCSS | nenhum |
| **P2** Respiro + CTA pílula ⭐ | Remove separadores (gap 26–30px separa melhor com 5 grupos); chevron cola no label; **CTA vira pílula** (estilo `.button` que o menu já tem) | bug + CTA §6 | ~30 linhas SCSS | baixo |
| **P3** Dropdown-vitrine | P2 + dropdown como cartão (raio, entrada 150ms) com **ícone de [docs/icones](../icones/)** + descrição de 1 linha por item | bug + CTA + menu vende | médio | médio (depende da iconografia) |
| **P4** Dois andares | Strip fino $cream (endereço · Instagram · WhatsApp) + andar principal 72px + CTA bordô; sticky colapsa | bug + CTA + contato no topo | alto | médio-alto |
| **P5** P3 ⊕ P4 | Strip utilitário + CTA bordô **e** dropdown-vitrine iconografado — o header completo (contato + vitrine + conversão) | tudo | alto (soma P3+P4) | médio-alto |

⭐ **Recomendação:** **P2** como base — menor ruído, fecha a pendência do CTA destacado ([ia-site.md §6](../ia-site.md)), risco baixo. Se a iconografia de docs/icones for aprovada, evoluir para **P3** numa segunda etapa (os dois compartilham o mesmo topo). **P5** é o destino final se as duas ambições forem desejadas — e dá para chegar nela **por etapas sem retrabalho**: P2 → P3 → +strip/CTA bordô. **P1** é o hotfix se quiser resolver o encavalamento hoje sem discutir design.

## Notas de implementação

- **P1:** no `Menu.vue`, remover `content:'•'` de `.link::after` (bloco global) e criar `.from-header .menu > * + *::before { content:'•'; ... }` centralizado no gap; `+ margin-left` no `.submenu-toggle`.
- **P2:** além do P1 (sem o separador novo), mover o chevron para **dentro** do link (span após `.txt`) mantendo o `<button>` só para teclado/mobile (ou `aria-haspopup` no link); classe `.cta` no último item — hoje o estilo `.button` é acionado por `blank=true`; criar acionador explícito (ex.: `item.path === '/agende-seu-ensaio'` ou campo novo `destaque` na tabela `menu_items`).
- **P3:** os subitens precisam de descrição — hardcoded num mapa `path → descrição` (rápido) ou coluna `descricao` em `menu_items` + campo no `MenuEditor` (correto). Ícones: inline SVG próprio, **sem** a classe `.icon` (reset `fill: currentColor !important` — ver [icones/README.md](../icones/README.md)). Ícone de "preços" (etiqueta) é novo/provisório.
- **P4:** strip novo no `Header.vue` acima da `.container`; revisar cálculo do sticky (`initialHeaderTopPosition`/`cachedHeaderHeight` são medidos no mount); decidir se o WhatsApp flutuante continua nas internas.
- **P5:** união dos escopos de P3 + P4 (nada novo além deles). Caminho incremental recomendado: aplicar P2 (topo), depois P3 (dropdown), depois o strip + CTA bordô da P4 — cada etapa é deployável sozinha. No sticky colapsado, esconder o strip primeiro (economiza os 34px).
- **A11y (todas):** manter `aria-expanded`/`aria-controls` + Escape do menu atual; foco visível 3px bordô; `prefers-reduced-motion` nas transições novas; área de toque ≥36px no chevron.
- Os mockups usam px fixos equivalentes ao render em ~1440px; no site, converter para o rem fluido (1rem ≈ 1px desktop — [design-system.md §4](../design-system.md)).

## Screenshots de referência

Bug ao vivo capturado em 2026-07-11 (dev server, menu §6 aplicado no banco local) — o cluster "•⌄" aparece em todos os grupos em 1440px e 1100px. Recriação exata no topo do [propostas-header.html](propostas-header.html).
