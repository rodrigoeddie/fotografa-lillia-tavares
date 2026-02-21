/**
 * Converte o body de um documento Nuxt Content (markdown) para HTML
 * Suporta tanto formato minimark (Nuxt Content v3+) quanto o formato AST antigo
 * 
 * @param body - O objeto body do Nuxt Content
 * @returns HTML string com os parágrafos formatados
 * 
 * @example
 * const { data: content } = await queryCollection('content').path('/sobre').first();
 * const html = useMarkdownToHtml(content.body);
 */
export const useMarkdownToHtml = (body: any) => {
  if (!body) return '';
  
  // Formato Minimark (Nuxt Content v3+)
  if (body.type === 'minimark' && body.value) {
    return body.value
      .filter((node: any) => node[0] === 'p') // [0] é o tipo do nó
      .map((p: any) => {
        // p[1] contém os children do parágrafo
        const children = p.slice(1);
        const content = children.map((child: any) => {
          // String simples = texto
          if (typeof child === 'string') return child;
          
          // Array = elemento (tag)
          if (Array.isArray(child)) {
            const tag = child[0];
            
            // Link: ['a', {href: '...'}, 'texto']
            if (tag === 'a') {
              const href = child[1]?.href || '';
              const text = child[2] || '';
              return `<a href="${href}">${text}</a>`;
            }
            
            // Strong/Bold: ['strong', 'texto']
            if (tag === 'strong' || tag === 'b') {
              const text = child[1] || '';
              return `<strong>${text}</strong>`;
            }
            
            // Emphasis/Italic: ['em', 'texto']
            if (tag === 'em' || tag === 'i') {
              const text = child[1] || '';
              return `<em>${text}</em>`;
            }
          }
          
          return '';
        }).join('');
        
        return `<p>${content}</p>`;
      })
      .join('');
  }
  
  // Formato AST antigo (fallback)
  if (body.children) {
    return body.children
      .filter((node: any) => node.tag === 'p')
      .map((p: any) => {
        const content = p.children?.map((child: any) => {
          if (child.type === 'text') return child.value;
          if (child.tag === 'a') {
            const text = child.children?.[0]?.value || '';
            return `<a href="${child.props?.href || ''}">${text}</a>`;
          }
          if (child.tag === 'strong' || child.tag === 'b') {
            const text = child.children?.[0]?.value || '';
            return `<strong>${text}</strong>`;
          }
          if (child.tag === 'em' || child.tag === 'i') {
            const text = child.children?.[0]?.value || '';
            return `<em>${text}</em>`;
          }
          return '';
        }).join('') || '';
        
        return `<p>${content}</p>`;
      })
      .join('');
  }
  
  return '';
};

/**
 * Extrai apenas o texto puro dos parágrafos (sem HTML)
 * Suporta tanto formato minimark quanto AST antigo
 * 
 * @param body - O objeto body do Nuxt Content
 * @returns Array de strings com o texto de cada parágrafo
 * 
 * @example
 * const paragraphs = useMarkdownParagraphs(content.body);
 * // ['Primeiro parágrafo', 'Segundo parágrafo', ...]
 */
export const useMarkdownParagraphs = (body: any): string[] => {
  if (!body) return [];
  
  // Formato Minimark
  if (body.type === 'minimark' && body.value) {
    return body.value
      .filter((node: any) => node[0] === 'p')
      .map((p: any) => {
        const children = p.slice(1);
        return children.map((child: any) => {
          if (typeof child === 'string') return child;
          if (Array.isArray(child)) {
            // Extrai texto de tags (a, strong, em, etc)
            return child.slice(1).filter((c: any) => typeof c === 'string').join('');
          }
          return '';
        }).join('');
      });
  }
  
  // Formato AST antigo
  if (body.children) {
    return body.children
      .filter((node: any) => node.tag === 'p')
      .map((p: any) => {
        return p.children?.map((child: any) => {
          if (child.type === 'text') return child.value;
          if (child.tag === 'a') return child.children?.[0]?.value || '';
          if (child.tag === 'strong' || child.tag === 'b') return child.children?.[0]?.value || '';
          if (child.tag === 'em' || child.tag === 'i') return child.children?.[0]?.value || '';
          return '';
        }).join('') || '';
      });
  }
  
  return [];
};
