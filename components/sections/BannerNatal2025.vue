<template>
  <div class="container">
      <NuxtLink
      class="hero"
      to="blog/cenarios-tematicos/nosso-cenario-do-natal-2025">
          <picture>
              <source
                  :srcset="configPublic.cloudflareURI + '308d3d3e-4db0-4d27-a9f4-cddf45d84500/public'"
                  media="(max-width: 768px)"
                  width="768"
                  height="1152">
              <nuxt-img
                  :src="configPublic.cloudflareURI + 'bf482491-462d-4e2e-1500-2fceba068700/public'"
                  width="1920"
                  height="681"
                  class="img-hero"
                  alt="Natal 2025" />
          </picture>
      </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.hero {
    overflow: hidden;

    .img-hero {
        display: block;
        margin: 0 auto;
        height: auto;
    }
}
</style>
