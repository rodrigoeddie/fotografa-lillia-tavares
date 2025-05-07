import fs from 'fs/promises';
import path from 'path';
import { defineEventHandler, readBody, createError } from 'h3';

const contentDir = path.resolve(process.cwd(), 'content');

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;

  if (!slug) {
    console.error('[API] Error: Slug is undefined or missing.');
    throw createError({
      statusCode: 400,
      statusMessage: 'File path (slug) is required.',
    });
  }

  const decodedSlug = decodeURIComponent(slug);
  const filePath = path.join(contentDir, decodedSlug);

  if (!path.resolve(filePath).startsWith(contentDir)) {
    console.error(`[API] Forbidden access attempt to: ${filePath} (resolved from slug: ${decodedSlug})`);
    throw createError({
      statusCode: 403,
      statusMessage: 'Access denied. Invalid file path.',
    });
  }
  

  console.log(`[API] Request for method: ${event.node.req.method}, path: ${decodedSlug}`);
  console.log(`[API] Resolved file path: ${filePath}`);

  if (event.node.req.method === 'GET') {
    try {
      const fileContentString = await fs.readFile(filePath, 'utf-8');
      console.log(`[API GET] Raw content for ${decodedSlug}: "${fileContentString.substring(0, 100)}..."`);

      if (fileContentString.trim() === '') {
        console.warn(`[API GET] File ${decodedSlug} is empty. Returning empty object.`);
        return {};
      }

      let jsonData;
      try {
        jsonData = JSON.parse(fileContentString);
      } catch (parseError) {
        console.error(`[API GET] Invalid JSON content in file: ${filePath}. Error: ${parseError.message}`);
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid JSON content in file: ${decodedSlug}. Please check the file format.`,
          data: { path: decodedSlug, details: parseError.message }
        });
      }

      // Se o JSON parseado for literalmente null, retorne um objeto vazio para o editor.
      if (jsonData === null) {
        console.warn(`[API GET] File ${decodedSlug} contained "null", returning empty object instead.`);
        return {};
      }

      console.log(`[API GET] Successfully parsed JSON for ${decodedSlug}.`);
      return jsonData;

    } catch (error) {
      // Se o erro já for um erro criado por createError (como o de JSON.parse acima), relance-o.
      if (error.statusCode) {
        throw error;
      }

      console.error(`[API GET] Error processing file ${decodedSlug}:`, error);
      if (error.code === 'ENOENT') {
        console.error(`[API GET] File not found: ${filePath}`);
        throw createError({
          statusCode: 404,
          statusMessage: `File not found: ${decodedSlug}`,
          data: { path: decodedSlug, details: error.message }
        });
      }
      console.error(`[API GET] Internal server error for ${filePath}. Error: ${error.message}`);
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
        console.error(`[API POST] Invalid body received for ${decodedSlug}. Expected an object.`);
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid request body. JSON object expected.',
        });
      }

      const jsonString = JSON.stringify(body, null, 2);
      await fs.writeFile(filePath, jsonString, 'utf-8');
      console.log(`[API POST] File saved successfully: ${filePath}`);
      return { success: true, message: 'File saved successfully.', path: decodedSlug };

    } catch (error) {
      console.error(`[API POST] Error saving file ${decodedSlug}:`, error);
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

  console.warn(`[API] Method not allowed: ${event.node.req.method} for path: ${decodedSlug}`);
  throw createError({
    statusCode: 405,
    statusMessage: `Method ${event.node.req.method} not allowed.`,
  });
});