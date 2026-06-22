<script lang="ts" setup>
import type { RenderedBlock, RenderedProfile } from '~/server/services/LinktreeService';

definePageMeta({ layout: 'emptyLayout' });

useHead({
  title: 'Links — Fotógrafa Lillia Tavares',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
});

const { data } = await useFetch<{ profile: RenderedProfile; blocks: RenderedBlock[] }>(
  '/api/public/linktree',
  { key: 'linktree' },
);

const TEMAS_VALIDOS = new Set(['claro', 'escuro', 'marrom', 'azul']);
const tema = computed(() => {
  const t = data.value?.profile?.tema;
  return t && TEMAS_VALIDOS.has(t) ? t : 'claro';
});

const LOGO_POR_TEMA: Record<string, string> = {
  azul:   'de7d6be6-8fed-43b0-e2ca-7b5643bd9d00',
  claro:  '19bd6c18-a153-4e79-c6bd-4293145da400',
  marrom: '4cb733c9-64af-48fd-2578-c43f3a26d800',
  escuro: '4cb733c9-64af-48fd-2578-c43f3a26d800',
};
const logoCfId = computed(() => LOGO_POR_TEMA[tema.value] ?? null);

const { init } = useScrollAnimations();
onMounted(() => nextTick(() => init()));
</script>

<template>
  <main class="linktree" :class="`tema-${tema}`">
    <div class="linktree-inner">
      <SectionsLinktreeHeader
        v-if="data?.profile"
        :nome="data.profile.nome"
        :headline="data.profile.headline"
        :avatar-cf-id="data.profile.avatarCfId"
        :logo-cf-id="logoCfId"
      />

      <div class="blocks">
        <template v-for="(block, i) in data?.blocks ?? []" :key="i">
          <SectionsLinktreeLinkCard
            v-if="block.render === 'link' || block.render === 'card'"
            :url="block.url"
            :label="block.label"
            :descricao="block.descricao"
            :icone="block.render === 'link' ? block.icone : undefined"
            :image-cf-id="block.render === 'card' ? block.imageCfId : undefined"
            :cor-destaque="block.render === 'card' ? block.corDestaque : undefined"
            :chave="block.chave"
          />
          <SectionsLinktreeDepoimento
            v-else-if="block.render === 'depoimento'"
            :nome="block.nome"
            :texto="block.texto"
            :rating="block.rating"
            :foto-cf-id="block.fotoCfId"
            :url="block.url"
            :chave="block.chave"
          />
          <SectionsLinktreeBanner
            v-else-if="block.render === 'banner'"
            :image-cf-id="block.imageCfId"
            :label="block.label"
            :url="block.url"
            :chave="block.chave"
          />
          <SectionsLinktreeCustom
            v-else-if="block.render === 'custom'"
            :titulo="block.titulo"
            :html="block.html"
          />
        </template>
      </div>

      <footer class="linktree-footer">
        <NuxtLink to="/">fotografalilliatavares.com.br</NuxtLink>
      </footer>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.linktree {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 56rem 18rem 44rem;
  display: flex;
  justify-content: center;
  font-family: v.$lato;
  background-attachment: fixed;

  &.tema-claro {
    color: v.$dark-green;
    background-color: v.$light-beige;
    background-image:
      radial-gradient(120rem 120rem at 50% -8%, rgba(255, 255, 255, 0.9), transparent 70%),
      radial-gradient(520rem 420rem at 110% 0%, rgba(207, 175, 150, 0.45), transparent 60%),
      radial-gradient(480rem 480rem at -10% 100%, rgba(123, 120, 91, 0.25), transparent 55%);
    --lt-card-bg: #ffffff;
    --lt-card-border: rgba(0, 0, 0, 0.05);
    --lt-shadow: rgba(94, 32, 18, 0.10);
    --lt-accent: #{v.$red};
    --lt-accent-soft: #{v.$light-green};
    --lt-ring: rgba(255, 255, 255, 0.85);
  }

  &.tema-escuro {
    color: v.$light-beige;
    background-color: v.$dark-green;
    background-image:
      radial-gradient(520rem 420rem at 110% -5%, rgba(123, 120, 91, 0.35), transparent 60%),
      radial-gradient(480rem 480rem at -10% 100%, rgba(107, 36, 20, 0.4), transparent 55%);
    --lt-card-bg: rgba(255, 255, 255, 0.055);
    --lt-card-border: rgba(255, 255, 255, 0.12);
    --lt-shadow: rgba(0, 0, 0, 0.35);
    --lt-accent: #{v.$beige};
    --lt-accent-soft: rgba(255, 255, 255, 0.09);
    --lt-ring: rgba(255, 255, 255, 0.18);
  }

  &.tema-marrom {
    color: #fbf3eb;
    background-color: #523b2c;
    background-image:
      radial-gradient(520rem 420rem at 110% -5%, rgba(157, 126, 105, 0.32), transparent 60%),
      radial-gradient(480rem 480rem at -10% 100%, rgba(60, 38, 22, 0.55), transparent 55%);
    --lt-card-bg: rgba(255, 255, 255, 0.07);
    --lt-card-border: rgba(255, 255, 255, 0.11);
    --lt-shadow: rgba(0, 0, 0, 0.38);
    --lt-accent: #c0a791;
    --lt-accent-soft: rgba(255, 255, 255, 0.07);
    --lt-ring: rgba(255, 255, 255, 0.16);
  }

  &.tema-azul {
    color: #cde2fe;
    background-color: #101c2c;
    background-image:
      radial-gradient(520rem 420rem at 110% -5%, rgba(40, 60, 87, 0.55), transparent 60%),
      radial-gradient(480rem 480rem at -10% 100%, rgba(10, 16, 26, 0.7), transparent 55%);
    --lt-card-bg: rgba(255, 255, 255, 0.05);
    --lt-card-border: rgba(205, 226, 254, 0.13);
    --lt-shadow: rgba(0, 0, 0, 0.42);
    --lt-accent: #cde2fe;
    --lt-accent-soft: rgba(205, 226, 254, 0.08);
    --lt-ring: rgba(205, 226, 254, 0.16);
  }
}

.linktree-inner {
  width: 100%;
  max-width: 500rem;
}

.blocks {
  display: flex;
  flex-direction: column;
  gap: 14rem;
}

.linktree-footer {
  text-align: center;
  margin-top: 36rem;

  a {
    color: inherit;
    opacity: 0.6;
    font-size: 13rem;
    text-decoration: none;
    letter-spacing: 0.03em;
    &:hover { opacity: 1; }
  }
}

@include m.max(sm) {
  .linktree { padding: 32rem 16rem 32rem; }
}
</style>
