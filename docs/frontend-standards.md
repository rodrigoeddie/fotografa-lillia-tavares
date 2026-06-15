# Padrões de Frontend

Guia normativo para Claude e qualquer agente que toque em componentes `.vue` ou arquivos `.scss` deste projeto.

---

## SCSS — Regras obrigatórias

### Sem BEM
**Proibido** usar `__` ou `--` para nomear seletores (BEM).  
Use SCSS nested com classes simples e descritivas.

```scss
/* ❌ BEM — não usar */
.pricing-card__header { ... }
.pricing-card--recommended { ... }

/* ✅ Nested SCSS */
.pricing-card {
  .header { ... }
  &.recommended { ... }
}
```

### Sem `px` em dimensões
Use `rem` em todas as dimensões (1rem = 1px). A única exceção são valores menores que 5 quando o valor é em `px`.

```scss
/* ❌ */
padding: 16px;
font-size: 14px;

/* ✅ */
padding: 16rem;
font-size: 14rem;
```

### Variáveis e mixins já injetados
Todo `<style lang="scss" scoped>` já tem acesso a `v.$` e `m.` sem importar nada.

```scss
color: v.$green;
@include m.max(sm) { ... }
@include m.min(md) { ... }
```

Breakpoints disponíveis: `xs:600`, `sm:900`, `md:1024`, `lg:1280`, `xlg:1600`.  
Variáveis de cor disponíveis: `$green`, `$dark-green`, `$light-green`, `$red`, `$dark-red`, `$beige`, `$light-beige`, `$space`, `$bigSpace` e as variáveis de tema LP (`$lp-corporativo`, `$lp-dia-das-maes`, `$lp-presentes` e suas variantes).

### CSS repetido vai para `_objects.scss`
Se uma regra aparece em 3+ componentes, ela pertence a `assets/styles/_objects.scss`.  
Antes de escrever CSS novo, verifique se já existe uma classe em `_objects.scss` (`.btn`, `.big-title`, `.title`, `.card-title`, `.container`, `.ac`, `.ar`, `.pb*`, `.pt*`, `.section-lp`, `.title-lp`, `.description-lp`, `.cover`…).

### Comentários em `<style lang="scss">`
Use `/* */`, nunca `//` — o plugin Vue/Vite rejeita `//` dentro de blocos de estilo.

---

## Componentes — Regras obrigatórias

### Tamanho máximo
Componentes com mais de ~150 linhas devem ser avaliados para particionamento.  
**Cuidado:** antes de extrair um sub-componente, verifique se há lógica JS que acessa o DOM diretamente (refs, `querySelector`, GSAP targets). Mova as refs junto com o template que as usa.

### HTML repetido → componente atômico
Se o mesmo bloco de template aparece em 2+ lugares, crie um componente em `components/blocks/`.  
Padrões que já têm componente: card de portfolio (`BlocksCardSimplePortfolio`), FAQ item (`BlocksFaqItem`), depoimento (`BlocksTestimonial`), breadcrumb (`BlocksBreadcrumb`).

### Quando NÃO extrair
- Blocos de 3–5 linhas que mudam muito entre usos (variação > extração).
- Lógica de animação GSAP que usa refs locais — extrair quebra o `useScrollAnimations()`.

---

## Animações

Use os atributos declarativos, não GSAP manual nos componentes:

```html
data-ani-type="fade-up"      <!-- ou fade, zoom-in, blur-in, polaroid -->
data-ani-batch="grupo-nome"
data-ani-stagger="0.07"
data-ani-batch-max="3"
```

Novos tipos de animação entram em `composables/useScrollAnimations.ts`.

---

## Referências rápidas

| Quero... | Vou em... |
|---|---|
| Classe utilitária existente | `assets/styles/_objects.scss` |
| Variável de cor/espaçamento | `assets/styles/_variables.scss` |
| Mixin de breakpoint | `assets/styles/_mixins.scss` |
| Componente atômico reutilizável | `components/blocks/` |
| Bloco de LP | `components/landings/` |
| Tema de LP via CSS | classe `.lp-corporativo` / `.lp-dia-das-maes` / `.lp-presentes` na raiz da página |
