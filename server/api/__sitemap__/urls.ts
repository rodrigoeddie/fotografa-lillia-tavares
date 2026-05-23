import { getOrm } from '~/server/utils/d1-client';
import { BlogService } from '~/server/services/BlogService';
import { PortfolioService } from '~/server/services/PortfolioService';
import { LandingPageService } from '~/server/services/LandingPageService';

const SITE_URL = 'https://fotografalilliatavares.com.br';

/** Rotas estáticas conhecidas que entram no sitemap. */
const STATIC_ROUTES = [
  '/',
  '/sobre-fotografa-lillia-tavares',
  '/depoimentos',
  '/perguntas-frequentes',
  '/agende-seu-ensaio',
  '/analise-coloracao-pessoal-em-mogi',
  '/blog',
  '/ensaio-fotografico',
  '/estudio-fotografico-em-mogi-das-cruzes',
  '/estudio-fotografico-em-mogi-das-cruzes/aluguel',
  '/precos-ensaios-fotograficos',
  '/presente-ensaio-fotografico-mogi',
];

export default defineEventHandler(async (event) => {
  const urls: { loc: string; lastmod?: string }[] = [];

  // Estáticas
  for (const path of STATIC_ROUTES) {
    urls.push({ loc: `${SITE_URL}${path}` });
  }

  // DB não disponível durante build — retorna só rotas estáticas
  let orm: ReturnType<typeof getOrm>;
  try {
    orm = getOrm(event);
  } catch {
    return urls;
  }

  // Landing Pages ativas (vindas do DB)
  try {
    const lps = await new LandingPageService(orm).list();
    for (const lp of lps) {
      if (lp.ativo === 1 && !STATIC_ROUTES.includes(lp.rota)) {
        urls.push({
          loc: `${SITE_URL}${lp.rota}`,
          lastmod: lp.atualizado_em || lp.criado_em || undefined,
        });
      }
    }
  } catch (e) {
    console.error('sitemap: LP fetch failed', e);
  }

  // Blog posts ativos
  try {
    const posts = await new BlogService(orm).list(true);
    const categorias = new Set<string>();
    for (const post of posts) {
      urls.push({
        loc: `${SITE_URL}/blog/${post.categoria}/${post.slug}`,
        lastmod: post.criado_em || undefined,
      });
      categorias.add(post.categoria);
    }
    for (const cat of categorias) {
      urls.push({ loc: `${SITE_URL}/blog/${cat}` });
    }
  } catch (e) {
    console.error('sitemap: blog fetch failed', e);
  }

  // Portfolio works ativos (slug já inclui "categoria/work")
  try {
    const works = await new PortfolioService(orm).list(true);
    const categorias = new Set<string>();
    for (const work of works) {
      urls.push({
        loc: `${SITE_URL}/ensaio-fotografico/${work.slug}`,
        lastmod: work.data || undefined,
      });
      categorias.add(work.categoria);
    }
    for (const cat of categorias) {
      urls.push({ loc: `${SITE_URL}/ensaio-fotografico/${cat}` });
    }
  } catch (e) {
    console.error('sitemap: portfolio fetch failed', e);
  }

  return urls;
});
