import fs from 'fs/promises';
import path from 'path';
import { getQuery } from 'h3'; // Importa getQuery para acessar os parâmetros da query string

const contentDir = path.resolve('content'); // Base para o diretório "content"

export default defineEventHandler(async (event) => {
  const query = getQuery(event); // Substitui useQuery por getQuery
  const relativePath = query.path || ''; // Caminho relativo passado como parâmetro
  const targetDir = path.join(contentDir, relativePath); // Resolve o caminho completo

  // Verifica se o caminho está dentro do diretório "content"
  if (!targetDir.startsWith(contentDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' });
  }

  try {
    const files = await fs.readdir(targetDir, { withFileTypes: true });

    return files.map((file) => ({
      name: file.name,
      isDirectory: file.isDirectory(),
    }));
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read directory' });
  }
});