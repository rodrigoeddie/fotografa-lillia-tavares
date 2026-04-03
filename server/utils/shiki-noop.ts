/**
 * Stub do Shiki para o bundle do Cloudflare Worker.
 * O site usa highlight: false no @nuxt/content e todos os posts são pre-renderizados,
 * então o Shiki nunca é chamado em runtime — apenas importado estaticamente,
 * o que causa os WASM files (2.9MB) a entrar no Worker desnecessariamente.
 * Este stub substitui o Shiki no bundle do servidor, removendo os WASM files.
 */

const noop = () => {}
const asyncNoop = async () => ({})

export default {}

export const getHighlighter = asyncNoop
export const createHighlighter = asyncNoop
export const getSingletonHighlighter = asyncNoop
export const codeToHtml = () => ''
export const codeToTokens = () => ({ tokens: [], fg: '', bg: '', rootStyle: '', themeName: '' })
export const codeToThemedTokens = () => []
export const bundledLanguages = {}
export const bundledThemes = {}
export const createJavaScriptRegexEngine = noop
export const createOnigString = noop
export const createOnigScanner = noop
