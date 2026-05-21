#!/usr/bin/env bun
/**
 * Faz backup do banco D1 local para scripts/backups/backup-TIMESTAMP.sql
 *
 * Uso:
 *   bun scripts/db-backup.ts
 *   bun scripts/db-backup.ts --name meu-backup
 */
import { readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const D1_DIR = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
const BACKUPS_DIR = 'scripts/backups';

// Tabelas internas do SQLite/Wrangler/D1 a excluir do dump
const SKIP_TABLES = new Set(['_cf_KV', '_cf_METADATA', 'd1_migrations', 'sqlite_sequence']);
const SKIP_PREFIX = /^_cf_/i;

const files = readdirSync(D1_DIR).filter(
  (f) => f.endsWith('.sqlite') && !f.startsWith('metadata'),
);

if (files.length === 0) {
  console.error('❌  Nenhum banco D1 local encontrado.');
  console.error('    Rode o dev server ao menos uma vez para criá-lo.');
  process.exit(1);
}

const dbFile = join(D1_DIR, files[0]!);

// Nome customizado via --name <slug>
const nameIdx = process.argv.indexOf('--name');
const customName = nameIdx !== -1 ? process.argv[nameIdx + 1] : null;
const ts = new Date().toISOString().slice(0, 19).replace(/T/, '_').replace(/:/g, '-');
const filename = customName ? `${customName}.sql` : `backup-${ts}.sql`;

mkdirSync(BACKUPS_DIR, { recursive: true });
const outFile = join(BACKUPS_DIR, filename);

console.log(`📦  Gerando dump de ${dbFile}…`);

const result = spawnSync('sqlite3', [dbFile, '.dump'], { encoding: 'utf8' });

if (result.status !== 0) {
  console.error('❌  Erro ao executar sqlite3:', result.stderr);
  process.exit(1);
}

// Filtra tabelas internas
const lines = result.stdout.split('\n');
let skipUntilSemicolon = false;
const filtered: string[] = [];

for (const line of lines) {
  // Detecta início de CREATE TABLE ou INSERT INTO para tabela interna
  const tableMatch = line.match(/^(?:CREATE TABLE(?: IF NOT EXISTS)?|INSERT INTO) [`"']?(\w+)[`"']?/i);
  const tableName = tableMatch?.[2] ?? '';
  if (tableName && (SKIP_TABLES.has(tableName) || SKIP_PREFIX.test(tableName))) {
    skipUntilSemicolon = true;
  }
  if (skipUntilSemicolon) {
    if (line.trimEnd().endsWith(';')) skipUntilSemicolon = false;
    continue;
  }
  filtered.push(line);
}

writeFileSync(outFile, filtered.join('\n'), 'utf8');
console.log(`✅  Backup salvo em ${outFile}`);
