/**
 * Script para baixar as fotos dos reviewers do Google e salvar localmente.
 * 
 * Uso: node scripts/download-review-photos.js
 * 
 * - Lê content/depoimentos/index.json
 * - Baixa cada foto para public/assets/images/depoimentos/
 * - Atualiza o JSON com o caminho local
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const JSON_PATH = path.join(__dirname, '..', 'content', 'depoimentos', 'index.json');
const PHOTOS_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'depoimentos');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (!url || url === '') return resolve(false);

    // Trocar tamanho de s72 para s128 para melhor qualidade
    const betterUrl = url.replace(/=s\d+-/, '=s128-');

    const client = betterUrl.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);

    client.get(betterUrl, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        download(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        fs.unlinkSync(dest);
        return resolve(false);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', (err) => {
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

async function main() {
  // Criar diretório de fotos
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });

  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const review of data.reviews) {
    const filename = `reviewer-${review.id}.jpg`;
    const destPath = path.join(PHOTOS_DIR, filename);
    const publicPath = `/assets/images/depoimentos/${filename}`;

    if (!review.photo || review.photo === '') {
      review.photo = '';
      skipped++;
      continue;
    }

    // Pular se já foi baixado anteriormente
    if (fs.existsSync(destPath)) {
      console.log(`  ⏭ #${review.id} ${review.name} — já existe`);
      review.photo = publicPath;
      skipped++;
      continue;
    }

    process.stdout.write(`  📥 #${review.id} ${review.name}...`);
    const ok = await download(review.photo, destPath);

    if (ok) {
      review.photo = publicPath;
      downloaded++;
      console.log(' ✅');
    } else {
      review.photo = '';
      failed++;
      console.log(' ❌ falhou');
    }

    // Pequeno delay para não sobrecarregar
    await new Promise(r => setTimeout(r, 200));
  }

  // Salvar JSON atualizado
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');

  console.log(`\n🎉 Concluído!`);
  console.log(`   ✅ Baixados: ${downloaded}`);
  console.log(`   ⏭ Já existiam/sem foto: ${skipped}`);
  console.log(`   ❌ Falharam: ${failed}`);
  console.log(`\n📁 Fotos salvas em: public/assets/images/depoimentos/`);
  console.log(`📄 JSON atualizado: content/depoimentos/index.json`);
}

main().catch(console.error);
