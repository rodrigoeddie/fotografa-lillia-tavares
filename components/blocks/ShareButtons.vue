<script lang="ts" setup>
const props = defineProps<{
  title?: string
  url?: string
  variant?: 'default' | 'dark'
}>();

const currentUrl = computed(() => {
  if (props.url) return props.url;
  if (import.meta.client) return window.location.href;
  return '';
});

const shareText = computed(() => props.title ?? '');

const waHref = computed(() =>
  `https://wa.me/?text=${encodeURIComponent(shareText.value + '\n' + currentUrl.value)}`
);

const fbHref = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`
);

const copied = ref(false);
async function copyLink() {
  if (!import.meta.client) return;
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    const el = document.createElement('textarea');
    el.value = currentUrl.value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
}
</script>

<template>
  <div class="share-buttons" :class="{ dark: variant === 'dark' }">
    <span class="label">Compartilhar</span>

    <div class="share-actions">
      <a
        :href="waHref"
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn"
        aria-label="Compartilhar no WhatsApp"
        data-tooltip="WhatsApp"
      >
        <Icon name="icons:whatsapp" />
      </a>

      <a
        :href="fbHref"
        target="_blank"
        rel="noopener noreferrer"
        class="share-btn"
        aria-label="Compartilhar no Facebook"
        data-tooltip="Facebook"
      >
        <Icon name="mdi:facebook" />
      </a>

      <button
        class="share-btn"
        :class="{ copied }"
        :aria-label="copied ? 'Link copiado!' : 'Copiar link'"
        :data-tooltip="copied ? 'Copiado!' : 'Copiar link'"
        @click="copyLink"
      >
        <Icon v-if="copied" name="mdi:check" />
        <Icon v-else name="mdi:link-variant" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.share-buttons {
  display: flex;
  align-items: center;

  .label {
    font-size: 15.6rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding-right: 5rem;
    color: #aaa;
  }

  &.dark .label {
    color: rgba(255, 255, 255, 0.45);
  }
}

.share-actions {
  display: flex;
  align-items: center;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60rem;
  height: 60rem;
  border-radius: 50%;
  border: 2rem solid transparent;
  background: transparent;
  color: #999;
  font-size: 36rem;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  position: relative;

  &:hover,
  &.copied {
    color: #444;
    border-color: #ddd;
    background: #f5f5f5;
  }

  /* tooltip via ::after, posicionado acima para evitar overflow inferior */
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 16rem);
    left: 50%;
    transform: translateX(-50%);
    background: #222;
    color: #fff;
    font-size: 22rem;
    line-height: 1;
    padding: 8rem 16rem;
    border-radius: 8rem;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  .dark & {
    color: rgba(255, 255, 255, 0.5);

    &:hover,
    &.copied {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.08);
    }
  }
}
</style>
