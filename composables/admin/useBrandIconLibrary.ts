/**
 * Biblioteca de ícones da marca (traço orgânico + fills sage/rosé — estilo do logo).
 * Fonte dos desenhos: docs/icones/ (ver README de lá).
 *
 * Cada `svg` é markup standalone pronto para gravar no campo `produto.icon`
 * (renderizado via v-html no admin e em SectionsPrecosList). Mantém `fill="none"`
 * na raiz e `viewBox 0 0 48 48` — não aplicar a classe global `.icon` (o reset
 * `.icon { fill: currentColor !important }` destruiria as cores).
 */
export interface BrandIcon {
  id: string;
  label: string;
  group: string;
  svg: string;
}

export const BRAND_ICONS: BrandIcon[] = [
  {
    id: 'ensaio',
    label: 'Ensaio (câmera)',
    group: 'Serviços',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M10.5 19.5h29l-1 19h-27z" fill="#E3BCAE"/><path d="M9 18.6c.2-1.5 1.3-2.4 2.8-2.4h4.4l2.4-3.4c.5-.7 1.2-1 2-1h6.6c.8 0 1.6.3 2 1l2.4 3.4h4.6c1.5 0 2.6 1 2.7 2.5.3 6-.1 12.2-.7 18-.1 1.4-1.3 2.4-2.7 2.4H12.4c-1.4 0-2.6-1-2.7-2.4-.6-6-.9-12.1-.7-18.1z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24.2" cy="28.3" r="6.8" fill="#B06F5E" stroke="#35331F" stroke-width="2.2"/><circle cx="35.4" cy="22.4" r="1.4" fill="#35331F"/><path d="M17.5 11.5c-1.6-2.4-3.8-3.7-6.9-3.9.9 2.9 2.9 4.4 6.9 3.9z" fill="#DFDCC6" stroke="#35331F" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'estudio',
    label: 'Estúdio (softbox)',
    group: 'Serviços',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M14.5 8.5l17-1.5-1.5 15-16.5 1.5z" fill="#DFDCC6"/><path d="M13 7.5l17.5-1.6-1.6 15.4-17.3 1.6z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 7.5l14.3 12.2M30.4 6l-15.6 13.3" stroke="#35331F" stroke-width="1.6" stroke-linecap="round"/><path d="M21 22.5l.8 6.5" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M21.8 29l-7.3 12.5M21.8 29l7.6 12.5M21.8 29l-.3 13" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="21.8" cy="29" r="2.2" fill="#B06F5E" stroke="#35331F" stroke-width="1.6"/></svg>`,
  },
  {
    id: 'coloracao',
    label: 'Coloração (cartelas)',
    group: 'Serviços',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M12 40.5l-4.2-19.8c2.4-1.4 5-2.2 7.8-2.4l4 19.5z" fill="#7B785B" stroke="#35331F" stroke-width="2.2" stroke-linejoin="round"/><path d="M19.6 37.8l-1.9-20.1c2.7-.7 5.4-.8 8.1-.4l1.6 20z" fill="#DFDCC6" stroke="#35331F" stroke-width="2.2" stroke-linejoin="round"/><path d="M27.4 37.3l1.9-20c2.8.5 5.4 1.5 7.7 3l-2.2 19.7z" fill="#E3BCAE" stroke="#35331F" stroke-width="2.2" stroke-linejoin="round"/><path d="M34.8 40l4.4-16.5c1.6 1.3 3 2.9 4.1 4.7L39.7 41.6z" fill="#B06F5E" stroke="#35331F" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12.6" cy="24.4" r="1.4" fill="#F7F4E8"/></svg>`,
  },
  {
    id: 'consultoria',
    label: 'Consultoria (cabide)',
    group: 'Serviços',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M24 19.5L11.2 28.4c-1.1.8-.6 2.4.7 2.4h24.2c1.3 0 1.8-1.6.7-2.4z" fill="#DFDCC6"/><path d="M24 8.3c1.8 0 3.2 1.3 3.2 3 0 1.4-.9 2.3-2.1 2.8-.8.3-1.1.8-1.1 1.6v2.2" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M24 18.2L9.9 28c-1.2.8-.7 2.6.8 2.6h26.6c1.5 0 2-1.8.8-2.6z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 30.8v3.4" stroke="#35331F" stroke-width="2" stroke-linecap="round"/><path d="M24 41.2c-2.6-2-4.3-3.7-4.3-5.8 0-1.6 1.2-2.7 2.5-2.7.9 0 1.6.4 2 1.2.4-.8 1.1-1.2 2-1.2 1.3 0 2.5 1.1 2.5 2.7 0 2.1-1.9 3.8-4.7 5.8z" fill="#B06F5E" stroke="#35331F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'aluguel',
    label: 'Aluguel (chave)',
    group: 'Serviços',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M18.5 14c4 .8 6.6 4.2 6 8.1-.6 3.9-4.2 6.6-8.2 6-4-.7-6.6-4.3-6-8.2.7-3.9 4.2-6.5 8.2-5.9z" fill="#DFDCC6"/><circle cx="16.8" cy="19.6" r="6.9" stroke="#35331F" stroke-width="2.2"/><circle cx="16.8" cy="19.6" r="2.5" stroke="#35331F" stroke-width="1.8"/><path d="M22.2 24.4c5 4.7 10 9.6 14.8 14.4" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M30.4 31.4l-3.3 3.3M35 35.8l-3.3 3.3" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><circle cx="21.4" cy="24.6" r="1.6" fill="#B06F5E"/></svg>`,
  },
  {
    id: 'precos',
    label: 'Preços (etiqueta)',
    group: 'Serviços',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M26.5 9.5l12 12c1 1 1 2.6 0 3.6L27.1 36.5c-1 1-2.6 1-3.6 0l-12-12c-.5-.5-.8-1.2-.7-1.9l.8-10.3c.1-1.2 1-2.1 2.2-2.2l10.3-.8c.7-.1 1.4.2 1.9.7z" fill="#DFDCC6"/><path d="M24.5 7.5l12 12c1 1 1 2.6 0 3.6L25.1 34.5c-1 1-2.6 1-3.6 0l-12-12c-.5-.5-.8-1.2-.7-1.9l.8-10.3c.1-1.2 1-2.1 2.2-2.2l10.3-.8c.7-.1 1.4.2 1.9.7z" stroke="#35331F" stroke-width="2.2" stroke-linejoin="round"/><circle cx="16.8" cy="16.6" r="2.2" fill="#B06F5E" stroke="#35331F" stroke-width="1.6"/><path d="M23 40.5c4.6 1 8.2-.2 11.6-3.4" stroke="#35331F" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'corporativo',
    label: 'Corporativo (crachá)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M15 17c7-.7 14-.7 21 0 .4 8.3.4 15.9 0 23.7-7 .8-14 .8-21 0-.4-7.8-.4-15.4 0-23.7z" fill="#DFDCC6"/><path d="M13 15.2c7.4-.8 14.8-.8 22.2 0 .4 8.7.4 16.7 0 24.9-7.4.8-14.8.8-22.2 0-.4-8.2-.4-16.2 0-24.9z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.5 7.5l7.6 7.3 7.4-7.5" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="24.3" r="4.6" fill="#B06F5E" stroke="#35331F" stroke-width="2"/><path d="M17.8 33.8c4.2-.5 8.3-.5 12.5 0M19.8 37.6c2.9-.3 5.6-.3 8.5 0" stroke="#35331F" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'sensual-intimista',
    label: 'Sensual intimista (lábios)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M10 23.5Q12 19 16.5 18.5Q21 18 24 21Q27 18 31.5 18.5Q36 19 38 23.5Q33 33.5 24 34.5Q15 33.5 10 23.5Z" fill="#E3BCAE" transform="translate(1.4 1.7)"/><path d="M10 23.5Q12 19 16.5 18.5Q21 18 24 21Q27 18 31.5 18.5Q36 19 38 23.5Q33 33.5 24 34.5Q15 33.5 10 23.5Z" fill="#B06F5E" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 23.5Q17 26 24 26Q31 26 38 23.5" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M16.5 30.4c1.9-1 4-1.4 5.8-1.2" stroke="#F7F4E8" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'dia-das-maes',
    label: 'Dia das mães (corações)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M23.5 39.5c-8.6-6.6-14-12.2-13.9-19 0-5 3.7-8.4 7.9-8.4 2.8 0 5.2 1.6 6.3 3.7 1.1-2.1 3.5-3.7 6.3-3.7 4.3 0 8 3.4 7.9 8.5 0 2.4-.8 4.7-2.2 6.9" fill="#DFDCC6"/><path d="M22 38c-8.6-6.6-14-12.2-13.9-19 0-5 3.7-8.4 7.9-8.4 2.8 0 5.2 1.6 6.3 3.7 1.1-2.1 3.5-3.7 6.3-3.7 4.3 0 8 3.4 7.9 8.5 0 2.4-.8 4.7-2.2 6.9" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M33.8 42.6c-4.3-3.3-7-6.1-7-9.5 0-2.5 1.9-4.2 4-4.2 1.4 0 2.6.8 3.1 1.9.6-1.1 1.8-1.9 3.2-1.9 2.1 0 3.9 1.7 3.9 4.3 0 3.4-2.9 6.1-7.2 9.4z" fill="#E3BCAE" stroke="#35331F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'gestante',
    label: 'Gestante (perfil)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M24.5 24.5c4.5 2.5 7 6 6.2 9.7-.7 3.3-3.2 5.8-6.5 6.8-.8-3-.8-7-.2-10.5.3-2.1.5-4.1.5-6z" fill="#E3BCAE"/><circle cx="21.5" cy="10.5" r="4.7" stroke="#35331F" stroke-width="2.2"/><path d="M18.5 16.5c-2.8 4.6-3.4 10.6-3 16.2.3 4.3 1.3 7.6 2.5 9.8" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M23.7 16.8c.9 2.4.5 4-.4 6 5.3 2.6 8.5 6.4 7.5 10.7-.9 4-4.2 7.1-8.4 8.3-1.5.4-3 .6-4.4.5" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M26.4 31c-1.6-1.2-2.6-2.3-2.6-3.6 0-1 .8-1.7 1.6-1.7.6 0 1 .3 1.3.8.2-.5.7-.8 1.3-.8.8 0 1.6.7 1.6 1.7 0 1.3-1.2 2.4-3.2 3.6z" fill="#6B2414"/></svg>`,
  },
  {
    id: 'aniversario',
    label: 'Aniversário (balão)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M25.5 9.5c5.6.2 9.6 4.6 9.4 10.4-.2 6.2-5 11-9.9 11.7-4.8-1-9.2-6.1-9-12.3.2-5.8 4.4-10 9.5-9.8z" fill="#E3BCAE"/><path d="M24 8c5.6.2 9.6 4.6 9.4 10.4-.2 6.2-5 11-9.9 11.7-4.8-1-9.2-6.1-9-12.3C14.7 12 18.9 7.8 24 8z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.5 30.1l-1.7 3 3.5.1z" stroke="#35331F" stroke-width="1.8" stroke-linejoin="round"/><path d="M23.3 33.4c1.7 2.4-1.6 4 .1 6.6" stroke="#35331F" stroke-width="1.8" stroke-linecap="round"/><circle cx="10.5" cy="31.5" r="1.6" fill="#7B785B"/><circle cx="37" cy="34" r="1.6" fill="#6B2414"/><path d="M12 40.5l2.6-1.4M34 42l2.4-1.8M9 12.5l2.2 1.6M36.5 10l-2 1.8" stroke="#7B785B" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'casal',
    label: 'Casal (corações)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M20 36.5c-6.8-5.2-11-9.6-11-14.9 0-4 2.9-6.7 6.2-6.7 2.2 0 4.1 1.2 5 3 .9-1.8 2.8-3 5-3 3.4 0 6.3 2.7 6.2 6.8 0 5.2-4.6 9.6-11.4 14.8z" fill="#DFDCC6" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.6 41.4c-5.5-4.3-9-7.9-9-12.2 0-3.3 2.4-5.5 5.1-5.5 1.8 0 3.4 1 4.1 2.4.7-1.4 2.3-2.4 4.1-2.4 2.8 0 5.2 2.2 5.1 5.6 0 4.3-3.8 7.9-9.4 12.1z" fill="#E3BCAE" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'presente',
    label: 'Presente (caixa)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M12.5 22.5h25l-1 19.5H14z" fill="#DFDCC6"/><path d="M10.5 15.5h27l-.4 6.5H11z" fill="#E3BCAE"/><path d="M11 15.2h26.4l-.5 6.6H11.4zM13 21.8l.9 18.7h20.5l1-18.7" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24.2 15.4V40.3" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M24 15c-3.6-.6-6.6-2.3-6.4-4.7.2-1.7 1.7-2.7 3.3-2.4 2.4.4 3.3 3.6 3.1 7.1zM24.5 15c3.6-.6 6.5-2.3 6.3-4.7-.2-1.7-1.7-2.7-3.3-2.4-2.3.4-3.2 3.6-3 7.1z" stroke="#35331F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'cenarios',
    label: 'Cenários temáticos',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M16.5 12.5h17v20.2c-3 2.5-6 3.6-8.6 3.6-2.6 0-5.6-1.1-8.4-3.5z" fill="#DFDCC6"/><path d="M8.5 10.5c10.3-1.4 20.7-1.4 31 0" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M11 10.2V42M37 10.2V42" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M15 11v20.7c2.8 2.4 5.9 3.6 8.5 3.6 2.6 0 5.7-1.2 8.7-3.7V11" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M23.7 17.8l1.5 3.2 3.4.4-2.5 2.4.7 3.4-3.1-1.7-3 1.7.6-3.4-2.5-2.4 3.4-.4z" fill="#B06F5E" stroke="#35331F" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'dicas',
    label: 'Dicas (lâmpada)',
    group: 'Categorias',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M25.5 9.5c6 .3 10 4.9 9.8 10.3-.1 3.4-1.8 5.8-3.6 8-1.2 1.4-2 2.7-2.4 4.4h-8.2c-.4-1.7-1.3-3-2.5-4.5-1.8-2.1-3.4-4.5-3.3-7.9.2-5.5 4.5-10.5 10.2-10.3z" fill="#DFDCC6"/><path d="M24 8c6 .3 10 4.9 9.8 10.3-.1 3.4-1.8 5.8-3.6 8-1.2 1.4-2 2.7-2.4 4.4h-8.2c-.4-1.7-1.3-3-2.5-4.5-1.8-2.1-3.4-4.5-3.3-7.9C14 12.8 18.3 7.8 24 8z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.5 35h7M21.3 38.6h5.4M22.6 42h2.8" stroke="#35331F" stroke-width="2" stroke-linecap="round"/><path d="M24 30.5c-.3-4 .5-7.5 2.5-10.5" stroke="#35331F" stroke-width="1.8" stroke-linecap="round"/><path d="M26 21.5c-.2-2 .6-3.6 2.4-4.6.5 2-.2 3.7-2.4 4.6zM23.2 25.6c-2-.2-3.4-1.3-4-3.3 2-.2 3.5.9 4 3.3z" fill="#B06F5E"/></svg>`,
  },
  {
    id: 'fotografa',
    label: 'Fotógrafa (hortênsia)',
    group: 'Sobre',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M25.5 10c3-2 7-1 8.5 2 3.5-.5 6.5 2 6 5.5 2.5 2 2.5 6-.5 7.5.5 3.5-2.5 6-6 5.5-1.5 3-5.5 4-8 2-2.5 2-6.5 1-8-2-3.5.5-6.5-2-6-5.5-2.5-1.5-2.5-5.5.5-7.5-.5-3.5 2.5-6 6-5.5 1.5-3 5.5-4 7.5-2z" fill="#DFDCC6"/><path d="M24 8c3-2 7-1 8.5 2 3.5-.5 6.5 2 6 5.5 2.5 2 2.5 6-.5 7.5.5 3.5-2.5 6-6 5.5-1.5 3-5.5 4-8 2-2.5 2-6.5 1-8-2-3.5.5-6.5-2-6-5.5-2.5-1.5-2.5-5.5.5-7.5-.5-3.5 2.5-6 6-5.5 1.5-3 5.5-4 7.5-2z" stroke="#35331F" stroke-width="2.2" stroke-linejoin="round"/><circle cx="20" cy="18" r="1.3" fill="#35331F"/><circle cx="27.5" cy="15.5" r="1.3" fill="#35331F"/><circle cx="24.5" cy="22.5" r="1.3" fill="#35331F"/><path d="M24 30.5c-.5 4.5-.4 7.6.5 11" stroke="#35331F" stroke-width="2.2" stroke-linecap="round"/><path d="M24.2 36c-4-.5-6.6-2.6-7.4-6.1 3.9-.3 6.7 1.9 7.4 6.1z" fill="#B06F5E" stroke="#35331F" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  },
  {
    id: 'depoimentos',
    label: 'Depoimentos (balão + coração)',
    group: 'Sobre',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M25.5 10.5c7.7 0 13.7 4.7 13.7 10.8 0 6.1-6 10.8-13.7 10.8-1.4 0-2.8-.2-4.1-.5-2 1.8-4.6 2.9-8 3.2 1.2-2 1.8-4 1.9-6-3-2-4.8-4.6-4.8-7.5 0-6.1 7.3-10.8 15-10.8z" fill="#DFDCC6"/><path d="M24 8.5c7.7 0 13.7 4.7 13.7 10.8 0 6.1-6 10.8-13.7 10.8-1.4 0-2.8-.2-4.1-.5-2 1.8-4.6 2.9-8 3.2 1.2-2 1.8-4 1.9-6-3-2-4.8-4.6-4.8-7.5C9 13.2 16.3 8.5 24 8.5z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 25.4c-3-2.2-5-4.1-5-6.4 0-1.8 1.4-3 2.8-3 1 0 1.8.4 2.2 1.3.4-.9 1.2-1.3 2.2-1.3 1.4 0 2.8 1.2 2.8 3 0 2.3-2.1 4.2-5 6.4z" fill="#B06F5E" stroke="#35331F" stroke-width="1.6" stroke-linejoin="round"/><path d="M31 38.5l2.7 1.5-.5-3 2.2-2.1-3-.4-1.4-2.8-1.4 2.8-3 .4 2.2 2.1-.5 3z" fill="#7B785B"/></svg>`,
  },
  {
    id: 'blog',
    label: 'Blog (página)',
    group: 'Sobre',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M15.5 9.5c4.8-.5 9.4-.5 13.5-.2l7.5 7.4c.3 8.4.2 16.6-.3 24.7-6.9.8-13.8.8-20.7 0-.4-10.6-.4-21.3 0-31.9z" fill="#DFDCC6"/><path d="M13.5 8c4.8-.5 9.4-.5 13.5-.2l7.5 7.4c.3 8.4.2 16.6-.3 24.7-6.9.8-13.8.8-20.7 0-.4-10.6-.4-21.3 0-31.9z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 7.8l.3 7.5 7.2.2" fill="#E3BCAE" stroke="#35331F" stroke-width="2" stroke-linejoin="round"/><path d="M18.5 21.5c3.6-.3 7.2-.3 10.8 0M18.5 26.5c3.6-.3 7.2-.3 10.8 0M18.5 31.5c2.4-.2 4.8-.2 7.2 0" stroke="#35331F" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    id: 'faq',
    label: 'FAQ (interrogação)',
    group: 'Sobre',
    svg: `<svg viewBox="0 0 48 48" fill="none"><path d="M25.5 9.5c7 .3 12.3 5.7 12 12.4-.3 6.6-6 11.8-13 11.5-1.2 0-2.3-.2-3.4-.6-1.8 1.6-4.1 2.6-7.1 2.9 1-1.8 1.6-3.5 1.7-5.4-2.6-2.1-4.2-5.2-4-8.6.3-6.7 6.7-12.5 13.8-12.2z" fill="#DFDCC6"/><path d="M24 7.5c7 .3 12.3 5.7 12 12.4-.3 6.6-6 11.8-13 11.5-1.2 0-2.3-.2-3.4-.6-1.8 1.6-4.1 2.6-7.1 2.9 1-1.8 1.6-3.5 1.7-5.4-2.6-2.1-4.2-5.2-4-8.6.3-6.7 6.7-12.5 13.8-12.2z" stroke="#35331F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 16.4c.4-2.6 2.5-4.3 5-4 2.4.3 4 2.2 3.6 4.5-.3 1.8-1.6 2.7-2.9 3.6-1 .7-1.6 1.5-1.6 2.9v1" stroke="#35331F" stroke-width="2.4" stroke-linecap="round"/><circle cx="24" cy="28.8" r="1.8" fill="#B06F5E"/></svg>`,
  },
];

export function useBrandIconLibrary() {
  const groups = computed(() => {
    const map = new Map<string, BrandIcon[]>();
    for (const icon of BRAND_ICONS) {
      if (!map.has(icon.group)) map.set(icon.group, []);
      map.get(icon.group)!.push(icon);
    }
    return Array.from(map, ([name, icons]) => ({ name, icons }));
  });
  return { icons: BRAND_ICONS, groups };
}
