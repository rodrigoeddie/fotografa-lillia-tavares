<script lang="ts" setup>
const props = defineProps<{
  titulo: string;
  html: string;
}>();
</script>

<template>
  <div class="lt-custom" data-ani-type="fade-up">
    <h2 class="titulo">{{ props.titulo }}</h2>
    <!-- html já sanitizado no servidor (LinktreeService.sanitizeHtml) -->
    <div class="conteudo" v-html="props.html" />
  </div>
</template>

<style lang="scss" scoped>
.lt-custom {
  width: 100%;
  padding: 20rem;
  border-radius: 16rem;
  background: var(--lt-card-bg);
  border: 1rem solid var(--lt-card-border);
  text-align: center;
}

.titulo {
  font-family: v.$lato;
  font-weight: 900;
  font-size: 19rem;
  margin-bottom: 8rem;
}

.conteudo {
  font-size: 15rem;
  line-height: 1.5;
  opacity: 0.9;

  :deep(a) { color: var(--lt-accent); text-decoration: underline; }
  :deep(p) { margin-bottom: 8rem; }
}
</style>
