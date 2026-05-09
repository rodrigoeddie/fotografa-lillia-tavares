import { defineConfig } from 'drizzle-kit';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Localiza o arquivo SQLite local do D1 gerenciado pelo Miniflare/Wrangler.
// O hash do nome do arquivo muda; pegamos o primeiro .sqlite no diretório do binding.
const d1Dir = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject';
let localSqlite: string | undefined;
if (existsSync(d1Dir)) {
  const candidates = readdirSync(d1Dir).filter((f) => f.endsWith('.sqlite') && !f.includes('metadata'));
  if (candidates.length > 0) localSqlite = join(d1Dir, candidates[0]);
}

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/db/schema',
  out: './server/db/drizzle',
  casing: 'snake_case',
  ...(localSqlite ? { dbCredentials: { url: localSqlite } } : {}),
});
