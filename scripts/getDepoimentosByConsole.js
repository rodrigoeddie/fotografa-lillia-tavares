
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
    const expandButtons = document.querySelectorAll(
      'a[jsname="ix0Hvc"], a.zjlSIe, a[aria-label="Exibir avaliação completa"]'
    );
    console.log(`🔎 Encontrados ${expandButtons.length} botões "Exibir avaliação completa". Expandindo...`);

    for (const btn of expandButtons) {
      try {
        btn.click();
        await new Promise(r => setTimeout(r, 300));
      } catch (e) {
        // ignora se algum falhar
      }
    }

    // Esperar o DOM atualizar
    await new Promise(r => setTimeout(r, 1000));
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

      // Pega o container do texto (jsname="lvvS4b" contém o texto completo após expandir)
      const expandedEl = el.querySelector('[jsname="lvvS4b"]');
      const fallbackEl = el.querySelector('div.gyKkFe.Fv38Af');
      const textContainer = expandedEl || fallbackEl;

      let text = '';
      if (textContainer) {
        // Pega só os nós de texto, ignorando o link "Exibir avaliação completa"
        const walker = document.createTreeWalker(textContainer, NodeFilter.SHOW_TEXT, null, false);
        const parts = [];
        let node;
        while ((node = walker.nextNode())) {
          const t = node.textContent.trim();
          if (t && t !== 'Exibir avaliação completa') parts.push(t);
        }
        text = parts.join(' ')
          .replace(/\s{2,}/g, ' ')
          .replace(/\.\.\.\s*$/, '')
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