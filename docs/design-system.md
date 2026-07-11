# Design System — Fotógrafa Lillia Tavares

> **Última atualização:** 2026-07-11
> Fonte canônica da **linguagem visual** do site: identidade, cores, tipografia (incl. a "voz da Lillia"), unidades, espaçamento, componentes-objeto, animação e iconografia.
> **Papéis dos docs:** linguagem visual → este arquivo · regras obrigatórias de código SCSS/Vue → [frontend-standards.md](frontend-standards.md) · iconografia proposta → [icones/README.md](icones/README.md).
> **Espécime vivo:** [design-system.html](design-system.html) — os itens renderizados de verdade (fontes reais embutidas, rem fluido, botões com hover, temas, animações). Ao mudar um token em `_variables.scss`, refletir lá também.

---

## 1. Identidade — o que o logo dita

O logotipo é a régua de estilo do site: uma **hortênsia desenhada à mão** (preenchimento sage, traço escuro orgânico e levemente deslocado do preenchimento) sobre uma **câmera em rosé**, ao lado da caligrafia **"Lillia Tavares" em bordô**.

Dele derivam os princípios:

| Princípio | Tradução prática |
|---|---|
| **Orgânico, não geométrico** | cantos arredondados, formas imperfeitas, traço com alma de desenho — nada de grids duros ou vetores frios |
| **Terroso e acolhedor** | paleta sage/creme/rosé/bordô; branco puro só como respiro |
| **A fotografia é a estrela** | UI discreta; cor forte (bordô/verde) reservada para ação e acento |
| **Feminino sem clichê** | rosé como acento, nunca como cor dominante de tela |

## 2. Cores

Tokens em [`assets/styles/_variables.scss`](../assets/styles/_variables.scss). Papéis:

### Núcleo da marca

| Token | Hex | Papel |
|---|---|---|
| `$green` | `#7B785B` | **Primária de UI** — títulos, botões, links. Sobre branco ≈ 4.3:1 → ok para texto ≥19rem/bold; para texto pequeno prefira `$dark-green` |
| `$dark-green` | `#2c2a15` | Texto de alto contraste, hover de `$green` |
| `$light-green` | `#e3dfcb` | Superfície de seção (fundos suaves), acento invertido sobre escuros |
| `$red` | `#6b2414` | **Bordô do logo** — ação secundária (`.btn-red`), destaque `.highlight`, focus ring |
| `$dark-red` | `#5e2012` | Variante escura do bordô |
| `$cream` / `$cream-light` | `#f7f4e8` / `#f4f2e9` | Fundos de página/seção — o "papel" do site |
| `$beige` / `$light-beige` | `#cfaf96` / `#E3DECA` | Eyebrows, bordas suaves, separadores |
| `$rose` | `#bd9187` | **Rosé do logo** — acento decorativo (hambúrguer, detalhes); não usar para texto pequeno sobre claro |
| `$rose-deep` | `#8a574c` | Rosé com AA — painéis (footer CTA), texto pequeno |
| `$panel` / `$panel-tan` | `#44432f` / `#e7d8c1` | Painéis de destaque (hero díptico) |

### Fundos do estúdio (cores reais amostradas das fotos)

`$fundo-azul #20435f` · `$fundo-bege #b7956f` · `$fundo-grafite #3a3a3d` · `$fundo-branco #dbd7d2` — usar apenas em contexto de estúdio/fundo infinito.

### Temas de LP

Cada LP tem trio dark/base/light(+ultralight) ativado por classe na raiz da página:

| Tema | Classe | Base |
|---|---|---|
| Corporativo | `.lp-corporativo` | `#101C2C` (azul-marinho) |
| Dia das Mães | `.lp-dia-das-maes` | `#9d7e69` (marrom quente) |
| Presentes | `.lp-presentes` | `#8b5e6b` (vinho rosado) |

