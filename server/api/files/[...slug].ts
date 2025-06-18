import fs from 'fs/promises';
import path from 'path';
import { defineEventHandler, readBody, createError } from 'h3';

const contentDir = path.resolve(process.cwd(), 'content');

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File path (slug) is required.',
    });
  }

  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(contentDir, decodedSlug);

  if (!path.resolve(filePath).startsWith(contentDir)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Invalid file path.',
    });
  }

  if (event.node.req.method === 'GET') {
    try {
      const fileContentString = await fs.readFile(filePath, 'utf-8');

      if (fileContentString.trim() === '') {
        return {};
      }

      let jsonData;
      try {
        jsonData = JSON.parse(fileContentString);
      } catch (parseError) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid JSON content in file: ${decodedSlug}. Please check the file format.`,
          data: { path: decodedSlug, details: parseError.message }
        });
      }

      // Se o JSON parseado for literalmente null, retorne um objeto vazio para o editor.
      if (jsonData === null) {
        return {};
      }

      return jsonData;

    } catch (error) {
      // Se o erro já for um erro criado por createError (como o de JSON.parse acima), relance-o.
      if (error.statusCode) {
        throw error;
      }

      if (error.code === 'ENOENT') {
        throw createError({
          statusCode: 404,
          statusMessage: `File not found: ${decodedSlug}`,
          data: { path: decodedSlug, details: error.message }
        });
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Error reading file: ${decodedSlug}.`,
        data: { path: decodedSlug, details: error.message }
      });
    }
  }

  if (event.node.req.method === 'POST') {
    try {
      const body = await readBody(event);
      if (typeof body !== 'object' || body === null) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid request body. JSON object expected.',
        });
      }

      const jsonString = JSON.stringify(body, null, 2);
      await fs.writeFile(filePath, jsonString, 'utf-8');
      return { success: true, message: 'File saved successfully.', path: decodedSlug };

    } catch (error) {
      if (error.code === 'EACCES') {
         throw createError({ statusCode: 500, statusMessage: `Permission denied while saving file: ${decodedSlug}` });
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Error saving file: ${decodedSlug}.`,
        data: { path: decodedSlug, details: error.message }
      });
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: `Method ${event.node.req.method} not allowed.`,
  });
});