/**
 * Adapters para transformar dados do D1 (banco de dados) no formato
 * que os componentes Vue existentes esperam.
 */

export const PORTFOLIO_CATEGORIAS: Record<string, string> = {
  corporativo: 'Corporativo',
  'sensual-intimista': 'Sensual Intimista',
  'dia-das-maes': 'Dia das Mães',
  gestante: 'Gestante',
  aniversario: 'Aniversário',
  casal: 'Casal',
};

export const BLOG_CATEGORIAS: Record<string, string> = {
  'fotografia-corporativa': 'Fotografia Corporativa',
  'cenarios-tematicos': 'Cenários Temáticos',
  presentes: 'Presentes',
  dicas: 'Dicas',
};

/** Adapta uma foto do D1 (portfolio_fotos) ao formato de album do componente Gallery */
export function adaptFoto(f: any, idx: number) {
  return {
    imageId: f.cf_image_id,
    format: f.formato || 'retrato',
    canBeThumb: f.can_be_thumb === 1 || f.can_be_thumb === true,
    highlight: f.highlight === 1 || f.highlight === true,
    customClass: f.custom_class ?? '',
    alt: f.alt ?? '',
    width: f.width ?? 800,
    height: f.height ?? 1000,
    order: f.ordem ?? idx,
    index: idx,
  };
}

/** Adapta um portfolio_work do D1 ao formato de work do componente */
export function adaptPortfolioWork(w: any) {
  const fotos: any[] = (w.fotos ?? []).map(adaptFoto);
  const album = fotos;

  const retratoSlides = fotos
    .filter((f) => f.format === 'retrato' && f.canBeThumb)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  const paisagemSlides = fotos
    .filter((f) => f.format === 'paisagem' && f.canBeThumb)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  return {
    ...w,
    title: w.titulo,
    description: w.descricao ?? '',
    colorHighlight: w.cor_destaque ?? '#000000',
    homeOrder: w.home_order ?? 0,
    path: `/ensaio-fotografico/${w.slug}`,
    category: {
      slug: w.categoria,
      title: PORTFOLIO_CATEGORIAS[w.categoria] ?? w.categoria,
    },
    testimonial: (w.depoimento?.texto ?? w.depoimento_texto)
      ? {
          text: w.depoimento?.texto ?? w.depoimento_texto,
          avatar: w.depoimento?.foto_cf_id ?? w.depoimento_avatar ?? '',
          link: w.depoimento?.link ?? w.depoimento_link ?? '',
          date: w.depoimento?.data ?? '',
          rating: Number(w.depoimento?.rating ?? 5),
          source: 'Google',
        }
      : null,
    album,
    photos: { retrato: retratoSlides, paisagem: paisagemSlides },
  };
}

/** Adapta um blog_post do D1 ao formato do componente */
export function adaptBlogPost(p: any) {
  return {
    ...p,
    title: p.titulo,
    description: p.descricao ?? '',
    date: p.data,
    image: p.imagem_cf_id ? { imageId: p.imagem_cf_id } : null,
    active: p.ativo === 1,
    path: `/blog/${p.categoria}/${p.slug}`,
    category: {
      slug: p.categoria,
      title: BLOG_CATEGORIAS[p.categoria] ?? p.categoria,
    },
    // content was an array in Nuxt Content; wrap single HTML string for compatibility
    content: p.conteudo ? [p.conteudo] : [],
    contentImages: Array.isArray(p.conteudo_imagens) ? p.conteudo_imagens : [],
  };
}

/** Adapta um produto do D1 ao formato esperado por SectionsPrecosInternal */
export function adaptProduto(p: any) {
  return {
    ...p,
    lp: p.lp_slug,
    active: p.active === 1,
    packages: (p.pacotes ?? []).map((pk: any) => ({
      ...pk,
      price: pk.preco,
      numParcelas: pk.num_parcelas,
      priceParcelas: pk.preco_parcelas,
      photos: pk.fotos_incluidas,
      extraPhotoPrice: pk.preco_foto_extra,
      isRecommended: pk.is_recommended === 1,
    })),
    cta: {
      title: p.cta_title ?? '',
      description: p.cta_description ?? '',
      whatsappMessage: p.cta_whatsapp_msg ?? '',
    },
  };
}

/** Adapta categories FAQ do D1 ao formato esperado por SectionsFaqSection */
export function adaptFaqCategoria(c: any) {
  return {
    ...c,
    name: c.titulo,
    questions: (c.perguntas ?? []).map((q: any) => ({
      ...q,
      question: q.pergunta,
      answer: q.resposta,
    })),
  };
}

/** Adapta um depoimento do D1 ao formato de review */
export function adaptDepoimento(d: any) {
  return {
    ...d,
    name: d.nome,
    text: d.texto,
    photo: d.foto_cf_id ?? '',
    date: d.data ?? '',
    source: 'Google',
    rating: Number(d.rating ?? 5),
  };
}
