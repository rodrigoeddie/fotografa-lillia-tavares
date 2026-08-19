/**
 * Conteúdo da página "Sobre a Fotógrafa", vindo de /api/public/sobre (D1).
 *
 * O FALLBACK abaixo reproduz o conteúdo original hard-coded e só entra em cena
 * se o endpoint falhar (ex.: migration 035 ainda não aplicada no ambiente).
 * Uma vez que o banco responde, tudo é editável em /admin/sobre.
 */
export interface SobrePagina {
  titulo: string;
  imagem_cf_id: string | null;
  imagem_alt: string | null;
  imagem_width: number;
  imagem_height: number;
  bio: string;
  servicos_titulo: string;
  timeline_titulo: string;
  timeline_descricao: string | null;
}

export interface SobreServico {
  id: number;
  tag: string | null;
  titulo: string;
  subtitulo: string | null;
  descricao: string | null;
  descricao_extra: string | null;
  cta_label: string | null;
  cta_url: string | null;
  sub_link_label: string | null;
  sub_link_url: string | null;
  destaque: number;
}

export interface SobreMarco {
  id: number;
  ano: number;
  mes: string | null;
  titulo: string;
  descricao: string | null;
  imagem_cf_id: string | null;
  formato: string | null;
}

interface SobreConteudo {
  pagina: SobrePagina | null;
  servicos: SobreServico[];
  marcos: SobreMarco[];
}

const FALLBACK_PAGINA: SobrePagina = {
  titulo: 'Sobre a Fotógrafa Lillia Tavares',
  imagem_cf_id: '5aaf1433-aaa7-42ed-7198-15626f964000',
  imagem_alt: 'Fotógrafa Lillia Tavares segurando sua câmera fotográfica',
  imagem_width: 935,
  imagem_height: 935,
  bio: [
    'Sou fotógrafa em Mogi das Cruzes e consultora de imagem, formada pela Etec de Artes e pelo Senac. Sou especialista em retratos femininos, fotografia corporativa e reposicionamento de imagem, capturando fotografias com intenção, presença e identidade.',
    'Cresci cercada pela fotografia, em uma família que sempre fez questão de registrar e guardar cada momento vivido. Aprendi desde cedo que imagens não são apenas registros, são memórias que atravessam o tempo. Esse olhar atento para os detalhes, para a luz e para as emoções me acompanha em cada ensaio.',
    'Atuo profissionalmente desde 2019, transformando a fotografia em uma ferramenta de fortalecimento da autoestima e construção de imagem. Em junho de 2024, inaugurei meu primeiro estúdio fotográfico em Mogi das Cruzes, criando um espaço pensado para acolher, direcionar e revelar o melhor de cada pessoa.',
    'Cada ensaio é uma experiência guiada. Eu direciono poses, expressões e postura de forma natural, respeitando a individualidade de cada cliente. Meu objetivo é que você se sinta confiante, confortável e verdadeiramente representada nas suas fotos.',
  ].join('\n\n'),
  servicos_titulo: 'O que eu ofereço',
  timeline_titulo: 'Nossa história',
  timeline_descricao: 'Uma jornada de evolução, aprendizado e muitas histórias fotografadas.',
};

const FALLBACK_SERVICOS: SobreServico[] = [
  {
    id: -1,
    tag: 'Produto principal',
    titulo: 'Ensaios Fotográficos em Mogi das Cruzes',
    subtitulo: null,
    descricao: 'Retratos femininos, corporativos, gestantes, família e debutantes. Cada sessão é conduzida com direção de poses, expressão e postura — tudo para revelar sua melhor versão com autenticidade.',
    descricao_extra: 'Como fotógrafa em Mogi das Cruzes, meu propósito é criar retratos que fortaleçam a autoestima, comuniquem identidade e gerem conexão verdadeira.',
    cta_label: 'Ver tipos de ensaio',
    cta_url: '/ensaio-fotografico',
    sub_link_label: null,
    sub_link_url: null,
    destaque: 1,
  },
  {
    id: -2,
    tag: null,
    titulo: 'Estúdio Fotográfico',
    subtitulo: 'Aluguel de espaço em Mogi das Cruzes',
    descricao: 'Sete cenários modernos e sofisticados, do corporativo elegante ao intimista delicado. Fácil acesso, ótimas opções de estacionamento e infraestrutura completa para fotógrafos e criadores de conteúdo.',
    descricao_extra: null,
    cta_label: 'Conhecer o espaço',
    cta_url: '/estudio-fotografico-em-mogi-das-cruzes/aluguel',
    sub_link_label: null,
    sub_link_url: null,
    destaque: 0,
  },
  {
    id: -3,
    tag: null,
    titulo: 'Consultoria de Imagem',
    subtitulo: null,
    descricao: 'Análise e reposicionamento de imagem pessoal, disponível de forma independente ou como parte do pacote Do Tom ao Clique, que une consultoria ao ensaio fotográfico em uma experiência única.',
    descricao_extra: null,
    cta_label: null,
    cta_url: null,
    sub_link_label: 'Análise de Coloração Pessoal',
    sub_link_url: '/analise-coloracao-pessoal-em-mogi',
    destaque: 0,
  },
];

