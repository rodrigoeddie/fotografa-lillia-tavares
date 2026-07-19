# Iconografia proposta — estilo do logo

> **Última atualização:** 2026-07-11 · Proposta para avaliação (nada aqui está integrado ao site ainda).
> Linguagem visual geral: [docs/design-system.md](../design-system.md) §10.

Conjunto de ícones desenhado a partir da anatomia do logotipo (hortênsia + câmera + caligrafia): **traço orgânico escuro com preenchimento suave deslocado** — como o desenho à mão do logo, em que a tinta não fica perfeitamente dentro da linha.

**Preview visual:** abrir [preview.html](preview.html) (ou o artifact publicado) — mostra os ícones em cards de categoria, rampa de tamanhos e fundos escuros da paleta.

## Spec de estilo

| Regra | Valor |
|---|---|
| Grid | `viewBox 0 0 48 48`, ~4px de margem interna |
| Traço | `#35331F` (oliva-tinta do logo), `stroke-width 2.2` (detalhes 1.4–2), `round` caps/joins |
| Preenchimentos | sage `#DFDCC6` · rosé `#E3BCAE` · rosé-fundo `#B06F5E` · verde `#7B785B` · bordô `#6B2414` (acentos mínimos) |
| Deslocamento | o fill fica ~1.5–2px deslocado do traço (o "charme" do logo) — exceto onde vira ruído (aí fill e traço coincidem) |
| Forma | curvas levemente assimétricas, nada perfeitamente reto ou simétrico; sem gradientes, sem sombras |
| Regra de cor | máx. 1 fill dominante + 1 acento por ícone; bordô só em detalhes pequenos (botões, coração) |

## Inventário

### Categorias de portfolio (`portfolio_categorias`)

| Arquivo | Metáfora | Slug |
|---|---|---|
| [cat-corporativo.svg](cat-corporativo.svg) | crachá com foto | `corporativo` |
| [cat-sensual-intimista.svg](cat-sensual-intimista.svg) | lábios sensuais | `sensual-intimista` |
| [cat-dia-das-maes.svg](cat-dia-das-maes.svg) | coração mãe + coração bebê | `dia-das-maes` |
| [cat-gestante.svg](cat-gestante.svg) | perfil gestante | `gestante` |
| [cat-aniversario.svg](cat-aniversario.svg) | balão + confetes | `aniversario` |
| [cat-casal.svg](cat-casal.svg) | corações entrelaçados | `casal` |

### Categorias de blog (`blog_categorias`)

| Arquivo | Metáfora | Slug |
|---|---|---|
| cat-corporativo.svg (reuso) | crachá com foto | `fotografia-corporativa` |
| [blog-cenarios-tematicos.svg](blog-cenarios-tematicos.svg) | fundo de estúdio + estrela | `cenarios-tematicos` |
| [blog-presentes.svg](blog-presentes.svg) | caixa de presente | `presentes` |
| [blog-dicas.svg](blog-dicas.svg) | lâmpada com raminho | `dicas` |

### Serviços (menu §6 / home)

| Arquivo | Metáfora | Serviço |
|---|---|---|
| [srv-ensaio.svg](srv-ensaio.svg) | câmera com folha (eco direto do logo) | ensaio fotográfico |
| [srv-estudio.svg](srv-estudio.svg) | softbox no tripé | estúdio / aluguel |
| [srv-coloracao.svg](srv-coloracao.svg) | leque de cartelas | análise de coloração |
| [srv-consultoria.svg](srv-consultoria.svg) | cabide com coração | consultoria de imagem |
| [tag-precos.svg](tag-precos.svg) | etiqueta de preço | preços e pacotes (submenu do header P5) |
| [srv-aluguel.svg](srv-aluguel.svg) | chave | aluguel do estúdio |
| [sobre-fotografa.svg](sobre-fotografa.svg) | hortênsia com folha (eco do logo) | a fotógrafa Lillia |
| [sobre-depoimentos.svg](sobre-depoimentos.svg) | balão de fala com coração + estrela | depoimentos |
| [sobre-blog.svg](sobre-blog.svg) | página com linhas | blog |
| [sobre-faq.svg](sobre-faq.svg) | balão com interrogação | FAQ / perguntas frequentes |

**Em uso desde 2026-07-11:** 13 ícones integrados ao dropdown do menu (todos os subitens) via [components/blocks/BrandIcon.vue](../../components/blocks/BrandIcon.vue) — inline, sem a classe `.icon` (ver ⚠️ abaixo).

**Futuros** (quando as categorias existirem): natal (bola de árvore com laço), casamento civil/casal (aliança dupla), espetáculo (máscara/cortina).

## ⚠️ Como integrar (importante)

O reset global tem `.icon, .icon * { fill: currentColor !important; }` ([_reset.scss](../../assets/styles/_reset.scss)) — **isso destrói ícones multicoloridos**. Ao integrar:

1. **Não** aplicar a classe `.icon` nem usar via `<Icon name="icons:...">` (o pipeline atual serve os monocromáticos de `assets/icons/`).
2. Usar **inline SVG** em componente próprio (ex.: `BlocksIconeMarca`) ou `<img src>` — preserva as cores.
3. Se um contexto pedir versão monocromática (footer escuro, hover), criar variante só-traço: remover os fills e trocar `stroke` por `currentColor` — a silhueta de traço aguenta monocromia; os fills não.
4. Tamanho mínimo recomendado: **24px** (abaixo disso o traço 2.2 fecha os detalhes).

## Onde testar primeiro

- Barra de categorias do portfolio (`SectionsPortfolioMenuCategories`) — chip com ícone 24–28px + label.
- Barra de categorias do blog (`SectionsBlogMenuCategories`) — idem.
- Painel de serviços do hero da home (ícone 40–48px por serviço).
- Cards "entregáveis" do hub de presentes.
