import { eq, asc, desc, sql } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  linktree_profile,
  linktree_items,
  linktree_clicks,
  blog_posts,
  portfolio_works,
  portfolio_fotos,
  depoimentos,
} from '~/server/db/schema';
import {
  LinktreeItemSchema,
  LINKTREE_DESTINOS,
  linktreeItemKey,
  type LinktreeItemInput,
  type LinktreeProfileInput,
} from '~/shared/schemas/linktree';

/** Bloco pronto para render no front (já resolvido server-side). `chave` p/ tracking. */
export type RenderedBlock = { chave: string } & (
  | { render: 'link';       url: string; label: string; descricao?: string; icone?: string; external?: boolean }
  | { render: 'card';       url: string; label: string; descricao?: string; imageCfId?: string | null; corDestaque?: string | null }
  | { render: 'depoimento'; nome: string; texto: string; rating: number; fotoCfId?: string | null; url?: string | null }
  | { render: 'banner';     imageCfId: string; label?: string; url?: string | null }
  | { render: 'custom';     titulo: string; html: string }
);

export interface RenderedProfile {
  nome: string;
  headline: string | null;
  avatarCfId: string | null;
  tema: 'claro' | 'escuro' | 'marrom' | 'azul';
}

/** Sanitização conservadora p/ HTML do bloco custom (conteúdo de admin confiável). */
function sanitizeHtml(input: string): string {
  return input
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed)[^>]*>/gi, '') // tags soltas/sem par
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')            // handlers onclick=...
    .replace(/(javascript|data|vbscript)\s*:/gi, 'unsafe:');             // schemes perigosos (com/sem aspas)
}

export class LinktreeService {
  constructor(private db: ORM) {}

  // ── Perfil ──────────────────────────────────────────────────────
  async getProfile() {
    const [row] = await this.db.select().from(linktree_profile).where(eq(linktree_profile.id, 1));
    return row ?? null;
  }

  async updateProfile(data: LinktreeProfileInput) {
    const values = {
      avatar_cf_id:  data.avatarCfId ?? null,
      nome:          data.nome ?? '',
      headline:      data.headline ?? null,
      tema:          data.tema ?? 'claro',
      atualizado_em: new Date().toISOString(),
    };
    return this.db
      .insert(linktree_profile)
      .values({ id: 1, ...values })
      .onConflictDoUpdate({ target: linktree_profile.id, set: values });
  }

  // ── Itens (admin: dados crus) ───────────────────────────────────
  async listItems(): Promise<LinktreeItemInput[]> {
    const rows = await this.db.select().from(linktree_items).orderBy(asc(linktree_items.ordem));
    return rows
      .map((r) => {
        try {
          return LinktreeItemSchema.parse({
            tipo:   r.tipo,
            ordem:  r.ordem,
            ativo:  !!r.ativo,
            config: JSON.parse(r.config),
          });
        } catch {
          return null;
        }
      })
      .filter((b): b is LinktreeItemInput => b !== null);
  }

  /** Substitui todos os itens (delete + insert atômico via batch), ordem = índice. */
  async replaceItems(items: LinktreeItemInput[]) {
    const inserts = items.map((item, idx) =>
      this.db.insert(linktree_items).values({
        ordem:  idx,
        ativo:  item.ativo,
        tipo:   item.tipo,
        config: JSON.stringify(item.config),
      }),
    );
    return this.db.batch([this.db.delete(linktree_items), ...inserts] as any);
  }

  // ── Árvore pública (referências resolvidas server-side) ─────────
  async getPublicTree(): Promise<{ profile: RenderedProfile; blocks: RenderedBlock[] }> {
    const profileRow = await this.getProfile();
    const profile: RenderedProfile = {
      nome:       profileRow?.nome ?? 'Fotógrafa Lillia Tavares',
      headline:   profileRow?.headline ?? null,
      avatarCfId: profileRow?.avatar_cf_id ?? null,
      tema:       (['claro', 'escuro', 'marrom', 'azul'].includes(profileRow?.tema ?? '') ? profileRow!.tema as RenderedProfile['tema'] : 'claro'),
    };

    const items = (await this.listItems()).filter((i) => i.ativo);
    const blocks: RenderedBlock[] = [];

    for (const item of items) {
      const block = await this.#resolveBlock(item);
      if (block) blocks.push({ ...block, chave: linktreeItemKey(item) });
    }

    return { profile, blocks };
  }

