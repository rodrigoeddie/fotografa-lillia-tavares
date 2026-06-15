export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === '/trabalhos') {
        return navigateTo('/ensaio-fotografico', { redirectCode: 301 })
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
    } else if (to.path === '/blog/fotografia-corporativa/as-vantagens-de-investir-em-fotos-corporativas-profissionais') {
        return navigateTo('/blog/fotografia-corporativa/vantagens-fotos-corporativas', { redirectCode: 301 })
    } else if (to.path === '/preco-ensaio-fotografico/') {
        return navigateTo('/precos-ensaios-fotograficos', { redirectCode: 301 })
    }  else if (to.path === '/preco-ensaio-fotografico') {
        return navigateTo('/precos-ensaios-fotograficos', { redirectCode: 301 })
    } else if (to.path === '/ensaio-fotografico/dia-das-maes-2025') {
        return navigateTo('/ensaio-fotografico/dia-das-maes', { redirectCode: 301 })
    } else if (to.path === '/ensaio-fotografico/dia-das-maes-2025/rosiney-de-melo') {
        return navigateTo('/ensaio-fotografico/dia-das-maes/rosiney-de-melo', { redirectCode: 301 })
    } else if (to.path === '/ensaio-fotografico/dia-das-maes-2025/lillia-tavares') {
        return navigateTo('/ensaio-fotografico/dia-das-maes/lillia-tavares', { redirectCode: 301 })
    } else if (to.path === '/corporativo') {
        return navigateTo('/ensaio-fotografico/corporativo', { redirectCode: 301 })
    } else if (to.path === '/ensaio-fotografico/corporativo/05-sheila-lima') {
        return navigateTo('/ensaio-fotografico/corporativo/sheila-lima', { redirectCode: 301 })
    } else if (to.path === '/ensaio-fotografico/corporativo/06-marcella-castelucci') {
        return navigateTo('/ensaio-fotografico/corporativo/marcella-castelucci', { redirectCode: 301 })
    } else if (to.path === '/estudio') {
        return navigateTo('/estudio-fotografico-em-mogi-das-cruzes', { redirectCode: 301 })
    } else if (to.path === '/estudio/cenarios') {
        return navigateTo('/estudio-fotografico-em-mogi-das-cruzes/cenarios', { redirectCode: 301 })
    } else if (to.path === '/estudio/cenarios/dia-das-maes-2025') {
        return navigateTo('/estudio-fotografico-em-mogi-das-cruzes/cenarios/dia-das-maes-2025', { redirectCode: 301 })
    } else if (to.path === '/investimento/casual-intimista') {
        return navigateTo('/precos-ensaios-fotograficos/sensual-intimista', { redirectCode: 301 })
    }
})
