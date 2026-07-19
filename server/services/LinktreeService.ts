import { eq, asc, desc, sql, count } from 'drizzle-orm';
import type { ORM } from '~/server/utils/d1-client';
import {
  linktree_presets,
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

/** Resumo de preset p/ a lista do admin. */
export interface PresetSummary {
  id: number;
  titulo: string;
  ativo: boolean;
  tema: string;
  nome: string;
  blocos: number;
}

const TEMAS = ['claro', 'escuro', 'marrom', 'azul'] as const;
function normalizeTema(t: string | null | undefined): RenderedProfile['tema'] {
  return (TEMAS as readonly string[]).includes(t ?? '') ? (t as RenderedProfile['tema']) : 'claro';
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

  // ── Presets ─────────────────────────────────────────────────────
  async listPresets(): Promise<PresetSummary[]> {
    const presets = await this.db.select().from(linktree_presets).orderBy(asc(linktree_presets.id));
    const counts = await this.db
      .select({ preset_id: linktree_items.preset_id, n: count() })
      .from(linktree_items)
      .groupBy(linktree_items.preset_id);
    const byPreset = new Map(counts.map((c) => [c.preset_id, Number(c.n)]));
    return presets.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      ativo: !!p.ativo,
      tema: normalizeTema(p.tema),
      nome: p.nome,
      blocos: byPreset.get(p.id) ?? 0,
    }));
  }

  async getPreset(id: number) {
    const [row] = await this.db.select().from(linktree_presets).where(eq(linktree_presets.id, id));
    return row ?? null;
  }

  /** Preset ativo (fallback: menor id). */
  async getActivePreset() {
    const [active] = await this.db.select().from(linktree_presets).where(eq(linktree_presets.ativo, true));
    if (active) return active;
    const [first] = await this.db.select().from(linktree_presets).orderBy(asc(linktree_presets.id)).limit(1);
    return first ?? null;
  }

  /** Cria um preset novo (inativo) com cabeçalho vazio. Retorna o id. */
  async createPreset(titulo: string): Promise<number> {
    const [row] = await this.db
      .insert(linktree_presets)
      .values({ titulo, ativo: false, nome: '', tema: 'claro', atualizado_em: new Date().toISOString() })
      .returning({ id: linktree_presets.id });
    return row!.id;
  }

  /** Duplica cabeçalho + blocos de um preset em um novo preset inativo. Retorna o id. */
  async duplicatePreset(sourceId: number, titulo: string): Promise<number> {
    const src = await this.getPreset(sourceId);
    if (!src) throw new Error('Preset de origem não encontrado');
    const [row] = await this.db
      .insert(linktree_presets)
      .values({
        titulo,
        ativo: false,
        avatar_cf_id: src.avatar_cf_id ?? null,
        nome: src.nome,
        headline: src.headline ?? null,
        tema: src.tema,
        atualizado_em: new Date().toISOString(),
      })
      .returning({ id: linktree_presets.id });
    const newId = row!.id;

    const items = await this.db.select().from(linktree_items).where(eq(linktree_items.preset_id, sourceId)).orderBy(asc(linktree_items.ordem));
    if (items.length) {
      const inserts = items.map((it) =>
        this.db.insert(linktree_items).values({
          preset_id: newId,
          ordem: it.ordem,
          ativo: !!it.ativo,
          tipo: it.tipo,
          config: it.config,
        }),
      );
      await this.db.batch(inserts as any);
    }
    return newId;
  }

  async renamePreset(id: number, titulo: string) {
    return this.db
      .update(linktree_presets)
      .set({ titulo, atualizado_em: new Date().toISOString() })
      .where(eq(linktree_presets.id, id));
  }

  /** Ativa um preset (desativa os demais). Índice único parcial garante 1 ativo. */
  async activatePreset(id: number) {
    const now = new Date().toISOString();
    return this.db.batch([
      this.db.update(linktree_presets).set({ ativo: false }).where(eq(linktree_presets.ativo, true)),
      this.db.update(linktree_presets).set({ ativo: true, atualizado_em: now }).where(eq(linktree_presets.id, id)),
    ] as any);
  }

  /** Remove um preset e seus blocos. Não permite apagar o último; reativa outro se preciso. */
  async deletePreset(id: number) {
    const presets = await this.db.select().from(linktree_presets).orderBy(asc(linktree_presets.id));
    if (presets.length <= 1) throw new Error('Não é possível excluir o único preset');
    const alvo = presets.find((p) => p.id === id);
    if (!alvo) return;

    await this.db.batch([
      this.db.delete(linktree_items).where(eq(linktree_items.preset_id, id)),
      this.db.delete(linktree_presets).where(eq(linktree_presets.id, id)),
    ] as any);

    // Se o excluído era o ativo, promove o preset restante mais antigo.
    if (alvo.ativo) {
      const proximo = presets.find((p) => p.id !== id);
      if (proximo) await this.activatePreset(proximo.id);
    }
  }

  /** Atualiza o cabeçalho do preset + substitui seus blocos. */
  async savePreset(id: number, profile: LinktreeProfileInput, items: LinktreeItemInput[]) {
    await this.db
      .update(linktree_presets)
      .set({
        avatar_cf_id: profile.avatarCfId ?? null,
        nome:         profile.nome ?? '',
        headline:     profile.headline ?? null,
        tema:         profile.tema ?? 'claro',
        atualizado_em: new Date().toISOString(),
      })
      .where(eq(linktree_presets.id, id));
    await this.replaceItems(id, items);
  }

  // ── Itens (admin: dados crus) ───────────────────────────────────
  async listItems(presetId: number): Promise<LinktreeItemInput[]> {
    const rows = await this.db
      .select()
      .from(linktree_items)
      .where(eq(linktree_items.preset_id, presetId))
      .orderBy(asc(linktree_items.ordem));
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

  /** Substitui os itens de um preset (delete + insert atômico via batch), ordem = índice. */
  async replaceItems(presetId: number, items: LinktreeItemInput[]) {
    const inserts = items.map((item, idx) =>
      this.db.insert(linktree_items).values({
        preset_id: presetId,
        ordem:  idx,
        ativo:  item.ativo,
        tipo:   item.tipo,
        config: JSON.stringify(item.config),
      }),
    );
    return this.db.batch([
      this.db.delete(linktree_items).where(eq(linktree_items.preset_id, presetId)),
      ...inserts,
    ] as any);
  }

  // ── Árvore pública (preset ativo, referências resolvidas server-side) ───────
  async getPublicTree(): Promise<{ profile: RenderedProfile; blocks: RenderedBlock[] }> {
    const preset = await this.getActivePreset();
    const profile: RenderedProfile = {
      nome:       preset?.nome || 'Fotógrafa Lillia Tavares',
      headline:   preset?.headline ?? null,
      avatarCfId: preset?.avatar_cf_id ?? null,
      tema:       normalizeTema(preset?.tema),
    };

    if (!preset) return { profile, blocks: [] };

    const items = (await this.listItems(preset.id)).filter((i) => i.ativo);
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