  // ── Cliques ─────────────────────────────────────────────────────
  async recordClick(chave: string) {
    return this.db
      .insert(linktree_clicks)
      .values({ chave, cliques: 1, atualizado_em: new Date().toISOString() })
      .onConflictDoUpdate({
        target: linktree_clicks.chave,
        set: { cliques: sql`${linktree_clicks.cliques} + 1`, atualizado_em: new Date().toISOString() },
      });
  }

  async getClicks(): Promise<Record<string, number>> {
    const rows = await this.db.select().from(linktree_clicks);
    return Object.fromEntries(rows.map((r) => [r.chave, r.cliques]));
  }

  async #resolveBlock(item: LinktreeItemInput): Promise<Omit<RenderedBlock, 'chave'> | null> {
    switch (item.tipo) {
      case 'atalho': {
        const d = LINKTREE_DESTINOS[item.config.destino];
        if (!d) return null;
        return {
          render: 'link',
          url: d.rota,
          label: item.config.label || d.label,
          descricao: item.config.descricao || undefined,
          icone: d.icone,
        };
      }

      case 'post': {
        const [post] = await this.db
          .select({ slug: blog_posts.slug, categoria: blog_posts.categoria, titulo: blog_posts.titulo, descricao: blog_posts.descricao, imagem: blog_posts.imagem_cf_id, ativo: blog_posts.ativo })
          .from(blog_posts).where(eq(blog_posts.id, item.config.postId));
        if (!post || post.ativo !== 1) return null;
        return {
          render: 'card',
          url: `/blog/${post.categoria}/${post.slug}`,
          label: item.config.label || post.titulo,
          descricao: item.config.descricao || post.descricao || undefined,
          imageCfId: post.imagem || null,
        };
      }

      case 'portfolio': {
        const [work] = await this.db
          .select({ slug: portfolio_works.slug, titulo: portfolio_works.titulo, descricao: portfolio_works.descricao, cor: portfolio_works.cor_destaque, ativo: portfolio_works.ativo, id: portfolio_works.id })
          .from(portfolio_works).where(eq(portfolio_works.id, item.config.workId));
        if (!work || work.ativo !== 1) return null;
        const [foto] = await this.db
          .select({ cf: portfolio_fotos.cf_image_id })
          .from(portfolio_fotos)
          .where(eq(portfolio_fotos.work_id, work.id))
          .orderBy(desc(portfolio_fotos.highlight), desc(portfolio_fotos.can_be_thumb), asc(portfolio_fotos.ordem))
          .limit(1);
        return {
          render: 'card',
          url: `/ensaio-fotografico/${work.slug}`,
          label: item.config.label || work.titulo || 'Ensaio',
          descricao: item.config.descricao || work.descricao || undefined,
          imageCfId: foto?.cf ?? null,
          corDestaque: work.cor ?? null,
        };
      }

      case 'depoimento': {
        const [dep] = await this.db
          .select().from(depoimentos).where(eq(depoimentos.id, item.config.depoimentoId));
        if (!dep) return null;
        return {
          render: 'depoimento',
          nome: dep.nome,
          texto: dep.texto,
          rating: dep.rating ?? 5,
          fotoCfId: dep.foto_cf_id ?? null,
          url: dep.portfolio_link ? `/ensaio-fotografico/${dep.portfolio_link}` : null,
        };
      }

      case 'banner': {
        return {
          render: 'banner',
          imageCfId: item.config.imageCfId,
          label: item.config.label || undefined,
          url: item.config.url || null,
        };
      }

      case 'custom': {
        return {
          render: 'custom',
          titulo: item.config.titulo,
          html: sanitizeHtml(item.config.html),
        };
      }

      default:
        return null;
    }
  }
}
