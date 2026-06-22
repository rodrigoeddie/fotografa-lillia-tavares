<script lang="ts" setup>
const props = defineProps<{
  nome: string;
  headline?: string | null;
  avatarCfId?: string | null;
  logoCfId?: string | null;
}>();

const cfImg = useCfImg();
</script>

<template>
  <header class="lt-header" data-ani-type="fade">
    <img
      v-if="props.logoCfId"
      class="logo"
      :src="cfImg(props.logoCfId, 'public')"
      alt="Fotógrafa Lillia Tavares"
    />
    <img
      v-if="props.avatarCfId"
      class="avatar"
      :src="cfImg(props.avatarCfId, 'public')"
      :alt="props.nome"
      width="120"
      height="120"
    />
    <h1 class="nome">{{ props.nome }}</h1>
    <p v-if="props.headline" class="headline">{{ props.headline }}</p>
  </header>
</template>

<style lang="scss" scoped>
.lt-header {
  text-align: center;
  margin-bottom: 32rem;
}

.logo {
  display: block;
  margin: 0 auto 24rem;
  height: 52rem;
  width: auto;
  max-width: 260rem;
  object-fit: contain;
}

.avatar {
  width: 120rem;
  height: 120rem;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 16rem;
  display: block;
  border: 4rem solid var(--lt-ring);
  box-shadow: 0 8rem 28rem var(--lt-shadow);
}

.nome {
  font-family: v.$lato;
  font-weight: 900;
  font-size: 30rem;
  line-height: 1.2;
  margin-bottom: 8rem;
}

.headline {
  font-size: 17rem;
  line-height: 1.4;
  opacity: 0.85;
  max-width: 420rem;
  margin: 0 auto;
}

@include m.max(sm) {
  .nome { font-size: 26rem; }
  .headline { font-size: 16rem; }
}
</style>
