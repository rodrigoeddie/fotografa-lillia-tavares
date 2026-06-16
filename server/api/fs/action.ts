import fs from 'fs/promises';
import path from 'path';
import { defineEventHandler, readBody, createError } from 'h3';
import { validateAdminToken } from '~/server/utils/auth-helpers';

const contentDir = path.resolve(process.cwd(), 'content');

function safeResolve(filePath: string) {
  const resolved = path.resolve(path.join(contentDir, filePath));
  if (resolved !== contentDir && !resolved.startsWith(contentDir + path.sep)) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' });
  }
  return resolved;
}

function assertInside(resolved: string) {
  if (resolved !== contentDir && !resolved.startsWith(contentDir + path.sep)) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' });
  }
}

export default defineEventHandler(async (event) => {
  await validateAdminToken(event);

  const body = await readBody(event);
  const { action, path: filePath, newName, name, type } = body;

  switch (action) {
    case 'rename': {
      if (!filePath || !newName) throw createError({ statusCode: 400, statusMessage: 'path and newName required' });
      const oldResolved = safeResolve(filePath);
      const dir = path.dirname(oldResolved);
      const newResolved = path.resolve(path.join(dir, newName));
      assertInside(newResolved);
      await fs.rename(oldResolved, newResolved);
      const parts = filePath.split('/');
      parts[parts.length - 1] = newName;
      return { success: true, newPath: parts.join('/') };
    }

    case 'delete': {
      if (!filePath) throw createError({ statusCode: 400, statusMessage: 'path required' });
      const resolved = safeResolve(filePath);
      const stat = await fs.stat(resolved);
      if (stat.isDirectory()) {
        await fs.rm(resolved, { recursive: true });
      } else {
        await fs.unlink(resolved);
      }
      return { success: true };
    }

    case 'create': {
      // filePath = parent directory (relative to content), may be empty string for root
      if (!name) throw createError({ statusCode: 400, statusMessage: 'name required' });
      const parentResolved = filePath ? safeResolve(filePath) : contentDir;
      const newPath = path.resolve(path.join(parentResolved, name));
      assertInside(newPath);

      if (type === 'dir') {
        await fs.mkdir(newPath, { recursive: true });
      } else {
        // Ensure parent exists
        await fs.mkdir(path.dirname(newPath), { recursive: true });
        await fs.writeFile(newPath, '', 'utf-8');
      }
      const newRelPath = filePath ? `${filePath}/${name}` : name;
      return { success: true, path: newRelPath };
    }

    default:
      throw createError({ statusCode: 400, statusMessage: `Unknown action: ${action}` });
  }
});
