import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler((event) => {
  deleteCookie(event, 'cliente_session', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
  return { success: true };
});