**Regra:** componente compartilhado que entra numa LP deve responder ao tema via seletor `.lp-* { ... }` (ver `Footer.vue`, `Testimonials.vue`) — nunca hardcodar a cor do tema no componente.

### Contraste (AA é requisito, não meta)

- Texto pequeno sobre claro: `$dark-green`, `$dark-red` ou `$rose-deep`.
- `$green` sobre branco: só ≥19rem ou weight 900.
- `$rose` e `$beige`: decorativos, ou texto sobre fundos escuros.
- Sobre `$green`/`$rose-deep`/temas dark: branco ou `$cream`.

## 3. Tipografia

### Famílias

| Token | Fonte | Papel |
|---|---|---|
| `$lato` (aliases `$open`, `$openExtra`) | **Lato** 400 / 900 (self-hosted) | Tudo por padrão: títulos (900 uppercase), corpo (400) |
| `$serif-pessoal` | **Georgia** itálica (system font — custo zero) | **Voz da Lillia** — ver abaixo |
| `$manuscrita` | The Girl Next Door (self-hosted) | Decorativa/pontual (assinatura, rabiscos). Carregada em `_fonts.scss`, hoje sem uso em tela — usar com parcimônia ou nunca |

### A voz da Lillia (`.voz-lillia`)

Georgia itálica marca **o texto que é a Lillia falando** — pessoal, acolhedor, primeira pessoa — em contraste com o Lato "institucional". Classe em `_objects.scss` (`.hm` é alias legado; não usar em código novo).

**Usar em:**
- Convites e frases pessoais ("Vamos criar algo inesquecível juntas.")
- Introduções acolhedoras de seção ("Se antes de agendar você deseja conhecer o estúdio…")
- Citações e depoimentos em destaque
- Subtítulos emocionais que complementam um título Lato 900

**Não usar em:**
- Títulos de seção (permanecem Lato 900 uppercase)
- UI: botões, menu, labels, formulários
- Texto informativo/SEO (descrições de serviço, preços, FAQ)
- Uppercase, weight 900 ou tamanhos < 19rem (a itálica serif precisa de corpo para respirar)

**Par tipográfico canônico:**

```html
<h2 class="big-title">Conheça nosso Estúdio</h2>
<p class="description voz-lillia">Se antes de agendar você deseja conhecer o estúdio…</p>
```

### Escala (desktop, em rem fluido — ver §4)

| Classe | Tamanho | Uso |
|---|---|---|
| `.big-title` | 35rem / 900 / uppercase | Título de seção |
| `.title` | 28rem / 900 / uppercase | Título secundário |
| `.subtitle` | 25rem / 900 | Subtítulo |
| `.card-title` | 22rem / 900 | Título de card |
| `.description` | 19rem / 400 / lh 28rem | Corpo padrão |
| `.c-eyebrow` (local hoje) | 13rem / 700 / uppercase / tracking .12em | Kicker acima de título — candidata a `_objects` no 3º uso |

Mobile: as classes já reduzem via `m.max(...)` (frequentemente em `px` fixo — ex.: `.big-title` → 17px). Texto de corpo nunca abaixo do equivalente a 14px no mobile; alvo 16px+.

## 4. Unidades — rem fluido (⚠️ não é o rem convencional)

`main.scss` define:

```scss
html { font-size: clamp(.65px, calc(0px + .053vw), 1px); }
```

Ou seja: **1rem ≈ 1px** num viewport de ~1890px, **escalando fluidamente para baixo** até 0.65px. Todo o layout desktop encolhe proporcionalmente em telas menores — é por isso que os valores parecem "px com nome de rem" (`font-size: 19rem`).

- Dimensões sempre em `rem` (regra de [frontend-standards.md](frontend-standards.md)).
- `px` literal aparece nos overrides mobile (onde a escala fluida já parou de agir) e em valores < 5.
- Nunca assumir 1rem = 16px neste projeto.

## 5. Espaçamento e layout

