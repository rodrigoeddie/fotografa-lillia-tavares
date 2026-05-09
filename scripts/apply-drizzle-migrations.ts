#!/usr/bin/env bun
// Aplica migrations Drizzle (server/db/drizzle/*.sql) no D1 via wrangler.
//
// IMPORTANTE: o arquivo 0000_*.sql é um BASELINE — snapshot do schema TS
// equivalente ao estado pós-migrations legacy 001..011. Em ambientes que já
// rodaram as legacy SQL (todos os ambientes atuais), o baseline NÃO deve ser
// aplicado (CREATE TABLE sem IF NOT EXISTS falha). Drizzle-kit usa o baseline
// internamente para diff de futuras migrations, mas a aplicação fica a cargo
// das migrations legacy. Aqui pulamos arquivos `0000_*.sql` por design.
//
// Para um D1 totalmente novo (que não rodou as legacy), aplique:
//   1) server/db/migrations/001..011 (via `bun run migrate:local` ou similar)
//   2) este script (db:apply:local) → aplica 0001+ se houver
//
// Uso:
//   bun scripts/apply-drizzle-migrations.ts --local
//   bun scripts/apply-drizzle-migrations.ts --remote

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const flag = process.argv.includes('--remote') ? '--remote' : '--local';
const dir = 'server/db/drizzle';
const dbName = 'nuxt-content';

let files: string[];
try {
  files = (await readdir(dir))
    .filter((f) => f.endsWith('.sql'))
    .filter((f) => !/^0000_/.test(f))   // pula baseline
    .sort();
} catch {
  console.log(`No directory ${dir} yet — run 'bun run db:generate' first.`);
  process.exit(0);
}

if (files.length === 0) {
  console.log(`No incremental drizzle migrations to apply in ${dir} (baseline 0000 ignored by design).`);
  process.exit(0);
}

for (const f of files) {
  const path = join(dir, f);
  console.log(`→ Applying ${f} (${flag})`);
  const res = spawnSync(
    'wrangler',
    ['d1', 'execute', dbName, flag, `--file=${path}`],
    { stdio: 'inherit' }
  );
  if (res.status !== 0) {
    console.error(`✗ Failed to apply ${f}`);
    process.exit(res.status ?? 1);
  }
}
console.log(`✓ ${files.length} drizzle migration(s) applied (${flag})`);
