import { z } from 'zod';

/**
 * Linktree — schema dos blocos do hub público (/links).
 *
 * Cada item tem `tipo` + `config` JSON validado por uma união discriminada
 * (mesmo padrão de `landing-page.ts`). Persistido em `linktree_items.config`.
 */

// ── Registro de destinos conhecidos (blocos "atalho") ────────────────────────
// Fonte única reusada pelo dropdown do admin e pela validação/resolução server.
// `icone` usa nomes da coleção Iconify material-symbols (@nuxt/icon).
export const LINKTREE_DESTINOS = {
  site:        { rota: '/',                                                label: 'Visite o site',         icone: 'lucide:home' },
  sobre:       { rota: '/sobre-fotografa-lillia-tavares',                  label: 'Sobre mim',             icone: 'lucide:user' },
  portfolio:   { rota: '/ensaio-fotografico',                              label: 'Portfólio',            icone: 'lucide:camera' },
  blog:        { rota: '/blog',                                            label: 'Blog',                  icone: 'lucide:newspaper' },
  depoimentos: { rota: '/depoimentos',                                     label: 'Depoimentos',           icone: 'lucide:message-square-quote' },
  precos:      { rota: '/precos-ensaios-fotograficos',                     label: 'Preços e pacotes',     icone: 'lucide:tag' },
  faq:         { rota: '/perguntas-frequentes',                            label: 'Perguntas frequentes',  icone: 'lucide:circle-help' },
  estudio:     { rota: '/estudio-fotografico-em-mogi-das-cruzes',          label: 'O estúdio',            icone: 'lucide:store' },
  aluguel:     { rota: '/estudio-fotografico-em-mogi-das-cruzes/aluguel',  label: 'Aluguel do estúdio',   icone: 'lucide:key' },
  coloracao:   { rota: '/analise-coloracao-pessoal-em-mogi',               label: 'Análise de coloração', icone: 'lucide:palette' },
  agendamento: { rota: '/agende-seu-ensaio',                               label: 'Agende seu ensaio',     icone: 'lucide:calendar' },
  contato:     { rota: '/agende-seu-ensaio',                               label: 'Contato',               icone: 'lucide:mail' },
} as const;

export type LinktreeDestino = keyof typeof LINKTREE_DESTINOS;
export const LINKTREE_DESTINO_KEYS = Object.keys(LINKTREE_DESTINOS) as [LinktreeDestino, ...LinktreeDestino[]];

// ── primitivos ───────────────────────────────────────────────────────────────
const optLabel = z.string().max(120).optional();
const optDesc  = z.string().max(300).optional();
const cfImageId = z.string().min(1).max(80);

// ── config por tipo de bloco ──────────────────────────────────────────────────
export const AtalhoConfigSchema = z.object({
  destino:   z.enum(LINKTREE_DESTINO_KEYS),
  label:     optLabel,
  descricao: optDesc,
});

export const PostConfigSchema = z.object({
  postId:    z.number().int().positive(),
  label:     optLabel,
  descricao: optDesc,
});

export const PortfolioConfigSchema = z.object({
  workId:    z.number().int().positive(),
  label:     optLabel,
  descricao: optDesc,
});

export const DepoimentoConfigSchema = z.object({
  depoimentoId: z.number().int().positive(),
});

export const BannerConfigSchema = z.object({
  imageCfId: cfImageId,
  label:     optLabel,
  url:       z.string().max(300).optional(),
});

export const CustomConfigSchema = z.object({
  titulo: z.string().min(1).max(160),
  html:   z.string().max(2000),
});

// ── item (discriminated union) ────────────────────────────────────────────────
const base = { ordem: z.number().int().min(0), ativo: z.boolean().default(true) };

export const LinktreeItemSchema = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('atalho'),     ...base, config: AtalhoConfigSchema }),
  z.object({ tipo: z.literal('post'),       ...base, config: PostConfigSchema }),
  z.object({ tipo: z.literal('portfolio'),  ...base, config: PortfolioConfigSchema }),
  z.object({ tipo: z.literal('depoimento'), ...base, config: DepoimentoConfigSchema }),
  z.object({ tipo: z.literal('banner'),     ...base, config: BannerConfigSchema }),
  z.object({ tipo: z.literal('custom'),     ...base, config: CustomConfigSchema }),
]);

export const LinktreeItemsReplaceSchema = z.array(LinktreeItemSchema).max(60);

export const LinktreeProfileSchema = z.object({
  avatarCfId: z.string().max(80).nullable().optional(),
  nome:       z.string().max(120).default(''),
  headline:   z.string().max(280).nullable().optional(),
  tema:       z.enum(['claro', 'escuro', 'marrom', 'azul']).default('claro'),
});

export const LinktreeSaveSchema = z.object({
  profile: LinktreeProfileSchema,
  items:   LinktreeItemsReplaceSchema,
});

// ── presets (temporadas/temas) ─────────────────────────────────────────────────
/** Título do preset exibido no admin (ex.: "Padrão", "Dia das Mães"). */
export const LinktreePresetTitleSchema = z.object({
  titulo: z.string().trim().min(1).max(80),
});

export type LinktreePresetTitleInput = z.infer<typeof LinktreePresetTitleSchema>;

// ── types ──────────────────────────────────────────────────────────────────────
export type LinktreeItemType  = z.infer<typeof LinktreeItemSchema>['tipo'];
export type LinktreeItemInput = z.infer<typeof LinktreeItemSchema>;
export type LinktreeProfileInput = z.infer<typeof LinktreeProfileSchema>;
export type LinktreeSaveInput = z.infer<typeof LinktreeSaveSchema>;

export const LINKTREE_ITEM_TYPES: LinktreeItemType[] = [
  'atalho', 'post', 'portfolio', 'depoimento', 'banner', 'custom',
];

/**
 * Chave estável p/ métricas de clique — derivada só do `config`, então sobrevive
 * a reordenação e ao replace (delete+insert) dos itens. Usada igual no servidor
 * (resolução/incremento) e no admin (exibir contagem por item).
 */
export function linktreeItemKey(item: { tipo: LinktreeItemType; config: any }): string {
  switch (item.tipo) {
    case 'atalho':     return `atalho:${item.config.destino}`;
    case 'post':       return `post:${item.config.postId}`;
    case 'portfolio':  return `portfolio:${item.config.workId}`;
    case 'depoimento': return `depoimento:${item.config.depoimentoId}`;
    case 'banner':     return `banner:${item.config.imageCfId}`;
    case 'custom':     return `custom:${item.config.titulo}`;
    default:           return 'desconhecido';
  }
}
