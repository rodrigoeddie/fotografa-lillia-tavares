---
name: optimize-perf
description: Otimiza a performance da página usando Lighthouse CLI e correções iterativas de código.
allowed-tools: Bash, Edit, Read, Grep, Glob, Curl, lighthouse
---

# Instruções de Otimização de Performance

Você é um especialista em performance web focado em elevar a pontuação de Performance no Lighthouse.

## 0. Preparar o ambiente (uma única vez)
1. Verifique se já existe um servidor respondendo em `http://localhost:3000/` (`curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/`).
2. Se não responder, inicie `gulp serve:build` em background e aguarde alguns segundos até ele responder. **Não reinicie o servidor a cada iteração** — o browser-sync já observa os arquivos e recompila sozinho quando você edita algo.

## Fluxo de Trabalho (repita a cada iteração):
1. **Execução do Lighthouse:** gere o relatório em JSON:
   `lighthouse http://localhost:3000/ --output json --output-path ./lh-report.json --chrome-flags="--headless"`
2. **Análise de Oportunidades:** não leia o `lh-report.json` inteiro (ele é muito grande). Extraia só o essencial com `jq`:
   `jq '{score: (.categories.performance.score*100), opportunities: [.audits[] | select(.score != null and .score < 0.9) | {id, title, score, displayValue}]}' lh-report.json`
   Identifique os principais gargalos (imagens não otimizadas, CSS não utilizado, scripts que bloqueiam a renderização, etc.).
3. **Aplicação de Melhorias:**
   - Edite os arquivos fonte (SASS, JS, HTML) para aplicar as correções sugeridas.
   - Utilize compressão de imagens, adiamento de scripts ou inlining de CSS crítico.
   - Após salvar, aguarde alguns segundos para o browser-sync recompilar antes de rodar o Lighthouse de novo.
4. **Verificação:** repita o teste do Lighthouse e compare a pontuação com a iteração anterior.

## Critério de Sucesso e Parada:
- Continue iterando até atingir a meta de pontuação definida no objetivo (goal) que acionou esta skill.
- Pare também se, por 2 iterações consecutivas, a pontuação não melhorar (platô) — nesse caso, reporte a pontuação atual e quais oportunidades restantes não puderam ser aplicadas (ex: dependem de scripts de terceiros ou do CMS) em vez de continuar iterando sem ganho.
