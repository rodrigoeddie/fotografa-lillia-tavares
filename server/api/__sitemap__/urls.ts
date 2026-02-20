import { promises as fs } from 'fs'
import { join } from 'path'

export default defineEventHandler(async () => {
  const siteUrl = 'https://fotografalilliatavares.com.br'
  
  try {
    const urls: any[] = []
    const contentDir = join(process.cwd(), 'content')
    
    // Função para remover prefixo numérico (ex: "01.corporativo" -> "corporativo")
    function removeNumericPrefix(name: string): string {
      return name.replace(/^\d+\./, '')
    }
    
    // Função auxiliar para ler arquivos JSON de um diretório
    async function readJsonFiles(dir: string, basePath: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      const files: any[] = []
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        // Remover prefixo numérico do nome para gerar o path correto
        const cleanName = removeNumericPrefix(entry.name.replace(/\.(json|md)$/, ''))
        const relativePath = `${basePath}/${cleanName}`
        
        if (entry.isDirectory()) {
          files.push(...await readJsonFiles(fullPath, relativePath))
        } else if (entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'index.json') {
          try {
            const content = await fs.readFile(fullPath, 'utf-8')
            const data = JSON.parse(content)
            files.push({
              path: relativePath,
              data: data
            })
          } catch (e) {
            console.error(`Error reading ${fullPath}:`, e)
          }
        } else if (entry.isFile() && entry.name === 'index.json') {
          // Adicionar categoria
          files.push({
            path: basePath,
            isCategory: true
          })
        }
      }
      
      return files
    }
    
    // Buscar posts do blog
    try {
      const blogFiles = await readJsonFiles(join(contentDir, 'blog'), '/blog')
      blogFiles.forEach(file => {
        urls.push({
          loc: `${siteUrl}${file.path}`,
          lastmod: file.data?.updatedAt || file.data?.date || new Date().toISOString(),
        })
      })
    } catch (e) {
      console.error('Error reading blog files:', e)
    }
    
    // Buscar ensaios fotográficos
    try {
      const portfolioFiles = await readJsonFiles(join(contentDir, 'ensaio-fotografico'), '/ensaio-fotografico')
      const categories = new Set<string>()
      
      portfolioFiles.forEach(file => {
        if (file.isCategory) {
          // É uma categoria
          urls.push({
            loc: `${siteUrl}${file.path}`,
          })
        } else {
          // É um post
          urls.push({
            loc: `${siteUrl}${file.path}`,
            lastmod: file.data?.updatedAt || file.data?.date || new Date().toISOString(),
          })
          
          // Coletar slug da categoria
          if (file.data?.category?.slug) {
            categories.add(file.data.category.slug)
          }
        }
      })
      
      // Adicionar páginas de categorias
      categories.forEach(categorySlug => {
        if (!urls.find((u: any) => u.loc === `${siteUrl}/ensaio-fotografico/${categorySlug}`)) {
          urls.push({
            loc: `${siteUrl}/ensaio-fotografico/${categorySlug}`,
          })
        }
      })
    } catch (e) {
      console.error('Error reading portfolio files:', e)
    }
    
    return urls
  } catch (error) {
    console.error('Error generating sitemap URLs:', error)
    return []
  }
})
