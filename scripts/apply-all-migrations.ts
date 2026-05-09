#!/usr/bin/env bun
/**
 * Pipeline de migrations + seeds para D1.
 *
 * Modos:
 *   --fresh   Roda TUDO em ordem (D1 limpo, primeiro deploy):
 *             1. server/db/migrations/001..011_*.sql (legacy SQL)
 *             2. scripts/backfill-portfolio-descricao.sql
 *             3. server/db/drizzle/0001+_*.sql (incrementais; baseline 0000 é pulado)
 *             4. server/db/seeds/*.sql
 *
 *   (default) Pula as legacy 001..011 (já aplicadas) e roda só:
 *             - drizzle incrementais, seeds.
 *             Use este modo em ambientes que já passaram pelas legacy.
 *
 * As legacy 001..011 só são totalmente idempotentes em D1 limpo (a 009 recria
 * `selecoes` removendo `sessao_id`, e a 001 referencia esse campo num índice).
 * Para o primeiro deploy SSR, use --fresh em D1 vazio.
 *
 * Uso:
 *   bun scripts/apply-all-migrations.ts --local
 *   bun scripts/apply-all-migrations.ts --remote
 *   bun scripts/apply-all-migrations.ts --local --fresh
 *   bun scripts/apply-all-migrations.ts --remote --fresh
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const flag   = process.argv.includes('--remote') ? '--remote' : '--local';
const fresh  = process.argv.includes('--fresh');
const dbName = 'nuxt-content';

function run(file: string) {
  console.log(`→ ${file} (${flag})`);
  const res = spawnSync('wrangler', ['d1', 'execute', dbName, flag, `--file=${file}`], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`✗ Falhou em ${file}`);
    process.exit(res.status ?? 1);
  }
}

/** Injeta IF NOT EXISTS em CREATE TABLE/INDEX/TRIGGER (drizzle-kit não emite). */
function makeIdempotent(sql: string): string {
  return sql
    .replace(/CREATE TABLE(?! IF NOT EXISTS)/gi, 'CREATE TABLE IF NOT EXISTS')
    .replace(/CREATE UNIQUE INDEX(?! IF NOT EXISTS)/gi, 'CREATE UNIQUE INDEX IF NOT EXISTS')
    .replace(/CREATE INDEX(?! IF NOT EXISTS)/gi, 'CREATE INDEX IF NOT EXISTS')
    .replace(/CREATE TRIGGER(?! IF NOT EXISTS)/gi, 'CREATE TRIGGER IF NOT EXISTS');
}

async function runDrizzle(srcPath: string) {
  const original = await readFile(srcPath, 'utf8');
  const patched = makeIdempotent(original);
  const tmpDir = join(tmpdir(), 'drizzle-apply');
  await mkdir(tmpDir, { recursive: true });
  const tmpPath = join(tmpDir, srcPath.replace(/[/\\]/g, '_'));
  await writeFile(tmpPath, patched);
  console.log(`→ ${srcPath} (${flag}, idempotent)`);
  const res = spawnSync('wrangler', ['d1', 'execute', dbName, flag, `--file=${tmpPath}`], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`✗ Falhou em ${srcPath}`);
    process.exit(res.status ?? 1);
  }
}

async function listSorted(dir: string, filter: (f: string) => boolean) {
  try {
    return (await readdir(dir)).filter((f) => f.endsWith('.sql') && filter(f)).sort();
  } catch {
    return [];
  }
}

let total = 0;

if (fresh) {
  // 1. Legacy migrations (001..011) — apenas em D1 limpo
  const legacy = await listSorted('server/db/migrations', () => true);
  for (const f of legacy) run(join('server/db/migrations', f));
  total += legacy.length;

  // 2. Backfill
  run('scripts/backfill-portfolio-descricao.sql');
  total += 1;
}

// 3. Drizzle migrations incrementais (pula baseline 0000; injeta IF NOT EXISTS)
const drizzleFiles = await listSorted('server/db/drizzle', (f) => !/^0000_/.test(f));
for (const f of drizzleFiles) await runDrizzle(join('server/db/drizzle', f));
total += drizzleFiles.length;

// 4. Seeds
const seeds = await listSorted('server/db/seeds', () => true);
for (const f of seeds) run(join('server/db/seeds', f));
total += seeds.length;

console.log(`✓ Pipeline ${fresh ? 'fresh' : 'incremental'} completo (${total} arquivo(s), ${flag})`);
