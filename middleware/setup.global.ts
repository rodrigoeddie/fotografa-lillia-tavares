export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/trabalhos') {
        return navigateTo('/ensaio-fotografico', { redirectCode: 301 })
    } else if (to.path === '/agende-seu-ensaio') {
        return navigateTo('/preco-ensaio-fotografico', { redirectCode: 301 })
    } else if (to.path === '/trabalhos/karoline-siqueira') {
        return navigateTo('/ensaio-fotografico/corporativo/karoline-siqueira', { redirectCode: 301 })
    } else if (to.path === '/trabalhos/vanessa-lima') {
        return navigateTo('/ensaio-fotografico/corporativo/vanessa-lima', { redirectCode: 301 })
    } else if (to.path === '/trabalhos/andresa-maia') {
        return navigateTo('/ensaio-fotografico/corporativo/andresa-maia', { redirectCode: 301 })
    } else if (to.path === '/ensaios/cris-borges-lv-estudio') {
        return navigateTo('/ensaio-fotografico/sensual-intimista/cris-borges', { redirectCode: 301 })
    } else if (to.path === '/ensaios/cris-pole-e-lira') {
        return navigateTo('/ensaio-fotografico/sensual-intimista/cris-pole-e-lira', { redirectCode: 301 })
    }
  })
