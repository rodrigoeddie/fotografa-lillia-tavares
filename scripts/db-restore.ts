#!/usr/bin/env bun
/**
 * Restaura o banco D1 local a partir de um arquivo de backup SQL.
 * Remove o SQLite atual e aplica o dump via wrangler.
 *
 * Uso:
 *   bun scripts/db-restore.ts                           # usa o backup mais recente
 *   bun scripts/db-restore.ts scripts/backups/meu-backup.sql
 */
import { readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const D1_DIR   = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const BACKUPS_DIR = 'scripts/backups';
const DB_NAME  = 'nuxt-content';

// ── Resolve arquivo de backup ─────────────────────────────────────────────────
let backupFile = process.argv[2];

if (!backupFile) {
  // Usa o backup mais recente
  const files = readdirSync(BACKUPS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌  Nenhum backup encontrado em', BACKUPS_DIR);
    console.error('    Crie um primeiro com: bun scripts/db-backup.ts');
    process.exit(1);
  }

  backupFile = join(BACKUPS_DIR, files[0]);
  console.log(`ℹ️   Usando backup mais recente: ${backupFile}`);
}

backupFile = resolve(backupFile);

if (!existsSync(backupFile)) {
  console.error(`❌  Arquivo não encontrado: ${backupFile}`);
  process.exit(1);
}

// ── Remove banco local atual ──────────────────────────────────────────────────
const dbFiles = readdirSync(D1_DIR).filter((f) => !f.startsWith('metadata'));

if (dbFiles.length > 0) {
  console.log('🗑️   Removendo banco local atual…');
  for (const f of dbFiles) {
    const p = join(D1_DIR, f);
    if (existsSync(p)) unlinkSync(p);
  }
}

// ── Aplica o backup via wrangler ──────────────────────────────────────────────
console.log(`🔄  Aplicando backup ${backupFile}…`);

const result = spawnSync(
  'wrangler',
  ['d1', 'execute', DB_NAME, '--local', `--file=${backupFile}`],
  { stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('❌  Falhou ao aplicar o backup.');
  process.exit(result.status ?? 1);
}

console.log('✅  Banco restaurado com sucesso!');
