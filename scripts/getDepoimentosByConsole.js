
// === Script para extrair depoimentos do Google Meu Negócio ===
// Cole todo este script no console do Chrome na página de reviews.

(async () => {

  // === PASSO 1: Rolar para carregar todos os reviews ===
  async function loadAllReviews() {
    const container = document.querySelector('.Aq1rze') ||
                      document.querySelector('[jsname="GGBMFc"]') ||
                      document.querySelector('.review-dialog-list') ||
                      document.documentElement;

    let lastCount = 0;
    let stableRounds = 0;

    for (let i = 0; i < 150; i++) {
      container.scrollTop = container.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);

      document.querySelectorAll('div').forEach(d => {
        if (d.scrollHeight > d.clientHeight + 100 && d.clientHeight > 300) {
          d.scrollTop = d.scrollHeight;
        }
      });

      await new Promise(r => setTimeout(r, 1200));

      const count = document.querySelectorAll('article.VaHEVc').length;
      console.log(`Scroll ${i + 1}: ${count} reviews`);

      if (count === lastCount) {
        stableRounds++;
        if (stableRounds >= 8) break;
      } else {
        stableRounds = 0;
        lastCount = count;
      }
    }
    console.log(`✅ Scroll completo. Total: ${lastCount} reviews carregados.`);
  }

  // === PASSO 2: Expandir todos os textos truncados ===
  async function expandAllReviews() {
    // Abordagem 1 (estrutural — robusta independente de jsname):
    // O container com jscontroller="vdnftc" sempre tem como segundo filho
    // o div com o texto completo oculto. Força display diretamente.
    let forcedCount = 0;
    document.querySelectorAll('[jscontroller="vdnftc"]').forEach(container => {
      Array.from(container.children).forEach(child => {
        if (child.tagName === 'DIV' && child.style.display === 'none') {
          child.style.display = 'block';
          forcedCount++;
        }
      });
    });
    console.log(`🔎 ${forcedCount} divs de texto completo forçados via estrutura DOM.`);

    // Abordagem 2 (por jsname="PBWx0c" — cobre casos onde display não está inline):
    document.querySelectorAll('[jsname="PBWx0c"]').forEach(div => {
      div.style.display = 'block';
    });

    // Abordagem 3 (fallback via aria-controls):
    // Usa o atributo aria-controls do botão para localizar o container pelo id
    // e forçar qualquer filho oculto, sem depender de jsname.
    const expandButtons = document.querySelectorAll('a[aria-controls]');
    expandButtons.forEach(btn => {
      const containerId = btn.getAttribute('aria-controls');
      const container = containerId ? document.getElementById(containerId) : null;
      if (container) {
        Array.from(container.children).forEach(child => {
          if (child.tagName === 'DIV') child.style.display = 'block';
        });
      }
    });
    console.log(`🖱  ${expandButtons.length} botões processados via aria-controls.`);

    // Aguarda o DOM estabilizar
    await new Promise(r => setTimeout(r, 600));
    console.log(`✅ Todos os textos expandidos.`);
  }

  // === PASSO 3: Extrair os dados ===
  function extractReviews() {
    const reviews = [];

    document.querySelectorAll('article.VaHEVc').forEach((el) => {
      const nameEl = el.querySelector('a.PskQHd');
      const photoEl = el.querySelector('img.ooGZkf');
      const dateEl = el.querySelector('span.KEfuhb');
      const starsEl = el.querySelector('span.DYizzd');

      // Ordem de prioridade para o texto:
      // 1. Filho oculto do [jscontroller="vdnftc"] — estrutural, independe de jsname
      // 2. [jsname="PBWx0c"] — container do texto completo pelo jsname conhecido
      // 3. [jsname="lvvS4b"] — container truncado (tem link "Exibir..." que será ignorado)
      // 4. div.gyKkFe.Fv38Af — wrapper externo como último recurso
      const jsCtrlContainer = el.querySelector('[jscontroller="vdnftc"]');
      const structuralEl = jsCtrlContainer
        ? Array.from(jsCtrlContainer.children).find(
            child => child.tagName === 'DIV' && child !== jsCtrlContainer.firstElementChild
          )
        : null;
      const fullEl      = structuralEl || el.querySelector('[jsname="PBWx0c"]');
      const truncatedEl = el.querySelector('[jsname="lvvS4b"]');
      const fallbackEl  = el.querySelector('div.gyKkFe.Fv38Af');
      const textContainer = fullEl || truncatedEl || fallbackEl;

      let text = '';
      if (textContainer) {
        // TreeWalker coleta apenas nós de texto, ignorando links e elementos ocultos
        const walker = document.createTreeWalker(textContainer, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            // Ignora filhos do link "Exibir avaliação completa"
            if (node.parentElement?.closest('a[jsname="ix0Hvc"], a.zjlSIe')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        const parts = [];
        let node;
        while ((node = walker.nextNode())) {
          const t = node.textContent.trim();
          if (t) parts.push(t);
        }
        text = parts.join(' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/\.\.\.\s*$/, '')  // remove "..." de textos truncados
          .trim();
      }

      const name = nameEl ? nameEl.textContent.trim() : 'Anônimo';
      const photo = photoEl ? photoEl.getAttribute('src') || '' : '';
      const dateText = dateEl ? dateEl.textContent.trim() : '';

      let rating = 5;
      if (starsEl) {
        const label = starsEl.getAttribute('aria-label') || '';
        const match = label.match(/(\d)/);
        if (match) rating = parseInt(match[1]);
      }

      if (text) {
        reviews.push({
          id: reviews.length + 1,
          name,
          photo,
          rating,
          date: dateText,
          text
        });
      }
    });

    return reviews;
  }

  // === EXECUTAR ===
  await loadAllReviews();
  await expandAllReviews();
  const reviews = extractReviews();

  const output = {
    title: 'O que dizem sobre mim',
    description: `Mais de ${reviews.length} avaliações 5 estrelas no Google. Veja o que minhas clientes falam sobre a experiência de um ensaio fotográfico comigo.`,
    reviews
  };

  console.log(`\n🎉 ${reviews.length} reviews extraídos!`);
  console.log('Primeiros 3:', reviews.slice(0, 3));

  // === Baixar como arquivo JSON ===
  const json = JSON.stringify(output, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  a.download = 'index.json';
  a.click();
  console.log('📥 Download do arquivo index.json iniciado!');

})();