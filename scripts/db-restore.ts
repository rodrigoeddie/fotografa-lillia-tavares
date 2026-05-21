#!/usr/bin/env bun
/**
 * Restaura o banco D1 a partir de um arquivo de backup SQL.
 *
 * Uso:
 *   bun scripts/db-restore.ts                                    # local, backup mais recente
 *   bun scripts/db-restore.ts scripts/backups/meu-backup.sql     # local, arquivo específico
 *   bun scripts/db-restore.ts --remote                           # produção, backup mais recente
 *   bun scripts/db-restore.ts scripts/backups/meu-backup.sql --remote
 */
import { readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const D1_DIR    = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const BACKUPS_DIR = 'scripts/backups';
const DB_NAME   = 'nuxt-content';

const remote = process.argv.includes('--remote');
const flag   = remote ? '--remote' : '--local';

// ── Resolve arquivo de backup ─────────────────────────────────────────────────
const fileArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
let backupFile = fileArg;

if (!backupFile) {
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

backupFile = resolve(backupFile!);

if (!existsSync(backupFile)) {
  console.error(`❌  Arquivo não encontrado: ${backupFile}`);
  process.exit(1);
}

// ── Confirmação obrigatória para --remote ─────────────────────────────────────
if (remote) {
  console.log('⚠️   Você está prestes a restaurar o banco de PRODUÇÃO.');
  console.log(`    Arquivo: ${backupFile}`);
  const answer = prompt('    Digite "sim" para confirmar: ');
  if (answer?.trim().toLowerCase() !== 'sim') {
    console.log('↩️   Operação cancelada.');
    process.exit(0);
  }
}

// ── Remove banco local (apenas para restore local) ────────────────────────────
if (!remote && existsSync(D1_DIR)) {
  const dbFiles = readdirSync(D1_DIR).filter((f) => !f.startsWith('metadata'));
  if (dbFiles.length > 0) {
    console.log('🗑️   Removendo banco local atual…');
    for (const f of dbFiles) {
      const p = join(D1_DIR, f);
      if (existsSync(p)) unlinkSync(p);
    }
  }
}

// ── Aplica o backup via wrangler ──────────────────────────────────────────────
console.log(`🔄  Aplicando backup em ${remote ? 'produção' : 'local'} (${backupFile})…`);

const result = spawnSync(
  'wrangler',
  ['d1', 'execute', DB_NAME, flag, `--file=${backupFile}`],
  { stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('❌  Falhou ao aplicar o backup.');
  process.exit(result.status ?? 1);
}

console.log(`✅  Banco ${remote ? 'de produção' : 'local'} restaurado com sucesso!`);
