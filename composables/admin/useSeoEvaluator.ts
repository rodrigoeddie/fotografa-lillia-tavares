export interface SeoIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface SeoItem {
  id: number;
  type: 'portfolio' | 'blog' | 'faq';
  title: string;
  editUrl: string;
  score: number; // 0-100
  issues: SeoIssue[];
}

// ─── Portfolio evaluator ──────────────────────────────────────────────────────

function evaluatePortfolioWork(w: any): SeoItem {
  const issues: SeoIssue[] = [];
  let deductions = 0;

  if (!w.titulo) {
    issues.push({ severity: 'error', message: 'Sem título' });
    deductions += 25;
  }

  if (!w.descricao) {
    issues.push({ severity: 'error', message: 'Sem descrição' });
    deductions += 20;
  } else if (w.descricao.length < 80) {
    issues.push({ severity: 'warning', message: `Descrição curta (${w.descricao.length} chars, mínimo 80)` });
    deductions += 8;
  } else if (w.descricao.length > 160) {
    issues.push({ severity: 'warning', message: `Descrição longa (${w.descricao.length} chars, máximo 160)` });
    deductions += 5;
  }

  const keywords = w.seo_keywords ? (Array.isArray(w.seo_keywords) ? w.seo_keywords : JSON.parse(w.seo_keywords || '[]')) : [];
  if (!keywords.length) {
    issues.push({ severity: 'warning', message: 'Sem palavras-chave SEO' });
    deductions += 10;
  } else if (keywords.length < 3) {
    issues.push({ severity: 'info', message: `Poucas palavras-chave (${keywords.length}, recomendado ≥ 3)` });
    deductions += 5;
  }

  const fotos = w.fotos ?? [];
  if (fotos.length === 0) {
    issues.push({ severity: 'error', message: 'Nenhuma foto adicionada' });
    deductions += 20;
  } else {
    const fotosWithAlt = fotos.filter((f: any) => f.alt);
    if (fotosWithAlt.length < fotos.length) {
      const missing = fotos.length - fotosWithAlt.length;
      issues.push({ severity: 'warning', message: `${missing} foto(s) sem alt text` });
      deductions += Math.min(missing * 3, 12);
    }
    const hasThumbs = fotos.some((f: any) => f.can_be_thumb === 1 || f.can_be_thumb === true);
    if (!hasThumbs) {
      issues.push({ severity: 'warning', message: 'Nenhuma foto marcada como thumbnail' });
      deductions += 5;
    }
  }

  if (!w.categoria) {
    issues.push({ severity: 'error', message: 'Sem categoria' });
    deductions += 10;
  }

  if (!w.local) {
    issues.push({ severity: 'info', message: 'Sem local definido' });
    deductions += 3;
  }

  const slug = w.slug ?? '';
  if (slug.length > 60) {
    issues.push({ severity: 'info', message: `Slug longo (${slug.length} chars, recomendado ≤ 60)` });
    deductions += 3;
  }

  if (!issues.length) {
    issues.push({ severity: 'info', message: 'Tudo OK!' });
  }

  return {
    id: w.id,
    type: 'portfolio',
    title: w.titulo || w.slug || `Work #${w.id}`,
    editUrl: `/admin/portfolio/save/${w.id}`,
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ─── Blog evaluator ───────────────────────────────────────────────────────────

function evaluateBlogPost(p: any): SeoItem {
  const issues: SeoIssue[] = [];
  let deductions = 0;

  if (!p.titulo) {
    issues.push({ severity: 'error', message: 'Sem título' });
    deductions += 25;
  } else if (p.titulo.length > 60) {
    issues.push({ severity: 'warning', message: `Título longo (${p.titulo.length} chars, recomendado ≤ 60)` });
    deductions += 5;
  }

  if (!p.descricao) {
    issues.push({ severity: 'error', message: 'Sem meta descrição' });
    deductions += 20;
  } else if (p.descricao.length < 80) {
    issues.push({ severity: 'warning', message: `Descrição curta (${p.descricao.length} chars, mínimo 80)` });
    deductions += 8;
  } else if (p.descricao.length > 160) {
    issues.push({ severity: 'warning', message: `Descrição longa (${p.descricao.length} chars, máximo 160)` });
    deductions += 5;
  }

  if (!p.imagem_cf_id) {
    issues.push({ severity: 'error', message: 'Sem imagem de capa' });
    deductions += 15;
  }

  if (!p.conteudo || p.conteudo.length < 300) {
    const len = p.conteudo?.length ?? 0;
    issues.push({ severity: 'warning', message: `Conteúdo curto (${len} chars, recomendado ≥ 300)` });
    deductions += 10;
  }

  const keywords = p.seo_keywords ? (Array.isArray(p.seo_keywords) ? p.seo_keywords : JSON.parse(p.seo_keywords || '[]')) : [];
  if (!keywords.length) {
    issues.push({ severity: 'warning', message: 'Sem palavras-chave SEO' });
    deductions += 10;
  }

  if (!p.data) {
    issues.push({ severity: 'info', message: 'Sem data de publicação' });
    deductions += 3;
  }

  if (!p.categoria) {
    issues.push({ severity: 'error', message: 'Sem categoria' });
    deductions += 10;
  }

  if (!p.ativo) {
    issues.push({ severity: 'info', message: 'Post inativo (não publicado)' });
  }

  if (!issues.length) {
    issues.push({ severity: 'info', message: 'Tudo OK!' });
  }

  return {
    id: p.id,
    type: 'blog',
    title: p.titulo || p.slug || `Post #${p.id}`,
    editUrl: `/admin/blog/save/${p.id}`,
    score: Math.max(0, 100 - deductions),
    issues,
  };
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useSeoEvaluator() {
  const { adminFetch } = useAdminFetch();
  const items = ref<SeoItem[]>([]);
  const loading = ref(false);

  const summary = computed(() => {
    const total = items.value.length;
    if (!total) return null;
    const avg = Math.round(items.value.reduce((s, i) => s + i.score, 0) / total);
    const errors = items.value.reduce((n, i) => n + i.issues.filter(x => x.severity === 'error').length, 0);
    const warnings = items.value.reduce((n, i) => n + i.issues.filter(x => x.severity === 'warning').length, 0);
    return { total, avg, errors, warnings };
  });

  async function evaluate() {
    loading.value = true;
    items.value = [];
    try {
      const [portfolioRes, blogRes] = await Promise.all([
        adminFetch<any[]>('/api/admin/portfolio?all=1'),
        adminFetch<any[]>('/api/admin/blog'),
      ]);

      // Load fotos for each portfolio work
      const portfolioItems = await Promise.all(
        (portfolioRes ?? []).map(async (w: any) => {
          try {
            const work = await adminFetch<any>(`/api/admin/portfolio/${w.id}`);
            return evaluatePortfolioWork(work);
          } catch {
            return evaluatePortfolioWork(w);
          }
        })
      );

      const blogItems = (blogRes ?? []).map(evaluateBlogPost);

      items.value = [...portfolioItems, ...blogItems].sort((a, b) => a.score - b.score);
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, summary, evaluate };
}
