/**
 * Generates scripts/backfill-blog-conteudo.sql with UPDATE statements
 * that populate `conteudo` and `album` in blog_posts from the legacy JSON content files.
 *
 * Run once:
 *   node scripts/gen-blog-backfill.cjs
 *   bunx wrangler d1 execute nuxt-content --local --file=scripts/backfill-blog-conteudo.sql
 *   bunx wrangler d1 execute nuxt-content --remote --file=scripts/backfill-blog-conteudo.sql
 */

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '../content/blog');
const outFile = path.join(__dirname, 'backfill-blog-conteudo.sql');

/** Escape single quotes for SQLite string literals */
function sqlEscape(str) {
  return str.replace(/'/g, "''");
}

const lines = [];
lines.push('-- Backfill blog_posts.conteudo + album from legacy JSON content files');
lines.push('-- Generated: ' + new Date().toISOString());
lines.push('');

let count = 0;

const categories = fs.readdirSync(contentDir).filter(f => {
  return fs.statSync(path.join(contentDir, f)).isDirectory();
});

for (const cat of categories) {
  const catDir = path.join(contentDir, cat);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const slug = path.basename(file, '.json');
    const raw = fs.readFileSync(path.join(catDir, file), 'utf-8');
    const data = JSON.parse(raw);

    const contentArr = Array.isArray(data.content) ? data.content : [];
    const conteudo = contentArr.join('\n');

    const albumArr = Array.isArray(data.album) ? data.album : [];

    if (!conteudo && albumArr.length === 0) {
      console.warn(`[SKIP] ${slug} — sem conteúdo nem álbum`);
      continue;
    }

    const sets = [];
    if (conteudo) {
      sets.push(`conteudo = '${sqlEscape(conteudo)}'`);
    }
    if (albumArr.length > 0) {
      sets.push(`album = '${sqlEscape(JSON.stringify(albumArr))}'`);
    }

    lines.push(`UPDATE blog_posts SET ${sets.join(', ')} WHERE slug = '${sqlEscape(slug)}';`);
    count++;
    console.log(`[OK] ${slug}`);
  }
}

lines.push('');
lines.push(`-- Total: ${count} posts`);

fs.writeFileSync(outFile, lines.join('\n'), 'utf-8');
console.log(`\nEscrito em: ${outFile} (${count} updates)`);
