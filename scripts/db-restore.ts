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
import { readdirSync, unlinkSync, existsSync, writeFileSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const D1_DIR      = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const BACKUPS_DIR = 'scripts/backups';
const DB_NAME     = 'nuxt-content';
const WRANGLER    = 'node_modules/wrangler/bin/wrangler.js';

const remote = process.argv.includes('--remote');
const flag   = remote ? '--remote' : '--local';

// ── Resolve arquivo de backup ─────────────────────────────────────────────────
const fileArg = process.argv.slice(2).find((a) => !a.startsWith('--'));
let backupFile = fileArg;

if (!backupFile) {
  const files = readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith('backup-') && f.endsWith('.sql'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.error('❌  Nenhum backup encontrado em', BACKUPS_DIR);
    console.error('    Crie um primeiro com: bun scripts/db-backup.ts');
    process.exit(1);
  }

  backupFile = join(BACKUPS_DIR, files[0]!);
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
  console.log('    Todas as tabelas existentes serão apagadas antes do restore.');
  const answer = prompt('    Digite "sim" para confirmar: ');
  if (answer?.trim().toLowerCase() !== 'sim') {
    console.log('↩️   Operação cancelada.');
    process.exit(0);
  }

  // ── Busca tabelas existentes em produção ──────────────────────────────────
  console.log('🔍  Consultando tabelas existentes em produção…');
  const queryRes = spawnSync(
    'bun',
    [
      WRANGLER,
      'd1', 'execute', DB_NAME, '--remote',
      '--command', "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_cf_%' AND name NOT LIKE 'd1_%'",
      '--json',
    ],
    { encoding: 'utf8' },
  );

  if (queryRes.status !== 0) {
    console.error('❌  Não foi possível consultar as tabelas de produção.');
    process.stderr.write(queryRes.stderr ?? '');
    process.exit(queryRes.status ?? 1);
  }

  type D1Result = { results: { name: string }[] }[];
  let tables: string[] = [];
  try {
    const parsed: D1Result = JSON.parse(queryRes.stdout);
    tables = parsed[0]?.results?.map((r) => r.name) ?? [];
  } catch {
    console.error('❌  Erro ao parsear resposta do wrangler.');
    process.exit(1);
  }

  if (tables.length > 0) {
    console.log(`🗑️   Apagando ${tables.length} tabela(s): ${tables.join(', ')}`);
    const dropSql = [
      'PRAGMA foreign_keys = OFF;',
      ...tables.map((t) => `DROP TABLE IF EXISTS "${t}";`),
      'PRAGMA foreign_keys = ON;',
    ].join('\n');
    const tmpPath = join(tmpdir(), 'db-restore-drop.sql');
    writeFileSync(tmpPath, dropSql);

    const dropRes = spawnSync(
      'bun',
      [WRANGLER, 'd1', 'execute', DB_NAME, '--remote', `--file=${tmpPath}`],
      { stdio: 'inherit' },
    );

    if (dropRes.status !== 0) {
      console.error('❌  Falhou ao apagar tabelas de produção.');
      process.exit(dropRes.status ?? 1);
    }
  } else {
    console.log('ℹ️   Nenhuma tabela existente encontrada em produção.');
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

// D1 remoto não aceita PRAGMA, BEGIN TRANSACTION, nem tabelas internas _cf_*
let applyFile = backupFile;
if (remote) {
  const STRIP_LINE = /^\s*(BEGIN TRANSACTION|COMMIT|ROLLBACK|SAVEPOINT|RELEASE SAVEPOINT|PRAGMA)/i;
  const SKIP_TABLE = /^(?:CREATE TABLE(?: IF NOT EXISTS)?|INSERT INTO) [`"']?(_cf_\w+|sqlite_sequence|d1_migrations)[`"']?/i;

  const lines = readFileSync(backupFile, 'utf8').split('\n');
  const out: string[] = [];
  let skipBlock = false;

  for (const line of lines) {
    if (SKIP_TABLE.test(line)) { skipBlock = true; }
    if (skipBlock) {
      if (line.trimEnd().endsWith(';')) skipBlock = false;
      continue;
    }
    if (!STRIP_LINE.test(line)) out.push(line);
  }

  applyFile = join(tmpdir(), 'db-restore-apply.sql');
  writeFileSync(applyFile, out.join('\n'));
}

const result = spawnSync(
  'bun',
  [WRANGLER, 'd1', 'execute', DB_NAME, flag, `--file=${applyFile}`],
  { stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('❌  Falhou ao aplicar o backup.');
  process.exit(result.status ?? 1);
}

console.log(`✅  Banco ${remote ? 'de produção' : 'local'} restaurado com sucesso!`);
