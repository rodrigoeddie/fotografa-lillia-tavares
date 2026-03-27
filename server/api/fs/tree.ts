import fs from 'fs/promises';
import path from 'path';
import { defineEventHandler, createError, setResponseHeaders } from 'h3';

const contentDir = path.resolve(process.cwd(), 'content');

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[];
}

async function buildTree(dirPath: string, relPath = ''): Promise<TreeNode[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const nodes: TreeNode[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const entryRel = relPath ? `${relPath}/${entry.name}` : entry.name;
    const node: TreeNode = {
      name: entry.name,
      path: entryRel,
      isDirectory: entry.isDirectory(),
    };
    if (entry.isDirectory()) {
      node.children = await buildTree(path.join(dirPath, entry.name), entryRel);
    }
    nodes.push(node);
  }

  return nodes;
}

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
  });
  try {
    return await buildTree(contentDir);
  } catch (e: any) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to read tree: ' + e.message });
  }
});