- `$space: 20rem` · `$bigSpace: 35rem` — respiros padrão; `padding-top: calc(v.$space * 2)` é o respiro de título de seção.
- Utilitárias: `.pb10`–`.pb50`, `.pt0`–`.pt30`, `.ac` (center), `.ar` (right).
- `.container`: largura 1750rem, padding lateral 15rem, centrado.
- Ritmo de seção: alternar fundo branco / `$cream` / `$light-green` / painel escuro (`$green`, `$rose-deep`) para criar blocos legíveis sem linhas divisórias.

## 6. Elevação e forma

- Sombra padrão: `@include m.card-shadow` (repouso) e `m.card-shadow-hover` — sombras quentes (base `rgba(42,37,32,…)`), nunca preto puro.
- Botões `.btn`: pílula (`border-radius: 999px`), sombra dura deslocada `4rem 4rem` que cresce no hover — o "carimbo" da marca.
- Cards: raio pequeno `8rem`, borda `1.5px $light-green` ou sombra, fundo branco sobre seção colorida.
- Círculos para retratos/imagens de destaque (`border-radius: 50%` — ver intro da página de coloração).

## 7. Componentes-objeto (em `_objects.scss`)

| Objeto | Variantes | Nota |
|---|---|---|
| `.btn` | `.btn-white`, `.btn-red`, `.btn-green-light`, `.tiny` | CTA primário = `.btn` verde; nas LPs o tema recolore via seletor `.lp-*` |
| `.big-title` | `.centered`, `.red`, `.white`, `.green` | |
| `.description` | `.green`, `a` com underline+bg, `.highlight` | |
| `.voz-lillia` | — | §3; alias legado `.hm` |
| `.title-lp` / `.description-lp` / `.section-lp` | — | blocos de LP |
| `.slider-wrap-buttons` | `.centered`, `.studio-controls` | navegação Swiper |
| `.cover` | — | img absoluta cobrindo o pai |

Antes de criar CSS novo, conferir aqui (regra dos 3+ usos → `_objects.scss`).

## 8. Animação

Declarativa via atributos (GSAP instalado por `useScrollAnimations()`):

- `data-ani-type`: `fade-up` (padrão para seções), `fade`, `zoom-in`, `blur-in`, `polaroid` (fotos)
- Grupos: `data-ani-batch` + `data-ani-stagger` (padrão `0.07`) + `data-ani-batch-max`
- `prefers-reduced-motion` deve ser respeitado em animações/transitions manuais (padrão dos redesigns jul/2026)
- Micro-interações: transições de 0.2s em cor/fundo/borda; `translateY(-2px)` em hover de CTA

## 9. Breakpoints

`xs:600 · sm:900 · md:1024 · lg:1280 · xlg:1600` — via `m.max()` / `m.min()` / `m.between()`. Mobile-first não é o padrão aqui: o desktop é a base (rem fluido) e o mobile é override.

## 10. Iconografia

Proposta de ícones no estilo do logo (traço orgânico escuro + preenchimentos sage/rosé deslocados) em [docs/icones/](icones/) — categorias de portfolio, categorias de blog e serviços. Regras de uso e a ressalva do reset `.icon { fill: currentColor !important }` estão no [README de lá](icones/README.md).

Ícones utilitários existentes (WhatsApp, setas, external…) vivem em `assets/icons/` e são usados via `<Icon name="icons:...">` — esses são monocromáticos por design.

## 11. Checklist de qualidade (herdado dos redesigns jul/2026)

- [ ] Contraste AA em todo texto (ver §2)
- [ ] Corpo de texto ≥ equivalente a 16px (mínimo tolerado 14px no mobile)
- [ ] Foto real do acervo, nunca placeholder genérico
- [ ] `prefers-reduced-motion` respeitado
- [ ] Tema de LP via classe `.lp-*`, nunca cor hardcodada
- [ ] Reuso de `_objects.scss` antes de CSS novo; sem BEM; `rem`; `/* */` em SFC ([frontend-standards.md](frontend-standards.md))