const FALLBACK_MARCOS: SobreMarco[] = [
  { id: -1,  ano: 2019, mes: null,        titulo: 'Espetáculo da Lola',       descricao: 'Primeiros registros profissionais em cobertura de espetáculo teatral — o clique que confirmou a vocação.', imagem_cf_id: '4f6db13c-469a-4636-b6b0-5f3f8dd71100', formato: null },
  { id: -2,  ano: 2019, mes: null,        titulo: 'Ensaio na praia',          descricao: 'Primeiros ensaios externos com luz natural, descobrindo o retrato feminino como linguagem.', imagem_cf_id: 'dfef0926-9e7f-4292-3515-f61e93a55600', formato: null },
  { id: -3,  ano: 2021, mes: 'Formação',  titulo: 'Etec de Artes',            descricao: 'Formação técnica em fotografia pela Etec, construindo a base técnica e artística.', imagem_cf_id: 'cad71dbd-ff03-467e-b1d6-08d299ce5f00', formato: null },
  { id: -4,  ano: 2021, mes: 'Prêmio',    titulo: 'Prêmio Mogi Revela 2021',  descricao: 'Ganhadora do 11º Prêmio Mogi Revela de Fotografia — mostra exibida no Centro Cultural de Mogi das Cruzes, um marco no reconhecimento da carreira.', imagem_cf_id: '67da3987-5e01-4fc9-2417-2c5e2f61ad00', formato: 'portrait' },
  { id: -5,  ano: 2022, mes: 'Formação',  titulo: 'Senac',                    descricao: 'Formação técnica em fotografia pelo Senac, reforçando a base técnica e artística.', imagem_cf_id: null, formato: null },
  { id: -6,  ano: 2022, mes: 'Formação',  titulo: 'Senac',                    descricao: 'Especialização em consultoria de imagem pelo Senac, integrando moda e fotografia.', imagem_cf_id: null, formato: null },
  { id: -7,  ano: 2023, mes: null,        titulo: 'Fashion Week',             descricao: 'Cobertura de desfile de moda — experiência de bastidor e fotografia editorial em ritmo acelerado.', imagem_cf_id: null, formato: null },
  { id: -8,  ano: 2024, mes: 'Junho',     titulo: 'Inauguração do Estúdio',   descricao: 'Abertura do primeiro estúdio fotográfico próprio em Mogi das Cruzes, com sete cenários exclusivos.', imagem_cf_id: null, formato: null },
  { id: -9,  ano: 2024, mes: 'Dezembro',  titulo: 'Natal 2024',               descricao: 'Primeira temporada de Natal no estúdio — cenários temáticos e centenas de famílias fotografadas.', imagem_cf_id: null, formato: null },
  { id: -10, ano: 2025, mes: 'Maio',      titulo: 'Dia das Mães 2025',        descricao: 'Campanha especial para mães e filhos, com ensaios emocionantes e cenários delicados.', imagem_cf_id: null, formato: null },
  { id: -11, ano: 2025, mes: 'Junho',     titulo: '1 Ano de Estúdio',         descricao: 'Um ano de sonho realizado: centenas de ensaios, histórias transformadas e autoestima elevada.', imagem_cf_id: null, formato: null },
  { id: -12, ano: 2025, mes: 'Dezembro',  titulo: 'Natal 2025',               descricao: 'Segunda temporada natalina, com cenários renovados e novos temas exclusivos.', imagem_cf_id: null, formato: null },
  { id: -13, ano: 2026, mes: 'Maio',      titulo: 'Dia das Mães 2026',        descricao: 'Mais uma edição especial celebrando o vínculo entre mães e filhos através da fotografia.', imagem_cf_id: null, formato: null },
  { id: -14, ano: 2026, mes: 'Junho',     titulo: '2 Anos de Estúdio',        descricao: 'Dois anos construindo histórias, revelando beleza e fortalecendo a autoestima de mulheres em Mogi.', imagem_cf_id: null, formato: null },
];

export async function useSobreConteudo() {
  /* useFetch (e não $fetch cru dentro de useAsyncData): no SSR do worker só ele
     herda o contexto da requisição — sem isso o handler não enxerga o binding
     do D1 e a página cai no fallback abaixo. */
  const { data, error } = await useFetch<SobreConteudo>('/api/public/sobre', {
    key: 'sobre-conteudo',
  });

  if (error.value) {
    console.error('[sobre] /api/public/sobre falhou, usando fallback:', error.value);
  }

  const pagina   = computed<SobrePagina>(() => data.value?.pagina ?? FALLBACK_PAGINA);
  const servicos = computed<SobreServico[]>(() => data.value?.servicos?.length ? data.value.servicos : FALLBACK_SERVICOS);
  const marcos   = computed<SobreMarco[]>(() => data.value?.marcos?.length ? data.value.marcos : FALLBACK_MARCOS);

  /** Bio guardada como texto único; parágrafos separados por linha em branco. */
  const bioParagrafos = computed<string[]>(() =>
    (pagina.value.bio ?? '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
  );

  return { pagina, servicos, marcos, bioParagrafos };
}
