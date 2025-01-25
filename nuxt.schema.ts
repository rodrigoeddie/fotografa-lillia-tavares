import { field, group, fieldList } from '@nuxthq/studio/theme'

export default defineNuxtSchema({
  appConfig: {
    parent: group({
      title: 'Parent title',
      description: 'Parent description.',
      icon: 'i-icon-to-display',
      fields: {
        categories: fieldList({
          title: 'Categorias',
          description: 'Configure as categorias customizadas.',
          icon: 'i-icon-to-display',
          fields: {
            slug: field({
              type: 'text',
              title: 'Slug',
              description: 'Identificador único para a categoria.',
              icon: 'i-icon-to-display',
              default: ''
            }),
            title: field({
              type: 'text',
              title: 'Título',
              description: 'Título da categoria.',
              icon: 'i-icon-to-display',
              default: ''
            }),
            description: field({
              type: 'textarea',
              title: 'Descrição',
              description: 'Descrição da categoria.',
              icon: 'i-icon-to-display',
              default: ''
            })
          },
          default: [
            {
              slug: 'corporativo',
              title: 'Corporativo',
              description: "Também conhecido como 'Posicionamento de imagem'."
            },
            {
              slug: 'intimista',
              title: 'Intimista',
              description: "Também conhecido como 'Posicionamento de imagem'."
            }
          ]
        })
      }
    })
  }
})