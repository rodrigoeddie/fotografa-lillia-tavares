# Conteúdo Markdown - Arquivos Separados

Este projeto usa **Nuxt Content** com múltiplos arquivos markdown para facilitar a edição de textos mantendo a estrutura de dados acessível.

## Estrutura

```
content/
├── index.md          # Conteúdo principal da homepage (título, descrição)
├── home/
│   └── sobre.md      # Seção "Sobre" da homepage
├── investimento/     # Preços dos pacotes
└── faq.json          # Perguntas frequentes
```

## Como Usar

### 1. Criar um arquivo markdown

**Exemplo:** `content/home/sobre.md`

```md
---
title: "Fotógrafa Lillia Tavares"
---

Com [estúdio em Mogi das Cruzes](/estudio), especializada em retratos e ensaios corporativos.

Transformo cada sessão em uma experiência acolhedora, criando um ambiente onde os modelos se sentem à vontade.

Possuo a sensibilidade necessária para capturar imagens que revelam não apenas a aparência, mas também a personalidade de cada pessoa.
```

### 2. Carregar no componente Vue

```vue
<script setup>
const { data: sobre } = await useAsyncData('home-sobre', () => {
  return queryCollection('content').path('/home/sobre').first()
});

// Acessar dados:
sobre.value?.title  // "Fotógrafa Lillia Tavares"
sobre.value?.body   // AST do markdown (parágrafos, links, etc)
</script>
```

### 3. Converter para HTML (se necessário)

Use os composables criados:

```vue
<script setup>
// Para HTML completo (com tags <p>, <a>, etc)
const html = computed(() => useMarkdownToHtml(sobre.value?.body));

// Para array de texto puro
const paragraphs = useMarkdownParagraphs(sobre.value?.body);
// ['Texto do parágrafo 1', 'Texto do parágrafo 2', ...]
</script>

<template>
  <!-- Renderizar HTML -->
  <div v-html="html"></div>
  
  <!-- Ou acessar parágrafos individualmente -->
  <p v-for="(text, index) in paragraphs" :key="index">
    {{ text }}
  </p>
</template>
```

## Vantagens

✅ **Fácil de escrever**: Markdown é muito mais simples que JSON para textos longos  
✅ **Suporte a links**: Use `[texto](url)` naturalmente  
✅ **Acesso filtrado**: Carregue apenas o conteúdo que precisa  
✅ **Separação de conteúdo**: Cada seção em seu próprio arquivo  
✅ **Tipagem**: Dados estruturados com frontmatter YAML

## Composables Disponíveis

### `useMarkdownToHtml(body)`
Converte o body markdown em HTML string (para usar com `v-html`)

### `useMarkdownParagraphs(body)`
Extrai array de strings com o texto de cada parágrafo (sem HTML)

## Exemplo Completo

Ver: [pages/index.vue](../pages/index.vue) - Homepage usando múltiplos arquivos markdown
