#!/usr/bin/env bun
// Aplica migrations Drizzle (server/db/drizzle/0001+_*.sql) no D1 via wrangler.
//
// O arquivo 0000_*.sql é um BASELINE — snapshot do schema TS equivalente ao
// estado pós-migrations legacy 001..011. Em ambientes que já rodaram as
// legacy SQL, o baseline não deve ser aplicado. Aqui pulamos `0000_*.sql`.
//
// As migrations geradas pelo drizzle-kit não emitem IF NOT EXISTS por padrão.
// Aqui pós-processamos cada arquivo injetando IF NOT EXISTS em CREATE
// TABLE/INDEX/TRIGGER antes de enviar ao wrangler, para idempotência.
//
// Uso:
//   bun scripts/apply-drizzle-migrations.ts --local
//   bun scripts/apply-drizzle-migrations.ts --remote

import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const flag     = process.argv.includes('--remote') ? '--remote' : '--local';
const dir      = 'server/db/drizzle';
const dbName   = 'nuxt-content';
const wrangler = 'node_modules/wrangler/bin/wrangler.js';

function makeIdempotent(sql: string): string {
  return sql
    .replace(/CREATE TABLE(?! IF NOT EXISTS)/gi, 'CREATE TABLE IF NOT EXISTS')
    .replace(/CREATE UNIQUE INDEX(?! IF NOT EXISTS)/gi, 'CREATE UNIQUE INDEX IF NOT EXISTS')
    .replace(/CREATE INDEX(?! IF NOT EXISTS)/gi, 'CREATE INDEX IF NOT EXISTS')
    .replace(/CREATE TRIGGER(?! IF NOT EXISTS)/gi, 'CREATE TRIGGER IF NOT EXISTS');
}

let files: string[];
try {
  files = (await readdir(dir))
    .filter((f) => f.endsWith('.sql'))
    .filter((f) => !/^0000_/.test(f))
    .sort();
} catch {
  console.log(`No directory ${dir} yet — run 'bun run db:generate' first.`);
  process.exit(0);
}

if (files.length === 0) {
  console.log(`No incremental drizzle migrations to apply in ${dir} (baseline 0000 ignored by design).`);
  process.exit(0);
}

const tmpDir = join(tmpdir(), 'drizzle-apply');
await mkdir(tmpDir, { recursive: true });

for (const f of files) {
  const srcPath = join(dir, f);
  const original = await readFile(srcPath, 'utf8');
  const statements = original
    .split(/--> statement-breakpoint/i)
    .map((s) => s.trim())
    .filter(Boolean);

  console.log(`→ Applying ${f} (${flag}, idempotent, ${statements.length} statement(s))`);

  for (const stmt of statements) {
    const patched = makeIdempotent(stmt);
    const isAlterAdd = /ALTER TABLE .+ ADD\s+(?:COLUMN\s+)?`/i.test(patched);
    const tmpPath = join(tmpDir, `stmt_${Date.now()}_${Math.random().toString(36).slice(2)}.sql`);
    await writeFile(tmpPath, patched);

    const res = spawnSync('bun', [wrangler, 'd1', 'execute', dbName, flag, `--file=${tmpPath}`], {
      stdio: isAlterAdd ? 'pipe' : 'inherit',
    });

    if (res.status !== 0) {
      if (isAlterAdd) {
        const out = (res.stdout?.toString() ?? '') + (res.stderr?.toString() ?? '');
        if (/duplicate column|already exists/i.test(out)) {
          console.log(`  ⚠ Column already exists, skipping: ${patched.slice(0, 80).trim()}`);
          continue;
        }
        process.stdout.write(res.stdout ?? '');
        process.stderr.write(res.stderr ?? '');
      }
      console.error(`✗ Failed to apply ${f}`);
      process.exit(res.status ?? 1);
    }
  }
}
console.log(`✓ ${files.length} drizzle migration(s) applied (${flag})`);
