import fs from 'fs/promises';
import path from 'path';
import { defineEventHandler, getQuery, readBody, createError } from 'h3';

const contentDir = path.resolve(process.cwd(), 'content');

function safeResolve(filePath: string) {
  const resolved = path.resolve(path.join(contentDir, filePath));
  if (!resolved.startsWith(contentDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' });
  }
  return resolved;
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'GET') {
    const query = getQuery(event);
    const filePath = query.path as string;
    if (!filePath) throw createError({ statusCode: 400, statusMessage: 'path is required' });

    const resolved = safeResolve(filePath);
    try {
      const content = await fs.readFile(resolved, 'utf-8');
      return { content, path: filePath };
    } catch (e: any) {
      throw createError({
        statusCode: e.code === 'ENOENT' ? 404 : 500,
        statusMessage: e.message,
      });
    }
  }

  if (event.node.req.method === 'POST') {
    const body = await readBody(event);
    const { path: filePath, content } = body;
    if (!filePath) throw createError({ statusCode: 400, statusMessage: 'path is required' });

    const resolved = safeResolve(filePath);
    try {
      await fs.writeFile(resolved, content ?? '', 'utf-8');
      return { success: true };
    } catch (e: any) {
      throw createError({ statusCode: 500, statusMessage: e.message });
    }
  }

  throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
});
