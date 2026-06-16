/**
 * RBAC server-side para /api/admin/**.
 *
 * Os handlers já validam o token (validateAdminToken). Este middleware adiciona
 * autorização por ROLE, espelhando o modelo do frontend (ROLE_SECTIONS em
 * composables/admin/useAdminAuth.ts) — sem ele, qualquer admin autenticado
 * conseguiria chamar qualquer endpoint admin direto pela API, ignorando o que
 * a UI esconde.
 *
 * Regra:
 *  - super_admin: tudo
 *  - usuarios/*: somente super_admin
 *  - segmentos de infra compartilhada: qualquer admin autenticado
 *  - demais segmentos: precisam estar na lista do role
 */
import { defineEventHandler, createError, getRequestURL } from 'h3';
import { getAdminPayload } from '~/server/utils/auth-helpers';

/** Segmentos de API permitidos por role (traduzidos das seções da UI). */
const ROLE_API_SECTIONS: Record<string, Set<string>> = {
  editor: new Set([
    'hero-banners', 'portfolio', 'depoimentos', 'faq', 'page-faq', 'blog',
    'cenarios', 'landing-pages', 'menu', 'seo', 'page-seo', 'cache',
  ]),
  sessions: new Set([
    'clientes', 'sessoes', 'entregas', 'produtos',
  ]),
};

/** Infra usada por mais de um role — liberada a qualquer admin autenticado. */
const SHARED_SECTIONS = new Set(['upload', 'r2', 'notificacoes', 'cron']);

export default defineEventHandler(async (event) => {
  const pathname = getRequestURL(event).pathname;

  if (!pathname.startsWith('/api/admin/')) return;

  const segments = pathname.split('/').filter(Boolean); // ['api','admin','<section>',...]
  const section = segments[2];
  if (!section) return;

  // Bootstrap/login: tratado pelos próprios handlers (KEYCMS), sem role.
  if (section === 'auth') return;

  const { adminRole } = await getAdminPayload(event);

  if (adminRole === 'super_admin') return;

  // Gestão de usuários é exclusiva de super_admin.
  if (section === 'usuarios') {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito a super administradores' });
  }

  if (SHARED_SECTIONS.has(section)) return;

  const allowed = ROLE_API_SECTIONS[adminRole];
  if (allowed?.has(section)) return;

  throw createError({ statusCode: 403, statusMessage: 'Seu perfil não tem acesso a este recurso' });
});
