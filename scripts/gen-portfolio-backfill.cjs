/**
 * Generates a SQL file (backfill-portfolio-descricao.sql) with UPDATE statements
 * that populate descricao and artigo from the legacy JSON content files.
 *
 * Run once after applying migration 004_portfolio_descricao.sql:
 *   node scripts/gen-portfolio-backfill.cjs
 *   wrangler d1 execute nuxt-content --remote --file=scripts/backfill-portfolio-descricao.sql
 *   rm scripts/gen-portfolio-backfill.cjs scripts/backfill-portfolio-descricao.sql
 */

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/ensaio-fotografico');
const outFile = path.join(__dirname, 'backfill-portfolio-descricao.sql');

/** Derive DB slug from folder + filename, e.g. "01.corporativo/01.ivana-geraldelli.json" → "corporativo/ivana-geraldelli" */
function fileToSlug(catFolder, file) {
  const catSlug = catFolder.replace(/^\d+\./, '');
  const workSlug = path.basename(file, '.json').replace(/^\d+\./, '');
  return `${catSlug}/${workSlug}`;
}

function esc(str) {
  return (str ?? '').replace(/'/g, "''");
}

const lines = ['-- Auto-generated backfill for portfolio_works.descricao + artigo', '-- Apply after migration 004_portfolio_descricao.sql', ''];

const catFolders = fs.readdirSync(contentDir).filter(f => fs.statSync(path.join(contentDir, f)).isDirectory());

for (const catFolder of catFolders) {
  const catPath = path.join(contentDir, catFolder);
  const files = fs.readdirSync(catPath).filter(f => f.endsWith('.json') && f !== 'index.json');
  for (const file of files) {
    const slug = fileToSlug(catFolder, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(path.join(catPath, file), 'utf8'));
    } catch (e) {
      console.warn('⚠ Could not parse', file, e.message);
      continue;
    }
    const descricao = esc(data.description ?? '');
    const artigo = esc(data.artigo ?? 'a');
    lines.push(`UPDATE portfolio_works SET descricao='${descricao}', artigo='${artigo}' WHERE slug='${slug}';`);
  }
}

fs.writeFileSync(outFile, lines.join('\n') + '\n', 'utf8');
console.log(`✓ Generated ${outFile}`);
console.log('');
console.log('Next step: apply with wrangler:');
console.log('  wrangler d1 execute nuxt-content --remote --file=scripts/backfill-portfolio-descricao.sql');
