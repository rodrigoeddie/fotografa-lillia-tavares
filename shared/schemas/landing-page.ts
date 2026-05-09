import { z } from 'zod';

// ── primitivos ───────────────────────────────────────────────
const cfImageId  = z.string().min(1).max(80);
const wppMessage = z.string().min(1).max(500);

// ── schemas de `dados` por tipo de bloco ─────────────────────
export const HeroDataSchema = z.object({
  variant:         z.enum(['corporativo', 'dia-das-maes']),
  title:           z.string().optional(),
  subtitle:        z.string().optional(),
  features:        z.array(z.string()).optional(),
  ctaText:         z.string().optional(),
  whatsappMessage: wppMessage.optional(),
});

export const HeroPresentesDataSchema = z.object({
  title:           z.string(),
  subtitle:        z.string(),
  features:        z.array(z.string()),
  whatsappMessage: wppMessage,
  buttonText:      z.string(),
});

export const ForWhoDataSchema = z.object({
  title:       z.string(),
  description: z.string(),
  lists:       z.array(z.object({
    title: z.string(),
    list:  z.array(z.string()),
  })).min(1),
});

export const HowWorksDataSchema = z.object({
  title: z.string(),
  list:  z.array(z.object({
    title:       z.string(),
    description: z.string(),
    icon:        z.string(),
    fillnone:    z.boolean().optional(),
  })).min(1),
});

export const PricesDataSchema = z.object({
  produtoSlug: z.string().min(1),
  title:       z.string().optional(),
  description: z.string().optional(),
});

export const TestimonialsDataSchema = z.object({
  description: z.string().optional(),
});

export const CtaContactDataSchema = z.object({
  title:           z.string(),
  description:     z.string(),
  buttonText:      z.string(),
  whatsappMessage: wppMessage,
  image:           cfImageId.optional(),
  imageAlt:        z.string().optional(),
  imageWidth:      z.string().optional(),
  features:        z.array(z.string()).optional(),
});

export const MapDataSchema = z.object({
  title:            z.string(),
  description:      z.string(),
  finalDescription: z.string().optional(),
});

export const PortfolioGridDataSchema = z.object({
  categoria:    z.string(),
  title:        z.string(),
  description:  z.string(),
  buttonText:   z.string().optional(),
  buttonLink:   z.string().optional(),
  buttonLabel:  z.string().optional(),
});

export const GiftGridDataSchema = z.object({
  title:       z.string().optional(),
  description: z.string().optional(),
  items: z.array(z.object({
    title:       z.string(),
    description: z.string(),
    link:        z.string().optional(),
    icon:        z.string(),
    active:      z.boolean().default(true),
  })).optional(),
});

export const ColoracaoDataSchema = z.object({
  title:       z.string().optional(),
  subtitle:    z.string().optional(),
  description: z.string().optional(),
});

export const DeliverablesDataSchema = z.object({
  title:       z.string(),
  description: z.string(),
  items:       z.array(z.object({
    icon:        z.string(),
    title:       z.string(),
    description: z.string(),
  })),
});

export const HubBacklinkDataSchema = z.object({
  text:      z.string(),
  linkLabel: z.string(),
  linkTo:    z.string(),
});

// ── discriminated union ──────────────────────────────────────
export const BlockSchema = z.discriminatedUnion('tipo', [
  z.object({ tipo: z.literal('hero'),          ordem: z.number().int().min(0), dados: HeroDataSchema }),
  z.object({ tipo: z.literal('heroPresentes'), ordem: z.number().int().min(0), dados: HeroPresentesDataSchema }),
  z.object({ tipo: z.literal('forWho'),        ordem: z.number().int().min(0), dados: ForWhoDataSchema }),
  z.object({ tipo: z.literal('howWorks'),      ordem: z.number().int().min(0), dados: HowWorksDataSchema }),
  z.object({ tipo: z.literal('prices'),        ordem: z.number().int().min(0), dados: PricesDataSchema }),
  z.object({ tipo: z.literal('testimonials'),  ordem: z.number().int().min(0), dados: TestimonialsDataSchema }),
  z.object({ tipo: z.literal('ctaContact'),    ordem: z.number().int().min(0), dados: CtaContactDataSchema }),
  z.object({ tipo: z.literal('map'),           ordem: z.number().int().min(0), dados: MapDataSchema }),
  z.object({ tipo: z.literal('portfolioGrid'), ordem: z.number().int().min(0), dados: PortfolioGridDataSchema }),
  z.object({ tipo: z.literal('giftGrid'),      ordem: z.number().int().min(0), dados: GiftGridDataSchema }),
  z.object({ tipo: z.literal('coloracao'),     ordem: z.number().int().min(0), dados: ColoracaoDataSchema }),
  z.object({ tipo: z.literal('deliverables'),  ordem: z.number().int().min(0), dados: DeliverablesDataSchema }),
  z.object({ tipo: z.literal('hubBacklink'),   ordem: z.number().int().min(0), dados: HubBacklinkDataSchema }),
]);

export const BlocksReplaceSchema = z.array(BlockSchema).max(40);

// ── input da Landing Page ────────────────────────────────────
export const LandingPageInputSchema = z.object({
  slug:      z.string().regex(/^[a-z0-9-]+$/).min(1).max(80),
  rota:      z.string().startsWith('/').min(2),
  titulo:    z.string().min(1).max(160),
  descricao: z.string().max(500).optional().nullable(),
  lp_class:  z.string().max(60).optional().nullable(),
  ativo:     z.boolean().default(true),
  ordem:     z.number().int().min(0).default(0),
});

export type LpBlockType = z.infer<typeof BlockSchema>['tipo'];
export type LpBlock     = z.infer<typeof BlockSchema>;
export type LandingPageInput = z.infer<typeof LandingPageInputSchema>;

export const LP_BLOCK_TYPES: LpBlockType[] = [
  'hero', 'heroPresentes', 'forWho', 'howWorks', 'prices', 'testimonials',
  'ctaContact', 'map', 'portfolioGrid', 'giftGrid', 'coloracao', 'deliverables', 'hubBacklink',
];
