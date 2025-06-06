import { defineEventHandler, readBody } from 'h3';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

  if (email === process.env.CMS_EMAIL && hashedPassword === process.env.CMS_PASSWORD_SHA1) {
    return { success: true, token: 'your-auth-token' }; // Simples token estático
  }

  return { success: false, message: 'Invalid credentials' };
});